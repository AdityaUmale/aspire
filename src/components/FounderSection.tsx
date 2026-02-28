'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Globe, CheckCircle, ArrowRight, Award } from "lucide-react";

export default function FounderSection() {
  return (
    <section id="founder" className="py-24 lg:py-32 relative overflow-hidden font-sans selection:bg-[#1a237e] selection:text-white border-t border-gray-50 z-10">

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">

          {/* --- Left: Editorial Image Card --- */}
          <div className="lg:col-span-5 relative order-2 lg:order-1 group">
            {/* Decorative Backdrop */}
            <div className="absolute inset-0 bg-[#f4f5f7] rounded-[2.5rem] transform -rotate-3 scale-105 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-[1.07] z-0" />
            <div className="absolute inset-0 border-2 border-dashed border-[#1a237e]/10 rounded-[2.5rem] transform rotate-3 scale-105 z-0" />

            {/* Main Image Container */}
            <div className="relative bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-[#1a237e]/10 z-10 transition-transform duration-500 group-hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-[2rem]">
                <div className="absolute inset-0 bg-[#1a237e]/10 mix-blend-overlay z-10 pointer-events-none" />
                <Image
                  src="/founder3.jpg"
                  alt="Hon'ble Mr. Sachin Burghate, Founder of Aspire Institute"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Floating Badge on Image */}
              <div className="absolute -bottom-6 -right-6 lg:-right-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:flex items-center gap-4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="h-12 w-12 rounded-full bg-[#1a237e]/5 flex items-center justify-center text-[#1a237e]">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Founded by</p>
                  <p className="font-bold text-[#1a237e] leading-none">Sachin Burghate</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right: Content & Stats --- */}
          <div className="lg:col-span-7 space-y-10 order-1 lg:order-2">

            {/* Headers */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#3949ab]/40 rounded-full" />
                <span className="text-sm font-bold tracking-[0.2em] text-[#1a237e] uppercase flex items-center gap-2">
                  <Star className="h-3.5 w-3.5" />
                  Meet Our Founder
                </span>
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a237e] leading-[1.1] tracking-tight text-balance mb-4">
                  Visionary Leadership, <br className="hidden lg:block" />
                  <span className="text-[#3949ab] bg-clip-text text-transparent bg-gradient-to-r from-[#1a237e] to-[#3949ab]">Real Impact.</span>
                </h2>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed font-light max-w-2xl text-balance">
                <strong className="font-medium text-gray-800">Hon&apos;ble Mr. Sachin Burghate, Founder of Aspire Institute</strong>, is an internationally acclaimed speaker with over 20+ years of experience in education and empowerment. A leader who inspires leaders. His vision is simple: <strong className="font-medium text-[#1a237e]">every learner can lead with purpose and confidence.</strong>
              </p>
            </div>

            {/* Bento Stats Grid */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="flex items-center gap-4 p-5 bg-[#FAFAFA] rounded-2xl border border-gray-100 hover:border-[#1a237e]/20 hover:shadow-md hover:bg-white transition-all duration-300 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-50 text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors duration-300">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#1a237e] leading-none mb-1">5,000+</h4>
                  <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">Workshops Conducted Globally</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-[#FAFAFA] rounded-2xl border border-gray-100 hover:border-[#1a237e]/20 hover:shadow-md hover:bg-white transition-all duration-300 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-50 text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors duration-300">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#1a237e] leading-none mb-1">15+</h4>
                  <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">Countries Worldwide</p>
                </div>
              </div>
            </div>

            {/* Premium Highlights List */}
            <div className="space-y-4 max-w-2xl bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              {[
                "Recipient of the Outstanding Young Person of India Award",
                "Featured on ZEE TV's \"The Real Heroes\"",
                "Delivered talks in Singapore, Dubai, Thailand, Malaysia & more"
              ].map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f0f1fa] text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors duration-300">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-gray-600 font-light text-base group-hover:text-gray-900 transition-colors">{highlight}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link href="/founder" className="inline-block outline-none">
                <Button className="h-14 px-8 rounded-full bg-[#1a237e] text-white hover:bg-[#10164f] text-base font-medium shadow-[0_4px_14px_0_rgba(26,35,126,0.39)] hover:shadow-[0_6px_20px_rgba(26,35,126,0.23)] transition-all duration-300 hover:-translate-y-0.5 group">
                  Learn More About Our Founder
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}