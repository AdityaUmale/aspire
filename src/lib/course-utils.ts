import {
  COURSE_CTA_MODES,
  COURSE_SECTIONS,
  type CourseCtaMode,
  type CourseSection,
  findProgramByCourseName,
  GENERIC_UPCOMING_DESCRIPTION,
  GENERIC_UPCOMING_HIGHLIGHTS,
} from "@/lib/course-config";
import { MAX_LENGTHS, normalizeString } from "@/lib/validation";

export interface CourseRecordLike {
  _id?: string;
  courseName?: string;
  description?: string;
  courseOutline?: string[] | string;
  courseDate?: string | Date;
  courseTime?: string;
  courseDayLabel?: string;
  section?: string;
  ctaMode?: string;
  sourceImageUrl?: string;
  sourceMonthLabel?: string;
}

export interface NormalizedCoursePayload {
  courseName: string;
  description: string;
  courseOutline: string[];
  courseDate: Date;
  courseTime?: string;
  courseDayLabel?: string;
  section?: CourseSection;
  ctaMode?: CourseCtaMode;
  sourceImageUrl?: string;
  sourceMonthLabel?: string;
}

interface NormalizeCoursePayloadOptions {
  requireDescriptionAndOutline?: boolean;
  defaultCtaMode?: CourseCtaMode;
  fallbackDescription?: string;
  fallbackOutline?: string[];
  fallbackSection?: CourseSection;
  fallbackSourceImageUrl?: string;
  fallbackSourceMonthLabel?: string;
}

export interface DraftImportItem {
  id: string;
  courseName: string;
  courseDateIso: string;
  courseDateLabel: string;
  courseTime: string;
  courseDayLabel: string;
  section: CourseSection;
  description: string;
  courseOutline: string[];
  sourceImageUrl?: string;
  sourceMonthLabel?: string;
  confidence: number;
  notes: string;
  selected: boolean;
  programKey?: string;
}

export const isCourseSection = (value: string): value is CourseSection => {
  return COURSE_SECTIONS.includes(value as CourseSection);
};

export const isCourseCtaMode = (value: string): value is CourseCtaMode => {
  return COURSE_CTA_MODES.includes(value as CourseCtaMode);
};

export const enrichUpcomingCourse = (courseName: string) => {
  const program = findProgramByCourseName(courseName);
  if (!program) {
    return {
      description: GENERIC_UPCOMING_DESCRIPTION,
      courseOutline: GENERIC_UPCOMING_HIGHLIGHTS,
      programKey: undefined,
      slug: undefined,
    };
  }

  return {
    description: program.description,
    courseOutline: program.features,
    programKey: program.key,
    slug: program.slug,
  };
};

