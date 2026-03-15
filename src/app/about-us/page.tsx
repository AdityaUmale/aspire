'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Microscope,
  CheckCircle,
  ArrowUpRight,
  Milestone
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className={`flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e] selection:text-white`}>

      {/* ────────────────────────────────────────────────
        GLOBAL GRADIENT BACKGROUND — fixed, spans entire page
       ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[20%] right-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] rounded-full bg-gradient-to-br from-[#7c4dff]/20 md:from-[#7c4dff]/25 via-[#536dfe]/15 md:via-[#536dfe]/20 to-transparent blur-[60px] md:blur-[120px]"></div>
        <div className="absolute top-[55%] left-[-8%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-tr from-[#448aff]/15 md:from-[#448aff]/20 via-[#7c4dff]/10 md:via-[#7c4dff]/15 to-transparent blur-[50px] md:blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-gradient-to-tl from-[#e040fb]/10 md:from-[#e040fb]/15 via-[#7c4dff]/10 md:via-[#7c4dff]/10 to-transparent blur-[40px] md:blur-[100px]"></div>
      </div>

      <Navbar />

      {/* ════════════════════════════════════════════════
          HERO SECTION — Clean, editorial
         ════════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-20 lg:pt-52 lg:pb-28 z-10 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="h-px w-12 bg-[#1a237e]/30"></span>
              <span className="text-sm font-bold tracking-[0.2em] text-[#1a237e] uppercase">Since 2009</span>
              <span className="h-px w-12 bg-[#1a237e]/30"></span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.1] mb-8">
              Unlocking Potential, <br />
              <span className="text-[#3949ab]">Shaping Futures.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light max-w-3xl mx-auto mb-16">
              We are India&apos;s premier institute for personal and professional development, dedicated to the belief that every individual holds the power to transform.
            </p>

            {/* Unique Architectural Stats Grid */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-16 text-center md:text-left">
                {[
                  { label: "Active Learners", value: "150K+", sub: "Across India" },
                  { label: "Global Reach", value: "3M+", sub: "Digital Footprint" },
                  { label: "Years Legacy", value: "15+", sub: "Since 2009" },
                  { label: "Programs", value: "5000+", sub: "Success Stories" },
                ].map((stat, index) => (
                  <div key={index} className="group relative pt-10">
                    {/* Minimalist Top Accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-[80%] md:w-full h-[1px] bg-gray-100 group-hover:bg-[#1a237e]/20 transition-colors duration-500">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-[2px] bg-[#1a237e] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center md:origin-left"></div>
                    </div>

                    <div className="space-y-1 text-center md:text-left">
                      <h3 className="font-black text-4xl md:text-5xl text-[#1a237e] tracking-tighter group-hover:-translate-y-1 transition-transform duration-500">
                        {stat.value}
                      </h3>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f1337] mb-1">
                          {stat.label}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 italic">
                          {stat.sub}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          NARRATIVE — Editorial Manifesto Layout
         ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">

          {/* Intro */}
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f1337] leading-tight tracking-tight mb-8">
              More than just an institute, we are a <span className="text-[#1a237e]">movement.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              Aspire offers a vibrant curriculum tailored for both young minds and seasoned professionals. We operate on a fundamental truth:
              <strong className="text-[#1a237e] font-medium"> everyone has the potential to become an incredible version of themselves.</strong>
            </p>
          </div>

          {/* Mission */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start pb-16 md:pb-20 border-b border-gray-100">
            <div className="lg:col-span-4">
              <span className="font-black text-7xl md:text-8xl text-[#1a237e]/10 leading-none select-none block mb-4">01</span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f1337] tracking-tight">Our Mission</h3>
            </div>
            <div className="lg:col-span-8 lg:pt-6">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                Our mission is to provide an extensive variety of life-transforming programs to create effective <strong className="text-[#0f1337] font-semibold">Communicators</strong>, <strong className="text-[#0f1337] font-semibold">Self-believers</strong>, <strong className="text-[#0f1337] font-semibold">Engaging leaders</strong>, <strong className="text-[#0f1337] font-semibold">Aspiring professionals</strong> and <strong className="text-[#0f1337] font-semibold">Visionary entrepreneurs</strong>.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start pt-16 md:pt-20">
            <div className="lg:col-span-4">
              <span className="font-black text-7xl md:text-8xl text-[#1a237e]/10 leading-none select-none block mb-4">02</span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f1337] tracking-tight">Our Vision</h3>
            </div>
            <div className="lg:col-span-8 lg:pt-6">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                Aspire envisions a world where people <strong className="text-[#0f1337] font-semibold">believe in themselves</strong> and live their true potential to make this world a <strong className="text-[#0f1337] font-semibold">better place to live</strong>.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          OFFERINGS — Light Glassmorphic Layout (matches Careers Core Values)
         ════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* Left — Sticky Heading */}
            <div className="lg:sticky lg:top-40">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-[#1a237e]/20"></span>
                <span className="text-[#1a237e] font-bold tracking-[0.2em] text-xs uppercase">What We Do</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-[#0f1337] leading-tight mb-6">
                Comprehensive Growth Ecosystem
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md mb-8">
                From public speaking to leadership development, our R&D-backed modules cover every aspect of human development.
              </p>

              {/* R&D Badge */}
              <div className="flex items-center gap-4 bg-[#f8f9fc] px-6 py-5 rounded-[2rem] border border-gray-100 shrink-0">
                <div className="p-3 bg-[#f5f6fa] rounded-full text-[#1a237e]">
                  <Microscope className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-[#0f1337] text-base tracking-tight">Research Backed R&D</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Methodology updated quarterly</p>
                </div>
              </div>
            </div>

            {/* Right — Stacked glassmorphism cards */}
            <div className="space-y-5 relative">
              {/* Colorful blobs behind the cards */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7c4dff] to-[#e040fb] rounded-full blur-[80px] opacity-30 -z-10 mix-blend-multiply"></div>
              <div className="absolute bottom-10 left-0 w-48 h-48 bg-gradient-to-tr from-[#448aff] to-[#536dfe] rounded-full blur-[60px] opacity-30 -z-10 mix-blend-multiply"></div>

              {[
                { title: "Training Programs", items: ["Leadership Development", "Entrepreneurship Development", "Personality Development", "Public Speaking", "Teachers Training", "Interview Skills & Techniques"] },
                { title: "Event Formats", items: ["Seminars & Keynotes", "Interactive Webinars", "Global Conferences", "Symposiums", "Residential Camps", "Hands-on Workshops"] },
                { title: "Delivery Modes", items: ["Live Online Training", "In-Person Classroom", "Group Discussions", "Practical Assignments", "Lifetime Access"] },
              ].map((category, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2rem] p-6 md:p-8 hover:bg-white/20 hover:border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-[0_20px_48px_0_rgba(26,35,126,0.1)] transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Glass sheen */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 pointer-events-none"></div>
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#1a237e]/5 rounded-full blur-2xl group-hover:bg-[#1a237e]/10 transition-colors duration-500 pointer-events-none"></div>

                  <h3 className="relative z-10 font-bold text-xl text-gray-900 mb-6 pb-4 border-b border-gray-100 group-hover:text-[#1a237e] transition-colors duration-300">
                    {category.title}
                  </h3>

                  <ul className="relative z-10 space-y-4">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex items-center justify-center h-5 w-5 rounded-full border border-[#1a237e]/20 text-[#3949ab] shrink-0 group-hover:bg-[#1a237e] group-hover:border-[#1a237e] group-hover:text-white transition-all duration-300">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HALL OF RECOGNITION — Preserved as-is
         ════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6 tracking-tight">Hall of Recognition</h2>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Our commitment to excellence has been recognized on national and international platforms by esteemed dignitaries.
            </p>
          </div>

          {/* Timeline Structure */}
          <div className="max-w-5xl mx-auto relative">
            {/* Center Line (Hidden on mobile, visible on md) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#1a237e]/0 via-[#1a237e]/20 to-[#1a237e]/0 -translate-x-1/2" />

            <div className="space-y-12 md:space-y-0 relative">
              {[
                { title: "Best Institute for Creating Leaders", year: "2019", org: "World Education Summit", guests: ["Hon'ble Sayed Shahnawaz Hussain", "Hon'ble Tarun Chugh", "Hon'ble Navin Sinha", "Hon'ble Mugdha Godse"], image: "/Excellent institute of creating leaders & discovering the potential in student in india.jpg" },
                { title: "Most Innovative Institute", year: "2019", org: "Human Development Awards", guests: ["Hon'ble Murli Manohar Joshi", "Hon'ble Adarsh Shastri", "Padma Shri Bajrang Punia", "Hon'ble Alok Mittal", "Hon'ble Gulshan Grover"], image: "/the most innovative istitute of human development training in india.jpg" },
                { title: "Social Impact Award", year: "2018", org: "Pratigya Foundation", guests: ["Hon'ble Kiran Kher", "Hon'ble Shyam Jaju", "Hon'ble Laxmi Agarwal", "Hon'ble Namrata Goyal", "Hon'ble Poonam Dhillon", "Hon'ble Manoj Tiwari"], image: "/SOCIAL IMPACT AWARD 2018-19 FOR EMPOWERING SOCIETY THROUGH HUMAN DEVELOPMENT TRAINING PROGRAM.jpg" },
                { title: "Best Institute in Maharashtra", year: "2018", org: "Education Excellence", guests: ["Padma Shri Sharmila Tagore", "Hon'ble Parshottam Rupala", "Hon'ble Dr. C. P. Thakur", "Hon'ble Anka Verma"], image: "/best institute of human development training in india.jpg" },
                { title: "National Achievers Award", year: "2018", org: "Education Excellence", guests: ["Hon'ble Ram Niwas Goel", "Hon'ble Kanhaiya Lal Ganju", "Hon'ble Atishi Marlena"], image: "/NATIONAL ACHIEVERS AWARD FOR EDUCATION EXCELLENCE.jpg" }
              ].map((award, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}>

                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center z-10 group-hover:border-[#1a237e] transition-colors shadow-sm">
                    <Milestone className="h-4 w-4 text-[#3949ab]" />
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-[48%]" />

                  {/* Card Content — Compact Horizontal */}
                  <div className="w-full md:w-[48%] bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(26,35,126,0.12)] hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row group/card">

                    {/* Award Image — Left Side, Square */}
                    <div className="relative h-44 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-auto sm:w-32 md:w-36">
                      <Image
                        src={award.image}
                        alt={award.title}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Year badge bottom of image */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a237e]/80 to-transparent px-3 py-3">
                        <span className="font-black text-xs text-white tracking-wider">{award.year}</span>
                      </div>
                    </div>

                    {/* Text Content — Right Side */}
                      <div className="p-5 md:p-6 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#3949ab] mb-2">{award.org}</p>
                        <h3 className="font-bold text-base text-gray-900 leading-snug group-hover/card:text-[#1a237e] transition-colors duration-300">
                          {award.title}
                        </h3>
                      </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Honoured By</p>
                          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                            {award.guests.map((guest, i) => (
                              <span key={i} className="min-w-0 text-[10px] leading-tight font-semibold text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-2xl border border-gray-100 whitespace-normal break-words">
                                {guest}
                              </span>
                            ))}
                          </div>
                        </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          WHY CHOOSE ASPIRE — Clean editorial CTA
         ════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-16 items-start">

              {/* Left — Heading */}
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                  Why Choose <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a237e] to-[#3949ab]">Aspire?</span>
                </h2>
                <p className="text-gray-500 text-lg font-light leading-relaxed">
                  Our institute carries 17+ years of meaningful work in education, built on consistency, trust and credibility. We do not simply conduct courses; we help individuals unlock their potential.
                </p>
              </div>

              {/* Right — List */}
              <div className="lg:col-span-7">
                <div className="space-y-4">
                  {[
                    "Largest personal & professional development institute in India",
                    "Meticulously designed courses by skilled R&D Department",
                    "Abundant success stories of our learners",
                    "Vibrant curriculum for young and professional learners",
                    "Unique methodology with a pragmatic approach",
                    "Flexible Online & In-Person training models"
                  ].map((item, i) => (
                    <div key={i} className="group relative flex items-start gap-6 p-6 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:border-[#1a237e]/15 hover:shadow-[0_8px_30px_rgb(26,35,126,0.06)] transition-all duration-500 overflow-hidden">
                      {/* Hover accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a237e] to-[#3949ab] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl"></div>

                      <div className="mt-0.5 h-8 w-8 rounded-full border border-[#1a237e]/20 flex items-center justify-center text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                      <span className="text-gray-600 text-lg group-hover:text-[#1a237e] transition-colors duration-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
