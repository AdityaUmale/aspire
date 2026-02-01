'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Quote,
  ArrowRight,
  Award,
  Scroll
} from 'lucide-react';

type SpiritStory = {
  name: string;
  title: string;
  headline: string;
  quote: string;
  story: string[];
  image?: string;
};

const stories: SpiritStory[] = [
  {
    name: 'Smt. Shraddha Bhokare',
    title: '79 years young | Salute Your Learning Spirit Award',
    headline: 'Learning has no age limit—and she proved it.',
    quote: 'Learning never retires and neither should our dreams.',
    story: [
      'Inspired by her granddaughter, she joined Aspire not as a spectator but as a determined learner—walking into every session with curiosity, discipline, and a desire to improve her communication.',
      'Her dedication became an inspiration for learners across all ages. Watching her participate, practise, and progress reminded everyone that learning isn’t bound by time—it’s powered by spirit.',
      'At our 17th Annual Function, she received the “We Salute Your Learning Spirit Award,” earning a heartfelt standing ovation for her courage and lifelong commitment to growth.',
    ],
    image: '/sls/Shradda.jpg',
  },
  {
    name: 'Shri Ramkrushna Gavhale',
    title: '81 years | Income Tax Officer (Retd.)',
    headline: 'Age is just a number; curiosity is forever.',
    quote: 'When the mind stays open, life keeps teaching.',
    story: [
      'Even after retirement, his dedication to improving himself brought him to Aspire with the same curiosity and discipline as our youngest learners.',
      'His enthusiasm to learn, ask questions, and embrace new knowledge inspired everyone around him. He showed us that personal development has no timeline—only a willing heart.',
      'We proudly honoured him with the “We Salute Your Learning Spirit Award” for his remarkable determination and example of lifelong learning.',
    ],
    image: '/sls/ramkrushn.jpg',
  },
  {
    name: 'Smt. Ashwini Pathak',
    title: 'Lifelong Learner & Homemaker',
    headline: '"Before you expire, join Aspire."',
    quote: 'Growth belongs to anyone brave enough to begin again.',
    story: [
      'With wisdom and warmth, she returned to the classroom to upgrade herself—balancing responsibilities while staying curious and courageous.',
      'Her openness to new ideas and joyful energy inspired learners across all age groups. She reminded us that growth isn’t reserved for the young.',
      'In recognition of her commitment to self-improvement, we honoured her with the “We Salute Your Learning Spirit Award.” Her journey shows that learning keeps us alive in mind, spirit, and purpose.',
    ],
  },
];

export default function SaluteLearningSpiritPage() {
  return (
    <div className={`flex flex-col min-h-screen bg-[#FDFDFD] font-sans selection:bg-[#1a237e] selection:text-white`}>
      <Navbar />

      {/* Global Grain Texture for "Archival" feel */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Hero Section - Dignified & Elegant */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[100px] opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-[#3949ab]/5 to-transparent blur-[100px] opacity-40 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 mb-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
            <div className="h-px w-8 bg-[#1a237e]/40"></div>
            <div className="flex items-center gap-2 text-[#1a237e] uppercase tracking-[0.2em] text-xs font-bold">
              <Award className="h-4 w-4" />
              <span>The Spirit Award</span>
            </div>
            <div className="h-px w-8 bg-[#1a237e]/40"></div>
          </div>

          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl font-medium text-[#1a237e] mb-8 tracking-tight leading-[1.1] animate-in slide-in-from-bottom-6 duration-700 delay-100 fade-in">
            Lifelong Learners, <br />
            <span className="text-[#3949ab] relative">
              Limitless Spirit.
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#3949ab]/10 rounded-full w-full"></span>
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in">
            Honouring the remarkable individuals who prove that growth has no age limit. Courage, curiosity, and commitment have no expiration date.
          </p>


        </div>
      </section>

      {/* Stories Section - "Hall of Fame" Layout */}
      <section className="py-20 bg-[#f8f9fa] border-t border-gray-100 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3 md:gap-8">
            {stories.map((story) => (
              <div
                key={story.name}
                className="group relative flex flex-col bg-white rounded-[20px] shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(26,35,126,0.15)] border border-gray-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Top Accent Line */}
                <div className="h-1.5 w-full bg-[#1a237e] group-hover:bg-[#3949ab] transition-colors"></div>

                <div className="p-8 md:p-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-6">
                    {story.image && (
                      <div className="mb-4 w-20 h-20 rounded-xl overflow-hidden shadow-md">
                        <Image
                          src={story.image}
                          alt={story.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0f1fa] text-[#1a237e] text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                      <Award className="h-3 w-3" />
                      Spirit Awardee
                    </div>
                    <h3 className="font-bold text-2xl font-bold text-[#1a237e] mb-2 leading-tight group-hover:text-[#3949ab] transition-colors">
                      {story.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-4">
                      {story.title}
                    </p>
                  </div>

                  {/* The Hook Quote */}
                  <div className="relative mb-8">
                    <Quote className="absolute -top-3 -left-2 h-8 w-8 text-[#1a237e]/10 -z-10" />
                    <h4 className="font-bold text-xl text-gray-800 leading-snug">
                      &ldquo;{story.headline}&rdquo;
                    </h4>
                  </div>

                  {/* Story Content */}
                  <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-light flex-grow">
                    {story.story.map((paragraph, i) => (
                      <p key={i} className={i === 0 ? "first-letter:text-2xl first-letter:font-bold first-letter:text-[#1a237e]" : ""}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Footer Quote */}
                  <div className="mt-8 pt-6 border-t border-gray-100 bg-gray-50 -mx-10 -mb-10 p-10 group-hover:bg-[#f8f9ff] transition-colors">
                    <div className="flex gap-3 items-center">
                      <Scroll className="h-5 w-5 text-[#1a237e] shrink-0" />
                      <p className="text-sm font-medium text-[#1a237e]">
                        {story.quote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotional CTA */}
      <section className="py-24 bg-[#1a237e] text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3949ab] opacity-30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">


            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Ready to write your <br />
              <span className="opacity-80">own story?</span>
            </h2>

            <p className="text-[#c5cae9] text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              Join a community where every learner, at every age, is celebrated for their courage to grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/#enquiry">
                <Button className="h-14 px-10 rounded-full bg-white text-[#1a237e] hover:bg-gray-100 text-base font-bold tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Begin Your Journey
                </Button>
              </Link>
              <Link href="/success-stories">
                <Button variant="outline" className="h-14 px-10 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 text-base font-medium transition-all duration-300">
                  Read More Stories
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}