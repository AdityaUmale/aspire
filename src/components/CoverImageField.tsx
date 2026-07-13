"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import {
  MAX_UPLOAD_IMAGE_MB,
  resizeImageFileIfNeeded,
} from "@/lib/client-image-resize";

type CoverImageFieldProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
};

export default function CoverImageField({
  value,
  onChange,
  disabled = false,
}: CoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const optimized = await resizeImageFileIfNeeded(file);
      if (optimized.size > MAX_UPLOAD_IMAGE_MB * 1024 * 1024) {
        throw new Error(
          `Image is over ${MAX_UPLOAD_IMAGE_MB}MB after compression.`
        );
      }

      const formData = new FormData();
      formData.append("file", optimized);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Cover upload failed");
      }

      onChange(payload.url);
    } catch (uploadError: unknown) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload cover image"
      );
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={disabled || uploading}
        onChange={(event) => {
          void handleFile(event.target.files?.[0] ?? null);
        }}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 aspect-[16/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Cover preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={disabled || uploading}
              className="rounded-full bg-white/95 shadow"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={disabled || uploading}
              className="rounded-full bg-white/95 shadow text-red-600"
              onClick={() => onChange(null)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-10 text-center transition hover:border-[#1a237e]/30 hover:bg-[#f8f9fc] disabled:opacity-60"
        >
          {uploading ? (
            <LoaderCircle className="h-6 w-6 animate-spin text-[#1a237e]" />
          ) : (
            <ImagePlus className="h-6 w-6 text-[#1a237e]" />
          )}
          <span className="text-sm font-semibold text-gray-800">
            {uploading ? "Uploading cover…" : "Add cover image (optional)"}
          </span>
          <span className="text-xs text-gray-400">
            Shown on cards and social shares · max {MAX_UPLOAD_IMAGE_MB}MB
          </span>
        </button>
      )}

      {error ? (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      ) : null}
    </div>
  );
}
