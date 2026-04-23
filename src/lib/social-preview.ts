import { getFacebookPluginDetails, normalizeFacebookInput } from '@/lib/social-url';
import type { SocialPreviewData } from '@/lib/social-types';

export class SocialPreviewRequestError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'SocialPreviewRequestError';
    this.status = status;
  }
}

const ALLOWED_HOSTS = [
  'facebook.com',
  'fb.watch',
  'instagram.com',
  'linkedin.com',
  'twitter.com',
  'x.com',
];

const COMMON_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

const DEFAULT_REQUEST_HEADERS = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
};

const FACEBOOK_REQUEST_HEADERS = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'user-agent': 'curl/8.7.1',
};

function isAllowedHost(hostname: string) {
  return ALLOWED_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    const normalized = entity.toLowerCase();

    if (COMMON_ENTITIES[normalized]) {
      return COMMON_ENTITIES[normalized];
    }

    if (normalized.startsWith('#x')) {
      const codePoint = Number.parseInt(normalized.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (normalized.startsWith('#')) {
      const codePoint = Number.parseInt(normalized.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return match;
  });
}

function extractMetaContent(html: string, names: string[]) {
  for (const name of names) {
    const escaped = escapeRegExp(name);
    const patterns = [
      new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        return decodeHtmlEntities(match[1]).trim();
      }
    }
  }

  return '';
}

function extractLinkHref(html: string, rel: string) {
  const escaped = escapeRegExp(rel);
  const patterns = [
    new RegExp(`<link[^>]+rel=["'][^"']*${escaped}[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*${escaped}[^"']*["'][^>]*>`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1]).trim();
    }
  }

  return '';
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtmlEntities(match[1]).trim() : '';
}

function cleanText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

function toAbsoluteUrl(value: string, baseUrl: string) {
  if (!value) return '';

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return '';
  }
}

function extractLinkedInEmbedUrl(html: string) {
  const embedMatch = html.match(/"embedUrl":"([^"]+)"/i);
  if (embedMatch?.[1]) {
    return decodeHtmlEntities(embedMatch[1]).trim();
  }

  const linkedinFeedUrl = extractMetaContent(html, ['lnkd:url']);
  const activityMatch = linkedinFeedUrl.match(/urn:li:activity:\d+/i);

  if (!activityMatch) {
    return '';
  }

  return `https://www.linkedin.com/embed/feed/update/${activityMatch[0]}?compact=true`;
}

function getFacebookEmbedDetails(canonicalUrl: string, ogType: string) {
  if (!canonicalUrl) {
    return { embedKind: '', embedUrl: '' };
  }

  if (ogType.startsWith('video') || /facebook\.com\/(?:[^/]+\/videos\/|watch\/?\?v=|reel\/\d+)/i.test(canonicalUrl)) {
    return {
      embedKind: 'facebook-video',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonicalUrl)}&show_text=true&width=350&height=476&t=0`,
    };
  }

  if (/facebook\.com\/(?:[^/]+\/posts\/|permalink\.php|photo(?:\.php)?\?)/i.test(canonicalUrl)) {
    return {
      embedKind: 'facebook-post',
      embedUrl: `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(canonicalUrl)}&show_text=true&width=350`,
    };
  }

  return { embedKind: '', embedUrl: '' };
}

function extractFacebookCanonicalUrl(html: string, baseUrl: string, fallbackUrl: string) {
  const metaUrl = toAbsoluteUrl(extractMetaContent(html, ['og:url']) || extractLinkHref(html, 'canonical'), baseUrl);
  if (metaUrl) {
    return normalizeFacebookInput(metaUrl);
  }

  const decodedHtml = decodeHtmlEntities(html).replace(/\\\//g, '/');
  const absolutePatterns = [
    /https:\/\/www\.facebook\.com\/[^"'\s<]+\/videos\/[^"'\s<]+\/\d+\/?/i,
    /https:\/\/www\.facebook\.com\/reel\/\d+\/?/i,
    /https:\/\/www\.facebook\.com\/watch\/\?v=\d+/i,
    /https:\/\/www\.facebook\.com\/[^"'\s<]+\/posts\/[^"'\s<]+/i,
    /https:\/\/www\.facebook\.com\/permalink\.php\?[^"'\s<]+/i,
    /https:\/\/www\.facebook\.com\/photo(?:\.php)?\?[^"'\s<]+/i,
  ];

  for (const pattern of absolutePatterns) {
    const match = decodedHtml.match(pattern);
    if (match?.[0]) {
      return normalizeFacebookInput(match[0]);
    }
  }

  const reelMatch = decodedHtml.match(/\/reel\/(\d+)\/?/i);
  if (reelMatch?.[1]) {
    return `https://www.facebook.com/reel/${reelMatch[1]}/`;
  }

  return normalizeFacebookInput(fallbackUrl);
}

