'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, Quote, Globe, Users, Mic, Star } from 'lucide-react';

export default function FounderPage() {
  const achievements = [
    { icon: Users, value: "3M+", label: "Lives Impacted" },
    { icon: Globe, value: "15+", label: "Countries" },
    { icon: Mic, value: "20+", label: "Years of Experience" },
    { icon: Star, value: "5,000+", label: "Workshops Conducted" },
  ];

  const countries = [
    "Singapore", "Thailand", "Malaysia", "Dubai", "Vietnam", "Qatar", "Egypt", "India"
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
                An internationally acclaimed speaker with over two decades of leadership in education and human development. His philosophy is grounded in a singular, powerful truth: <strong className="text-[#1a237e] font-medium">every learner holds the capacity to lead with purpose.</strong>
              </p>

              <div className="flex flex-wrap gap-3 animate-in slide-in-from-bottom-10 duration-700 delay-300 fade-in">
                {countries.map((country, i) => (
                  <span key={i} className="px-4 py-2 bg-white border border-[#1a237e]/10 shadow-sm rounded-full text-sm text-[#1a237e] font-medium hover:scale-105 transition-transform cursor-default">
                    {country}
                  </span>
                ))}
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
                    src="/founder1.jpg"
                    alt="Hon&apos;ble Mr. Sachin Burghate, Founder of Aspire Institute, speaking at an international conference"
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

      {/* STATS STRIP - Floating Glass */}
      <section className="container mx-auto px-4 relative z-20 -mt-10 lg:-mt-20 mb-20">
        <div className="bg-[#1a237e] rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(26,35,126,0.3)] text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 divide-x divide-white/10">
            {achievements.map((stat, index) => (
              <div key={index} className="text-center group px-4">
                <stat.icon className="h-6 w-6 mx-auto mb-4 text-[#7986cb] group-hover:text-white transition-colors duration-300" />
                <h3 className="font-bold text-3xl md:text-4xl font-medium mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">{stat.value}</h3>
                <p className="text-xs uppercase tracking-widest text-white/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MESSAGE SECTION - The Manuscript Look */}
      <section className="py-20 relative z-10">
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
                          src="/founder3.jpg"
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


      {/* GLOBAL PRESENCE - Light Professional Vibe */}
      <section className="py-24 relative overflow-hidden border-t border-gray-100 z-10">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1a237e]/10 bg-[#f8f9fa] shadow-sm mb-6">
            <Globe className="h-4 w-4 text-[#1a237e]" />
            <span className="text-xs font-bold tracking-[0.15em] text-[#1a237e] uppercase">Worldwide Impact</span>
          </div>

          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-[#1a237e] mb-6 tracking-tight">Borders Are Not Barriers.</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl font-light mb-12 leading-relaxed">
            Delivering transformative wisdom across continents. From Singapore to Dubai, the message of empowerment resonates globally.
          </p>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {countries.map((country, index) => (
              <div key={index} className="group cursor-default flex items-center gap-3 px-6 py-3 bg-white hover:bg-[#f8f9fa] border border-gray-200 shadow-sm hover:shadow-md rounded-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-2 h-2 rounded-full bg-[#1a237e]/20 group-hover:bg-[#3949ab] transition-colors duration-300"></div>
                <span className="text-sm md:text-base font-semibold text-gray-700 group-hover:text-[#1a237e] transition-colors">{country}</span>
              </div>
            ))}
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
                Join <span className="font-bold text-[#1a237e]">150,000+ learners</span> who have discovered their true potential with Aspire Institute.
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
