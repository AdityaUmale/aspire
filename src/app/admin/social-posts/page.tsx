'use client';

import { useState, useEffect } from 'react';
import { FaLinkedinIn, FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { Save, RefreshCw, ExternalLink, AlertCircle, Info } from 'lucide-react';
import { normalizeFacebookInput } from '@/lib/social-url';
import { AdminPageHeader } from '@/components/admin/page-header';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialUrls {
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

const PLATFORMS = [
  {
    key: 'linkedin' as const,
    label: 'LinkedIn',
    icon: FaLinkedinIn,
    color: '#0077B5',
    placeholder: 'https://www.linkedin.com/posts/...',
    hint: 'Paste the URL of any LinkedIn post',
  },
  {
    key: 'instagram' as const,
    label: 'Instagram',
    icon: FaInstagram,
    color: '#E1306C',
    placeholder: 'https://www.instagram.com/p/...',
    hint: 'Paste the URL of an Instagram post (must be public)',
  },
  {
    key: 'facebook' as const,
    label: 'Facebook',
    icon: FaFacebookF,
    color: '#1877F2',
    placeholder: 'https://www.facebook.com/reel/... or Facebook embed URL/code',
    hint: 'Direct Facebook URLs render as preview cards. Use Facebook plugin/embed code for inline playback.',
  },
  {
    key: 'twitter' as const,
    label: 'X (Twitter)',
    icon: FaXTwitter,
    color: '#000000',
    placeholder: 'https://x.com/.../status/...',
    hint: 'Paste the URL of an X/Twitter post',
  },
];

const FACEBOOK_POST_PATTERNS = [
  /facebook\.com\/plugins\/(?:video|post)\.php/i,
  /facebook\.com\/[^/]+\/posts\/[^/?#]+/i,
  /facebook\.com\/[^/]+\/videos\/[^/?#]+/i,
  /facebook\.com\/watch\/?\?v=\d+/i,
  /facebook\.com\/reel\/\d+/i,
  /facebook\.com\/permalink\.php\?/i,
  /facebook\.com\/photo(?:\.php)?\?/i,
];

function getPlatformValidation(platform: keyof SocialUrls, url: string) {
  const value = url.trim();
  if (!value) return null;

  switch (platform) {
    case 'linkedin':
      return {
        tone: 'info' as const,
        message:
          'LinkedIn can render as a live embed when the post is public and embedding is allowed by the page or profile.',
      };
    case 'instagram':
      if (!/instagram\.com\/(?:p|reel)\/[A-Za-z0-9_-]+/i.test(value)) {
        return {
          tone: 'warning' as const,
          message: 'Use a direct Instagram post or reel URL from a public account.',
        };
      }
      return null;
    case 'facebook': {
      const normalizedFacebook = normalizeFacebookInput(value);
      const isFacebookPlugin = /facebook\.com\/plugins\/(?:video|post)\.php/i.test(normalizedFacebook);

      if (isFacebookPlugin) {
        return {
          tone: 'info' as const,
          message: 'Official Facebook plugin/embed URLs can render inline on the landing page.',
        };
      }

      if (/facebook\.com\/(?:share\/|share\.php)/i.test(normalizedFacebook)) {
        return {
          tone: 'warning' as const,
          message:
            'Share links are less reliable and will render as preview cards. Use Facebook’s official Embed iframe/plugin URL for inline playback.',
        };
      }

      if (!FACEBOOK_POST_PATTERNS.some((pattern) => pattern.test(normalizedFacebook))) {
        return {
          tone: 'warning' as const,
          message:
            'Use a direct facebook.com reel, video, post, photo, permalink URL, or Facebook embed URL/code.',
        };
      }
      return {
        tone: 'info' as const,
        message: 'Direct Facebook reels, videos, and posts render as preview cards with a link out to Facebook.',
      };
    }
    case 'twitter':
      if (!/(?:x\.com|twitter\.com)\/[^/]+\/status\/\d+/i.test(value)) {
        return {
          tone: 'warning' as const,
          message: 'Use a direct X/Twitter status URL so the frontend can try to render the post.',
        };
      }
      return null;
    default:
      return null;
  }
}

export default function SocialPostsPage() {
  const toast = useAdminToast();
  const [urls, setUrls] = useState<SocialUrls>({
    linkedin: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/social-posts')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setUrls({
            linkedin: res.data.linkedin || '',
            instagram: res.data.instagram || '',
            facebook: res.data.facebook || '',
            twitter: res.data.twitter || '',
          });
          setLoadError(null);
        } else {
          throw new Error(res.message || 'Failed to load social post URLs');
        }
      })
      .catch((err) => {
        const message = getFriendlyError(err, 'Could not load saved social URLs.');
        setLoadError(message);
        toast.error('Load failed', message);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/social-posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(urls),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUrls({
          linkedin: data.data.linkedin || '',
          instagram: data.data.instagram || '',
          facebook: data.data.facebook || '',
          twitter: data.data.twitter || '',
        });
        toast.success('Social embeds saved', 'Homepage social section will use these URLs.');
      } else {
        throw new Error(data.message || data.error || 'Failed to save social posts');
      }
    } catch (err) {
      toast.error(
        'Could not save',
        getFriendlyError(err, 'Failed to save. Please try again.')
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Social embeds"
        title="Social media post embeds"
        description="Paste the direct URL of your latest post on each platform. These appear in the social section of the landing page. Leave a field blank to hide that platform."
      />

      {loadError ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{loadError}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {PLATFORMS.map(({ key, label, icon: Icon, color, placeholder, hint }) => {
            const validation = getPlatformValidation(key, urls[key]);
            return (
              <div
                key={key}
                className="space-y-3 rounded-2xl border border-[#1a237e]/10 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[#1a237e]">{label}</h3>
                    <p className="text-xs text-gray-400">{hint}</p>
                  </div>
                  {urls[key] ? (
                    <a
                      href={urls[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[#3949ab] transition-colors hover:text-[#1a237e] hover:underline"
                    >
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
                <input
                  type={key === 'facebook' ? 'text' : 'url'}
                  value={urls[key]}
                  onChange={(e) => setUrls((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-[#1a237e]/10 bg-[#f8f9ff] px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 transition focus:border-[#1a237e]/30 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/15"
                />
                {validation ? (
                  <p
                    className={cn(
                      'flex items-start gap-1.5 text-xs leading-relaxed',
                      validation.tone === 'warning' ? 'text-amber-700' : 'text-[#3949ab]'
                    )}
                  >
                    {validation.tone === 'warning' ? (
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    )}
                    {validation.message}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-[#1a237e] text-white shadow-md hover:bg-[#283593] hover:shadow-lg"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <p className="text-xs text-gray-400">Changes apply to the public homepage social section.</p>
      </div>

      <div className="space-y-2 rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Important notes</p>
        <ul className="list-inside list-disc space-y-1 text-xs leading-relaxed text-amber-800/90">
          <li>
            Instagram embeds require the post to be from a <strong>public</strong> account.
          </li>
          <li>
            LinkedIn embeds work only for public posts where the author or page allows embedding.
          </li>
          <li>
            Direct Facebook reels, videos, posts, and share links render as preview cards with an outbound CTA.
          </li>
          <li>
            Facebook&apos;s official Embed/plugin URL or iframe code is the reliable way to get inline playback.
          </li>
          <li>
            For X (Twitter), use a direct <strong>/status/</strong> URL. If the post cannot be embedded, a preview
            card is shown instead.
          </li>
        </ul>
      </div>
    </div>
  );
}
