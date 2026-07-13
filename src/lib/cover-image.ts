/**
 * Cover images must be absolute http(s) URLs (typically our Vercel Blob host)
 * or same-site relative paths. Reject javascript:/data: etc.
 */
export const isAllowedCoverImageUrl = (value: unknown): value is string => {
  if (typeof value !== "string") {
    return false;
  }

  const url = value.trim();
  if (!url || url.length > 2000) {
    return false;
  }

  if (url.startsWith("/")) {
    return !url.startsWith("//");
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const normalizeCoverImage = (value: unknown): string | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (!isAllowedCoverImageUrl(value)) {
    return null;
  }

  return value.trim();
};
