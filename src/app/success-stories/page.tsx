'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
} from 'lucide-react';

type SuccessStory = {
  name: string;
  role: string;
  headline: string;
  quote: string;
  story: string[];
  image?: string;
  imagePosition?: string;
  imageScale?: string;
};

// FULL CONTENT RESTORED - NO CUTS
const successStories: SuccessStory[] = [
  {
    name: 'Tejas Kakkad',
    role: 'Parekh Group, India',
    headline: "ASPIRE Institute didn't just shape my skills, it walked alongside me as I shaped myself.",
    quote: 'If you feel even a spark of ambition within you, Aspire Institute is where that spark becomes your story.',
    story: [
      'I entered with hesitation, but through consistent effort and the right guidance, I discovered confidence, clarity, and courage.',
      'Real experiences challenged me to communicate better, think sharper, and step beyond my comfort zone. Aspire Institute taught me resilience, professionalism, and the mindset to strive for excellence.',
      'From personal transformation to securing a PPO, this journey proved that the right guidance can unlock unimaginable potential.',
    ],
    image: '/sls/tejas.jpg',
    imagePosition: 'object-[center_20%]',
  },
  {
    name: 'Sharayu Hande',
    role: 'Amazon, India',
    headline: "At Aspire Institute, I unlocked a version of myself I never knew existed.",
    quote: "If you're ready to rewrite your story, Aspire is where the first chapter begins.",
    story: [
      'With the right training, guidance, and constant belief paired with my efforts, I built the skills, confidence, and mindset that led to my placement at Amazon. This wasn\'t one big change, but a series of transformations, clearer thinking, stronger confidence, and a positive outlook on growth.',
      'Working at a global MNC is really fulfilling, but knowing Aspire Institute helped shape this journey makes it truly meaningful. The lessons I gained here stay with me pushing me to dream boldly and aim for heights as big as leading an International Company someday.',
    ],
    image: '/sls/sharayu.jpg',
  },
  {
    name: 'Dr. Renuka Pawar',
    role: 'Student of the Year 2023',
    headline: 'Joining Aspire was a turning point in my journey.',
    quote: 'If you ever need a place that equips you to chase the impossible, Aspire Institute is where impossible begins to feel achievable.',
    story: [
      'Through immersive training and workshops, I transformed my confidence, sharpened my communication, and learned to see every challenge as an opportunity to excel.',
      'That belief fuelled my research pursuits, meaningful contributions, and even led to earning patents. Being honoured as Student of the Year 2023 was a moment that celebrated not just achievement, but growth, perseverance, and vision.',
      'Today, I stride toward my dream of becoming an Agricultural Research Scientist with unwavering clarity, courage, and the conviction that every step forward is a step toward impact.',
    ],
    image: '/sls/renuka.jpg',
    imagePosition: 'object-[center_20%]',
  },

  {
    name: 'Ms. Pranjali Wahurwagh',
    role: 'Flight Attendant, IndiGo Airlines',
    headline: 'At Aspire, I discovered a stronger version of myself.',
    quote: 'Aspire shaped my mindset, resilience, and belief that no dream is too big. The journey continues, but now I walk it with confidence and purpose.',
    story: [
      'Coming from a small town, I joined Aspire \u2013 The Institute of Human Development through the Intermediate to Proficient levels and the Arise Language and Thoughts Enrichment Camp. What began as a step to improve my English became a complete transformation. My communication improved, but more importantly, my confidence grew.',
      'Speaking fluently once felt difficult. Today, I connect effortlessly with people from across the world. Being selected as 1 out of 367 candidates for cabin crew interviews and becoming a Flight Attendant with IndiGo Airlines was a proud milestone. At 21, I was also able to fulfil my dream of owning a home for my parents.',
    ],
    image: '/sls/pranjali.jpg',
    imageScale: 'scale-200',
    imagePosition: 'object-[center_-65%]',
  },
  {
    name: 'Mr. Aditya Umale',
    role: 'Software Engineer, Giddly',
    headline: 'At Aspire, I learned how to turn potential into performance.',
    quote: 'Today, as a Software Engineer at Giddly with multiple job offers after graduation, I move forward with clarity and purpose. Aspire helped me grow into a professional who strives to create meaningful impact through his work.',
    story: [
      'I joined Aspire \u2013 The Institute of Human Development with technical knowledge and a desire to grow, but I needed direction and confidence. Through programs like PDP, LDP, ELT (L3, L4, L5), FEL, and the Arise Language and Thoughts Enrichment Camp, my communication became clearer, my thinking sharper, and my leadership more grounded in values and empathy.',
      'With the guidance of my mentors and the inspiring vision of Respected Sachin Sir, this journey truly changed the direction of my career. I learned not just to acquire knowledge, but to apply it with confidence.',
    ],
    image: '/Aditya Umale.jpg',
    imageScale: 'scale-130',
    imagePosition: 'object-[center_10%]',
  },
  {
    name: 'Mr. Rohit Chaudhari',
    role: 'Senior Consultant, Fractal Analytics',
    headline: 'Consistency changed my life.',
    quote: 'Today, as a Senior Consultant at Fractal Analytics, I work with greater confidence and direction. My goal is to grow into senior management and create lasting value for both my organization and my family. Aspire taught me that steady effort, guided well, always leads forward.',
    story: [
      'Coming from a financially humble background, responsibility shaped me early. I knew growth would not be instant \u2013 it had to be earned. Joining Aspire \u2013 The Institute of Human Development became a defining step in that journey. Through the ELT Intermediate and Proficient Levels, the Personality Development Program (PDP), and the Arise Language and Thoughts Enrichment Camp, I strengthened not just my English communication, but my clarity of thought and confidence in expression.',
      'Aspire helped me present ideas effectively, interact professionally with teams, and build a positive, solution-focused mindset. Over time, these changes reflected directly in my career growth.',
    ],
    image: '/Rohit Chaudhari.jpg',
    imagePosition: 'object-[center_20%]',
  },
  {
    name: 'Mr. Shubham Purushottam Marhe',
    role: 'Process Executive, Infosys BPM',
    headline: 'There was a time I was afraid to speak. Today, I speak with confidence.',
    quote: 'I carry not just improved communication skills, but a stronger sense of self. I aspire to grow further as a responsible corporate professional and one day, a successful businessman. Aspire taught me that even the smallest consistent steps can change a life.',
    story: [
      'I joined Aspire \u2013 The Institute of Human Development at the Basic Level as a nervous but eager learner. I wanted to improve my English, but what I truly needed was belief in myself. Aspire gave me that space \u2013 patient guidance, constant motivation, and the courage to grow step by step.',
      'From Levels 2 to 5, the Arise Camp, and the Public Speaking Program, every stage shaped me. Daily practice slowly replaced hesitation with clarity. I learned to express my thoughts without fear and approach challenges with a calm, positive mindset.',
      'Today, as a Process Executive at Infosys BPM, I see how far I have come.',
    ],
    image: '/shubham marhe.jpg',
    imagePosition: 'object-[center_20%]',
  },
  {
    name: 'Mr. Gopal Raju Hagawane',
    role: 'Owner, Shree Hari Food Junction',
    headline: 'I joined Aspire to improve my English. I walked away with belief in myself.',
    quote: 'I now aim to grow as an ideal businessman and build multiple successful ventures. This journey taught me that when you believe in yourself, you begin to break every ceiling that once felt out of reach.',
    story: [
      'As the owner of Shree Hari Food Junction, I always worked hard, but I wanted to grow beyond my limitations. I enrolled at Aspire \u2013 The Institute of Human Development and completed the ELT levels up to Functional English Level 2. What began as a simple step toward better communication became a journey of confidence and clarity.',
      'There was a time I struggled to speak even a few words in English. Today, I communicate comfortably and carry myself with confidence in every interaction. Aspire helped me recognize my potential and approach challenges with a positive mindset.',
    ],
    image: '/gopal hagwane.jpg',
    imagePosition: 'object-[center_10%]',
  },
  {
    name: 'Ms. Pratiksha Nirale',
    role: 'Assistant Manager, ASBC & Co.',
    headline: "I didn\u0027t just grow at Aspire \u2013 I rebuilt myself.",
    quote: 'I once hoped for stability and direction \u2014 today, I am living the dreams I once only imagined. Aspire taught me that when clarity meets courage, transformation follows.',
    story: [
      'There was a phase in my life when I felt confused, demotivated, and uncertain about my direction. Joining Aspire \u2013 The Institute of Human Development became the turning point. Through the Leadership Development Program, Personality Development Program, Advanced and Proficient Levels, multiple Arise Camps, the Meet Yourself International Workshop in Hanoi, and growth workshops in Pune, I slowly began to see myself with clarity.',
      'I learned to respond calmly instead of reacting emotionally. I developed responsibility, emotional balance, and a positive outlook toward challenges. Aspire helped me strengthen my self-image and think with purpose.',
      'Today, as an Assistant Manager at ASBC & Co., I stand confident and grounded. I feel proud of how far I have come.',
    ],
    image: '/Pratiksha Nirale.jpg',
  },
  {
    name: 'Mr. Aspirant Vishal Vitthalrao Tale',
    role: 'Office Manager, Mandar Pharma',
    headline: 'Aspire became the backbone of my growth.',
    quote: 'I aim to step into larger leadership roles, manage bigger teams, and take on greater responsibilities. Aspire taught me that true growth begins within \u2013 and when your mindset strengthens, your career follows.',
    story: [
      'I joined Aspire \u2013 The Institute of Human Development through Functional English Level 2, hoping to improve my communication. What I experienced was much deeper. The journey shaped my confidence, strengthened my thinking, and helped me grow into a calm and capable professional.',
      'I learned how to draft professional emails, communicate effectively with senior executives, and handle workplace responsibilities with clarity. More importantly, Aspire taught me how to stay composed under pressure, think logically, and respond with maturity instead of reacting emotionally. These qualities have transformed the way I work every day.',
      'Today, as an Office Manager at Mandar Pharma, I carry myself with greater confidence and stability.',
    ],
    image: '/vishal tale.JPG.jpg',
  },
  {
    name: 'Mr. Aspirant Kirtesh Nandkishor Agrawal',
    role: 'Business Owner, Sankalp Cyber Caf\u00e9 & PA to MLC, Vidhan Bhavan',
    headline: 'My journey was never easy \u2013 but it was always meaningful.',
    quote: 'I aim to scale higher, expand my ventures, and inspire others who begin with limited resources but unlimited determination. Aspire taught me that resilience, guided well, can turn struggle into strength.',
    story: [
      'When I joined Aspire \u2013 The Institute of Human Development, I was carrying responsibilities, setbacks, and the pressure to build something of my own. I needed clarity and direction. Aspire became that turning point. It gave me belief when I needed it most.',
      'Through the Personality Development Program (PDP) and Functional English Level training, I rebuilt myself step by step. My communication improved, but more importantly, my mindset changed. I learned discipline, better decision-making, and the courage to take bold steps even when the path felt uncertain.',
      'Today, as the owner of Sankalp Cyber Caf\u00e9 and serving as PA to an MLC at Vidhan Bhavan, I lead with confidence and purpose.',
    ],
    image: '/sls/kirtesh.jpg',
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function accentColorFromName(name: string) {
  // Classic, muted academic colors
  const palette = ['#1a237e', '#2c3e50', '#8e44ad', '#c0392b', '#d35400', '#16a085'];
  let code = 0;
  for (let i = 0; i < name.length; i++) code = (code * 31 + name.charCodeAt(i)) % palette.length;
  return palette[code];
}

export default function SuccessStoriesPage() {
  return (
    // The background is a warm, soft linen/paper white to simulate a noticeboard
    <div className="min-h-screen bg-[#f4f3ef] font-sans selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      {/* Subtle paper/cork texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* HEADER */}
      <header className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 z-10 text-center">
        <div className="container mx-auto px-4 md:px-6">


          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-[#111827] mb-6 tracking-tight max-w-4xl mx-auto">
            Where Aspirations <br /> Become <span className="text-[#1a237e] font-serif font-bold">Achievements</span>
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Real people. Real transformations. Pinned memories of hesitation turning into unshakeable confidence.
          </p>
        </div>
      </header>

      {/* TRADITIONAL PINBOARD GRID */}
      <main id="stories" className="container mx-auto px-4 md:px-6 pb-24 relative z-10">
        {/* Using CSS columns for a masonry look, like real pinned notes */}
        <div className="columns-1 md:columns-2 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
          {successStories.map((s, index) => {
            // Very subtle organic rotations
            const rotation = index % 4 === 0 ? '-rotate-1' : index % 3 === 0 ? 'rotate-1' : index % 2 === 0 ? '-rotate-[0.5deg]' : 'rotate-[0.5deg]';

            return (
              <article
                key={s.name}
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
                    {s.image ? (
                      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden shadow-md border-2 border-white ring-1 ring-black/5">
                        <Image
                          src={s.image}
                          alt={s.name}
                          width={112}
                          height={112}
                          sizes="(max-width: 640px) 96px, 112px"
                          className={`w-full h-full object-cover ${s.imageScale || ''} ${s.imagePosition || 'object-center'}`}
                        />
                      </div>
                    ) : (
                      <div
                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl flex items-center justify-center text-white font-medium text-3xl shadow-md border-2 border-white ring-1 ring-black/5"
                        style={{ background: accentColorFromName(s.name) }}
                      >
                        {initials(s.name)}
                      </div>
                    )}
                  </div>

                  <div className="sm:pt-2">
                    <h3 className="font-bold text-2xl text-gray-900 leading-tight">{s.name}</h3>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#1a237e] mt-1.5">
                      {s.role}
                    </div>
                  </div>
                </div>

                <h4 className="font-serif font-medium text-xl text-[#1a237e] leading-snug mb-5 relative z-[2]">
                  “{s.headline}”
                </h4>

                <div className="space-y-3 text-gray-700 leading-relaxed text-sm md:text-base mb-6 relative z-[2]">
                  {s.story.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Quote Box - Styled like a stamped/highlighted section */}
                <div className="bg-[#f4efe3]/60 border-l-[3px] border-[#1a237e]/40 px-4 py-3 rounded-r-sm relative z-[2]">
                  <p className="text-gray-800 font-medium italic text-sm">
                    {s.quote}
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
                    Ready to pin your own <br className="hidden lg:block" />
                    <span className="text-white font-serif font-medium opacity-90">success story?</span>
                  </h2>
                  <p className="text-[#c5cae9] text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                    Join the hundreds of students who walked through our doors with hesitation and walked out with unshakeable confidence.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full lg:w-auto">
                  <Link href="/#enquiry" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-14 px-8 bg-white text-[#1a237e] hover:bg-white/90 text-base font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      Start Your Transformation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/#courses" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-14 px-8 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 text-base font-medium rounded-xl transition-all duration-300">
                      Explore Programs
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
