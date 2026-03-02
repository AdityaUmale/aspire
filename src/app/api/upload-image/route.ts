import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const VERCEL_BLOB_API_BASE_URL = 'https://blob.vercel-storage.com';
const VERCEL_BLOB_API_VERSION = '7';
const MAX_FILE_SIZE_BYTES = Math.floor(4.5 * 1024 * 1024);
const DEFAULT_CACHE_CONTROL_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

interface VercelBlobUploadResponse {
  url?: string;
  downloadUrl?: string;
  pathname?: string;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

const sanitizeBaseName = (fileName: string): string => {
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  const cleaned = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleaned || 'image';
};

const toBlobPathname = (fileName: string): string => {
  const cleanedPath = fileName
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return cleanedPath;
};

const uploadToVercelBlob = async (fileName: string, fileEntry: File): Promise<string> => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is missing.');
  }

  const pathname = toBlobPathname(fileName);
  const response = await fetch(`${VERCEL_BLOB_API_BASE_URL}/${pathname}`, {
    method: 'PUT',
    headers: {
      access: 'public',
      authorization: `Bearer ${token}`,
      'x-api-version': VERCEL_BLOB_API_VERSION,
      'x-content-type': fileEntry.type,
      'x-add-random-suffix': '1',
      'x-cache-control-max-age': String(DEFAULT_CACHE_CONTROL_MAX_AGE_SECONDS),
    },
    body: fileEntry,
  });

  const payload = (await response.json().catch(() => ({}))) as VercelBlobUploadResponse;
  if (!response.ok || !payload.url) {
    throw new Error(
      payload.error?.message ||
        payload.message ||
        'Vercel Blob upload failed.'
    );
  }

  return payload.url;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileEntry = formData.get('file');

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    if (fileEntry.size <= 0) {
      return NextResponse.json({ error: 'Uploaded image is empty.' }, { status: 400 });
    }

    if (fileEntry.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Image is too large. Max size is 4.5MB for server uploads.' },
        { status: 413 }
      );
    }

    const extension = ALLOWED_MIME_TYPES[fileEntry.type];
    if (!extension) {
      return NextResponse.json(
        { error: 'Unsupported image type. Use JPG, PNG, WEBP, or GIF.' },
        { status: 415 }
      );
    }

    const fileName = `${Date.now()}-${randomUUID()}-${sanitizeBaseName(fileEntry.name)}.${extension}`;
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Image uploads are not configured. Set BLOB_READ_WRITE_TOKEN.' },
        { status: 500 }
      );
    }

    const url = await uploadToVercelBlob(`article-images/${fileName}`, fileEntry);

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
