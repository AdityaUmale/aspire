'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import type { SocialFeedItem, SocialPlatform } from '@/lib/social-types';

interface SocialEmbedProps {
  item: SocialFeedItem;
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

const PLATFORM_META: Record<SocialPlatform, { accent: string; icon: IconType; label: string }> = {
  linkedin: { accent: '#0077B5', icon: FaLinkedinIn, label: 'LinkedIn' },
  instagram: { accent: '#E1306C', icon: FaInstagram, label: 'Instagram' },
  facebook: { accent: '#1877F2', icon: FaFacebookF, label: 'Facebook' },
  twitter: { accent: '#111111', icon: FaXTwitter, label: 'X' },
};

const scriptPromises = new Map<string, Promise<void>>();

function waitFor(check: () => boolean, timeoutMs = 4000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const poll = () => {
      if (check()) {
        resolve();
        return;
      }

      if (Date.now() - start >= timeoutMs) {
        reject(new Error('Timed out'));
        return;
      }

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

function getTwitterId(url: string) {
  return url.match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/i)?.[1] ?? null;
}

function getInstagramPostId(url: string) {
  return url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/i)?.[1] ?? null;
}

function sanitizeFacebookEmbedUrl(embedUrl: string): string {
  try {
    const url = new URL(embedUrl);
    if (url.hostname.endsWith('facebook.com') && !url.hostname.startsWith('www.')) {
      url.hostname = 'www.facebook.com';
    }
    return url.toString();
  } catch {
    return embedUrl;
  }
}

function useLatest<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

function useNearViewport(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    if (!enabled || isNearViewport || !ref.current) return;

    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '320px 0px',
        threshold: 0.01,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [enabled, isNearViewport]);

  return { ref, isNearViewport };
}

function TwitterNativeEmbed({
  url,
  onReady,
  onFail,
}: {
  url: string;
  onReady: () => void;
  onFail: () => void;
}) {
  const tweetId = getTwitterId(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useLatest(onReady);
  const failRef = useLatest(onFail);

  useEffect(() => {
    if (!tweetId || !containerRef.current) {
      failRef.current();
      return;
    }

    let cancelled = false;
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
            align: 'center',
            dnt: true,
            theme: 'light',
          }),
        );

        if (rendered) {
          readyRef.current();
          return;
        }

        failRef.current();
      } catch {
        if (!cancelled) failRef.current();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tweetId, failRef, readyRef]);

  return <div ref={containerRef} className="min-h-[200px] max-h-[520px] overflow-hidden [&>*]:!margin-0" />;
}

