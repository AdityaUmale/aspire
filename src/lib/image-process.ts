import sharp from "sharp";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_UPLOAD_IMAGE_SIZE_BYTES,
} from "@/lib/blob-upload";

export const MAX_IMAGE_DIMENSION = 1920;
export const WEBP_QUALITY = 82;

export type ProcessedImage = {
  buffer: Buffer;
  contentType: "image/webp" | "image/gif";
  extension: "webp" | "gif";
  originalName: string;
};

/**
 * Resize and convert uploads to WebP (GIFs kept as GIF to preserve animation).
 * Enforces the 4.5MB input limit before processing.
 */
export const processUploadedImage = async (
  file: File
): Promise<ProcessedImage> => {
  if (file.size <= 0) {
    throw new Error("Uploaded image is empty.");
  }

  if (file.size > MAX_UPLOAD_IMAGE_SIZE_BYTES) {
    throw new Error("Image is too large. Max size is 4.5MB.");
  }

  const extension = ALLOWED_IMAGE_MIME_TYPES[file.type];
  if (!extension) {
    throw new Error("Unsupported image type. Use JPG, PNG, WEBP, or GIF.");
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  // Keep animated GIFs as-is (sharp would flatten frames).
  if (file.type === "image/gif") {
    return {
      buffer: inputBuffer,
      contentType: "image/gif",
      extension: "gif",
      originalName: file.name,
    };
  }

  const pipeline = sharp(inputBuffer, { failOn: "none" }).rotate();
  const metadata = await pipeline.metadata();

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const needsResize =
    width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION;

  let output = pipeline;
  if (needsResize) {
    output = output.resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const buffer = await output.webp({ quality: WEBP_QUALITY }).toBuffer();

  return {
    buffer,
    contentType: "image/webp",
    extension: "webp",
    originalName: file.name,
  };
};
