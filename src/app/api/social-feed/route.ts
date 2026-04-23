import { NextResponse } from 'next/server';
import { loadSocialFeed } from '@/lib/social-feed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const items = await loadSocialFeed();

    return NextResponse.json(
      {
        success: true,
        data: { items },
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch social feed' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }
}
