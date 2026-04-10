'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, Quote, Globe, Users, Mic, Star } from 'lucide-react';

export default function FounderPage() {
  const founderImages = [
    "/founder/_BK29163.jpg",
    "/founder/AJM_4059.jpg",
    "/founder/IMG_7550.jpg",
    "/founder/2.jpg",
    "/founder/_DSC9414.jpg",
  ];

  const founderGalleryImages = [
    founderImages[1],
    founderImages[2],
    founderImages[3],
    founderImages[4],
  ];

  const achievements = [
    { icon: Users, value: "3M+", label: "Lives Impacted" },
    { icon: Globe, value: "15+", label: "Countries" },
    { icon: Mic, value: "20+", label: "Years of Experience" },
    { icon: Star, value: "5,000+", label: "Workshops Conducted" },
  ];

  const countries = [
    "Singapore", "Dubai", "Malaysia", "Thailand", "Qatar", "Egypt", "Sri Lanka", "UAE", "Vietnam", "Macau", "Indonesia"
  ];

  return (
    <div className={`flex flex-col min-h-screen bg-[#FAFAFA] text-[#1a237e] font-sans selection:bg-[#1a237e] selection:text-white`}>

      {/* ────────────────────────────────────────────────
        GLOBAL GRADIENT BACKGROUND — fixed, spans entire page
       ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[20%] right-[-10%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-gradient-to-br from-[#7c4dff]/20 md:from-[#7c4dff]/25 via-[#536dfe]/15 md:via-[#536dfe]/20 to-transparent blur-[60px] md:blur-[80px]"></div>
        <div className="absolute top-[55%] left-[-8%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full bg-gradient-to-tr from-[#448aff]/15 md:from-[#448aff]/20 via-[#7c4dff]/10 md:via-[#7c4dff]/15 to-transparent blur-[50px] md:blur-[60px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full bg-gradient-to-tl from-[#e040fb]/10 md:from-[#e040fb]/15 via-[#7c4dff]/10 md:via-[#7c4dff]/10 to-transparent blur-[40px] md:blur-[60px]"></div>
      </div>

      <Navbar />

      {/* GLOBAL BACKGROUND GRAIN TEXTURE */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* HERO SECTION - Editorial Style */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1a237e]/60 hover:text-[#1a237e] mb-12 transition-all group font-medium tracking-wide text-sm uppercase">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Return Home</span>
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Typography Content */}
            <div className="lg:col-span-7 flex flex-col justify-center pt-4">
              <div className="inline-flex items-center gap-2 mb-6 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                <span className="h-px w-8 bg-[#1a237e]"></span>
                <span className="text-xs font-bold tracking-[0.2em] text-[#1a237e] uppercase">The Visionary</span>
              </div>

              <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-[#1a237e] leading-[0.9] mb-8 tracking-tight animate-in slide-in-from-bottom-6 duration-700 delay-100 fade-in">
                Hon&apos;ble <br />
                <span className="opacity-80">Mr. Sachin</span> <br />
                Burghate
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mb-10 font-light border-l-2 border-[#1a237e]/20 pl-6 animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in">
                Sachin Burghate Sir doesn&apos;t just teach for a living; he teaches for a <strong className="text-[#1a237e] font-medium">purpose.</strong> As India&apos;s most celebrated voice in personal development, he has spent over two decades changing lives with extraordinary consistency.
              </p>

              
            </div>

            {/* Image Composition */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 animate-in zoom-in-95 duration-1000 delay-200 fade-in">
              <div className="relative">
                {/* Decorative Frame */}
                <div className="absolute inset-0 border border-[#1a237e] translate-x-4 translate-y-4 rounded-tr-[4rem] rounded-bl-[4rem]" />

                {/* Main Image Container */}
                <div className="relative bg-gray-200 rounded-tr-[4rem] rounded-bl-[4rem] overflow-hidden shadow-2xl aspect-[4/5]">
                  <Image
                    src={founderImages[0]}
                    alt="Hon&apos;ble Mr. Sachin Burghate, Founder of Aspire Institute"
                    fill
                    className="object-cover object-[25%_center] hover:scale-105 transition-transform duration-700 ease-in-out"
                    priority
                  />

                  {/* Glass Card Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a237e]/90 to-transparent pt-24">
                    <div className="flex items-center gap-4 text-white">
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest opacity-80">Honored With</p>
                        <p className="font-bold text-lg">OYP India Award</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS - Landing Page Minimalist Style */}
      <section className="container mx-auto px-4 md:px-6 relative z-20 mt-16 lg:mt-24 mb-16 lg:mb-24">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {achievements.map((stat, i) => (
            <div key={i} className={`flex flex-col items-center justify-center text-center p-3 lg:p-0 ${i !== 3 ? 'lg:border-r border-gray-200/60' : ''}`}>
              {/* Keep icon subtle above text if desired, or remove entirely to match landing page exactly. Removing icon to perfectly match landing. */}
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a237e] mb-2">{stat.value}</span>
              <span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* HONORARY LEGACY SECTION - The Detailed Story */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-32">

            {/* Segment 1: The Intro */}
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="h-px w-8 bg-[#1a237e]"></span>
                  <span className="text-xs font-bold tracking-[0.2em] text-[#1a237e] uppercase">Meet Our Hon’ble Founder</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a237e] tracking-tight leading-[1.1] mb-8">
                  The man behind <br />
                  <span className="opacity-60">millions</span> of <br />
                  transformed lives.
                </h2>
                <div className="space-y-6 text-gray-600 font-light text-lg leading-relaxed">
                  <p>
                    Some people teach for a living. <strong className="text-[#1a237e] font-medium">Sachin Burghate Sir teaches for a purpose.</strong>
                  </p>
                  <p>
                    Founder of Aspire the Institute of Human Development, and one of India&apos;s most celebrated voices in personal and professional development, Mr. Sachin Burghate has spent over two decades doing one thing with extraordinary consistency: walking into a room and changing lives.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 border border-[#1a237e]/10 -translate-x-6 translate-y-6 rounded-[3rem]" />
                <div className="relative rounded-[3rem] overflow-hidden aspect-video shadow-2xl">
                  <Image
                    src={founderImages[1]}
                    alt="Sachin Burghate Sir conducting a leadership workshop"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Segment 2: Impact & Global Presence */}
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute inset-0 bg-[#1a237e]/5 rounded-3xl -rotate-2 scale-105" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 aspect-square md:aspect-[4/5]">
                  <Image
                    src={founderGalleryImages[1]}
                    alt="Sachin Burghate Sir international training gallery"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="h-px w-8 bg-[#14237e]"></span>
                  <span className="text-xs font-bold tracking-[0.2em] text-[#1a237e] uppercase">A Career of Impact</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a237e] tracking-tight mb-8">
                  Built on impact, <br />not just accolades.
                </h2>
                <div className="space-y-6 text-gray-600 font-light text-lg leading-relaxed">
                  <p>
                    With over 20 years of experience, reaching more than <strong className="text-[#1a237e] font-medium">3 million lives</strong> and delivering over <strong className="text-[#1a237e] font-medium">5,000 programs worldwide</strong>, Sir&apos;s journey is not a tale of overnight success. It is a story of unwavering belief in human potential, built one learner at a time.
                  </p>
                  <p>
                    From the classrooms of Maharashtra to the global stages of Singapore, Dubai, Malaysia, Thailand, Qatar, Egypt, Sri Lanka, UAE, Vietnam, Macau, and Indonesia, his message has crossed every border, connected with every culture, and resonated with every kind of dreamer.
                  </p>
                </div>
              </div>
            </div>

            {/* Segment 3: Recognition */}
            {/* Segment 3: Recognition Bento Box */}
            <div className="relative pt-12">
              <div className="inline-flex items-center gap-2 mb-10">
                <div className="h-px w-8 bg-[#1a237e]"></div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1a237e]">Recognised. Celebrated. Unstoppable.</span>
              </div>
              
              <div className="grid md:grid-cols-12 gap-6">
                {/* Highlight Card 1: Outstanding Young Person */}
                <div className="md:col-span-12 relative bg-[#1a237e] rounded-[2.5rem] p-10 md:p-14 text-white overflow-hidden shadow-[0_20px_40px_-15px_rgba(26,35,126,0.3)] group">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />
                  
                  <div className="relative z-10 grid md:grid-cols-12 items-center gap-8 md:gap-12">
                    <div className="md:col-span-8 space-y-6">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-inner group-hover:-translate-y-1 transition-transform">
                        <Award className="h-4 w-4 text-blue-300" />
                        <span className="text-xs font-bold tracking-widest uppercase text-blue-100">National Recognition</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
                        Honoured with the prestigious <strong className="font-bold text-white">Outstanding Young Person of India</strong> award by JCI India in 2014.
                      </h3>
                      <p className="text-blue-100/90 text-lg md:text-xl font-light max-w-2xl">
                        Subsequently nominated for the Ten Outstanding Young Persons of the World the very next year.
                      </p>
                    </div>

                    <div className="md:col-span-4 flex justify-center md:justify-end hidden md:flex">
                      <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative">
                        <div className="absolute inset-4 rounded-full border border-white/20 border-dashed animate-[spin_40s_linear_infinite]" />
                        <div className="absolute inset-8 rounded-full border border-white/10 animate-[spin_20s_linear_reverse_infinite]" />
                        <Award className="h-16 w-16 lg:h-24 lg:w-24 text-white/20 transform group-hover:scale-110 group-hover:text-blue-300/30 transition-all duration-700" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Card 2: Zee TV Feature */}
                <div className="md:col-span-6 relative bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="h-14 w-14 rounded-2xl bg-[#1a237e]/5 text-[#1a237e] flex items-center justify-center mb-8 border border-[#1a237e]/10 group-hover:bg-[#1a237e] group-hover:text-white transition-colors duration-500">
                    <Star className="h-6 w-6" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1a237e] mb-4 group-hover:text-[#3949ab] transition-colors duration-300">Featured on ZEE TV&apos;s &quot;The Real Hero&quot;</h4>
                  <p className="text-gray-600 leading-relaxed font-light text-lg">
                    His extraordinary journey was watched by millions who saw, in his story, a reflection of what is possible when purpose meets persistence.
                  </p>
                </div>

                {/* Sub Card 3: International Standing */}
                <div className="md:col-span-6 relative bg-gradient-to-br from-[#f8f9fa] to-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                  {/* Subtle map pattern/gradient hint */}
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#1a237e]/5 rounded-full blur-3xl group-hover:bg-[#1a237e]/10 transition-colors duration-700" />
                  
                  <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-[#1a237e]/5 text-[#1a237e] flex items-center justify-center mb-8 border border-[#1a237e]/10 group-hover:bg-[#1a237e] group-hover:text-white transition-colors duration-500">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h4 className="text-2xl font-bold text-[#1a237e] mb-4 group-hover:text-[#3949ab] transition-colors duration-300">Global Academic Impact</h4>
                    <p className="text-gray-600 leading-relaxed font-light text-lg">
                      Addressed institutions of international standing, including HUB Singapore&apos;s National Youth Council Academy and VNU University of Science in Hanoi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MESSAGE SECTION - The Manuscript Look */}
      <section className="py-20 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">

              {/* Left Column: Context */}
              <div className="md:w-1/3 space-y-8 relative md:sticky md:top-24 h-fit">
                <div>
                  <h2 className="font-bold text-4xl text-[#1a237e] mb-4">A Message From <br />The Founder</h2>
                  <div className="h-1 w-20 bg-[#3949ab]"></div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Welcome to Aspire, The Institute Of Human Development. Welcome to the University Of Life.
                </p>
                <div className="hidden md:block">
                  <Quote className="h-24 w-24 text-[#e8eaf6]" />
                </div>
              </div>

              {/* Right Column: The Content */}
              <div className="md:w-2/3">
                <div className="relative">
                  {/* Decorative quote mark */}
                  <span className="absolute -top-6 -left-4 text-8xl font-bold text-[#1a237e]/5 leading-none">&ldquo;</span>

                  <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-light">
                    <p className="font-bold text-2xl text-[#1a237e] leading-snug">
                      Welcome to Aspire, The Institute Of Human Development. Welcome to the University Of Life.
                    </p>

                    <p>
                      Some institutions teach subjects. And then some institutions shape people. At Aspire, we have always chosen the latter, and that choice has defined everything we do.
                    </p>

                    <p>
                      Since 2009, Aspire has stood for something larger than conventional education. We were built on the belief that true learning must go beyond textbooks and examinations. Nurturing learners&apos; confidence, sharpening their communication, awakening their leadership, and giving them a deep, grounded sense of purpose are not additions to our curriculum. They are the very heart of it.
                    </p>

                    <p>
                      Over the years, it has been the greatest privilege of my life to witness thousands of learners walk through the doors of Aspire Institute, transformed. Closer to their goals. Clearer in their purpose. More capable and more confident in everything they do. Watching that transformation unfold, again and again, is what fuels everything we build here.
                    </p>

                    <p>
                      As the founder of Aspire Institute, I welcome you not just to a programme, but to a place where learning is practical, meaningful, and life-changing. A place where you are seen not merely as a student, but as a person with immense potential waiting to be discovered and directed.
                    </p>

                    <p>
                      Our purpose at Aspire Institute has always been simple, and it remains unchanged: to develop capable, confident, and responsible individuals who go on to contribute meaningfully to their families, their professions, and to the world around them.
                    </p>

                    <p>
                      You have taken an important step by choosing Aspire Institute. I hope this journey brings you not only knowledge and skill, but a renewed belief in yourself and all that you are capable of achieving.
                    </p>

                    <p>
                      I wish you a truly wonderful learning journey and a future as bright as your aspirations.
                    </p>

                    <div className="py-6 my-6 border-y border-gray-100 flex items-center gap-6">
                      <div className="h-20 w-20 rounded-full overflow-hidden border border-gray-200 shadow-inner shrink-0">
                        <Image
                          src={founderImages[2]}
                          alt="Portrait of Sachin Burghate, Founder of Aspire Institute"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover grayscale opacity-80"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-xl text-[#1a237e]">Warm regards,</p>
                        <div className="mt-2 text-sm">
                          <span className="font-bold text-[#1a237e] tracking-wider uppercase block">Sachin Burghate</span>
                          <span className="text-gray-400">Founder, Aspire The Institute Of Human Development</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* GLOBAL PRESENCE - Editorial Two-Column */}
      <section className="py-24 lg:py-32 relative overflow-hidden border-t border-gray-100 z-10">
        {/* Decorative background orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1a237e]/[0.03] blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-6xl mx-auto">

            {/* Left: Headline + Globe Stat */}
            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="h-px w-8 bg-[#1a237e]" />
                  <span className="text-xs font-bold tracking-[0.2em] text-[#1a237e] uppercase">Worldwide Impact</span>
                </div>
                <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-[#1a237e] tracking-tight leading-[1.1] mb-6">
                  Borders Are <br className="hidden md:block" />
                  <span className="text-[#3949ab]">Not Barriers.</span>
                </h2>
                <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                  Delivering transformative wisdom across continents. The message of empowerment has resonated with every kind of dreamer, everywhere.
                </p>
              </div>

              {/* Animated Globe Counter */}
              <div className="flex items-center gap-8">
                <div className="relative w-36 h-36 md:w-44 md:h-44 shrink-0 group">
                  {/* Orbiting rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#1a237e]/10 animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-3 rounded-full border border-[#1a237e]/5 animate-[spin_30s_linear_reverse_infinite]" />
                  {/* Inner circle */}
                  <div className="absolute inset-5 rounded-full bg-gradient-to-br from-[#1a237e] to-[#3949ab] shadow-[0_20px_40px_-12px_rgba(26,35,126,0.35)] flex flex-col items-center justify-center text-white">
                    <span className="text-4xl md:text-5xl font-bold tracking-tighter leading-none">15+</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70 mt-1">Countries</span>
                  </div>
                  {/* Floating dot decorations */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 rounded-full bg-[#3949ab] shadow-lg" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-[#7986cb]" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-[#5c6bc0]" />
                </div>
                <div className="hidden md:block space-y-1">
                  <p className="text-3xl font-bold text-[#1a237e] tracking-tight">5,000+</p>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Programs Delivered Globally</p>
                </div>
              </div>
            </div>

            {/* Right: Country List — Numbered Itinerary */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-x-8 gap-y-0">
                {countries.map((country, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 py-5 border-b border-gray-200/80 last:border-b-0 cursor-default hover:pl-2 transition-all duration-300"
                  >
                    <span className="text-[11px] font-bold tracking-wider text-[#1a237e]/30 group-hover:text-[#3949ab] transition-colors duration-300 tabular-nums w-5 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="h-px w-4 bg-[#1a237e]/10 group-hover:w-6 group-hover:bg-[#3949ab] transition-all duration-300 shrink-0" />
                    <span className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-[#1a237e] transition-colors duration-300">
                      {country}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION - Clean Minimalist */}
      <section className="py-24 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-[#f8f9fa] rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-24 -left-24 w-64 h-64 border-[40px] border-[#e8eaf6] rounded-full opacity-50"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 border-[40px] border-[#e8eaf6] rounded-full opacity-50"></div>

            <div className="relative z-10 max-w-3xl mx-auto">

              <h2 className="font-bold text-4xl md:text-5xl font-medium text-[#1a237e] mb-6">
                Ready to Transform Your Life?
              </h2>
              <p className="text-gray-600 text-lg mb-10 font-light">
                Join <span className="font-bold text-[#1a237e]">1.7 L+ learners</span> who have discovered their true potential with Aspire Institute.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link href="/#courses">
                  <Button className="h-14 px-10 rounded-full bg-[#1a237e] hover:bg-[#10164f] text-white text-base font-medium shadow-lg shadow-[#1a237e]/20 transition-all hover:scale-105">
                    Explore Programs
                  </Button>
                </Link>
                <Link href="/#enquiry">
                  <Button variant="outline" className="h-14 px-10 rounded-full border-2 border-[#1a237e]/10 text-[#1a237e] hover:bg-[#1a237e] hover:text-white text-base font-medium transition-all">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
