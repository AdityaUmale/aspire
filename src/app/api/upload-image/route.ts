import { NextRequest, NextResponse } from 'next/server';
import {
  assertSupportedImageFile,
  createBlobUploadFileName,
  uploadToVercelBlob,
} from "@/lib/blob-upload";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileEntry = formData.get('file');

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    const extension = assertSupportedImageFile(fileEntry);
    const fileName = createBlobUploadFileName({
      fileName: fileEntry.name,
      folder: "article-images",
      extension,
    });

    const url = await uploadToVercelBlob(fileName, fileEntry);

    return NextResponse.json({
      url,
      provider: 'vercel-blob',
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json(
      { error: 'Failed to upload image. Please try again.' },
      { status: 500 }
    );
  }
}
