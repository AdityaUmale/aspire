import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import {
  assertSupportedImageFile,
  createBlobUploadFileName,
  uploadToVercelBlob,
} from "@/lib/blob-upload";
import { parseUpcomingCoursesFromPoster } from "@/lib/openai/upcoming-course-parser";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return auth.response;
    }

    const formData = await req.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const extension = assertSupportedImageFile(fileEntry);
    const fileName = createBlobUploadFileName({
      fileName: fileEntry.name,
      folder: "course-posters",
      extension,
    });
    const imageUrl = await uploadToVercelBlob(fileName, fileEntry);
    const parsed = await parseUpcomingCoursesFromPoster({ imageUrl });

    return NextResponse.json(
      {
        imageUrl,
        sourceMonthLabel: parsed.sourceMonthLabel,
        items: parsed.items,
        model: parsed.model,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing course poster:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to parse the uploaded poster.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