const normalizeOutline = (outline: unknown) => {
  if (Array.isArray(outline)) {
    return outline
      .map((item) => normalizeString(item))
      .filter(Boolean);
  }

  const normalizedValue = normalizeString(outline);
  if (!normalizedValue) {
    return [];
  }

  return normalizedValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const normalizeCoursePayload = (
  raw: Record<string, unknown>,
  options: NormalizeCoursePayloadOptions = {}
): { value?: NormalizedCoursePayload; errors: string[] } => {
  const errors: string[] = [];
  const courseName = normalizeString(raw.courseName);

  const enrichment = enrichUpcomingCourse(courseName);
  const description =
    normalizeString(raw.description) ||
    options.fallbackDescription ||
    enrichment.description;
  const courseOutline =
    normalizeOutline(raw.courseOutline).length > 0
      ? normalizeOutline(raw.courseOutline)
      : options.fallbackOutline && options.fallbackOutline.length > 0
        ? options.fallbackOutline
        : enrichment.courseOutline;

  const rawDate = raw.courseDate;
  const courseDate =
    rawDate instanceof Date ? rawDate : new Date(typeof rawDate === "string" ? rawDate : "");
  const courseTime = normalizeString(raw.courseTime);
  const courseDayLabel = normalizeString(raw.courseDayLabel);
  const sourceImageUrl =
    normalizeString(raw.sourceImageUrl) || options.fallbackSourceImageUrl || "";
  const sourceMonthLabel =
    normalizeString(raw.sourceMonthLabel) || options.fallbackSourceMonthLabel || "";
  const rawSection = normalizeString(raw.section);
  const rawCtaMode = normalizeString(raw.ctaMode);
  const section = rawSection
    ? isCourseSection(rawSection)
      ? rawSection
      : undefined
    : options.fallbackSection;
  const ctaMode = rawCtaMode
    ? isCourseCtaMode(rawCtaMode)
      ? rawCtaMode
      : undefined
    : options.defaultCtaMode;

  if (!courseName) {
    errors.push("Course name is required.");
  } else if (courseName.length > MAX_LENGTHS.courseName) {
    errors.push("Course name exceeds allowed length.");
  }

  if (!(courseDate instanceof Date) || Number.isNaN(courseDate.getTime())) {
    errors.push("Course date is required and must be valid.");
  }

  if (options.requireDescriptionAndOutline && !description) {
    errors.push("Description is required.");
  }

  if (options.requireDescriptionAndOutline && courseOutline.length === 0) {
    errors.push("At least one course outline item is required.");
  }

  if (description.length > MAX_LENGTHS.description) {
    errors.push("Description exceeds allowed length.");
  }

  if (courseOutline.some((item) => item.length > MAX_LENGTHS.courseOutlineItem)) {
    errors.push("One or more course outline items exceed allowed length.");
  }

  if (courseTime && courseTime.length > MAX_LENGTHS.courseTime) {
    errors.push("Course time exceeds allowed length.");
  }

  if (courseDayLabel && courseDayLabel.length > MAX_LENGTHS.courseDayLabel) {
    errors.push("Course day label exceeds allowed length.");
  }

  if (rawSection && !section) {
    errors.push("Section must be REGULAR, ONLINE, or EXCLUSIVE.");
  }

  if (rawCtaMode && !ctaMode) {
    errors.push("CTA mode is invalid.");
  }

  if (sourceImageUrl && sourceImageUrl.length > MAX_LENGTHS.url) {
    errors.push("Source image URL exceeds allowed length.");
  }

  if (sourceMonthLabel && sourceMonthLabel.length > MAX_LENGTHS.sourceMonthLabel) {
    errors.push("Source month label exceeds allowed length.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors: [],
    value: {
      courseName,
      description,
      courseOutline,
      courseDate,
      ...(courseTime ? { courseTime } : {}),
      ...(courseDayLabel ? { courseDayLabel } : {}),
      ...(section ? { section } : {}),
      ...(ctaMode ? { ctaMode } : {}),
      ...(sourceImageUrl ? { sourceImageUrl } : {}),
      ...(sourceMonthLabel ? { sourceMonthLabel } : {}),
    },
  };
};

const parseTimeToSortValue = (value?: string | null) => {
  if (!value) {
    return Number.MAX_SAFE_INTEGER;
  }

  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");
  const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?(AM|PM)$/);
  if (!match) {
    return Number.MAX_SAFE_INTEGER - 1;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return Number.MAX_SAFE_INTEGER - 1;
  }

  let normalizedHours = hours % 12;
  if (match[3] === "PM") {
    normalizedHours += 12;
  }

  return normalizedHours * 60 + minutes;
};

export const sortCoursesForDisplay = <T extends CourseRecordLike>(courses: T[]) => {
  return [...courses].sort((left, right) => {
    const leftDate = left.courseDate ? new Date(left.courseDate).getTime() : Number.MAX_SAFE_INTEGER;
    const rightDate = right.courseDate ? new Date(right.courseDate).getTime() : Number.MAX_SAFE_INTEGER;

    if (leftDate !== rightDate) {
      return leftDate - rightDate;
    }

    const leftTime = parseTimeToSortValue(left.courseTime);
    const rightTime = parseTimeToSortValue(right.courseTime);
    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    return String(right._id ?? "").localeCompare(String(left._id ?? ""));
  });
};
