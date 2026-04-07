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

interface OpenAIUsage {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  input_tokens_details?: {
    cached_tokens?: number;
  };
  output_tokens_details?: {
    reasoning_tokens?: number;
  };
}

const POSTER_SCHEMA = {
  name: "upcoming_course_schedule",
  strict: true,
  schema: {
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
  },
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

const getParsedResponseText = (payload: Record<string, unknown>) => {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const content = Array.isArray((item as { content?: unknown[] }).content)
      ? ((item as { content?: unknown[] }).content as unknown[])
      : [];

    for (const contentItem of content) {
      const typedContentItem =
        contentItem && typeof contentItem === "object"
          ? (contentItem as { type?: unknown; text?: unknown })
          : null;

      if (
        typedContentItem &&
        typedContentItem.type === "output_text" &&
        typeof typedContentItem.text === "string"
      ) {
        return typedContentItem.text;
      }
    }
  }

  return "";
};

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

const formatUsageForLog = (usage?: OpenAIUsage | null) => {
  if (!usage) {
    return "usage=unavailable";
  }

  const inputTokens = usage.input_tokens ?? 0;
  const outputTokens = usage.output_tokens ?? 0;
  const totalTokens = usage.total_tokens ?? inputTokens + outputTokens;
  const cachedTokens = usage.input_tokens_details?.cached_tokens ?? 0;
  const reasoningTokens = usage.output_tokens_details?.reasoning_tokens ?? 0;

  return [
    `input_tokens=${inputTokens}`,
    `output_tokens=${outputTokens}`,
    `total_tokens=${totalTokens}`,
    `cached_input_tokens=${cachedTokens}`,
    `reasoning_output_tokens=${reasoningTokens}`,
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

export const parseUpcomingCoursesFromPoster = async ({
  imageUrl,
}: {
  imageUrl: string;
}) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model = process.env.OPENAI_VISION_MODEL || "gpt-5-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: POSTER_PARSER_INSTRUCTIONS }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Extract the poster into structured upcoming-course rows.",
            },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "high",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          ...POSTER_SCHEMA,
        },
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const apiError =
      payload &&
      typeof payload.error === "object" &&
      payload.error !== null &&
      "message" in payload.error
        ? String((payload.error as { message?: string }).message)
        : "OpenAI poster parsing failed.";
    throw new Error(apiError);
  }

  const text = getParsedResponseText(payload);
  const usage =
    payload.usage && typeof payload.usage === "object"
      ? (payload.usage as OpenAIUsage)
      : null;

  if (!text) {
    throw new Error("OpenAI parser returned an empty response.");
  }

  let parsed: ParsedPosterResponse;
  try {
    parsed = JSON.parse(text) as ParsedPosterResponse;
  } catch {
    throw new Error("OpenAI parser returned invalid JSON.");
  }

  const sourceMonthLabel = normalizeString(parsed.sourceMonthLabel);
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  const normalizedItems = items
    .map((item) => normalizeDraftItem(item, imageUrl, sourceMonthLabel))
    .filter((item): item is DraftImportItem => item !== null);

  if (normalizedItems.length === 0) {
    throw new Error("No valid course rows were extracted from the poster.");
  }

  const totalTokens = usage?.total_tokens ?? 0;
  const averageTokensPerRow =
    normalizedItems.length > 0 && totalTokens > 0
      ? (totalTokens / normalizedItems.length).toFixed(2)
      : "n/a";

  console.info(
    `[course-import][openai] image_url=${imageUrl} model=${model} extracted_rows=${normalizedItems.length} ${formatUsageForLog(
      usage
    )} avg_total_tokens_per_row=${averageTokensPerRow}`
  );

  return {
    sourceMonthLabel,
    items: normalizedItems,
    model,
  };
};