async function resolveFacebookShareUrl(url: string, headers: HeadersInit) {
  for (const method of ['HEAD', 'GET'] as const) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers,
        method,
        redirect: 'manual',
      });

      const location = response.headers.get('location');
      if (location) {
        return new URL(location, url).toString();
      }
    } catch {
      continue;
    }
  }

  return url;
}

export async function fetchSocialPreviewData(rawRequestedUrl: string): Promise<SocialPreviewData> {
  const trimmedUrl = rawRequestedUrl.trim();
  if (!trimmedUrl) {
    throw new SocialPreviewRequestError('Missing url parameter', 400);
  }

  const facebookPlugin = /facebook\.com/i.test(trimmedUrl) ? getFacebookPluginDetails(trimmedUrl) : null;
  const requestedUrl = facebookPlugin
    ? facebookPlugin.targetUrl
    : /facebook\.com/i.test(trimmedUrl)
      ? normalizeFacebookInput(trimmedUrl)
      : trimmedUrl;

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(requestedUrl);
  } catch {
    throw new SocialPreviewRequestError('Invalid URL', 400);
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol) || !isAllowedHost(parsedUrl.hostname)) {
    throw new SocialPreviewRequestError('Unsupported host', 400);
  }

  try {
    const requestHeaders =
      parsedUrl.hostname.endsWith('facebook.com') || parsedUrl.hostname.endsWith('fb.watch')
        ? FACEBOOK_REQUEST_HEADERS
        : DEFAULT_REQUEST_HEADERS;
    const resolvedUrl =
      parsedUrl.hostname.endsWith('facebook.com') && /^\/share\//i.test(parsedUrl.pathname)
        ? normalizeFacebookInput(await resolveFacebookShareUrl(parsedUrl.toString(), requestHeaders))
        : parsedUrl.toString();

    const response = await fetch(resolvedUrl, {
      cache: 'no-store',
      headers: requestHeaders,
      redirect: 'follow',
    });

    const finalUrl =
      parsedUrl.hostname.endsWith('facebook.com') || parsedUrl.hostname.endsWith('fb.watch')
        ? normalizeFacebookInput(response.url || resolvedUrl)
        : response.url || parsedUrl.toString();
    const finalParsedUrl = new URL(finalUrl);

    if (!isAllowedHost(finalParsedUrl.hostname)) {
      throw new SocialPreviewRequestError('Redirected to an unsupported host', 400);
    }

    const html = await response.text();
    const ogType = extractMetaContent(html, ['og:type']);
    const canonicalUrl =
      finalParsedUrl.hostname.endsWith('facebook.com') || finalParsedUrl.hostname.endsWith('fb.watch')
        ? extractFacebookCanonicalUrl(html, finalUrl, resolvedUrl || finalUrl)
        : toAbsoluteUrl(extractMetaContent(html, ['og:url']) || extractLinkHref(html, 'canonical') || finalUrl, finalUrl);
    const title = cleanText(
      extractMetaContent(html, ['og:title', 'twitter:title', 'title']) || extractTitle(html),
      140,
    );
    const description = cleanText(
      extractMetaContent(html, ['og:description', 'twitter:description', 'description']),
      220,
    );
    const image = toAbsoluteUrl(
      extractMetaContent(html, ['og:image', 'twitter:image', 'og:image:url']),
      finalUrl,
    );
    const siteName = cleanText(
      extractMetaContent(html, ['og:site_name', 'application-name']) || finalParsedUrl.hostname.replace(/^www\./, ''),
      60,
    );
    let embedUrl = '';
    let embedKind = '';

    if (finalParsedUrl.hostname.endsWith('linkedin.com')) {
      embedUrl = extractLinkedInEmbedUrl(html);
      embedKind = embedUrl ? 'linkedin' : '';
    } else if (finalParsedUrl.hostname.endsWith('facebook.com') || finalParsedUrl.hostname.endsWith('fb.watch')) {
      const facebookEmbed = getFacebookEmbedDetails(canonicalUrl || resolvedUrl || finalUrl, ogType);
      embedUrl = facebookEmbed.embedUrl;
      embedKind = facebookEmbed.embedKind;
    }

    if (facebookPlugin) {
      embedUrl = facebookPlugin.embedUrl;
      embedKind = facebookPlugin.embedKind;
    }

    const fallbackTitle = finalParsedUrl.hostname.endsWith('facebook.com')
      ? 'Facebook post'
      : `${siteName || finalParsedUrl.hostname.replace(/^www\./, '')} post`;

    return {
      canonicalUrl,
      title: title || fallbackTitle,
      description,
      embedKind,
      embedUrl,
      finalUrl,
      image,
      siteName,
    };
  } catch (error) {
    if (error instanceof SocialPreviewRequestError) {
      throw error;
    }

    throw new SocialPreviewRequestError('Failed to fetch preview metadata', 500);
  }
}
