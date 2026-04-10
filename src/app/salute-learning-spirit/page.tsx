'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Quote,
  ArrowRight,
  Award
} from 'lucide-react';

type SpiritStory = {
  name: string;
  title: string;
  headline: string;
  quote: string;
  story: string[];
  image?: string;
  imagePosition?: string;
  imageScale?: string;
  profession?: string;
};

const stories: SpiritStory[] = [
  {
    name: 'Smt. Shraddha Bhokare',
    title: '79 years young ',
    headline: 'Learning has no age limit, and she proved it.',
    quote: 'Learning never retires and neither should our dreams.',
    story: [
      'Inspired by her granddaughter, she joined Aspire not as a spectator but as a determined learner, walking into every session with curiosity, discipline, and a desire to improve her communication.',
      'Her dedication became an inspiration for learners across all ages. Watching her participate, practise, and progress reminded everyone that learning isn’t bound by time, it’s powered by spirit.',
      'At our 17th Annual Function, she received the “We Salute Your Learning Spirit Award,” earning a heartfelt standing ovation for her courage and lifelong commitment to growth.',
    ],
    image: '/sls/Shradda.jpg',
    profession: 'Former Professor',
  },
  {
    name: 'Shri Ramkrushna Gavhale',
    title: '81 years young',
    headline: 'Age is just a number; curiosity is forever.',
    quote: 'When the mind stays open, life keeps teaching.',
    story: [
      'Even after retirement, his dedication to improving himself brought him to Aspire with the same curiosity and discipline as our youngest learners.',
      'His enthusiasm to learn, ask questions, and embrace new knowledge inspired everyone around him. He showed us that personal development has no timeline, only a willing heart.',
      'We proudly honoured him with the “We Salute Your Learning Spirit Award” for his remarkable determination and example of lifelong learning.',
    ],
    image: '/sls/ramkrushn.jpg',
    imagePosition: 'object-[center_20%]',
    profession: 'Income Tax Officer (retd.)',
  },
  {
    name: 'Smt. Ashwini Pathak',
    title: '60+ years young',
    headline: 'Before you expire, join Aspire.',
    quote: 'Growth belongs to anyone brave enough to begin again.',
    story: [
      'With wisdom and warmth, she returned to the classroom to upgrade herself, balancing responsibilities while staying curious and courageous.',
      'Her openness to new ideas and joyful energy inspired learners across all age groups. She reminded us that growth isn’t reserved for the young.',
      'In recognition of her commitment to self-improvement, we honoured her with the “We Salute Your Learning Spirit Award.” Her journey shows that learning keeps us alive in mind, spirit, and purpose.',
    ],
    image: '/ashwini pathak.jpg',
    imagePosition: 'object-[center_10%]',
    profession: 'Accounting professional',
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(p => !p.includes('.')) // skip titles like Smt.
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function accentColorFromName(name: string) {
  const palette = ['#1a237e', '#2c3e50', '#8e44ad', '#c0392b', '#d35400', '#16a085'];
  let code = 0;
  for (let i = 0; i < name.length; i++) code = (code * 31 + name.charCodeAt(i)) % palette.length;
  return palette[code];
}

export default function SaluteLearningSpiritPage() {
  return (
    // The background is a warm, soft linen/paper white to simulate a noticeboard
    <div className="min-h-screen bg-[#f4f3ef] font-sans selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      {/* Subtle paper/cork texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* HEADER */}
      <header className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 z-10 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="inline-flex items-center gap-2 mb-6 border-b border-[#1a237e]/20 pb-2">
            <Award className="h-4 w-4 text-[#1a237e]" />
            <span className="text-sm font-semibold tracking-[0.2em] text-[#1a237e] uppercase">The Spirit Award</span>
            <Award className="h-4 w-4 text-[#1a237e]" />
          </div>

          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-[#111827] mb-6 tracking-tight max-w-4xl mx-auto">
            Lifelong Learners, <br />
            <span className="text-[#1a237e] font-bold">Limitless Spirit.</span>
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Honouring the remarkable individuals who prove that growth has no age limit. Courage, curiosity, and commitment have no expiration date.
          </p>
        </div>
      </header>

      {/* TRADITIONAL PINBOARD GRID */}
      <main id="stories" className="container mx-auto px-4 md:px-6 pb-24 relative z-10">
        {/* Using CSS columns for a masonry look, like real pinned notes */}
        <div className="columns-1 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
          {stories.map((story, index) => {
            // Very subtle organic rotations
            const rotation = index % 4 === 0 ? '-rotate-1' : index % 3 === 0 ? 'rotate-1' : index % 2 === 0 ? '-rotate-[0.5deg]' : 'rotate-[0.5deg]';

            return (
              <article
                key={story.name}
                className={`break-inside-avoid relative bg-[#fffdf8] rounded-[3px] p-6 md:p-8 shadow-[2px_4px_16px_rgba(0,0,0,0.08),_0_0_2px_rgba(0,0,0,0.02)] border border-[#e8e6df] transition-all duration-300 hover:shadow-[4px_12px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:rotate-0 group ${rotation}`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='0.04' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
              >
                {/* REALISTIC PUSH PIN */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 z-20">
                  {/* Pin Head */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#283593] to-[#1a237e] rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4),_inset_1.5px_1.5px_3px_rgba(255,255,255,0.4),_0_4px_6px_rgba(0,0,0,0.3)] border border-[#0f1337]"></div>
                  {/* Pin Highlight */}
                  <div className="absolute top-1 left-1.5 w-1 h-1 bg-white/60 rounded-full blur-[0.5px]"></div>
                  {/* Pin Shadow/Hole Depth */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black/40 rounded-full blur-[1.5px]"></div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 mb-6 relative z-[2]">
                  <div className="flex-shrink-0">
                    {story.image ? (
                      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden shadow-md border-2 border-white ring-1 ring-black/5">
                        <Image
                          src={story.image}
                          alt={story.name}
                          width={112}
                          height={112}
                          className={`w-full h-full object-cover ${story.imageScale || ''} ${story.imagePosition || 'object-center'}`}
                        />
                      </div>
                    ) : (
                      <div
                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl flex items-center justify-center text-white font-medium text-3xl shadow-md border-2 border-white ring-1 ring-black/5"
                        style={{ background: accentColorFromName(story.name) }}
                      >
                        {initials(story.name)}
                      </div>
                    )}
                  </div>

                  <div className="sm:pt-2">
                    <h3 className="font-bold text-2xl text-gray-900 leading-tight">{story.name}</h3>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#1a237e] mt-1.5 bg-[#1a237e]/5 inline-block px-2 py-0.5 rounded-sm">
                      {story.title}
                    </div>
                    {story.profession && (
                      <div className="text-sm font-medium text-gray-600 mt-1">
                        {story.profession}
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-xl text-[#1a237e] leading-snug mb-5 relative z-[2]">
                  “{story.headline}”
                </h4>

                <div className="space-y-3 text-gray-700 leading-relaxed text-sm md:text-base mb-6 relative z-[2]">
                  {story.story.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Quote Box - Styled like a stamped/highlighted section */}
                <div className="bg-[#f4efe3]/60 border-l-[3px] border-[#1a237e]/40 px-4 py-3 rounded-r-sm relative z-[2] mt-auto">
                  <p className="text-gray-800 font-medium italic text-sm flex items-start gap-2">
                    <Quote className="h-4 w-4 text-[#1a237e]/30 shrink-0 mt-0.5" />
                    {story.quote}
                  </p>
                </div>

                {/* Realistic paper fold effect at the bottom corner */}
                <div
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-[#e4dfd1] to-[#fdfcf7] shadow-[-2px_-2px_6px_rgba(0,0,0,0.06)] rounded-tl-sm transition-all duration-300 origin-bottom-right group-hover:w-10 group-hover:h-10 z-10"
                  style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
                ></div>
                {/* Background mask for the fold */}
                <div
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#f4f3ef] transition-all duration-300 origin-bottom-right group-hover:w-10 group-hover:h-10 z-0 pointer-events-none"
                  style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)', transform: 'scale(1.05) translate(1px, 1px)' }}
                ></div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Premium CTA SECTION */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Rounded Rectangle CTA */}
            <div className="relative bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] rounded-[2.5rem] md:rounded-[3rem] py-16 md:py-20 px-8 md:px-16 lg:px-20 overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5"></div>
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-60 h-60 bg-[#c5cae9]/20 rounded-full blur-3xl"></div>
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-60 h-60 bg-[#c5cae9]/20 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                {/* Text Content */}
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Ready to write your <br className="hidden lg:block" />
                    <span className="text-white font-bold opacity-90">own story?</span>
                  </h2>
                  <p className="text-[#c5cae9] text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                    Join a community where every learner, at every age, is celebrated for their courage to grow.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full lg:w-auto">
                  <Link href="/#enquiry" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-14 px-8 bg-white text-[#1a237e] hover:bg-white/90 text-base font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      Begin Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/success-stories" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-14 px-8 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 text-base font-medium rounded-xl transition-all duration-300">
                      View More Noticeboards
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
