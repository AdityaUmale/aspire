'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import {
  Quote,
  ArrowRight,
  Star,
  Heart,
  MessageCircle,
} from 'lucide-react';

// Fonts setup
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });

type SuccessStory = {
  name: string;
  role: string;
  headline: string;
  quote: string;
  story: string[];
  
};

const successStories: SuccessStory[] = [
  {
    name: 'Tejas Kakkad',
    role: 'Parekh Group, India',
    headline: "ASPIRE didn't just shape my skills - it shaped me.",
    quote: 'If you feel even a spark of ambition within you, Aspire Institute is where that spark becomes your story.',
    story: [
      'My journey with Aspire Institute has been a turning point filled with learning, unlearning, and immense growth. I walked in with hesitation, but slowly discovered confidence I didn’t know I had.',
      'Through powerful workshops, real-time experiences, and constant encouragement, I learned how to communicate better, work effectively in teams, think strategically, and stretch beyond every comfort zone I had built for myself.',
      'Aspire taught me resilience, professionalism, and the courage to pursue excellence. From securing a PPO to seeing my personal transformation unfold, every milestone has been a reminder that the right guidance can unlock unimaginable potential.',
    ],
    
  },
  {
    name: 'Sharayu Hande',
    role: 'Amazon, India',
    headline: "Aspire Institute didn't just prepare me for a placement; it prepared me for a life I once only dreamed about.",
    quote: "If you’re ready to rewrite your story, Aspire is where the first chapter begins.",
    story: [
      'I unlocked a version of myself I never knew existed at Aspire Institute. The training, the guidance, and the constant belief they had in me equipped me with the skills, confidence, and mindset that ultimately led me to my placement at Amazon.',
      'What I experienced wasn’t a single change but a chain of transformations. My confidence soared, my outlook became positive, and I gathered the tools that now shape every area of my personal and professional growth.',
      'Working at a global MNC feels fulfilling, but knowing Aspire played a huge role in helping me reach this point makes it even more meaningful. Aspire gave me lessons I’ll carry for life—lessons that push me to dream boldly and aim for heights like becoming the CEO of an international company someday.',
    ],
  },
  {
    name: 'Sachin Ingle',
    role: 'Indian Army',
    headline: "Aspire didn’t just polish my English; it polished the man I became.",
    quote: 'If you dream of transforming yourself not just for a career, but for the life you’re meant to lead, Aspire is where that transformation begins.',
    story: [
      'I stepped into Aspire as someone who barely knew the English language, shaped by a background where the language was never my strength. The journey from there to today still amazes the people around me.',
      'Aspire didn’t just teach me language; it reshaped my confidence, refined my personality, and helped a shy boy grow into a gentleman ready to serve the nation.',
      'The communication skills, discipline, and self-belief I built here became my greatest assets when I joined the Indian Army. Aspire believed in me long before I believed in myself, and that changed everything.',
    ],
  },
  {
    name: 'Omkara Dethe',
    role: 'Human Resource Officer, Adani Group, India',
    headline: "Aspire didn’t just change my communication; it changed the way I see myself.",
    quote: 'If you feel you’re capable of more but don’t know where to begin, Aspire Institute is the place where your new self is born.',
    story: [
      'When I joined Aspire back in 2019, I struggled to speak, share, or even express simple thoughts. I carried the weight of hesitation and fear.',
      'With every session, activity, and push from mentors, my confidence rose to a level I never imagined. I learned how to communicate, present myself, and step into opportunities I once thought were not for me.',
      'The transformation shaped my skills and my identity—helping me become more knowledgeable, skilled, and grounded. Aspire gave me the courage to dream bigger and the clarity to pursue those dreams with certainty.',
    ],
  },
  {
    name: 'ADV Sonali Bobade',
    role: 'Advocate, Judiciary of India',
    headline: 'Aspire helped me find the voice I now use to stand for others.',
    quote: 'If you’re a woman fighting life’s battles while building your career, Aspire Institute is the hand that lifts you while you lift others.',
    story: [
      'I lost my father in my first year of LL.B., balanced my education, supported my family, got married, became a mother, and still built my career step by step.',
      'Aspire added a strength I didn’t know I needed. I learned to look at life with a positive attitude, express myself with clarity, and carry confidence into every courtroom.',
      'My clients now appreciate my communication, my income has grown, and most importantly, I’ve learned to believe in myself with honesty and pride. Aspire uplifted my spirit, reminding me that growth never stops.',
    ],
  },
  {
    name: 'Abhishek Wathurkar',
    role: 'QA Engineer, Reactore, India',
    headline: 'Aspire turned my silence into strength—and that strength built my career.',
    quote: 'If you feel stuck today, remember Aspire Institute can turn that starting point into a success story.',
    story: [
      'When I first joined Aspire, my confidence was at its lowest. Today, I communicate, collaborate, and present with ease—not because life became simpler, but because Aspire equipped me with the skills to rise.',
      'From completing a public speaking course to handling full client discussions, every step transformed me. I now manage projects and communicate confidently with teams and clients.',
      'Aspire taught me not just how to speak, but how to stand tall, solve problems, and keep moving forward with courage.',
    ],
  },
  {
    name: 'Dr. Renuka Pawar',
    role: 'Student of the Year 2023',
    headline: 'Aspire didn’t just change my confidence; it changed the direction of my entire journey.',
    quote: 'If you ever need a place that equips you to chase the impossible, Aspire Institute is where impossible begins to feel achievable.',
    story: [
      'Before joining Aspire, I was an introverted student struggling to express myself and doubting my abilities. Through training and workshops, I rebuilt my confidence and sharpened my communication.',
      'Life’s challenges no longer intimidate me—I see them as opportunities to grow. That belief helped me pursue research, contribute meaningfully, and even earn patents.',
      'Being awarded Student of the Year 2023 was a turning point. Today, I walk toward my dream of becoming an Agricultural Research Scientist with confidence, clarity, and courage.',
    ],
  },
  {
    name: 'Dr. Maleka Ansari',
    role: 'Dentist, Maharashtra, India',
    headline: 'Aspire helped me find the version of myself I thought I had lost.',
    quote: "Aspire doesn’t just train you—it lifts you back into your life.",
    story: [
      'I came to Aspire as an introvert battling many challenges—unsure of how to face people or life. Aspire rebuilt me piece by piece: my confidence, my expressiveness, my courage.',
      'Today, I run my clinic independently, I’m planning a new venture, and I’ve returned to my studies to complete my Bachelor’s in Psychology.',
      'None of this would have happened without Aspire’s support, guidance, and belief in me.',
    ],
  },
  {
    name: 'Gauri Gadge',
    role: 'Front-end Developer, India',
    headline: "Aspire didn’t just remove my hesitation; it helped me discover the confident version of myself.",
    quote: "If you’re talented but unheard, Aspire Institute is the bridge between your potential and your opportunity.",
    story: [
      'Even though I was a BCA student attending hackathons and building projects, my communication held me back from connecting with people and showcasing what I could do.',
      'Aspire changed everything. My confidence shot up, my stage fear disappeared, and networking became natural. That transformation helped me get selected as a Pro Developer at Infosys in Pune.',
      'Aspire didn’t just give me skills—it gave me wings, and now I’m aiming for companies like Google with the belief that I can reach there.',
    ],
  },
  {
    name: 'Suhana Pathan',
    role: 'MahaTransCo, Maharashtra, India',
    headline: "Aspire didn’t just improve my communication; it helped me find me.",
    quote: 'If fear is holding you back, Aspire Institute is the place where your voice returns to you.',
    story: [
      'When I joined Aspire in December 2024, I was filled with fear, negativity, and doubt. Communicating in English felt impossible.',
      'The positive environment and constant encouragement transformed me. My listening, writing, and understanding improved, and I overcame the fear that once held me back.',
      'That change helped me clear my competitive exam and step into my government job with pride. Aspire didn’t just teach me a skill; it helped me find myself.',
    ],
  },
  {
    name: 'Sahil Ansari',
    role: 'Web Developer, India',
    headline: "Aspire didn’t just change my story—it also changed the way I tell it.",
    quote: 'If you’re building a future but your voice isn’t ready yet, Aspire is the place where your voice learns to fly.',
    story: [
      'I could build, code, and dream—but couldn’t express it. When I walked into Aspire, I didn’t know a classroom could feel like a launchpad.',
      'My hesitation melted into expression, my silence into clarity, and my confidence into something solid. That shift carried me through hackathons, prize-winning projects, a scholarship, and even to ISRO as a volunteer.',
      'Aspire didn’t just improve my communication—it connected me to the world I was meant to be part of.',
    ],
  },
  {
    name: 'Asawari Kulkarni',
    role: 'HR Executive, Pune, India',
    headline: 'Aspire shaped the way I experience life itself.',
    quote: 'If you want to grow not only as a professional but as a human being, Aspire is where that transformation begins.',
    story: [
      'I joined Aspire at ELT Basic Level searching for confidence and clarity. By the time I completed ELT Proficient Level and personality development, something inside me had shifted.',
      'Aspire gave me a new perspective filled with warmth, positivity, and courage. It shaped my character and helped me grow professionally.',
      'I stepped into my HR role with empathy and strength—the kind the field truly demands. Aspire became my pillar of strength and motivation.',
    ],
  },
  {
    name: 'Deeptesh Patil',
    role: 'Engineer, Maharashtra Highway, India',
    headline: "Aspire didn’t just upgrade my communication; it upgraded the entire blueprint of my life.",
    quote: 'Aspire is the foundation that strengthens your future brick by brick, belief by belief.',
    story: [
      'From the moment I joined Aspire, I experienced transformation after transformation—each one shaping me into a stronger, sharper version of myself.',
      'My confidence shot up, communication improved, and I learned to identify my true potential. I became more productive, self-aware, and better at managing time and leading my team.',
      'Aspire helped me believe in my dream of starting my own construction firm and giving back to society with meaningful work.',
    ],
  },
  {
    name: 'Sahil Takrani',
    role: 'Business Owner, India',
    headline: "Aspire didn’t just build my confidence; it built the mindset that guides my business.",
    quote: 'If you want to build a business, start by building yourself—Aspire Institute is the place where that journey starts.',
    story: [
      'I joined Aspire relying on others for direction, unsure of my decisions and afraid to take steps alone. Aspire changed that completely.',
      'It helped me become calm, confident, grounded, and humble, and taught me how to carry myself with clarity in both business and life.',
      'When I applied Aspire’s lessons to my work, everything improved—communication, leadership, and the way people responded to my ideas.',
    ],
  },
  {
    name: 'Mudita Gawai',
    role: 'India',
    headline: "Aspire Institute didn’t just give me wings—it gave me direction.",
    quote: 'If you want to rise with clarity and courage, Aspire is where your journey truly begins.',
    story: [
      'Before Aspire, I often felt unsure about which path was right for my career and my life. Through Aspire’s courses and guidance, I learned how to think and choose wisely.',
      'Aspire taught me how to solve problems instead of depending on others, rise stronger in my personal life, and seize opportunities in my professional journey.',
      'Today, I’m more confident, disciplined, and determined to serve in the government sector with integrity—aiming to become an officer who leads with strength and purpose.',
    ],
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
    <div className={`min-h-screen bg-[#fbfbff] ${playfair.variable} ${jakarta.variable} font-sans selection:bg-[#1a237e] selection:text-white`}>
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

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-[#1a237e] mb-8 tracking-tight leading-[1.1] max-w-4xl mx-auto">
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
                  <div className="h-14 w-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg" style={{ background: accentColorFromName(s.name) }}>
                    {initials(s.name)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl text-[#0f1337] mb-1">{s.name}</h3>
                      <div className="text-xs uppercase tracking-wider text-gray-400">{s.role}</div>
                    </div>

                    
                  </div>

                  <h4 className="mt-4 font-serif text-2xl text-[#1a237e] leading-tight">“{s.headline}”</h4>

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

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8">
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
          font-family: var(--font-serif);
        }
        /* ensure accent bar doesn't overlap content on small screens */
        @media (max-width: 768px) {
          article > div.absolute[left] { display: none; }
        }
      `}</style>
    </div>
  );
}
