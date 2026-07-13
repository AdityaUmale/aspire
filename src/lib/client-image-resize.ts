/**
 * Client-side downscale before upload to cut bandwidth and avoid the 4.5MB server limit.
 * GIFs are returned unchanged (canvas would destroy animation).
 */

const MAX_CLIENT_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;

export const MAX_UPLOAD_IMAGE_MB = 4.5;
export const MAX_UPLOAD_IMAGE_BYTES = Math.floor(MAX_UPLOAD_IMAGE_MB * 1024 * 1024);

export const resizeImageFileIfNeeded = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  if (file.type === "image/gif") {
    return file;
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  try {
    const { width, height } = bitmap;
    const maxSide = Math.max(width, height);

    if (maxSide <= MAX_CLIENT_DIMENSION && file.size <= MAX_UPLOAD_IMAGE_BYTES) {
      return file;
    }

    const scale =
      maxSide > MAX_CLIENT_DIMENSION ? MAX_CLIENT_DIMENSION / maxSide : 1;
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (result) => resolve(result),
        "image/jpeg",
        JPEG_QUALITY
      );
    });

    if (!blob) {
      return file;
    }

    const baseName = file.name.replace(/\.[^/.]+$/, "") || "image";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
};
