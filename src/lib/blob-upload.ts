import { randomUUID } from "crypto";

const VERCEL_BLOB_API_BASE_URL = "https://blob.vercel-storage.com";
const VERCEL_BLOB_API_VERSION = "7";
const DEFAULT_CACHE_CONTROL_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const MAX_UPLOAD_IMAGE_SIZE_BYTES = Math.floor(4.5 * 1024 * 1024);

export const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

interface VercelBlobUploadResponse {
  url?: string;
  message?: string;
  error?: {
    message?: string;
  };
}

const sanitizeBaseName = (fileName: string) => {
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const cleaned = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "image";
};

const toBlobPathname = (fileName: string) => {
  return fileName
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
};

export const assertSupportedImageFile = (fileEntry: File) => {
  if (fileEntry.size <= 0) {
    throw new Error("Uploaded image is empty.");
  }

  if (fileEntry.size > MAX_UPLOAD_IMAGE_SIZE_BYTES) {
    throw new Error("Image is too large. Max size is 4.5MB for server uploads.");
  }

  const extension = ALLOWED_IMAGE_MIME_TYPES[fileEntry.type];
  if (!extension) {
    throw new Error("Unsupported image type. Use JPG, PNG, WEBP, or GIF.");
  }

  return extension;
};

export const createBlobUploadFileName = ({
  fileName,
  folder,
  extension,
}: {
  fileName: string;
  folder: string;
  extension: string;
}) => {
  return `${folder}/${Date.now()}-${randomUUID()}-${sanitizeBaseName(fileName)}.${extension}`;
};

export const uploadToVercelBlob = async (
  fileName: string,
  fileEntry: File
): Promise<string> => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Image uploads are not configured. Set BLOB_READ_WRITE_TOKEN.");
  }

  const pathname = toBlobPathname(fileName);
  const response = await fetch(`${VERCEL_BLOB_API_BASE_URL}/${pathname}`, {
    method: "PUT",
    headers: {
      access: "public",
      authorization: `Bearer ${token}`,
      "x-api-version": VERCEL_BLOB_API_VERSION,
      "x-content-type": fileEntry.type,
      "x-add-random-suffix": "1",
      "x-cache-control-max-age": String(DEFAULT_CACHE_CONTROL_MAX_AGE_SECONDS),
    },
    body: fileEntry,
  });

  const payload = (await response.json().catch(() => ({}))) as VercelBlobUploadResponse;
  if (!response.ok || !payload.url) {
    throw new Error(payload.error?.message || payload.message || "Vercel Blob upload failed.");
  }

  return payload.url;
};
