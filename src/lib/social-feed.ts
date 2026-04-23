import connectDB from '@/lib/db';
import SocialPost from '@/lib/models/SocialPost';
import { getFacebookPluginDetails } from '@/lib/social-url';
import { fetchSocialPreviewData } from '@/lib/social-preview';
import type { SocialFeedItem, SocialPlatform, SocialPreviewData, SocialUrlsConfig } from '@/lib/social-types';

const SOCIAL_PLATFORM_ORDER: SocialPlatform[] = ['linkedin', 'instagram', 'facebook', 'twitter'];
const INSTAGRAM_POST_PATTERN = /instagram\.com\/(?:p|reel)\/[A-Za-z0-9_-]+/i;
const TWITTER_STATUS_PATTERN = /(?:x\.com|twitter\.com)\/[^/]+\/status\/\d+/i;
const CONFIG_KEY = 'social_posts_config';

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getNativeEmbedEligibility(platform: SocialPlatform, url: string, preview: SocialPreviewData | null) {
  switch (platform) {
    case 'instagram':
      return INSTAGRAM_POST_PATTERN.test(url);
    case 'twitter':
      return TWITTER_STATUS_PATTERN.test(url);
    case 'facebook':
      return Boolean(getFacebookPluginDetails(url));
    case 'linkedin':
      return Boolean(preview?.embedKind === 'linkedin' && preview.embedUrl);
    default:
      return false;
  }
}

function getNativeEmbedUrl(platform: SocialPlatform, url: string, preview: SocialPreviewData | null) {
  if (platform === 'facebook') {
    return getFacebookPluginDetails(url)?.embedUrl || preview?.embedUrl || '';
  }

  if (platform === 'linkedin') {
    return preview?.embedUrl || '';
  }

  return '';
}

export async function getStoredSocialUrls(): Promise<SocialUrlsConfig> {
  await connectDB();

  const doc = (await SocialPost.findOne({ key: CONFIG_KEY }).lean()) as Partial<SocialUrlsConfig> | null;

  return {
    linkedin: trimValue(doc?.linkedin),
    instagram: trimValue(doc?.instagram),
    facebook: trimValue(doc?.facebook),
    twitter: trimValue(doc?.twitter),
  };
}

export async function loadSocialFeed(): Promise<SocialFeedItem[]> {
  const urls = await getStoredSocialUrls();
  const configuredPlatforms = SOCIAL_PLATFORM_ORDER.filter((platform) => urls[platform]);

  const items = await Promise.all(
    configuredPlatforms.map(async (platform) => {
      const url = urls[platform];
      const preview = await fetchSocialPreviewData(url).catch(() => null);

      return {
        platform,
        url,
        preview,
        nativeEmbedEligible: getNativeEmbedEligibility(platform, url, preview),
        nativeEmbedUrl: getNativeEmbedUrl(platform, url, preview),
      } satisfies SocialFeedItem;
    }),
  );

  return items;
}
