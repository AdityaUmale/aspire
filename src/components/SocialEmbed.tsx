'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

/* ─── Types ─────────────────────────────────────────────── */

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

/* ─── Platform metadata ─────────────────────────────────── */

const PLATFORM_META: Record<Platform, { accent: string; icon: IconType; label: string }> = {
  linkedin:  { accent: '#0077B5', icon: FaLinkedinIn, label: 'LinkedIn' },
  instagram: { accent: '#E1306C', icon: FaInstagram, label: 'Instagram' },
  facebook:  { accent: '#1877F2', icon: FaFacebookF,  label: 'Facebook' },
  twitter:   { accent: '#111111', icon: FaXTwitter,   label: 'X' },
};

/* ─── Script loading utilities ──────────────────────────── */

const scriptPromises = new Map<string, Promise<void>>();

function waitFor(check: () => boolean, timeoutMs = 4000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const poll = () => {
      if (check()) { resolve(); return; }
      if (Date.now() - start >= timeoutMs) { reject(new Error('Timed out')); return; }
      window.setTimeout(poll, 100);
    };
    poll();
  });
}

function ensureScript(src: string, readyCheck: () => boolean): Promise<void> {
  if (typeof window === 'undefined' || readyCheck()) return Promise.resolve();
  const existing = scriptPromises.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const el = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (!el) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => waitFor(readyCheck).then(resolve).catch(reject);
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
      return;
    }
    waitFor(readyCheck).then(resolve).catch(reject);
  });

  scriptPromises.set(src, promise);
  promise.catch(() => scriptPromises.delete(src));
  return promise;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(null), timeoutMs);
    promise
      .then((v) => { window.clearTimeout(timer); resolve(v); })
      .catch(() => { window.clearTimeout(timer); resolve(null); });
  });
}

/* ─── URL helpers ───────────────────────────────────────── */

function getTwitterId(url: string) {
  return url.match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/i)?.[1] ?? null;
}

function getInstagramPostId(url: string) {
  return url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/i)?.[1] ?? null;
}

/** Force www.facebook.com so we stay within the CSP frame-src whitelist */
function sanitizeFacebookEmbedUrl(embedUrl: string): string {
  try {
    const u = new URL(embedUrl);
    if (u.hostname.endsWith('facebook.com') && !u.hostname.startsWith('www.')) {
      u.hostname = 'www.facebook.com';
    }
    return u.toString();
  } catch {
    return embedUrl;
  }
}

/* ─── OG Preview hook ───────────────────────────────────── */

function useSocialPreview(url?: string | null) {
  const [preview, setPreview] = useState<SocialPreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) { setPreview(null); setLoading(false); return; }

    setPreview(null);
    setLoading(true);
    let cancelled = false;
    const controller = new AbortController();

    fetch(`/api/social-preview?url=${encodeURIComponent(url)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((payload) => {
        if (!cancelled && payload?.success && payload.data) setPreview(payload.data as SocialPreviewData);
      })
      .catch(() => { if (!cancelled) setPreview(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; controller.abort(); };
  }, [url]);

  return { preview, loading };
}

/* ─── Native embed media: Twitter ───────────────────────── */

function TwitterNativeEmbed({ url }: { url: string }) {
  const tweetId = getTwitterId(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!tweetId);

  useEffect(() => {
    if (!tweetId || !containerRef.current) { setFailed(true); return; }

    let cancelled = false;
    setFailed(false);
    containerRef.current.innerHTML = '';

    (async () => {
      try {
        await ensureScript(
          'https://platform.twitter.com/widgets.js',
          () => Boolean((window as TwitterWindow).twttr?.widgets?.createTweet),
        );
        if (cancelled || !containerRef.current) return;

        const rendered = await withTimeout(
          (window as TwitterWindow).twttr!.widgets!.createTweet!(tweetId, containerRef.current, {
            align: 'center', dnt: true, theme: 'light',
          }),
        );
        if (!rendered && !cancelled) setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => { cancelled = true; };
  }, [tweetId]);

  if (failed) return null; // signal to parent to show fallback
  return <div ref={containerRef} className="w-full overflow-hidden [&>*]:!margin-0" />;
}

/* ─── Native embed media: Instagram ─────────────────────── */

function InstagramNativeEmbed({ url }: { url: string }) {
  const postId = getInstagramPostId(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!postId);

  useEffect(() => {
    if (!postId || !containerRef.current) { setFailed(true); return; }

    let cancelled = false;
    setFailed(false);
    containerRef.current.innerHTML = '';

    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', `https://www.instagram.com/p/${postId}/`);
    blockquote.setAttribute('data-instgrm-version', '14');
    blockquote.style.cssText =
      'background:#fff;border:0;border-radius:12px;margin:0 auto;max-width:540px;min-width:280px;padding:0;width:100%;';
    containerRef.current.appendChild(blockquote);

    ensureScript(
      'https://www.instagram.com/embed.js',
      () => Boolean((window as InstagramWindow).instgrm?.Embeds?.process),
    )
      .then(() => { if (!cancelled) (window as InstagramWindow).instgrm?.Embeds?.process?.(); })
      .catch(() => { if (!cancelled) setFailed(true); });

    return () => { cancelled = true; };
  }, [postId]);

  if (failed) return null;
  return <div ref={containerRef} className="w-full overflow-hidden" />;
}

