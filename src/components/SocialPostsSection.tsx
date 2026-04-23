'use client';

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import SocialEmbed from './SocialEmbed';
import type { SocialFeedItem, SocialPlatform } from '@/lib/social-types';

interface SocialPostsSectionProps {
  items: SocialFeedItem[];
  isLoading?: boolean;
}

const PLATFORM_CONFIG: Record<SocialPlatform, { icon: IconType; accent: string; label: string }> = {
  linkedin: { icon: FaLinkedinIn, accent: '#0077B5', label: 'LinkedIn' },
  instagram: { icon: FaInstagram, accent: '#E1306C', label: 'Instagram' },
  facebook: { icon: FaFacebookF, accent: '#1877F2', label: 'Facebook' },
  twitter: { icon: FaXTwitter, accent: '#111111', label: 'X (Twitter)' },
};

const LOADING_PLATFORMS: SocialPlatform[] = ['linkedin', 'instagram', 'facebook', 'twitter'];

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="aspect-[3/4] animate-pulse bg-gradient-to-br from-slate-100 via-white to-slate-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded-full bg-slate-100" />
        <div className="h-4 w-5/6 rounded-full bg-slate-100" />
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 rounded-full bg-slate-100" />
        <div className="h-3 w-24 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function SocialPostsSection({ items, isLoading = false }: SocialPostsSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isLoading && items.length === 0) return null;

  const platformsToRender = isLoading ? LOADING_PLATFORMS : items.map((item) => item.platform);

  return (
    <section className="relative z-10 py-20 md:py-28 bg-gradient-to-b from-transparent to-[#f5f7ff]/40 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7c4dff]/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#448aff]/5 rounded-full blur-[80px]" />

      <div className={`container px-4 md:px-6 mx-auto transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a237e]/10 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <Share2 className="h-3.5 w-3.5 text-[#1a237e]" />
            <span className="text-xs font-bold tracking-widest text-[#1a237e] uppercase">Community</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h2 className="font-bold text-4xl md:text-5xl lg:text-5xl text-[#1a237e] leading-tight">
              Join The Conversation <br />
              <span className="text-[#3949ab]">Across The Globe.</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              Follow our latest updates, insights, and stories from our vibrant global community.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {platformsToRender.map((platform, index) => {
            const { icon: Icon, accent, label } = PLATFORM_CONFIG[platform];
            const item = items.find((entry) => entry.platform === platform) ?? null;

            return (
              <div
                key={platform}
                className={`flex flex-col gap-4 transform transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center self-center sm:self-start gap-3 mb-1 px-1 transition-transform duration-300 hover:-translate-y-1">
                  <div
                    className="flex items-center justify-center h-9 w-9 rounded-xl text-white shadow-lg"
                    style={{ backgroundColor: accent, boxShadow: `0 4px 14px 0 ${accent}40` }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Featured On</span>
                    <span className="text-[15px] font-extrabold leading-none tracking-tight" style={{ color: accent }}>{label}</span>
                  </div>
                </div>

                <div className="h-fit self-start w-full overflow-hidden rounded-[1.5rem] border border-[#1a237e]/10 bg-white/60 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all duration-700 hover:shadow-[0_20px_40px_-10px_rgba(26,35,126,0.15)] hover:bg-white hover:-translate-y-2">
                  {item ? <SocialEmbed item={item} /> : <LoadingCard />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
