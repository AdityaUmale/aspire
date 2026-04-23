'use client';

import { useState, useEffect } from 'react';
import { FaLinkedinIn, FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { Save, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { normalizeFacebookInput } from '@/lib/social-url';

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
        message: 'LinkedIn can render as a live embed when the post is public and embedding is allowed by the page or profile.',
      };
    case 'instagram':
      if (!/instagram\.com\/(?:p|reel)\/[A-Za-z0-9_-]+/i.test(value)) {
        return {
          tone: 'warning' as const,
          message: 'Use a direct Instagram post or reel URL from a public account.',
        };
      }
      return null;
    case 'facebook':
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
          message: 'Share links are less reliable and will render as preview cards. Use Facebook’s official Embed iframe/plugin URL for inline playback.',
        };
      }

      if (!FACEBOOK_POST_PATTERNS.some((pattern) => pattern.test(normalizedFacebook))) {
        return {
          tone: 'warning' as const,
          message: 'Use a direct facebook.com reel, video, post, photo, permalink URL, or Facebook embed URL/code.',
        };
      }
      return {
        tone: 'info' as const,
        message: 'Direct Facebook reels, videos, and posts render as preview cards with a link out to Facebook.',
      };
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
  const [urls, setUrls] = useState<SocialUrls>({ linkedin: '', instagram: '', facebook: '', twitter: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/admin/social-posts')
      .then(r => r.json())
      .then(res => {
        if (res.success) setUrls({ linkedin: res.data.linkedin || '', instagram: res.data.instagram || '', facebook: res.data.facebook || '', twitter: res.data.twitter || '' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
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
      }
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1a237e]">Social Media Post Embeds</h1>
        <p className="text-sm text-gray-500">
          Paste the direct URL of your latest post on each platform. These will be displayed in the social section of the landing page.
          Leave a field blank to hide that platform&apos;s embed.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-400 py-12 justify-center">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading saved URLs…</span>
        </div>
      ) : (
        <div className="space-y-5">
          {PLATFORMS.map(({ key, label, icon: Icon, color, placeholder, hint }) => (
            <div key={key} className="bg-white/80 backdrop-blur-sm border border-[#1a237e]/10 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a237e] text-sm">{label}</h3>
                  <p className="text-xs text-gray-400">{hint}</p>
                </div>
                {urls[key] && (
                  <a href={urls[key]} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-xs text-[#3949ab] hover:underline">
                    Preview <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <input
                type={key === 'facebook' ? 'text' : 'url'}
                value={urls[key]}
                onChange={e => setUrls(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#1a237e]/10 bg-[#f8f9ff] px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]/30 transition"
              />
              {(() => {
                const validation = getPlatformValidation(key, urls[key]);
                if (!validation) return null;

                return (
                  <p className={`text-xs ${validation.tone === 'warning' ? 'text-amber-700' : 'text-[#3949ab]'}`}>
                    {validation.message}
                  </p>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#283593] disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>

        {status === 'success' && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <CheckCircle className="h-4 w-4" /> Saved successfully
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
            <AlertCircle className="h-4 w-4" /> Failed to save. Please try again.
          </span>
        )}
      </div>

      {/* Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Important Notes</p>
        <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
          <li>Instagram embeds require the post to be from a <strong>public</strong> account.</li>
          <li>LinkedIn embeds work only for public posts where the author or page allows embedding. Some post types may still fall back to a preview card.</li>
          <li>Direct Facebook reels, videos, posts, and share links now render as preview cards with an outbound CTA.</li>
          <li>Facebook&apos;s official Embed/plugin URL or iframe code is the reliable way to get inline playback on the landing page.</li>
          <li>For X (Twitter), use a direct <strong>/status/</strong> URL. If the post cannot be embedded, the site will show a preview card instead.</li>
        </ul>
      </div>
    </div>
  );
}
