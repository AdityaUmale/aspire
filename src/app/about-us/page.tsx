'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import {
  Award,
  Users,
  BookOpen,
  Target,
  Globe,
  Zap,
  Microscope,
  Heart,
  CheckCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className={`flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#1a237e] selection:text-white`}>
      <Navbar />

      {/* Global Grain Texture */}
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#3949ab]/5 to-transparent blur-3xl opacity-60"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
              <span className="h-px w-12 bg-[#1a237e]/30"></span>
              <span className="text-sm font-bold tracking-[0.2em] text-[#1a237e] uppercase">Since 2009</span>
              <span className="h-px w-12 bg-[#1a237e]/30"></span>
            </div>

            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl font-medium text-[#1a237e] mb-8 tracking-tight leading-[1.1] animate-in slide-in-from-bottom-6 duration-700 delay-100 fade-in">
              Unlocking Potential, <br />
              <span className="text-[#3949ab]">Shaping Futures.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in">
              We are India&apos;s premier institute for personal and professional development, dedicated to the belief that every individual holds the power to transform.
            </p>
          </div>

          {/* Hero Stats - Floating Bar Style */}
          <div className="mt-20 max-w-6xl mx-auto animate-in slide-in-from-bottom-10 duration-700 delay-300 fade-in">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
                {[
                  { label: "Active Learners", value: "150K+", icon: Users },
                  { label: "Global Reach", value: "3M+", icon: Globe },
                  { label: "Years Legacy", value: "15+", icon: Award },
                  { label: "Programs Delivered", value: "5000+", icon: BookOpen },
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-[#f5f6fa] rounded-full text-[#1a237e] group-hover:scale-110 group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300">
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className="font-bold text-3xl md:text-4xl font-medium text-[#1a237e] mb-1">{stat.value}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-[#f8f9fa] relative border-y border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* Text Column */}
            <div className="lg:col-span-5 space-y-8 relative md:sticky md:top-24">
              <h2 className="font-bold text-4xl md:text-5xl text-[#1a237e] leading-tight">
                More than just an institute, we are a <span>movement.</span>
              </h2>
              <div className="prose prose-lg text-gray-600 leading-relaxed font-light">
                <p>
                  Aspire - The Institute Of Human Development offers a vibrant curriculum tailored for both young minds and seasoned professionals. We operate on a fundamental truth:
                  <strong className="text-[#1a237e] font-medium"> everyone has the potential to become an incredible version of themselves.</strong>
                </p>
                <p>
                  Through our meticulously crafted programs, we provide the tools, knowledge, and environment needed to unlock that potential. We don&apos;t just teach; we transform. We cultivate a positive shift that empowers learners to live confidently and successfully.
                </p>
              </div>
            </div>

            {/* Cards Column */}
            <div className="lg:col-span-7 grid gap-6">
              {[
                { title: "Our Mission", content: "Our mission is to provide an extensive variety of life-transforming programs to create effective Communicators, Self-believers, Engaging leaders, Aspiring professionals and Visionary entrepreneurs.", icon: Target, color: "bg-blue-50" },
                { title: "Our Vision", content: "Aspire The Institute Of Human Development envisions the world where people believe in themselves & live their true potential to make this world a better place to live.", icon: Zap, color: "bg-indigo-50" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">

                  <h3 className="font-bold text-2xl font-medium text-[#1a237e] mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{item.content}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Offerings - The "Dark Mode" Section */}
      <section className="py-24 bg-[#0F1229] text-white relative overflow-hidden">
        {/* Abstract Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#1a237e] rounded-full blur-[120px] opacity-20"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[#9fa8da] font-bold tracking-widest text-xs uppercase mb-3 block">What We Do</span>
              <h2 className="font-bold text-4xl md:text-5xl font-medium mb-6">Comprehensive Growth Ecosystem</h2>
              <p className="text-[#c5cae9] text-lg font-light leading-relaxed">
                From public speaking to corporate leadership, our R&D-backed modules cover every aspect of human development.
              </p>
            </div>

            {/* R&D Badge */}
            <div className="hidden md:flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
              <div className="bg-[#3949ab] p-3 rounded-full animate-pulse">
                <Microscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Research Backed R&D</p>
                <p className="text-xs text-gray-400">Methodology updated quarterly</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Training Programs", items: ["Leadership Development", "Entrepreneurship", "Personality Development", "Public Speaking", "Teachers Training", "Corporate Training"] },
              { title: "Event Formats", items: ["Seminars & Keynotes", "Interactive Webinars", "Global Conferences", "Symposiums", "Residential Camps", "Hands-on Workshops"] },
              { title: "Delivery Modes", items: ["Live Online Training", "In-Person Classroom", "Hybrid Learning Models", "Group Discussions", "Practical Assignments", "Lifetime Access"] },
            ].map((category, idx) => (
              <div key={idx} className="group bg-gradient-to-b from-white/10 to-transparent p-[1px] rounded-3xl">
                <div className="bg-[#131733] h-full rounded-[23px] p-8 hover:bg-[#181d3d] transition-colors duration-300">
                  <h3 className="font-bold text-2xl mb-6 text-white group-hover:text-[#9fa8da] transition-colors">{category.title}</h3>
                  <ul className="space-y-4">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#c5cae9] group-hover:text-white transition-colors">
                        <CheckCircle className="h-5 w-5 text-[#3949ab] shrink-0 mt-[2px]" />
                        <span className="font-light tracking-wide">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honours & Awards - Gallery Style */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="font-bold text-4xl md:text-5xl text-[#1a237e] mb-4">Hall of Recognition</h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              Our commitment to excellence has been recognized on national and international platforms by esteemed dignitaries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Best Institute for Creating Leaders",
                year: "2019",
                org: "World Education Summit",
                guests: ["Hon'ble Sayed Shahnawaz Hussain", "Hon'ble Tarun Chugh"]
              },
              {
                title: "Most Innovative Institute",
                year: "2019",
                org: "Human Development Awards",
                guests: ["Hon'ble Murli Manoharji Joshi", "Padmashree Bajrangji Punia"]
              },
              {
                title: "Social Impact Award",
                year: "2018",
                org: "Pratigya Foundation",
                guests: ["Hon'ble Kiran Kher", "Hon'ble Laxmi Agarwal"]
              },
              {
                title: "Best Institute in Maharashtra",
                year: "2018",
                org: "Education Excellence",
                guests: ["Padmshri Sharmila Tagore", "Hon'ble Parshottam Rupala"]
              },
              {
                title: "National Achievers Award",
                year: "2018",
                org: "Education Excellence",
                guests: ["Hon'ble Ram Niwas Goel", "Hon'ble Atishi Marlena"]
              }
            ].map((award, index) => (
              <div key={index} className="flex flex-col bg-white p-8 rounded-xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(26,35,126,0.15)] transition-all duration-300 group hover:-translate-y-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-[#e8eaf6] rounded-full text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-4xl text-gray-100 group-hover:text-[#e8eaf6] transition-colors duration-300">
                    {award.year}
                  </span>
                </div>

                <h3 className="font-bold text-xl font-medium text-[#1a237e] mb-2 leading-tight">
                  {award.title}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">{award.org}</p>

                <div className="mt-auto pt-6 border-t border-dashed border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Honoured By</p>
                  <div className="flex flex-wrap gap-2">
                    {award.guests.map((guest, i) => (
                      <span key={i} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Aspire - Final Call */}
      <section className="py-24 bg-[#F5F7FA]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 md:p-20 bg-[#1a237e] text-white flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 mb-6">
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <span className="text-xs font-bold tracking-wider uppercase">The Aspire Advantage</span>
                  </div>
                  <h2 className="font-bold text-4xl md:text-5xl font-medium mb-6">Why Choose Aspire?</h2>
                  <p className="text-[#c5cae9] text-lg font-light leading-relaxed mb-12">
                    Our brand has a rich history of over 17 years in the industry, establishing a strong presence and credibility. We don&apos;t just teach courses; we build careers and character.
                  </p>

                  <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="h-12 w-12 bg-white text-[#1a237e] rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Trusted by Millions</p>
                      <p className="text-white/60 text-sm">Consistent positive impact across the globe</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 md:p-20 flex flex-col justify-center">
                <ul className="space-y-6">
                  {[
                    "Largest personal & professional development institute in India",
                    "Meticulously designed courses by skilled R&D Department",
                    "Abundant success stories of our learners",
                    "Vibrant curriculum for young and professional learners",
                    "Unique methodology with a pragmatic approach",
                    "Flexible Online & In-Person training models"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 h-6 w-6 rounded-full border border-[#1a237e]/20 flex items-center justify-center text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors duration-300">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-gray-700 text-lg group-hover:text-[#1a237e] transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}