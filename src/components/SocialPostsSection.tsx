'use client';

import { useEffect, useState } from 'react';
import SocialEmbed from './SocialEmbed';

interface SocialUrls {
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

export default function SocialPostsSection() {
  const [socialUrls, setSocialUrls] = useState<SocialUrls | null>(null);

  useEffect(() => {
    fetch('/api/admin/social-posts')
      .then(r => r.json())
      .then(res => {
        if (res.success) setSocialUrls(res.data);
      })
      .catch(() => {/* silently fall back */ });
  }, []);

  const hasAnyEmbed = socialUrls &&
    (socialUrls.linkedin || socialUrls.instagram || socialUrls.facebook || socialUrls.twitter);

  if (!hasAnyEmbed) return null;

  return (
    <section className="relative z-10 py-16 md:py-20">
      <div className="container px-6 mx-auto">
        <h3 className="font-bold text-xl text-[#1a237e] mb-8">Latest from Our Socials</h3>
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(["linkedin", "instagram", "facebook", "twitter"] as const).map(platform => {
            const url = socialUrls?.[platform];
            if (!url) return null;
            return (
              <div key={platform} className="h-fit self-start overflow-hidden rounded-2xl border border-[#1a237e]/10 bg-white/60 p-2 shadow-sm backdrop-blur-sm">
                <SocialEmbed platform={platform} url={url} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
