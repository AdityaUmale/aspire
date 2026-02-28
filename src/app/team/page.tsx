'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Users,
  Target,
  Award,
  Lightbulb,
  Heart,
  Microscope,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── 3D Glass Value Card ─── */
function ValueCard({ value }: { value: { icon: LucideIcon; title: string; description: string; colSpan: string; rowSpan: string; accent: string; delay: string } }) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const multiplier = 20;
    setRotation({
      x: -(y / rect.height) * multiplier,
      y: (x / rect.width) * multiplier
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className={`relative h-full ${value.colSpan} ${value.rowSpan}`}
      style={{ perspective: '1000px' }}
    >
      {/* Background blurred blob for extra pop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${value.accent} blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-3xl -z-10`}
      ></div>

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full w-full rounded-[2rem] bg-white/[0.03] backdrop-blur-3xl border border-white/20 p-6 md:p-8 overflow-hidden transition-all duration-300 ease-out shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex flex-col justify-between"
        style={{
          transform: isHovered
            ? `translateZ(20px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            : 'translateZ(0) rotateX(0deg) rotateY(0deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glass sheen reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        {/* Top border highlight */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Icon Container with internal volumetric glow */}
        <div
          className="relative w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 md:mb-10 transition-transform duration-500 group-hover:scale-110 shadow-inner overflow-hidden"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${value.accent} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
          <value.icon className="h-6 w-6 text-gray-800 relative z-10" />
        </div>

        {/* Text content lifted off the card */}
        <div style={{ transform: 'translateZ(20px)' }}>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
            {value.title}
          </h3>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">
            {value.description}
          </p>
        </div>

        {/* Decorative corner accent */}
        <div
          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 text-gray-400"
          style={{ transform: 'translateZ(10px)' }}
        >
          <ArrowRight className="h-5 w-5 -rotate-45" />
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const coreValues = [
    {
      icon: Heart,
      title: "Trust & Respect",
      description: "Fostering mutual trust in every interaction.",
      colSpan: "sm:col-span-1 lg:col-span-1",
      rowSpan: "row-span-1",
      accent: "from-indigo-400 to-blue-500",
      delay: "0s"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Striving for the highest teaching standards.",
      colSpan: "sm:col-span-1 lg:col-span-1",
      rowSpan: "row-span-1",
      accent: "from-indigo-400 to-blue-500",
      delay: "0.1s"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Improving methods through continuous creativity.",
      colSpan: "sm:col-span-1 lg:col-span-1",
      rowSpan: "row-span-1",
      accent: "from-indigo-400 to-blue-500",
      delay: "0.2s"
    },
    {
      icon: Users,
      title: "Inclusivity",
      description: "Creating a welcoming environment for all.",
      colSpan: "sm:col-span-1 lg:col-span-1",
      rowSpan: "row-span-1",
      accent: "from-indigo-400 to-blue-500",
      delay: "0.3s"
    },
  ];

  const rdFocusAreas = [
    {
      icon: Microscope,
      title: "Research-Driven",
      description: "Exploring innovative teaching techniques."
    },
    {
      icon: Target,
      title: "Barrier Identification",
      description: "Strategies to overcome growth obstacles."
    },
    {
      icon: Award,
      title: "Customised Programs",
      description: "Tailoring content to unique learner needs."
    },
    {
      icon: Lightbulb,
      title: "Future-Ready Skills",
      description: "Preparing learners for tomorrow's challenges."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e] selection:text-white">
      {/* ────────────────────────────────────────────────
         GLOBAL GRADIENT BACKGROUND — fixed, spans entire page
        ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* Large primary blob — right side, drifts slowly */}
        <div className="absolute top-[20%] right-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] rounded-full bg-gradient-to-br from-[#7c4dff]/20 md:from-[#7c4dff]/25 via-[#536dfe]/15 md:via-[#536dfe]/20 to-transparent blur-[60px] md:blur-[120px]"></div>
        {/* Secondary blob — left side */}
        <div className="absolute top-[55%] left-[-8%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-tr from-[#448aff]/15 md:from-[#448aff]/20 via-[#7c4dff]/10 md:via-[#7c4dff]/15 to-transparent blur-[50px] md:blur-[100px]"></div>
        {/* Accent blob — bottom right */}
        <div className="absolute bottom-[10%] right-[5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-gradient-to-tl from-[#e040fb]/10 md:from-[#e040fb]/15 via-[#7c4dff]/10 md:via-[#7c4dff]/10 to-transparent blur-[40px] md:blur-[100px]"></div>
      </div>
      <Navbar />

      {/* 
        HERO SECTION
        Massive brand typography
      */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-28 relative z-10">

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a237e]/5 border border-[#1a237e]/10 text-[#1a237e] font-semibold text-xs tracking-[0.15em] uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a237e]"></span>
              The Collective
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-gray-900 tracking-tight leading-[1.05] mb-8">
              The Architects of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a237e] to-[#3949ab]">Transformation.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light max-w-3xl mx-auto mb-12">
              When your mission is to serve others, you need the best people driving your vision forward. Our team is the secret to our success.
            </p>

            <div className="max-w-3xl mx-auto mt-14 border-l-2 border-[#1a237e]/20 pl-8 md:pl-10">
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed italic">
                &quot;Each of our team members is amazing in their own way, but together they are what make Aspire such a creative and rewarding place to work.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Values - 3D Glass Bento Grid Approach
      */}
      <section className="py-20 md:py-32 relative z-10 w-full overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Content */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 lg:pt-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-[1.1]">
                United by a common goal.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed font-light mb-8 max-w-md">
                Our team has a shared vision of delivering the best possible results for our learners. By fostering an atmosphere of trust, respect, and efficiency, we excel together.
              </p>

              <div className="border-l-2 border-[#1a237e]/20 pl-6 mb-10">
                <p className="text-[#1a237e] font-semibold text-lg leading-snug">
                  United by a singular focus: <br className="hidden sm:block" />
                  <span className="font-extrabold">the success of our learners.</span>
                </p>
              </div>

              {/* Reputation Bar — clean light style */}
              <div className="pt-8 border-t border-gray-100">
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] block mb-5">
                  Our Reputation
                </span>
                <div className="flex flex-col gap-3">
                  {["Excellent Leadership", "Great Management", "Punctuality"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#1a237e]/40 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Grid (3D Glass Bento Style) */}
            <div className="lg:col-span-7 perspective-1000">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 auto-rows-[minmax(0,1fr)]">
                {coreValues.map((value, idx) => (
                  <ValueCard key={idx} value={value} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        PREMIUM BRAND SECTION: The Educator's Standard
      */}
      <section className="py-20 md:py-32 relative z-10 w-full border-y border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* Left: Sticky Header & Context */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a237e]/5 text-[#1a237e] font-semibold text-[10px] tracking-[0.2em] uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a237e]"></span>
                Expert Educators
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
                The <span className="text-[#1a237e]">Architects</span> <br />
                of Growth.
              </h2>

              <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-light">
                <p>
                  Our trainers have all been chosen for their exceptional classroom management skills and their commitment to helping our learners achieve the best of their abilities.
                </p>
                <p>
                  Each trainer is highly competent, striving to deliver specific requirements while fostering <span className="text-gray-900 font-medium">curiosity, honour, and integrity</span>. All trainers are rigorously trained under our R&D department.
                </p>
              </div>

              {/* Decorative line */}
              <div className="h-px w-24 bg-gradient-to-r from-[#1a237e]/20 to-transparent mt-10"></div>
            </div>

            {/* Right: The Standard List */}
            <div className="lg:col-span-7">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-10 pb-4 border-b border-gray-100">
                The Educator&apos;s Standard
              </h3>

              <div className="flex flex-col gap-2">
                {[
                  "Exceptional classroom management",
                  "Deep commitment to learner success",
                  "Expertise in respective domains",
                  "Trained under R&D department",
                  "Use of effective, varied pedagogies",
                  "Creating comfortable environments"
                ].map((quality, index) => (
                  <div
                    key={index}
                    className="group relative flex items-start gap-6 p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:border-[#1a237e]/15 hover:shadow-[0_8px_30px_rgb(26,35,126,0.06)] transition-all duration-500 overflow-hidden"
                  >
                    {/* Hover reveal accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a237e] to-[#3949ab] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-3xl"></div>

                    {/* Index Number */}
                    <div className="flex-shrink-0 text-3xl md:text-4xl font-black text-gray-100 group-hover:text-[#c5cae9] transition-colors duration-500 select-none">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="pt-2">
                      <p className="text-lg md:text-xl font-medium text-gray-700 group-hover:text-[#1a237e] leading-snug transition-colors duration-300">
                        {quality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        RESEARCH & DEVELOPMENT
      */}
      <section className="py-20 md:py-32 relative z-10 w-full overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-20 pb-10 border-b border-gray-200">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                Research & <br className="hidden sm:block" /> Development
              </h2>
              <p className="text-xl text-[#1a237e] font-semibold leading-relaxed">
                At the forefront of understanding and improving the psychology of learners through data-driven methodology.
              </p>
            </div>
            <div className="max-w-md">
              <p className="text-gray-500 leading-relaxed font-light">
                The R&D Department plays a crucial role in designing courses by exploring innovative teaching techniques and studying barriers to self-growth, developing strategies to overcome them through tailored programs.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {rdFocusAreas.map((area, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Top border that animates on hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-100">
                  <div className="h-full bg-[#1a237e] w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>

                <div className="pt-8 block">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-6 text-white group-hover:-translate-y-1 transition-all duration-500">
                    <area.icon className="h-6 w-6" strokeWidth={2} />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-[#1a237e] transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed font-light">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 
        FINAL CTA 
      */}
      <section className="py-24 relative z-10 w-full border-t border-gray-100 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#1a237e]/5 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">



            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
              Be Part of Something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a237e] to-[#3949ab]">Meaningful.</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light max-w-2xl mx-auto mb-12">
              We&apos;re always looking for passionate individuals who share our vision of transforming lives through education.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Link href="/careers" className="w-full sm:w-auto">
                <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1a237e] text-white font-bold text-lg rounded-2xl hover:bg-[#283593] shadow-[0_8px_30px_rgb(26,35,126,0.2)] hover:shadow-[0_8px_30px_rgb(26,35,126,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[-150%] group-hover:animate-[shimmer_2s_infinite]"></div>
                  <span className="relative z-10">View Open Roles</span>
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/#enquiry" className="w-full sm:w-auto">
                <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-200 text-gray-900 font-bold text-lg rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-300 w-full">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}