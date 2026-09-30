import { randomUUID } from "crypto";

import { type CourseSection } from "@/lib/course-config";
import { type DraftImportItem, enrichUpcomingCourse } from "@/lib/course-utils";
import { normalizeString } from "@/lib/validation";

interface RawParsedPosterItem {
  courseName?: string;
  courseDateIso?: string;
  courseDateLabel?: string;
  courseTime?: string;
  courseDayLabel?: string;
  section?: string;
  descriptionHint?: string;
  programKey?: string;
  confidence?: number;
  notes?: string;
}

interface ParsedPosterResponse {
  sourceMonthLabel?: string;
  items?: RawParsedPosterItem[];
}

interface GeminiUsage {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  thoughtsTokenCount?: number;
  cachedContentTokenCount?: number;
  totalTokenCount?: number;
}

const POSTER_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceMonthLabel: {
      type: "string",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          courseName: { type: "string" },
          courseDateIso: { type: "string" },
          courseDateLabel: { type: "string" },
          courseTime: { type: "string" },
          courseDayLabel: { type: "string" },
          section: {
            type: "string",
            enum: ["REGULAR", "ONLINE", "EXCLUSIVE"],
          },
          descriptionHint: { type: "string" },
          programKey: { type: "string" },
          confidence: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },
          notes: { type: "string" },
        },
        required: [
          "courseName",
          "courseDateIso",
          "courseDateLabel",
          "courseTime",
          "courseDayLabel",
          "section",
          "descriptionHint",
          "programKey",
          "confidence",
          "notes",
        ],
      },
    },
  },
  required: ["sourceMonthLabel", "items"],
} as const;

const POSTER_PARSER_INSTRUCTIONS = `
You extract upcoming course schedule rows from a poster image.

Rules:
- Return only rows that are visibly present in the image.
- Never invent missing courses, times, dates, or sections.
- If a row is ambiguous, keep confidence low and explain the issue in notes.
- Prefer omission over guessing.
- Convert dates to ISO format YYYY-MM-DD.
- Use the poster's year and month when available.
- Normalize section values to REGULAR, ONLINE, or EXCLUSIVE.
- Keep courseName as the exact visible display title as much as possible.
- descriptionHint should be a short plain-text note, not marketing copy.
- programKey should be empty string when you cannot confidently map it.
- notes should be empty string when there is nothing special to note.
`;

const normalizeSection = (value: string): CourseSection => {
  switch (value) {
    case "ONLINE":
      return "ONLINE";
    case "EXCLUSIVE":
      return "EXCLUSIVE";
    default:
      return "REGULAR";
  }
};

const formatUsageForLog = (usage?: GeminiUsage | null) => {
  if (!usage) {
    return "usage=unavailable";
  }

  return [
    `input_tokens=${usage.promptTokenCount ?? 0}`,
    `output_tokens=${usage.candidatesTokenCount ?? 0}`,
    `total_tokens=${usage.totalTokenCount ?? 0}`,
    `cached_input_tokens=${usage.cachedContentTokenCount ?? 0}`,
    `reasoning_output_tokens=${usage.thoughtsTokenCount ?? 0}`,
  ].join(" ");
};

const normalizeDraftItem = (
  item: RawParsedPosterItem,
  sourceImageUrl: string,
  sourceMonthLabel: string
): DraftImportItem | null => {
  const courseName = normalizeString(item.courseName);
  const courseDateIso = normalizeString(item.courseDateIso);
  const courseDateLabel = normalizeString(item.courseDateLabel) || courseDateIso;

  if (!courseName || !courseDateIso) {
    return null;
  }

  const enrichment = enrichUpcomingCourse(courseName);
  const confidence = typeof item.confidence === "number" ? item.confidence : 0.4;

  return {
    id: randomUUID(),
    courseName,
    courseDateIso,
    courseDateLabel,
    courseTime: normalizeString(item.courseTime),
    courseDayLabel: normalizeString(item.courseDayLabel),
    section: normalizeSection(normalizeString(item.section)),
    description:
      normalizeString(item.descriptionHint) || enrichment.description,
    courseOutline: enrichment.courseOutline,
    sourceImageUrl,
    sourceMonthLabel,
    confidence,
    notes: normalizeString(item.notes),
    selected: true,
    programKey: normalizeString(item.programKey) || enrichment.programKey,
  };
};

const getApiErrorMessage = (payload: Record<string, unknown>, fallback: string) =>
  payload &&
  typeof payload.error === "object" &&
  payload.error !== null &&
  "message" in payload.error
    ? String((payload.error as { message?: string }).message)
    : fallback;