/* ─── Shared card shell ─────────────────────────────────── */

function CardShell({
  platform,
  targetUrl,
  title,
  description,
  children,
}: {
  platform: Platform;
  targetUrl: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { accent, icon: Icon, label } = PLATFORM_META[platform];

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-6px_rgba(26,35,126,0.15)] hover:border-[#1a237e]/20"
    >
      {/* Media area */}
      <div className="relative w-full overflow-hidden">
        {children}
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Platform badge */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ backgroundColor: accent }}>
            <Icon className="h-2.5 w-2.5" />
          </div>
          <span className="text-[11px] font-semibold text-gray-500">{label}</span>
        </div>
        <h4 className="text-sm font-semibold text-[#1a237e] leading-snug line-clamp-2">{title}</h4>
        {description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{description}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs font-semibold" style={{ color: accent }}>
          <span>View on {label}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </a>
  );
}

/* ─── Fallback media (OG image or platform icon) ────────── */

function FallbackMedia({
  platform,
  image,
  title,
}: {
  platform: Platform;
  image: string;
  title: string;
}) {
  const { accent, icon: Icon } = PLATFORM_META[platform];
  const isTall = platform === 'facebook' || platform === 'linkedin';
  const aspectClass = 'aspect-[3/4]';

  if (image) {
    return (
      <div className={`relative ${aspectClass} bg-gray-100`}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${aspectClass} bg-gray-50`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full text-white/90" style={{ backgroundColor: accent }}>
        <Icon className="h-7 w-7" />
      </div>
    </div>
  );
}

/* ─── Per-platform card components ──────────────────────── */

function TwitterCard({ url }: { url: string }) {
  const { preview, loading } = useSocialPreview(url);
  const [nativeFailed, setNativeFailed] = useState(false);
  const targetUrl = preview?.canonicalUrl || preview?.finalUrl || url;
  const title = preview?.title || '';
  const description = preview?.description || '';
  const image = preview?.image || '';

  if (loading) return <LoadingCard />;

  return (
    <CardShell platform="twitter" targetUrl={targetUrl} title={title} description={description}>
      {!nativeFailed ? (
        <TwitterNativeEmbedOrFallback url={url} image={image} title={title} onFail={() => setNativeFailed(true)} />
      ) : (
        <FallbackMedia platform="twitter" image={image} title={title} />
      )}
    </CardShell>
  );
}

/** Wrapper that detects native embed failure and falls back */
function TwitterNativeEmbedOrFallback({
  url, image, title, onFail,
}: {
  url: string; image: string; title: string; onFail: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showNative, setShowNative] = useState(true);

  useEffect(() => {
    // Give the native embed a few seconds to render, then check if it produced content
    const timer = window.setTimeout(() => {
      if (ref.current && ref.current.childElementCount === 0) {
        setShowNative(false);
        onFail();
      }
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [onFail]);

  if (!showNative) return <FallbackMedia platform="twitter" image={image} title={title} />;

  return (
    <div ref={ref} className="min-h-[200px] max-h-[5200px] overflow-hidden" onClick={(e) => e.preventDefault()}>
      <TwitterNativeEmbed url={url} />
    </div>
  );
}

function InstagramCard({ url }: { url: string }) {
  const { preview, loading } = useSocialPreview(url);
  const [nativeFailed, setNativeFailed] = useState(false);
  const targetUrl = preview?.canonicalUrl || preview?.finalUrl || url;
  const title = preview?.title || '';
  const description = preview?.description || '';
  const image = preview?.image || '';

  if (loading) return <LoadingCard />;

  return (
    <CardShell platform="instagram" targetUrl={targetUrl} title={title} description={description}>
      {!nativeFailed ? (
        <InstagramNativeEmbedOrFallback url={url} image={image} title={title} onFail={() => setNativeFailed(true)} />
      ) : (
        <FallbackMedia platform="instagram" image={image} title={title} />
      )}
    </CardShell>
  );
}

function InstagramNativeEmbedOrFallback({
  url, image, title, onFail,
}: {
  url: string; image: string; title: string; onFail: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showNative, setShowNative] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (ref.current && ref.current.childElementCount === 0) {
        setShowNative(false);
        onFail();
      }
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [onFail]);

  if (!showNative) return <FallbackMedia platform="instagram" image={image} title={title} />;

  return (
    <div ref={ref} className="min-h-[200px] max-h-[520px] overflow-hidden" onClick={(e) => e.preventDefault()}>
      <InstagramNativeEmbed url={url} />
    </div>
  );
}

function FacebookCard({ url }: { url: string }) {
  const { preview, loading } = useSocialPreview(url);
  const targetUrl = preview?.canonicalUrl || preview?.finalUrl || url;
  const title = preview?.title || '';
  const description = preview?.description || '';
  const image = preview?.image || '';
  const embedUrl = preview?.embedUrl ? sanitizeFacebookEmbedUrl(preview.embedUrl) : '';
  const embedKind = preview?.embedKind || '';
  const hasEmbed = Boolean(embedUrl && (embedKind === 'facebook-video' || embedKind === 'facebook-post'));

  if (loading) return <LoadingCard />;

  return (
    <CardShell platform="facebook" targetUrl={targetUrl} title={title} description={description}>
      {hasEmbed ? (
        <div className="relative aspect-[3/4] bg-gray-100">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title={title}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <FallbackMedia platform="facebook" image={image} title={title} />
      )}
    </CardShell>
  );
}

function LinkedInCard({ url }: { url: string }) {
  const { preview, loading } = useSocialPreview(url);
  const targetUrl = preview?.canonicalUrl || preview?.finalUrl || url;
  const title = preview?.title || 'LinkedIn post';
  const description = preview?.description || '';
  const image = preview?.image || '';
  const embedUrl = preview?.embedUrl || '';
  const hasEmbed = Boolean(embedUrl && preview?.embedKind === 'linkedin');

  if (loading) return <LoadingCard />;

  return (
    <CardShell platform="linkedin" targetUrl={targetUrl} title={title} description={description}>
      {hasEmbed ? (
        <div className="relative aspect-[3/4] bg-gray-100">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title={title}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <FallbackMedia platform="linkedin" image={image} title={title} />
      )}
    </CardShell>
  );
}

/* ─── Loading state ─────────────────────────────────────── */

function LoadingCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 p-8 min-h-[280px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1a237e]" />
      <p className="mt-3 text-xs text-gray-400">Loading preview…</p>
    </div>
  );
}

/* ─── Public entry point ────────────────────────────────── */

export default function SocialEmbed({ platform, url }: SocialEmbedProps) {
  if (!url) return null;

  switch (platform) {
    case 'twitter':   return <TwitterCard url={url} />;
    case 'instagram': return <InstagramCard url={url} />;
    case 'facebook':  return <FacebookCard url={url} />;
    case 'linkedin':  return <LinkedInCard url={url} />;
    default:          return null;
  }
}
