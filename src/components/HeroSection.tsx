'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full py-6 md:py-16 lg:py-24 xl:py-32 overflow-hidden px-4 md:px-6 lg:pl-14 mt-0 md:mt-8">
      {/* Background Video */}
      {/* Background Video - Right Aligned */}
      {/* Background Video - Responsive: Bottom half on mobile, Right side on desktop */}
      <div className="absolute bottom-0 right-0 w-full h-[50vh] md:top-0 md:w-[55%] lg:w-[60%] md:h-full overflow-hidden md:rounded-bl-[120px] pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/building-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Inner overlay for contrast */}
        <div className="absolute inset-0 bg-[#1a237e]/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>

        {/* Fade to merge with content above (Mobile: Top of video container, Desktop: Top of page) */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/90 to-transparent"></div>
      </div>

      {/* Main page gradient overlays - Desktop only to blend video left edge */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none w-[65%] hidden md:block z-0"></div>

      {/* Decorative elements - Keeping the glow effect but ensuring it's behind content */}
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1a237e]/5 blur-3xl -z-10 pulse"></div>


      <div className="container px-4 md:px-6 relative z-10 pb-[40vh] md:pb-0">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6 pt-2 md:pt-0">
            <div className="flex flex-wrap gap-3 fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
                A Legacy of Transformation Since 2009
              </div>
              <div className="inline-flex items-center rounded-full bg-[#1a237e] px-3 py-1 text-sm text-white shadow-md">
                <span className="font-bold mr-1">17+</span> Years of Impact
              </div>
            </div>
            <div className="space-y-4 fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#1a237e]">
                Unlock Your{" "}
                <span className="relative inline-block">
                  Potential
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-[#c5cae9]/50 -z-10"></span>
                </span>
              </h1>
              <p className="text-lg font-medium text-[#3949ab] mb-2">Developing People. Creating Leaders.</p>
              <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed">
                Join 150,000+ learners who have discovered confidence, clarity, and success with ASPIRE India&apos;s leading personal and professional development institute. Because when you grow, everything changes.
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
              className="group inline-flex items-center gap-4 pt-4 fade-in w-fit"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="inline-flex items-center gap-3 rounded-full bg-white/85 backdrop-blur-md border border-[#e0e0e0] shadow-sm px-3 py-2 transition-all duration-300 group-hover:shadow-lg group-hover:border-[#1a237e]/30">
                <div className="flex -space-x-2">
                  {[
                    { src: '/sls/tejas.jpg', alt: 'Tejas Kakkad' },
                    { src: '/sls/sharayu.jpg', alt: 'Sharayu Hande' },
                    { src: '/sls/renuka.jpg', alt: 'Dr. Renuka Pawar' },
                    { src: '/sls/gauri.jpg', alt: 'Gauri Gadge' },
                  ].map((person, i) => (
                    <div
                      key={i}
                      className="h-11 w-11 rounded-full border-2 border-white bg-[#e8eaf6] overflow-hidden shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-2 group-hover:ring-[#1a237e]/50"
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
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  <span className="font-semibold text-[#1a237e]">150,000+</span> people transformed
                  <div className="flex items-center gap-1 text-[#1a237e] font-semibold text-[11px] sm:text-xs opacity-80 group-hover:opacity-100 transition-opacity">
                    Browse success stories
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="hidden lg:block relative z-10">
            {/* The 3D card has been removed to show the video background clearly */}
          </div>
        </div>
      </div>
    </section>
  );
}

