import { NextRequest, NextResponse } from "next/server";
import {
  createBlobUploadFileName,
  uploadToVercelBlob,
} from "@/lib/blob-upload";
import { processUploadedImage } from "@/lib/image-process";
import { getAdminFromRequest } from "@/lib/auth";
import {
  getOrRefreshWriterSession,
  getRequestIp,
  setWriterSessionCookie,
} from "@/lib/writer-auth";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const UPLOAD_LIMIT = 30;
const UPLOAD_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const writerSession = await getOrRefreshWriterSession(req);
    const admin = writerSession ? null : await getAdminFromRequest(req);

    if (!writerSession && !admin) {
      return NextResponse.json(
        { error: "Authentication required to upload images." },
        { status: 401 }
      );
    }

    const identityKey = writerSession
      ? `writer:${writerSession.writer.id}`
      : `admin:${admin!.id}`;
    const ip = getRequestIp(req);

    const identityLimit = checkRateLimit({
      key: `upload-image:${identityKey}`,
      limit: UPLOAD_LIMIT,
      windowMs: UPLOAD_WINDOW_MS,
    });
    const ipLimit = checkRateLimit({
      key: `upload-image:ip:${ip}`,
      limit: UPLOAD_LIMIT,
      windowMs: UPLOAD_WINDOW_MS,
    });

    if (!identityLimit.allowed || !ipLimit.allowed) {
      const retryAfterSeconds = Math.max(
        identityLimit.retryAfterSeconds,
        ipLimit.retryAfterSeconds
      );
      return NextResponse.json(
        { error: "Too many image uploads. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

    const formData = await req.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const processed = await processUploadedImage(fileEntry);
    const fileName = createBlobUploadFileName({
      fileName: processed.originalName,
      folder: "article-images",
      extension: processed.extension,
    });

    const url = await uploadToVercelBlob(
      fileName,
      processed.buffer,
      processed.contentType
    );

    const response = NextResponse.json({
      url,
      provider: "vercel-blob",
      contentType: processed.contentType,
    });

    if (writerSession?.wasRefreshed) {
      setWriterSessionCookie(response, writerSession.token);
    }

    return response;
  } catch (error) {
    console.error("Image upload failed:", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to upload image. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