// Free tier: https://aistudio.google.com/apikey (no billing needed).
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
// Tried in order when the previous model is overloaded or rate limited.
// The newest flash models are often at capacity on the free tier, so these are
// older models that were verified to return this schema in a few seconds.
const OVERLOAD_FALLBACK_GEMINI_MODELS = ["gemini-3.1-flash-lite", "gemini-3.6-flash"];
const OVERLOAD_STATUS_CODES = new Set([429, 500, 503]);

const requestGemini = async ({
  apiKey,
  model,
  imageFile,
  imageBase64,
}: {
  apiKey: string;
  model: string;
  imageFile: File;
  imageBase64: string;
}) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: POSTER_PARSER_INSTRUCTIONS }],
        },
        contents: [
          {
            role: "user",
            parts: [
              { text: "Extract the poster into structured upcoming-course rows." },
              {
                inlineData: {
                  mimeType: imageFile.type,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: POSTER_SCHEMA,
        },
      }),
    }
  );

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { response, payload };
};

export const parseUpcomingCoursesFromPoster = async ({
  imageUrl,
  imageFile,
}: {
  imageUrl: string;
  imageFile: File;
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const primaryModel = process.env.GEMINI_VISION_MODEL || DEFAULT_GEMINI_MODEL;
  const models = [
    primaryModel,
    ...OVERLOAD_FALLBACK_GEMINI_MODELS.filter((candidate) => candidate !== primaryModel),
  ];
  const imageBase64 = Buffer.from(await imageFile.arrayBuffer()).toString("base64");

  let model = primaryModel;
  let result: Awaited<ReturnType<typeof requestGemini>> | null = null;
  for (const candidate of models) {
    model = candidate;
    result = await requestGemini({ apiKey, model, imageFile, imageBase64 });
    if (result.response.ok || !OVERLOAD_STATUS_CODES.has(result.response.status)) {
      break;
    }
    console.warn(
      `[course-import][gemini] model=${model} status=${result.response.status} ${getApiErrorMessage(
        result.payload,
        "overloaded"
      )}`
    );
  }

  if (!result) {
    throw new Error("Gemini poster parsing failed.");
  }

  const { response, payload } = result;
  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, "Gemini poster parsing failed."));
  }

  const candidates = Array.isArray(payload.candidates) ? payload.candidates : [];
  const parts = (candidates[0] as { content?: { parts?: unknown[] } } | undefined)?.content
    ?.parts;
  const text = (Array.isArray(parts) ? parts : [])
    .filter(
      (part): part is { text: string } =>
        !!part &&
        typeof part === "object" &&
        typeof (part as { text?: unknown }).text === "string" &&
        !(part as { thought?: unknown }).thought
    )
    .map((part) => part.text)
    .join("");

  if (!text) {
    const blockReason = (payload.promptFeedback as { blockReason?: string } | undefined)
      ?.blockReason;
    throw new Error(
      blockReason
        ? `Gemini refused to parse the poster (${blockReason}).`
        : "Gemini parser returned an empty response."
    );
  }

  const usage =
    payload.usageMetadata && typeof payload.usageMetadata === "object"
      ? (payload.usageMetadata as GeminiUsage)
      : null;

  let parsed: ParsedPosterResponse;
  try {
    parsed = JSON.parse(text) as ParsedPosterResponse;
  } catch {
    throw new Error("Gemini parser returned invalid JSON.");
  }

  const sourceMonthLabel = normalizeString(parsed.sourceMonthLabel);
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  const normalizedItems = items
    .map((item) => normalizeDraftItem(item, imageUrl, sourceMonthLabel))
    .filter((item): item is DraftImportItem => item !== null);

  if (normalizedItems.length === 0) {
    throw new Error("No valid course rows were extracted from the poster.");
  }

  const totalTokens = usage?.totalTokenCount ?? 0;
  const averageTokensPerRow =
    normalizedItems.length > 0 && totalTokens > 0
      ? (totalTokens / normalizedItems.length).toFixed(2)
      : "n/a";

  console.info(
    `[course-import][gemini] image_url=${imageUrl} model=${model} extracted_rows=${normalizedItems.length} ${formatUsageForLog(
      usage
    )} avg_total_tokens_per_row=${averageTokensPerRow}`
  );

  return {
    sourceMonthLabel,
    items: normalizedItems,
    model,
  };
};
