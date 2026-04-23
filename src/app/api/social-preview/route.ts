import { NextRequest, NextResponse } from 'next/server';
import { SocialPreviewRequestError, fetchSocialPreviewData } from '@/lib/social-preview';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const requestedUrl = request.nextUrl.searchParams.get('url')?.trim();

  if (!requestedUrl) {
    return NextResponse.json({ success: false, message: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const data = await fetchSocialPreviewData(requestedUrl);

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    const status = error instanceof SocialPreviewRequestError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Failed to fetch preview metadata';

    return NextResponse.json(
      { success: false, message },
      {
        status,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }
}