function InstagramNativeEmbed({
  url,
  onReady,
  onFail,
}: {
  url: string;
  onReady: () => void;
  onFail: () => void;
  }) {
  const postId = getInstagramPostId(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useLatest(onReady);
  const failRef = useLatest(onFail);

  useEffect(() => {
    if (!postId || !containerRef.current) {
      failRef.current();
      return;
    }

    let cancelled = false;
    const container = containerRef.current;
    let observer: MutationObserver | null = null;
    let timeoutId = 0;

    const cleanup = () => {
      if (observer) observer.disconnect();
      window.clearTimeout(timeoutId);
    };

    const markReady = () => {
      if (cancelled) return;
      cleanup();
      readyRef.current();
    };

    const markFailed = () => {
      if (cancelled) return;
      cleanup();
      failRef.current();
    };

    container.innerHTML = '';

    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', `https://www.instagram.com/p/${postId}/`);
    blockquote.setAttribute('data-instgrm-version', '14');
    blockquote.style.cssText =
      'background:#fff;border:0;border-radius:12px;margin:0 auto;max-width:540px;min-width:280px;padding:0;width:100%;';
    container.appendChild(blockquote);

    observer = new MutationObserver(() => {
      if (container.querySelector('iframe')) {
        markReady();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    timeoutId = window.setTimeout(() => {
      if (container.querySelector('iframe')) {
        markReady();
        return;
      }

      markFailed();
    }, 6000);

    ensureScript(
      'https://www.instagram.com/embed.js',
      () => Boolean((window as InstagramWindow).instgrm?.Embeds?.process),
    )
      .then(() => {
        if (cancelled) return;
        (window as InstagramWindow).instgrm?.Embeds?.process?.();

        if (container.querySelector('iframe')) {
          markReady();
        }
      })
      .catch(() => {
        if (!cancelled) markFailed();
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [postId, failRef, readyRef]);

  return <div ref={containerRef} className="min-h-[200px] max-h-[520px] overflow-hidden" />;
}

function IframeNativeEmbed({
  embedUrl,
  platform,
  title,
  onReady,
  onFail,
}: {
  embedUrl: string;
  platform: Extract<SocialPlatform, 'facebook' | 'linkedin'>;
  title: string;
  onReady: () => void;
  onFail: () => void;
}) {
  const readyRef = useLatest(onReady);
  const failRef = useLatest(onFail);

  useEffect(() => {
    if (!embedUrl) {
      failRef.current();
    }
  }, [embedUrl, failRef]);

  if (!embedUrl) return null;

  const resolvedEmbedUrl = platform === 'facebook' ? sanitizeFacebookEmbedUrl(embedUrl) : embedUrl;

  return (
    <div className="relative aspect-[3/4] bg-gray-100">
      <iframe
        src={resolvedEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title={title}
        className="absolute inset-0 h-full w-full"
        onLoad={() => readyRef.current()}
        onError={() => failRef.current()}
      />
    </div>
  );
}

function CardShell({
  platform,
  targetUrl,
  title,
  description,
  children,
}: {
  platform: SocialPlatform;
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
      <div className="relative w-full overflow-hidden">
        {children}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
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

function FallbackMedia({
  platform,
  image,
  title,
}: {
  platform: SocialPlatform;
  image: string;
  title: string;
}) {
  const { accent, icon: Icon } = PLATFORM_META[platform];

  if (image) {
    return (
      <div className="relative aspect-[3/4] bg-gray-100">
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
    <div className="flex aspect-[3/4] items-center justify-center bg-gray-50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full text-white/90" style={{ backgroundColor: accent }}>
        <Icon className="h-7 w-7" />
      </div>
    </div>
  );
}

function ProgressiveMedia({
  item,
  title,
  image,
}: {
  item: SocialFeedItem;
  title: string;
  image: string;
}) {
  const { ref, isNearViewport } = useNearViewport(item.nativeEmbedEligible);
  const [nativeRequested, setNativeRequested] = useState(false);
  const [nativeReady, setNativeReady] = useState(false);
  const [nativeFailed, setNativeFailed] = useState(false);

  useEffect(() => {
    setNativeRequested(false);
    setNativeReady(false);
    setNativeFailed(false);
  }, [item.nativeEmbedEligible, item.nativeEmbedUrl, item.platform, item.url]);

  useEffect(() => {
    if (item.nativeEmbedEligible && isNearViewport) {
      setNativeRequested(true);
    }
  }, [item.nativeEmbedEligible, isNearViewport]);

  const shouldShowNative = nativeReady && !nativeFailed;
  const shouldMountNative = nativeRequested && !nativeFailed;

  return (
    <div ref={ref} className="relative">
      {!shouldShowNative && <FallbackMedia platform={item.platform} image={image} title={title} />}

      {shouldMountNative && (
        <div className={shouldShowNative ? '' : 'absolute inset-0 opacity-0 pointer-events-none'}>
          {item.platform === 'twitter' && (
            <div onClick={(event) => event.preventDefault()}>
              <TwitterNativeEmbed
                url={item.url}
                onReady={() => setNativeReady(true)}
                onFail={() => setNativeFailed(true)}
              />
            </div>
          )}
          {item.platform === 'instagram' && (
            <div onClick={(event) => event.preventDefault()}>
              <InstagramNativeEmbed
                url={item.url}
                onReady={() => setNativeReady(true)}
                onFail={() => setNativeFailed(true)}
              />
            </div>
          )}
          {item.platform === 'facebook' && (
            <IframeNativeEmbed
              embedUrl={item.nativeEmbedUrl}
              platform="facebook"
              title={title}
              onReady={() => setNativeReady(true)}
              onFail={() => setNativeFailed(true)}
            />
          )}
          {item.platform === 'linkedin' && (
            <IframeNativeEmbed
              embedUrl={item.nativeEmbedUrl}
              platform="linkedin"
              title={title}
              onReady={() => setNativeReady(true)}
              onFail={() => setNativeFailed(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function SocialEmbed({ item }: SocialEmbedProps) {
  const meta = PLATFORM_META[item.platform];
  const targetUrl = item.preview?.canonicalUrl || item.preview?.finalUrl || item.url;
  const title = item.preview?.title || `${meta.label} post`;
  const description = item.preview?.description || '';
  const image = item.preview?.image || '';

  return (
    <CardShell platform={item.platform} targetUrl={targetUrl} title={title} description={description}>
      <ProgressiveMedia item={item} title={title} image={image} />
    </CardShell>
  );
}
