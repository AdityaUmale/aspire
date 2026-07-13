export const extractPlainText = (html: string): string => {
  if (!html || typeof html !== "string") {
    return "";
  }

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const countWords = (text: string): number => {
  if (!text) {
    return 0;
  }

  return text.split(/\s+/).filter(Boolean).length;
};

export const computeReadingTimeMinutes = (contentHtml: string): number => {
  const words = countWords(extractPlainText(contentHtml));
  return Math.max(1, Math.ceil(words / 200));
};

export const formatArticleDate = (
  dateInput?: string | Date | null,
  fallback = ""
): string => {
  if (!dateInput) {
    return fallback;
  }

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const slugify = (value: string): string => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "article";
};

export const buildArticleSlug = (title: string, id: string): string => {
  const base = slugify(title);
  const suffix = String(id).slice(-6).toLowerCase();
  return `${base}-${suffix}`;
};

export const extractFirstImageSrc = (html: string): string | null => {
  if (!html || typeof html !== "string") {
    return null;
  }

  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
};

export const getArticlePath = (
  kind: "founder" | "student",
  slugOrId: string
) => {
  return kind === "founder"
    ? `/articles/${slugOrId}`
    : `/student-articles/${slugOrId}`;
};

export const resolveReadingTimeMinutes = ({
  readingTimeMinutes,
  content,
}: {
  readingTimeMinutes?: number | null;
  content?: string | null;
}): number => {
  if (
    typeof readingTimeMinutes === "number" &&
    Number.isFinite(readingTimeMinutes) &&
    readingTimeMinutes > 0
  ) {
    return Math.round(readingTimeMinutes);
  }

  return computeReadingTimeMinutes(content ?? "");
};
