'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { getFacebookPluginDetails } from '@/lib/social-url';

interface SocialEmbedProps {
  platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter';
  url: string;
}

type Platform = SocialEmbedProps['platform'];

interface SocialPreviewData {
  canonicalUrl: string;
  description: string;
  embedKind: string;
  embedUrl: string;
  finalUrl: string;
  image: string;
  siteName: string;
  title: string;
}

type TwitterWindow = Window & {
  twttr?: {
    widgets?: {
      createTweet?: (
        tweetId: string,
        element: HTMLElement,
        options?: Record<string, unknown>,
      ) => Promise<HTMLElement | undefined>;
    };
  };
};

type InstagramWindow = Window & {
  instgrm?: {
    Embeds?: {
      process?: () => void;
    };
  };
};

const scriptPromises = new Map<string, Promise<void>>();

const PLATFORM_META: Record<
  Platform,
  {
    accent: string;
    icon: IconType;
    label: string;
    surface: string;
  }
> = {
  linkedin: {
    accent: '#0077B5',
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    surface: '#f0f8ff',
  },
  instagram: {
    accent: '#E1306C',
    icon: FaInstagram,
    label: 'Instagram',
    surface: '#fff3f8',
  },
  facebook: {
    accent: '#1877F2',
    icon: FaFacebookF,
    label: 'Facebook',
    surface: '#eff6ff',
  },
  twitter: {
    accent: '#111111',
    icon: FaXTwitter,
    label: 'X',
    surface: '#f5f5f5',
  },
};

const FACEBOOK_EMBED_PATTERNS = [
  /facebook\.com\/plugins\/(?:video|post)\.php/i,
  /facebook\.com\/[^/]+\/posts\/[^/?#]+/i,
  /facebook\.com\/[^/]+\/videos\/[^/?#]+/i,
  /facebook\.com\/watch\/?\?v=\d+/i,
  /facebook\.com\/reel\/\d+/i,
  /facebook\.com\/permalink\.php\?/i,
  /facebook\.com\/photo(?:\.php)?\?/i,
];

function waitFor(check: () => boolean, timeoutMs = 4000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const poll = () => {
      if (check()) {
        resolve();
        return;
      }

      if (Date.now() - start >= timeoutMs) {
        reject(new Error('Timed out while waiting for an embed script to initialize.'));
        return;
      }

      window.setTimeout(poll, 100);
    };

    poll();
  });
}

function ensureScript(src: string, readyCheck: () => boolean): Promise<void> {
  if (typeof window === 'undefined' || readyCheck()) {
    return Promise.resolve();
  }

  const existingPromise = scriptPromises.get(src);
  if (existingPromise) {
    return existingPromise;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

    if (!existing) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        waitFor(readyCheck).then(resolve).catch(reject);
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
      return;
    }

    waitFor(readyCheck).then(resolve).catch(reject);
  });

  scriptPromises.set(src, promise);
  promise.catch(() => {
    scriptPromises.delete(src);
  });

  return promise;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(null), timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        window.clearTimeout(timer);
        resolve(null);
      });
  });
}

function getInstagramPostId(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

function getTwitterId(url: string): string | null {
  const match = url.match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/i);
  return match ? match[1] : null;
}

function isFacebookEmbeddableUrl(url: string): boolean {
  return FACEBOOK_EMBED_PATTERNS.some((pattern) => pattern.test(url));
}

