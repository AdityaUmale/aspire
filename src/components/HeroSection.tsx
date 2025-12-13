'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-16 lg:py-24 xl:py-32 overflow-hidden px-4 md:px-6 lg:pl-14 mt-4 md:mt-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9] -z-10"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] bg-no-repeat bg-cover opacity-5 -z-10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a237e]/5 rounded-bl-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1a237e]/5 blur-3xl -z-10 pulse"></div>

      <div className="container px-4 md:px-6 relative">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
              Transforming Lives Since 2009
            </div>
            <div className="space-y-4 fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#1a237e]">
                Unlock Your{" "}
                <span className="relative inline-block">
                  Potential
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-[#c5cae9]/50 -z-10"></span>
                </span>
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed">
                Join 1,50,000+ learners who have discovered confidence, clarity, and success with ASPIRE India’s Leading Personal & Professional Development Institute. because when you grow, everything changes. 
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
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-11 w-11 rounded-full border-2 border-white bg-[#e8eaf6] overflow-hidden shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-2 group-hover:ring-[#1a237e]/50"
                    >
                      <Image
                        src="/founder3.jpg"
                        alt="Success story"
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

          <div className="relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-full max-w-xs sm:max-w-md">
              <div className="absolute -top-6 -left-6 w-16 h-16 sm:w-24 sm:h-24 bg-[#1a237e]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-[#1a237e]/10 rounded-full blur-xl"></div>
              <div className="relative z-10 flex justify-center items-center p-2 sm:p-4" style={{ perspective: '1500px' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6]/70 via-[#c5cae9]/60 to-[#9fa8da]/50 rounded-2xl transform rotate-1 scale-[1.01] shadow-lg z-0"></div>
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 z-[1]"></div>
                <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5 mix-blend-overlay rounded-xl z-[2]"></div>
                <div className="absolute -top-5 -right-5 w-32 h-32 bg-gradient-radial from-[#1a237e]/15 to-transparent rounded-full blur-xl z-[3]"></div>
                <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-gradient-radial from-[#3949ab]/15 to-transparent rounded-full blur-xl z-[3]"></div>
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
    </section>
  );
}

