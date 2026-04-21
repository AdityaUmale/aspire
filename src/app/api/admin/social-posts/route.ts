import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import SocialPost from '@/lib/models/SocialPost';
import { requireAdmin } from '@/lib/auth';
import { normalizeFacebookInput } from '@/lib/social-url';

const CONFIG_KEY = 'social_posts_config';

// GET – public, used by Footer
export async function GET() {
  try {
    await connectDB();
    const doc = await SocialPost.findOne({ key: CONFIG_KEY }).lean();
    return NextResponse.json({
      success: true,
      data: doc ?? { linkedin: '', instagram: '', facebook: '', twitter: '' },
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch social posts' }, { status: 500 });
  }
}

// PUT – admin only, upserts the config document
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { linkedin = '', instagram = '', facebook = '', twitter = '' } = body;
    const normalizedFacebook = normalizeFacebookInput(facebook);

    await connectDB();
    const doc = await SocialPost.findOneAndUpdate(
      { key: CONFIG_KEY },
      { linkedin: linkedin.trim(), instagram: instagram.trim(), facebook: normalizedFacebook, twitter: twitter.trim() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: doc });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update social posts' }, { status: 500 });
  }
}