function getFacebookFallbackEmbed(url: string) {
  const pluginDetails = getFacebookPluginDetails(url);
  if (pluginDetails) {
    return pluginDetails;
  }

  if (/facebook\.com\/(?:[^/]+\/videos\/|watch\/?\?v=|reel\/\d+)/i.test(url)) {
    return {
      embedKind: 'facebook-video',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=true&width=350&height=476&t=0`,
      targetUrl: url,
    };
  }

  if (/facebook\.com\/(?:[^/]+\/posts\/|permalink\.php|photo(?:\.php)?\?)/i.test(url)) {
    return {
      embedKind: 'facebook-post',
      embedUrl: `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=350`,
      targetUrl: url,
    };
  }

  return { embedKind: '', embedUrl: '', targetUrl: url };
}

function getDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const shortenedPath = parsed.pathname.length > 26 ? `${parsed.pathname.slice(0, 26)}...` : parsed.pathname;
    return `${parsed.hostname.replace(/^www\./, '')}${shortenedPath}`;
  } catch {
    return url.length > 42 ? `${url.slice(0, 42)}...` : url;
  }
}

function useSocialPreview(url?: string | null) {
  const [preview, setPreview] = useState<SocialPreviewData | null>(null);

  useEffect(() => {
    if (!url) {
      setPreview(null);
      return;
    }

    setPreview(null);
    let cancelled = false;
    const controller = new AbortController();

    fetch(`/api/social-preview?url=${encodeURIComponent(url)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled && payload?.success && payload.data) {
          setPreview(payload.data as SocialPreviewData);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreview(null);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url]);

  return preview;
}

function SocialLinkCard({
  platform,
  url,
  message,
  cta,
  preview: previewOverride,
}: {
  platform: Platform;
  url: string;
  message: string;
  cta?: string;
  preview?: SocialPreviewData | null;
}) {
  const { accent, icon: Icon, label, surface } = PLATFORM_META[platform];
  const fetchedPreview = useSocialPreview(previewOverride ? null : url);
  const preview = previewOverride ?? fetchedPreview;
  const targetUrl = preview?.canonicalUrl || preview?.finalUrl || url;
  const title = preview?.title || `${label} post`;
  const description = preview?.description || message;
  const hostLabel = preview?.siteName || label;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[240px] flex-col rounded-[22px] border border-black/5 p-4 transition-transform duration-300 hover:-translate-y-1"
      style={{ backgroundColor: surface }}
    >
      <div className="flex h-full flex-col gap-4">
        {preview?.image ? (
          <div className="overflow-hidden rounded-[18px] border border-black/5 bg-white">
            <Image
              src={preview.image}
              alt={title}
              width={960}
              height={540}
              sizes="(max-width: 640px) 100vw, 320px"
              className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
            style={{ backgroundColor: accent }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
              {hostLabel}
            </p>
            <p className="truncate text-sm font-semibold text-[#1a237e]">{getDisplayUrl(targetUrl)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="line-clamp-2 text-base font-semibold leading-snug text-[#1a237e]">{title}</p>
          <p className="line-clamp-4 text-sm leading-relaxed text-gray-600">{description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 text-sm font-semibold text-[#1a237e]">
          <span>{cta ?? `View on ${label}`}</span>
          <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </a>
  );
}

function TwitterEmbed({ url }: { url: string }) {
  const tweetId = getTwitterId(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(!tweetId);

  useEffect(() => {
    if (!tweetId || !containerRef.current) {
      setShowFallback(true);
      return;
    }

    let cancelled = false;
    setShowFallback(false);
    containerRef.current.innerHTML = '';

    const renderTweet = async () => {
      const twitterWindow = window as TwitterWindow;

      try {
        await ensureScript(
          'https://platform.twitter.com/widgets.js',
          () => Boolean((window as TwitterWindow).twttr?.widgets?.createTweet),
        );

        if (cancelled || !containerRef.current || !twitterWindow.twttr?.widgets?.createTweet) {
          return;
        }

        const renderedTweet = await withTimeout(
          twitterWindow.twttr.widgets.createTweet(tweetId, containerRef.current, {
            align: 'center',
            dnt: true,
            theme: 'light',
          }),
        );

        if (!renderedTweet && !cancelled) {
          setShowFallback(true);
        }
      } catch {
        if (!cancelled) {
          setShowFallback(true);
        }
      }
    };

    renderTweet();

    return () => {
      cancelled = true;
    };
  }, [tweetId]);

  if (showFallback) {
    return (
      <SocialLinkCard
        platform="twitter"
        url={url}
        message="This post could not be rendered inline, so visitors will see a preview card instead."
      />
    );
  }

  return <div ref={containerRef} className="w-full overflow-hidden rounded-[18px]" />;
}

function InstagramEmbed({ url }: { url: string }) {
  const postId = getInstagramPostId(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(!postId);

  useEffect(() => {
    if (!postId || !containerRef.current) {
      setShowFallback(true);
      return;
    }

    let cancelled = false;
    setShowFallback(false);
    containerRef.current.innerHTML = '';

    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', `https://www.instagram.com/p/${postId}/`);
    blockquote.setAttribute('data-instgrm-version', '14');
    blockquote.style.cssText =
      'background:#fff;border:0;border-radius:18px;box-shadow:0 10px 30px rgba(15,23,42,0.08);margin:0 auto;max-width:540px;min-width:280px;padding:0;width:100%;';
    containerRef.current.appendChild(blockquote);

    ensureScript(
      'https://www.instagram.com/embed.js',
      () => Boolean((window as InstagramWindow).instgrm?.Embeds?.process),
    )
      .then(() => {
        if (cancelled) {
          return;
        }

        (window as InstagramWindow).instgrm?.Embeds?.process?.();
      })
      .catch(() => {
        if (!cancelled) {
          setShowFallback(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (showFallback) {
    return (
      <SocialLinkCard
        platform="instagram"
        url={url}
        message="Use a direct public Instagram post or reel URL to show the live embed here."
        cta="Open on Instagram"
      />
    );
  }

  return <div ref={containerRef} className="w-full overflow-hidden rounded-[18px]" />;
}

function EmbeddedFrame({
  href,
  label,
  src,
  title,
  height,
}: {
  href: string;
  label: string;
  src: string;
  title: string;
  height: number;
}) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-black/5 bg-white shadow-sm">
      <iframe
        src={src}
        width="100%"
        height={String(height)}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title={title}
      />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between border-t border-black/5 px-4 py-3 text-sm font-semibold text-[#1a237e] transition-colors hover:bg-[#f8fbff]"
      >
        <span>{label}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}

function FacebookEmbed({ url }: { url: string }) {
  const directPlugin = getFacebookPluginDetails(url);
  const preview = useSocialPreview(directPlugin?.targetUrl || url);
  const fallbackEmbed = getFacebookFallbackEmbed(url);
  const embedUrl = directPlugin?.embedUrl || preview?.embedUrl || fallbackEmbed.embedUrl;
  const targetUrl =
    directPlugin?.targetUrl || preview?.canonicalUrl || preview?.finalUrl || fallbackEmbed.targetUrl || url;
  const frameTitle = preview?.title || 'Facebook embed';
  const embedKind = directPlugin?.embedKind || preview?.embedKind || fallbackEmbed.embedKind;
  const frameHeight = embedKind === 'facebook-post' ? 520 : 591;

  if (embedUrl) {
    return (
      <EmbeddedFrame
        src={embedUrl}
        href={targetUrl}
        label="Open on Facebook"
        title={frameTitle}
        height={frameHeight}
      />
    );
  }

  if (!isFacebookEmbeddableUrl(url)) {
    return (
      <SocialLinkCard
        platform="facebook"
        url={url}
        message="Use Facebook's official Embed code, plugin URL, or a direct public reel, video, post, or permalink URL to render this live."
        cta="Open on Facebook"
        preview={preview}
      />
    );
  }

  return null;
}

function LinkedInEmbed({ url }: { url: string }) {
  const preview = useSocialPreview(url);

  if (preview?.embedUrl) {
    return (
      <EmbeddedFrame
        src={preview.embedUrl}
        href={preview.canonicalUrl || preview.finalUrl || url}
        label="Open on LinkedIn"
        title={preview.title || 'LinkedIn embed'}
        height={520}
      />
    );
  }

  return (
    <SocialLinkCard
      platform="linkedin"
      url={url}
      message="This LinkedIn post cannot be embedded live, so the post is shown as a preview card instead."
      cta="View post on LinkedIn"
      preview={preview}
    />
  );
}

export default function SocialEmbed({ platform, url }: SocialEmbedProps) {
  if (!url) return null;

  switch (platform) {
    case 'twitter':
      return <TwitterEmbed url={url} />;
    case 'instagram':
      return <InstagramEmbed url={url} />;
    case 'facebook':
      return <FacebookEmbed url={url} />;
    case 'linkedin':
      return <LinkedInEmbed url={url} />;
    default:
      return null;
  }
}
