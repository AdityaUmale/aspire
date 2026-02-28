'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full py-6 md:py-16 lg:py-24 xl:py-32 overflow-hidden px-4 md:px-6 lg:pl-14 mt-0 md:mt-8">
      {/* Background Video */}
      {/* Creative Right Side Logo Display rather than a video */}
      {/* The absolute positioned 3D card wrapper has been removed as per instructions. */}

      {/* Decorative elements - Keeping the glow effect but ensuring it's behind content */}
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1a237e]/5 blur-3xl -z-10 animate-pulse"></div>


      <div className="container px-4 md:px-6 relative z-10"> {/* Removed pb-12 md:pb-0 from container */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6 pt-2 md:pt-0">
            <div className="flex flex-wrap gap-3 fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
                India&apos;s leading personal and professional development institute since 2009.
              </div>
            </div>
            <div className="space-y-4 fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#1a237e]">
                Unlock Your{" "}
                <span className="relative inline-block">
                  Potential.
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-[#c5cae9]/50 -z-10"></span>
                </span>
                <br />
                <span className="text-[#3949ab] text-3xl sm:text-4xl xl:text-5xl mt-2 block">Lead With Confidence.</span>
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed mt-4">
                Join 150,000+ learners who have discovered confidence, clarity, and success with Aspire, India&apos;s leading personal and professional development institute.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row fade-in w-full sm:w-auto" style={{ animationDelay: '0.3s' }}>
              <Link href="#courses" className="w-full sm:w-auto">
                <Button className="bg-[#1a237e] hover:bg-[#0d1642] shadow-md transition-all duration-300 hover:shadow-lg w-full sm:w-auto">
                  Explore Our Programs
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about-us" className="w-full sm:w-auto">
                <Button variant="outline" className="text-[#1a237e] border-[#1a237e] hover:bg-[#e8eaf6] transition-all duration-300 w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
            <Link
              href="/success-stories"
              className="group hidden sm:inline-flex items-center gap-4 mt-6 fade-in w-fit transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex -space-x-3">
                {[
                  { src: '/sls/tejas.jpg', alt: 'Tejas Kakkad' },
                  { src: '/sls/sharayu.jpg', alt: 'Sharayu Hande' },
                  { src: '/sls/renuka.jpg', alt: 'Dr. Renuka Pawar' },
                  { src: '/sls/gauri.jpg', alt: 'Gauri Gadge' },
                ].map((person, i) => (
                  <div
                    key={i}
                    className="relative h-11 w-11 rounded-full border-2 border-white/50 bg-[#e8eaf6] overflow-hidden shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-white"
                    style={{ zIndex: 4 - i }}
                  >
                    <Image
                      src={person.src}
                      alt={person.alt}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="relative h-11 w-11 rounded-full border-2 border-white/50 bg-gradient-to-br from-[#1a237e] to-[#3949ab] flex items-center justify-center text-white font-bold text-[10px] shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-white" style={{ zIndex: 0 }}>
                  150k+
                </div>
              </div>

              <div className="flex flex-col sm:border-l border-gray-300 pt-3 sm:pt-0 sm:pl-4 text-center sm:text-left">

                <div className="text-sm font-semibold text-gray-800 leading-tight">
                  150,000+ <span className="font-medium text-gray-600">Learners</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-[#1a237e] font-medium text-xs mt-0.5 group-hover:text-[#3949ab] transition-colors">
                  Real stories of growth
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>

          <div className="relative z-10 flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative w-full max-w-xs sm:max-w-md pointer-events-auto">
              <div className="absolute -top-6 -left-6 w-16 h-16 sm:w-24 sm:h-24 bg-[#1a237e]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-[#1a237e]/10 rounded-full blur-xl"></div>
              <div className="relative z-10 flex justify-center items-center p-2 sm:p-4" style={{ perspective: '1500px' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6]/70 via-[#c5cae9]/60 to-[#9fa8da]/50 rounded-2xl transform rotate-1 scale-[1.01] shadow-lg z-0"></div>
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 z-[1]"></div>
                <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5 mix-blend-overlay rounded-xl z-[2]"></div>
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-radial from-[#e31837]/30 to-transparent rounded-full blur-2xl z-[3]"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-radial from-[#1a237e]/30 to-transparent rounded-full blur-2xl z-[3]"></div>
                <div className="relative transform transition-all duration-500 ease-out group z-[5] hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(0deg) rotateY(0deg) scale(1)' }}>
                  <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 border border-white/30 shadow-2xl overflow-hidden" style={{ transform: 'translateZ(20px)', boxShadow: '0 25px 50px -12px rgba(26, 35, 126, 0.25)' }}>
                    <div className="relative" style={{ transform: 'translateZ(30px)' }}>
                      <Image src="/logo2.png" alt="Aspire Institute Secondary Logo" width={400} height={400} className="object-contain relative z-10 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:drop-shadow-[0_20px_30px_rgba(26,35,126,0.3)] w-full h-auto" style={{ transform: 'translateZ(10px)' }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-50"></div>
                    <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-25deg] animate-[shine_7s_ease-in-out_infinite]" style={{ transform: 'translateZ(10px)' }}></div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-black/5 shadow-[0_5px_15px_rgba(0,0,0,0.1)]" style={{ transform: 'translateZ(5px)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats Strip */}
      <div className="container px-4 md:px-6 relative z-10 mt-16 lg:mt-24 pb-8 fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 rounded-2xl p-6 md:p-0">
          {[
            { value: "17+", label: "Years of Impact" },
            { value: "150,000+", label: "Learners" },
            { value: "5,000+", label: "Workshops" },
            { value: "15+", label: "Countries" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center p-4 rounded-xl md:rounded-none md:border-r last:border-0 border-gray-200">
              <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1a237e] mb-1">{stat.value}</span>
              <span className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

