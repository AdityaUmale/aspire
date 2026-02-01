'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Quote,
  ArrowRight,
  Star,
  Heart,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';

type SuccessStory = {
  name: string;
  role: string;
  headline: string;
  quote: string;
  story: string[];
  image?: string;
};

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
    name: 'Sachin Ingle',
    role: 'Indian Army',
    headline: "I began my journey at Aspire with a different linguistic background, and over time that journey unfolded into a powerful transformation.",
    quote: 'If you dream of transforming yourself not just for a career, but for the life you\'re meant to lead, Aspire is where that transformation begins.',
    story: [
      'Aspire helped refine my communication, confidence, and discipline, shaping my personality and preparing me to serve the nation with pride and purpose.',
      'The skills and self-belief I strengthened here became invaluable when I joined the \'Indian Army\'. Aspire Institute\'s guidance amplified my potential and helped me step forward with clarity & confidence.',
    ],

  },
  {
    name: 'Omkara Dethe',
    role: 'Human Resource Officer, Adani Group, India',
    headline: "Aspire Institute didn't change who I was, it helped me step fully into who I was becoming.",
    quote: 'If you feel you\'re capable of more but don\'t know where to begin, Aspire Institute is the place where your new self is born.',
    story: [
      'I joined Aspire back in 2019 as someone who preferred silence over speaking and observation over expression. Growth reshaped me gradually, session by session, nudge by nudge.',
      'Over time, I found my voice, learning not just how to speak, but how to show up with confidence and intent. Opportunities that once felt distant began to feel possible.',
      'This beautiful journey shaped both my skills and my sense of self, helping me become more aware, capable, and grounded.',
    ],
  },
  {
    name: 'ADV Sonali Bobade',
    role: 'Advocate, Judiciary of India',
    headline: 'Aspire Institute didn\'t change my path, it empowered me to walk it with strength, dignity, and momentum.',
    quote: 'If you\'re a woman fighting life\'s battles while building your career, Aspire Institute is the hand that lifts you while you lift others.',
    story: [
      'Life tested me early. I lost my father during my first year of LLB, yet I moved forward balancing education, supporting my family, embracing marriage, becoming a mother, and building my career step by step.',
      'Miraculously, Aspire entered my journey as quiet strength at the right moment. It helped me cultivate a positive lens on life, express myself with clarity, and carry unshakeable confidence into every courtroom.',
      'Today, my clients value my communication, my professional growth reflects in my worth, and most importantly, I stand grounded in self-belief and pride.',
    ],
  },
  {
    name: 'Abhishek Wathurkar',
    role: 'QA Engineer, Reactore, India',
    headline: 'When I joined Aspire, I was eager to grow and explore my potential.',
    quote: 'If you feel stuck today, remember Aspire Institute can turn that starting point into a success story.',
    story: [
      'Step by step, I learned to communicate clearly, work with teams, and handle responsibilities with confidence. From public speaking training program to leading client discussions, every experience strengthened my skills and mindset, shaping me into a capable and grounded professional.',
      'Today, I approach challenges with clarity and calm, knowing that preparation and persistence are the keys to success. The lessons I learned at Aspire guide me in making thoughtful decisions and achieving results every day.',
      'Beyond career growth, Aspire taught me that learning is continuous. Each opportunity to improve, take initiative, and step confidently into new experiences reinforces the belief that we can always rise higher.',
    ],
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
  },
  {
    name: 'Dr. Maleka Ansari',
    role: 'Dentist, Maharashtra, India',
    headline: 'Aspire didn\'t just equip me with skills, it helped me embrace my potential, trust in myself, and move forward in life with clarity, purpose, and confidence.',
    quote: "Aspire doesn't just train you—it lifts you back into your life.",
    story: [
      'I came to Aspire as an introvert, unsure how to face people or navigate life\'s challenges. Piece by piece, Aspire Institute helped me grow, building my confidence, sharpening my expressiveness, and nurturing the courage I didn\'t know I had.',
      'Today, I run my clinic independently, plan exciting new ventures, and have returned to complete my Bachelor\'s in Psychology.',
      'Each step forward is a reflection of my effort combined with the guidance, support, and belief that Aspire instilled in me.',
    ],
  },
  {
    name: 'Gauri Gadge',
    role: 'Pro Developer, Infosys, India',
    headline: "Aspire didn't just equip me with skills, it gave me wings to aim higher.",
    quote: "If you're talented but unheard, Aspire Institute is the bridge between your potential and your opportunity.",
    story: [
      'As a BCA student, I could build projects and participate in hackathons but, to communicate effectively and showcase my abilities was a task back in time. That gap often held me back from connecting with people and opportunities.',
      'Aspire changed everything. Through training, workshops, and guidance, my confidence grew, stage fear disappeared, and networking became natural. This transformation helped me secure a role as a Pro Developer at Infosys in Pune.',
      'Today, I dream bigger and approach challenges with the belief that even companies like Google are within my reach.',
    ],
    image: '/sls/gauri.jpg',
  },
  {
    name: 'Suhana Pathan',
    role: 'MahaTransCo, Maharashtra, India',
    headline: "Aspire Institute didn't just teach me a skill, it helped me discover my potential, embrace challenges, and approach life with courage and clarity.",
    quote: 'If fear is holding you back, Aspire Institute is the place where your voice returns to you.',
    story: [
      'When I joined Aspire in December 2024, I was filled with fear, doubt, and negativity. Even communicating in English felt tough at first, and I often questioned my own abilities.',
      'The supportive environment, guidance, and constant encouragement gradually transformed me. My listening, writing, and comprehension improved, my confidence grew, and the fears that once held me back became stepping stones for growth.',
      'That change empowered me to clear my competitive exam and step into a government job with pride and assurance.',
    ],
  },
  {
    name: 'Sahil Ansari',
    role: 'Web Developer, India',
    headline: "Aspire didn't just teach me communication, it connected me to a world I had only imagined.",
    quote: 'If you\'re building a future but your voice isn\'t ready yet, Aspire is the place where your voice learns to fly.',
    story: [
      'I could build, code, and dream but to express it was what I hesitated at. When I first walked into Aspire, I didn\'t realize a classroom could feel like a launchpad for so much more than skills, it could spark transformation.',
      'Gradually, my hesitation turned into expression, my silence into clarity, and my confidence into something solid and unshakable. Every session, every mentor\'s guidance, every challenge became a step forward.',
      'That growth carried me through hackathons, prize-winning projects, a scholarship, and even the incredible opportunity to volunteer at ISRO. It showed me that potential isn\'t just about what you can do, it\'s about how boldly you step into it. Today, I carry that confidence, clarity, and courage into every project, every challenge, and every opportunity that comes my way.',
    ],

  },
  {
    name: 'Asawari Kulkarni',
    role: 'HR Executive, Pune, India',
    headline: 'Aspire didn\'t just guide me, it became my pillar of strength, motivation, and inspiration.',
    quote: 'If you want to grow not only as a professional but as a human being, Aspire is where that transformation begins.',
    story: [
      'I joined Aspire at the ELT Basic Level Training course, seeking confidence and clarity, not knowing that the journey ahead would transform not just my skills, but my perspective.',
      'By the time I completed ELT Proficient Level and personality development, something fundamental inside me had shifted. Aspire gave me more than knowledge, it instilled warmth, positivity, and courage, shaping and empowering my professional growth.',
      'Every session, every interaction, every challenge became a stepping stone toward the professional I was becoming. Today, as I step into my HR role, I carry empathy, strength, and clarity, the qualities this field truly demands.',
    ],
  },
  {
    name: 'Deeptesh Patil',
    role: 'Engineer, Maharashtra Highway, India',
    headline: "Aspire Institute didn't just equip me with skills, it gave me the belief and courage to pursue my dream.",
    quote: 'Aspire is the foundation that strengthens your future brick by brick, belief by belief.',
    story: [
      'From the moment I joined Aspire Institute, every experience sparked a transformation shaping me into a stronger, sharper, and more confident version of myself.',
      'I honed my communication, discovered my true potential, and grew in productivity, self-awareness, and leadership. Each step taught me how to manage time effectively and guide my team with clarity.',
      'Aspire Institute gave me the belief and courage to pursue my dream of starting my own construction firm and making a meaningful impact on society, which is a dream I\'m living every day in reality.',
    ],
  },
  {
    name: 'Sahil Takrani',
    role: 'Business Owner, India',
    headline: "I'm building a life of my dreams for myself with Aspire as one of my backbones.",
    quote: 'If you want to build a business, start by building yourself—Aspire Institute is the place where that journey starts.',
    story: [
      'I joined Aspire ready to grow, looking to sharpen my decision-making and step into my potential. Aspire accelerated that growth.',
      'Aspire transformed that completely. It helped me grow calm, confident, grounded, and humble, teaching me to carry myself with clarity in both business and life.',
      'Applying Aspire Institute\'s lessons to my work changed everything, my communication became sharper, my leadership stronger, and people began responding to my ideas with respect and trust.',
    ],
    image: '/sls/sahil.jpg',
  },
  {
    name: 'Mudita Gawai',
    role: 'India',
    headline: "The lessons learned at the Institute are the cornerstone for all this.",
    quote: 'If you want to rise with clarity and courage, Aspire is where your journey truly begins.',
    story: [
      'Before Aspire, I was on the path to find direction in my career and in life. I learned from Aspire Institute, discovering how to think clearly, make decisions confidently, and take ownership of my path.',
      'I faced challenges head-on, solved problems independently, and embraced opportunities that once felt out of reach. Each step strengthened my resilience, focus, and determination.',
      'Today, I move forward as a confident, disciplined, and purposeful individual, ready to serve in the government sector with integrity. My goal is to become an officer who leads with strength, conviction, and the courage to make a meaningful impact.',
    ],
    image: '/sls/mudita.jpg',
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
  // deterministic but simple palette
  const palette = ['#1a237e', '#3949ab', '#7c4dff', '#ef5350', '#fb8c00', '#00897b'];
  let code = 0;
  for (let i = 0; i < name.length; i++) code = (code * 31 + name.charCodeAt(i)) % palette.length;
  return palette[code];
}

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-[#fbfbff] font-sans selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      {/* Ambient paper grain for editorial feel (subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-20" style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.02), transparent 25%)` }} />

      {/* HERO */}
      {/* HERO */}
      <header className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-8">
            <Star className="h-4 w-4 text-[#1a237e] fill-[#1a237e]" />
            <span className="text-sm font-bold tracking-[0.2em] text-[#1a237e] uppercase opacity-70">Success Stories</span>
            <Star className="h-4 w-4 text-[#1a237e] fill-[#1a237e]" />
          </div>

          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl font-medium text-[#1a237e] mb-8 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Where Aspirations <br /> Become <span className="italic text-[#3949ab]">Achievements</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
            Real people. Real transformations. Discover how hesitation turns into confidence and ambition into impact.
          </p>
        </div>
      </header>

      {/* STORIES GRID */}
      <main id="stories" className="container mx-auto px-5 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {successStories.map((s) => (
            <article key={s.name} className="relative bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(16,24,40,0.06)] border border-black/[0.03] overflow-hidden group">

              {/* left accent */}
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-tr-lg rounded-br-lg" style={{ background: accentColorFromName(s.name), transform: 'translateX(-50%)' }} />

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {s.image ? (
                    <div className="h-20 w-20 rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={s.image}
                        alt={s.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg" style={{ background: accentColorFromName(s.name) }}>
                      {initials(s.name)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-xl text-[#0f1337] mb-1">{s.name}</h3>
                      <div className="text-xs uppercase tracking-wider text-gray-400">{s.role}</div>
                    </div>


                  </div>

                  <h4 className="mt-4 font-bold text-2xl text-[#1a237e] leading-tight">“{s.headline}”</h4>

                  <div className="mt-4 text-gray-600 leading-relaxed space-y-3 text-sm md:text-base">
                    {s.story.map((p, i) => (
                      <p key={i} className={i === 0 ? 'drop-cap' : ''}>
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="mt-6 bg-[#fbfbff] border-t pt-4 flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-[#1a237e] mt-1 flex-shrink-0" />
                    <p className="text-[#1a237e] italic font-medium">{s.quote}</p>
                  </div>
                </div>
              </div>

              {/* subtle quote mark in background */}
              <div className="pointer-events-none absolute right-6 top-6 opacity-5">
                <Quote className="w-36 h-36" />
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* CTA */}
      {/* CTA Section (original logic preserved) */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-[#1a237e] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3949ab] opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-8">
                <Heart className="h-4 w-4 text-[#9fa8da]" />
                <span className="text-[#c5cae9] text-sm font-medium tracking-wide">Join 150,000+ Success Stories</span>
              </div>

              <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-8">
                Your success story <br /> begins with <span className="italic opacity-80">one step.</span>
              </h2>

              <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
                <Link href="/#enquiry">
                  <Button className="h-14 px-8 rounded-full bg-white hover:bg-gray-100 text-[#1a237e] text-base font-bold tracking-wide shadow-xl transition-all hover:scale-105">
                    Start Your Transformation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/#courses">
                  <Button
                    variant="outline"
                    className="h-14 px-8 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 text-base font-medium transition-all"
                  >
                    Explore Programs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Drop-cap styling for the opening paragraph */
        .drop-cap::first-letter {
          float: left;
          font-size: 3rem;
          line-height: 1;
          padding-right: 8px;
          color: var(--tw-color-primary, #1a237e);
          font-weight: 700;
        }
        /* ensure accent bar doesn't overlap content on small screens */
        @media (max-width: 768px) {
          article > div.absolute[left] { display: none; }
        }
      `}</style>
    </div>
  );
}
