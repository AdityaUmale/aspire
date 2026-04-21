'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

// Slide 0 = the original 3D logo card, slides 1-5 = full-bleed campus images
const CAMPUS_IMAGES = [
  { src: '/carousel/12x18 == ok print.jpg', alt: 'Aspire Institute' },
  { src: '/carousel/DSC_1355.jpg', alt: 'Aspire Institute' },
  { src: '/carousel/ac1.jpg', alt: 'Aspire Institute' },
  { src: '/carousel/ac2.jpg', alt: 'Aspire Institute' },
  { src: '/carousel/arise-logo.jpg', alt: 'Aspire Institute' },
  { src: '/carousel/ist2.jpg', alt: 'Aspire Institute' },
];

const TOTAL_SLIDES = 1 + CAMPUS_IMAGES.length; // 1 logo card + N images
const SLIDE_INTERVAL = 3000;

export default function HeroSection() {
  // activeSlide: 0 = logo card, 1..N = campus images
  const [activeSlide, setActiveSlide] = useState(0);

  const advance = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  }, []);

  useEffect(() => {
    const id = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [advance]);

  const isLogoCard = activeSlide === 0;

  return (
    <section className="relative w-full pt-6 pb-4 md:pt-16 md:pb-8 lg:pt-24 lg:pb-12 xl:pt-32 xl:pb-16 overflow-x-clip px-4 md:px-6 lg:pl-14">
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1a237e]/5 blur-3xl -z-10 animate-pulse"></div>

      {/* ── LAYER 2: EXPANDED Campus Images covering right edge ── */}
      {CAMPUS_IMAGES.map((img, i) => {
        const slideIndex = i + 1;
        const isActive = activeSlide === slideIndex;
        return (
          <div
            key={i}
            className="hidden lg:block absolute -top-20 lg:-top-24 -bottom-[1%] -right-4 md:-right-6 w-[120vw] md:w-[90vw] lg:w-[90vw] transition-opacity duration-[2000ms] ease-in-out pointer-events-none"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 5 : 0,
            }}
          >
            <div
              className="relative w-full h-full transform transition-transform duration-[12000ms] ease-out"
              style={{
                transform: isActive ? 'scale(1.03) translate(-1%, 0)' : 'scale(1) translate(0, 0)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 100% 50%, black 40%, transparent 95%)',
                maskImage: 'radial-gradient(ellipse 80% 50% at 100% 50%, black 40%, transparent 95%)'
              }}
            >
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover object-[70%_50%]" priority={i === 0} />
              <div className="absolute inset-0 bg-[#1a237e]/15 mix-blend-overlay"></div>
            </div>
          </div>
        );
      })}

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6 pt-2 md:pt-0">
            <div className="space-y-4 fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/tight text-[#1a237e]">
                Aspire Institute
                <br />
                <span className="relative inline-block mt-2 text-[#3949ab]">
                  3 M + Lives Transformed
                  <span className="absolute bottom-1.5 left-0 w-full h-2.5 bg-[#c5cae9]/50 -z-10"></span>
                </span>
              </h1>
              <p className="max-w-[700px] text-gray-600 md:text-xl leading-relaxed mt-4">
                Transform Your Personality and Career with INDIA&apos;s Leading Training Institute. Trusted By Learners Across 15+ Countries round the globe.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row fade-in w-full sm:w-auto" style={{ animationDelay: '0.3s' }}>
              <Link href="/#enquiry" className="w-full sm:w-auto">
                <Button className="bg-[#1a237e] hover:bg-[#0d1642] shadow-md transition-all duration-300 hover:shadow-lg w-full sm:w-auto">
                  Start Your Growth Journey
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#courses" className="w-full sm:w-auto">
                <Button variant="outline" className="text-[#1a237e] border-[#1a237e] hover:bg-[#e8eaf6] transition-all duration-300 w-full sm:w-auto">
                  Explore Programs
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
                      sizes="44px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="relative h-11 w-11 rounded-full border-2 border-white/50 bg-gradient-to-br from-[#1a237e] to-[#3949ab] flex items-center justify-center text-white font-bold text-[10px] shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-white" style={{ zIndex: 0 }}>
                  3M+
                </div>
              </div>

              <div className="flex flex-col sm:border-l border-gray-300 pt-3 sm:pt-0 sm:pl-4 text-center sm:text-left">
                <div className="text-sm font-semibold text-gray-800 leading-tight">
                  3,000,000+ <span className="font-medium text-gray-600">Learners</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-[#1a237e] font-medium text-xs mt-0.5 group-hover:text-[#3949ab] transition-colors">
                  Real stories of growth
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>

          {/* ─── Right Column: Logo Card + Expanded Campus Images ─── */}
          <div className="relative z-10 flex items-center justify-center lg:justify-end mt-12 lg:mt-0 min-h-[400px] lg:min-h-[500px]">
            {/* Base Container for the entire right section actions */}
            <div className="relative w-full h-full flex items-center justify-center lg:justify-end">

              {/* ── MOBILE: CAMPUS IMAGES BACKGROUND (Bigger, Faded) ── */}
              {CAMPUS_IMAGES.map((img, i) => {
                const slideIndex = i + 1;
                const isActive = activeSlide === slideIndex;
                return (
                  <div
                    key={`mobile-${i}`}
                    className="absolute w-[100vw] left-1/2 -translate-x-1/2 h-[150%] sm:h-[160%] top-1/2 -translate-y-1/2 flex lg:hidden transition-opacity duration-[2000ms] ease-in-out pointer-events-none z-0"
                    style={{
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <div 
                      className="relative w-full h-full transform transition-transform duration-[12000ms] ease-out"
                      style={{
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 80%)',
                        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 80%)'
                      }}
                    >
                      <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} sizes="100vw" />
                      
                      {/* Gradient overlays to blend it perfectly */}
                      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent opacity-90"></div>
                      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent opacity-90"></div>
                      <div className="absolute inset-0 bg-[#1a237e]/10 mix-blend-overlay"></div>
                    </div>
                  </div>
                );
              })}

              {/* ── LAYER 1: The original 3D logo card ── */}
              <div
                className="transition-all duration-[1200ms] ease-in-out relative z-30 w-full max-w-xs sm:max-w-md"
                style={{
                  opacity: isLogoCard ? 1 : 0,
                  pointerEvents: isLogoCard ? 'auto' : 'none',
                  transform: isLogoCard ? 'scale(1) rotate(0deg)' : 'scale(0.8) translateY(20px)',
                }}
              >
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
                        <Image src="/logo2.png" alt="Aspire Institute Secondary Logo" width={400} height={400} sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px" priority className="object-contain relative z-10 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:drop-shadow-[0_20px_30px_rgba(26,35,126,0.3)] w-full h-auto" style={{ transform: 'translateZ(10px)' }} />
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
      </div>

      {/* Impact Stats Strip */}
      <div className="container px-4 md:px-6 relative z-10 mt-24 lg:mt-48 pb-12 fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="space-y-12 md:space-y-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 border-b border-[#1a237e]/5 pb-12">
            {[
              { value: "17+", label: "Years of Impact" },
              { value: "1.7 L+", label: "Learners" },
              { value: "5,000+", label: "Workshops" },
              { value: "15+", label: "Countries" },
              { value: "20+", label: "Indian States" },
              { value: "65+", label: "Training Programs" },
            ].map((stat, i) => (
              <StatItem key={i} value={stat.value} label={stat.label} isLast={i === 5} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {[
              { value: "55+", label: "Collaborations with colleges and companies" },
              { value: "21+", label: "Residential Camp" },
              { value: "25+", label: "International Conferences" },
              { value: "300+", label: "International Learners" },
              { value: "10,000+", label: "Annual Learners Footfalls" },
              { value: "10+", label: "Foreign University Partnerships" },
            ].map((stat, i) => (
              <StatItem key={i} value={stat.value} label={stat.label} isLast={i === 5} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label, isLast }: { value: string; label: string; isLast: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-3 lg:p-0 ${!isLast ? 'lg:border-r border-gray-100' : ''}`}>
      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a237e] mb-2">{value}</span>
      <span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight max-w-[200px]">
        {label}
      </span>
    </div>
  );
}
