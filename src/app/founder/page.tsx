'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { ArrowLeft, Award, Quote, Globe, Users, Mic, Star } from 'lucide-react';

// Initialize fonts (If you are not using next/font, you can remove this and use standard fonts, but this is key for the aesthetic)
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });

export default function FounderPage() {
  const achievements = [
    { icon: Users, value: "3M+", label: "Lives Impacted" },
    { icon: Globe, value: "15+", label: "Countries" },
    { icon: Mic, value: "20+", label: "Years Experience" },
    { icon: Star, value: "5k+", label: "Workshops" },
  ];

  const countries = [
    "Singapore", "Thailand", "Malaysia", "Dubai", "Vietnam", "Qatar", "Egypt", "India"
  ];

  const awards = [
    "Outstanding Young Person of India (OYP) by JCI in 2014",
    "Social Impact Award for Empowering Society",
    "Most Innovative Institute for Human Development Training",
    "Excellent Institute for Creating Leaders",
    "IDOL OF MAHARASHTRA by Sakal Media Group",
    "National Achievers Award for Education Excellence",
  ];

  return (
    <div className={`flex flex-col min-h-screen bg-[#FAFAFA] text-[#1a237e] ${playfair.variable} ${jakarta.variable} font-sans selection:bg-[#1a237e] selection:text-white`}>
      <Navbar />

      {/* GLOBAL BACKGROUND GRAIN TEXTURE */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* HERO SECTION - Editorial Style */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Abstract shapes for depth */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#1a237e]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-[#3949ab]/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

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

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-[#1a237e] leading-[0.9] mb-8 tracking-tight animate-in slide-in-from-bottom-6 duration-700 delay-100 fade-in">
                Hon&apos;ble <br/> 
                <span className="italic opacity-80">Mr. Sachin</span> <br/>
                Burghate
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mb-10 font-light border-l-2 border-[#1a237e]/20 pl-6 animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in">
                An internationally acclaimed speaker with over two decades of excellence. His philosophy is grounded in a singular, powerful truth: <strong className="text-[#1a237e] font-medium">every learner holds the capacity to lead with purpose.</strong>
              </p>

              <div className="flex flex-wrap gap-3 animate-in slide-in-from-bottom-10 duration-700 delay-300 fade-in">
                {countries.slice(0, 4).map((country, i) => (
                  <span key={i} className="px-4 py-2 bg-white border border-[#1a237e]/10 shadow-sm rounded-full text-sm text-[#1a237e] font-medium hover:scale-105 transition-transform cursor-default">
                    {country}
                  </span>
                ))}
                <span className="px-4 py-2 bg-[#1a237e] text-white rounded-full text-sm font-medium shadow-lg shadow-[#1a237e]/20">
                  +{countries.length - 4} Global Locations
                </span>
              </div>
            </div>

            {/* Image Composition */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 animate-in zoom-in-95 duration-1000 delay-200 fade-in">
              <div className="relative">
                {/* Decorative Frame */}
                <div className="absolute inset-0 border border-[#1a237e] translate-x-4 translate-y-4 rounded-tr-[4rem] rounded-bl-[4rem]" />
                
                {/* Main Image Container */}
                <div className="relative bg-gray-200 rounded-tr-[4rem] rounded-bl-[4rem] overflow-hidden shadow-2xl aspect-[4/5]">
                  <Image
                    src="/founder3.jpg"
                    alt="Sachin Burghate"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
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
                          <p className="font-serif text-lg">OYP India Award</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP - Floating Glass */}
      <section className="container mx-auto px-4 relative z-20 -mt-10 lg:-mt-20 mb-20">
        <div className="bg-[#1a237e] rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(26,35,126,0.3)] text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 divide-x divide-white/10">
            {achievements.map((stat, index) => (
              <div key={index} className="text-center group px-4">
                <stat.icon className="h-6 w-6 mx-auto mb-4 text-[#7986cb] group-hover:text-white transition-colors duration-300" />
                <h3 className="font-serif text-3xl md:text-4xl font-medium mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">{stat.value}</h3>
                <p className="text-xs uppercase tracking-widest text-white/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MESSAGE SECTION - The Manuscript Look */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
              
              {/* Left Column: Context */}
              <div className="md:w-1/3 space-y-8 sticky top-24 h-fit">
                <div>
                  <h2 className="font-serif text-4xl text-[#1a237e] mb-4">A Letter from <br/>the Founder</h2>
                  <div className="h-1 w-20 bg-[#3949ab]"></div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Reflecting on a journey of 20 years, transforming education from a mere academic pursuit into a holistic journey of self-discovery.
                </p>
                <div className="hidden md:block">
                  <Quote className="h-24 w-24 text-[#e8eaf6]" />
                </div>
              </div>

              {/* Right Column: The Content */}
              <div className="md:w-2/3">
                <div className="relative">
                  {/* Decorative quote mark */}
                  <span className="absolute -top-6 -left-4 text-8xl font-serif text-[#1a237e]/5 leading-none">&ldquo;</span>
                  
                  <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-light">
                    <p className="font-serif text-2xl text-[#1a237e] leading-snug">
                      Welcome to Aspire. We are not just an institute; we are a catalyst for the human spirit.
                    </p>
                    
                    <p>
                      It&apos;s an honour to welcome you to our institution. Since 2009, we have operated on a simple belief: studying isn&apos;t just about academics; true development involves honing all areas of personal and professional life.
                    </p>

                    <p>
                      At <span className="font-medium text-[#1a237e]">ASPIRE</span>, our philosophy recognizes that learning opportunities are everywhere. As founder, I strive for everyone&apos;s overall success. Our unique curriculum provides you with an opportunity to cultivate yourself into a better person—one who is capable of tackling any challenge while overcoming adversity.
                    </p>

                    <p>
                      I am proud of this revolution taking place here and invite you all to join us. We want each person who passes through our doors to leave with not only new knowledge but also newfound confidence.
                    </p>

                    <div className="py-6 my-6 border-y border-gray-100 flex items-center gap-6">
                      <div className="h-20 w-20 rounded-full overflow-hidden border border-gray-200 shadow-inner shrink-0">
                         <Image
                            src="/founder3.jpg"
                            alt="Signature"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover grayscale opacity-80"
                          />
                      </div>
                      <div>
                        <p className="font-serif text-xl text-[#1a237e] italic">&quot;A bright and wonderful learning experience!&quot;</p>
                        <div className="mt-2 text-sm">
                           <span className="font-bold text-[#1a237e] tracking-wider uppercase block">Sachin Burghate</span>
                           <span className="text-gray-400">Founder, Aspire Institute</span>
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

      {/* AWARDS SECTION - Bento Grid Style */}
      <section className="py-24 bg-[#f4f5f7]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
               <span className="text-[#3949ab] font-bold tracking-widest text-xs uppercase mb-2 block">Excellence Recognized</span>
               <h2 className="font-serif text-4xl md:text-5xl text-[#1a237e]">Honours & Accolades</h2>
            </div>
            <div className="hidden md:block w-1/3 h-px bg-[#1a237e]/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#1a237e]/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-0 bg-[#1a237e] group-hover:h-full transition-all duration-500 ease-out"></div>
                <div className="mb-6 inline-flex p-3 rounded-xl bg-[#e8eaf6] text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-gray-800 font-medium text-lg leading-snug group-hover:text-[#1a237e] transition-colors">{award}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL PRESENCE - Dark Modern Map Vibe */}
      <section className="py-24 bg-[#0d1642] text-white relative overflow-hidden">
        {/* Radial Gradients pretending to be map lights */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#3949ab] rounded-full blur-[128px] opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#1a237e] rounded-full blur-[128px] opacity-60"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <Globe className="h-4 w-4 text-[#9fa8da]" />
            <span className="text-xs font-medium tracking-wider text-[#9fa8da] uppercase">World Wide Impact</span>
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Borders are not Barriers.</h2>
          <p className="text-[#c5cae9] max-w-2xl mx-auto text-lg font-light mb-12">
            Delivering transformative wisdom across continents. From Singapore to Dubai, the message of empowerment resonates globally.
          </p>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {countries.map((country, index) => (
              <div key={index} className="group cursor-default flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full transition-all duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3949ab] group-hover:bg-[#4ade80] transition-colors"></div>
                <span className="text-sm font-medium tracking-wide">{country}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Clean Minimalist */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-[#f8f9fa] rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute -top-24 -left-24 w-64 h-64 border-[40px] border-[#e8eaf6] rounded-full opacity-50"></div>
             <div className="absolute -bottom-24 -right-24 w-64 h-64 border-[40px] border-[#e8eaf6] rounded-full opacity-50"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1a237e] mb-6">
                Ready to Transform Your Life?
              </h2>
              <p className="text-gray-600 text-lg mb-10 font-light">
                Join over <span className="font-bold text-[#1a237e]">150,000+ learners</span> who have discovered their true potential with Aspire Institute.
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
    </div>
  );
}