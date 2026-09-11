import { PROGRAM_CATALOG } from "@/lib/course-config";

/** Query params carried by every "Enquire" CTA on the marketing site. */
export const ENQUIRY_SOURCE_PARAM = "src";
export const ENQUIRY_DETAIL_PARAM = "course";

export interface EnquirySourceEntry {
  key: string;
  label: string;
  path: string;
}

const PAGE_SOURCES: EnquirySourceEntry[] = [
  { key: "home-hero", label: "Home — Hero banner", path: "/" },
  { key: "home-upcoming", label: "Home — Upcoming batches", path: "/" },
  { key: "founder", label: "Founder page", path: "/founder" },
  { key: "team", label: "Team page", path: "/team" },
  { key: "success-stories", label: "Success stories page", path: "/success-stories" },
  {
    key: "salute-learning-spirit",
    label: "Salute to Learning Spirit page",
    path: "/salute-learning-spirit",
  },
];

const COURSE_SOURCES: EnquirySourceEntry[] = PROGRAM_CATALOG.filter(
  (program): program is typeof program & { slug: string } => Boolean(program.slug)
).map((program) => ({
  key: program.key,
  label: `${program.title} — course page`,
  path: program.slug,
}));

export const ENQUIRY_SOURCES: EnquirySourceEntry[] = [...PAGE_SOURCES, ...COURSE_SOURCES];

const SOURCE_BY_KEY = new Map(ENQUIRY_SOURCES.map((entry) => [entry.key, entry]));

/** Used when a visitor opens the form without going through a tracked CTA. */
export const DIRECT_SOURCE_KEY = "direct";
export const DIRECT_SOURCE_LABEL = "Home page (direct)";
/** Used when the visitor arrived from a page that has no registered CTA. */
export const OTHER_SOURCE_KEY = "other";
/** Enquiries saved before source tracking existed. */
export const UNTRACKED_SOURCE_LABEL = "Not tracked";

const MAX_KEY_LENGTH = 64;
const MAX_DETAIL_LENGTH = 180;
const MAX_PATH_LENGTH = 512;

const sanitizeKey = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, MAX_KEY_LENGTH);
};

const sanitizeDetail = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_DETAIL_LENGTH);
};

const sanitizePath = (value: unknown) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  // Only accept same-site paths, never a full URL from another origin.
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "";
  return trimmed.slice(0, MAX_PATH_LENGTH);
};

export interface ResolvedEnquirySource {
  sourceKey: string;
  sourceLabel: string;
  sourceDetail: string;
  sourcePath: string;
}

/**
 * Turns the raw values sent by the browser into a trusted, storable source.
 * Labels always come from the registry so a crafted request cannot inject text.
 */
export const resolveEnquirySource = (input: {
  key?: unknown;
  detail?: unknown;
  path?: unknown;
}): ResolvedEnquirySource => {
  const key = sanitizeKey(input.key);
  const detail = sanitizeDetail(input.detail);
  const path = sanitizePath(input.path);
  const entry = SOURCE_BY_KEY.get(key);

  if (entry) {
    return {
      sourceKey: entry.key,
      sourceLabel: entry.label,
      sourceDetail: detail,
      sourcePath: entry.path,
    };
  }

  if (path && path !== "/") {
    return {
      sourceKey: OTHER_SOURCE_KEY,
      sourceLabel: `Other page (${path})`,
      sourceDetail: detail,
      sourcePath: path,
    };
  }

  return {
    sourceKey: DIRECT_SOURCE_KEY,
    sourceLabel: DIRECT_SOURCE_LABEL,
    sourceDetail: detail,
    sourcePath: "/",
  };
};

/** Appends the tracking params to an enquiry CTA href. */
export const enquiryHref = (key: string, detail?: string) => {
  const params = new URLSearchParams({ [ENQUIRY_SOURCE_PARAM]: key });
  if (detail) {
    params.set(ENQUIRY_DETAIL_PARAM, detail);
  }
  return `/?${params.toString()}#enquiry`;
};

/** Label to show in the admin UI, falling back for pre-tracking enquiries. */
export const getEnquirySourceLabel = (enquiry: {
  sourceLabel?: string | null;
  sourceKey?: string | null;
}) => {
  if (enquiry.sourceLabel) return enquiry.sourceLabel;
  const entry = enquiry.sourceKey ? SOURCE_BY_KEY.get(enquiry.sourceKey) : undefined;
  if (entry) return entry.label;
  return UNTRACKED_SOURCE_LABEL;
};
