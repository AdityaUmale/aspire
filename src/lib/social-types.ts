export type SocialPlatform = 'linkedin' | 'instagram' | 'facebook' | 'twitter';

export interface SocialUrlsConfig {
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

export interface SocialPreviewData {
  canonicalUrl: string;
  description: string;
  embedKind: string;
  embedUrl: string;
  finalUrl: string;
  image: string;
  siteName: string;
  title: string;
}

export interface SocialFeedItem {
  platform: SocialPlatform;
  url: string;
  preview: SocialPreviewData | null;
  nativeEmbedEligible: boolean;
  nativeEmbedUrl: string;
}

export interface SocialFeedResponse {
  items: SocialFeedItem[];
}
