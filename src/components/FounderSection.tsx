'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Users, Calendar, Globe, CheckCircle, ArrowRight } from "lucide-react";

export default function FounderSection() {
  return (
    <section id="founder" className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6]/30 animate-on-scroll">
      <div className="container px-4 md:px-6 lg:ml-14 mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Image Side */}
          <div className="relative slide-in-left order-2 lg:order-1">
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-[#1a237e]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#3949ab]/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e]/20 to-[#3949ab]/20 rounded-2xl transform rotate-2"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <Image
                  src="/founder3.jpg"
                  alt="Hon'ble Mr. Sachin Burghate - Founder of Aspire Institute"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6 order-1 lg:order-2 slide-in-right">
            <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-4 py-1.5 text-sm text-[#1a237e] shadow-sm">
              <Star className="h-4 w-4 mr-2 text-[#1a237e]" />
              Meet Our Founder
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-2">Visionary Leadership, Real Impact.</h2>
              <p className="text-xl font-semibold text-[#3949ab]">Hon&apos;ble Mr. Sachin Burghate</p>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              Internationally acclaimed speaker with 20+ years in education & empowerment. A leader who inspires leaders—his vision is simple: <span className="font-semibold text-[#1a237e]">every learner can lead with purpose and confidence.</span>
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eaf6] text-[#1a237e]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a237e]">5000+</h4>
                  <p className="text-xs text-gray-500">Workshops Globally</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eaf6] text-[#1a237e]">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a237e]">15+</h4>
                  <p className="text-xs text-gray-500">Countries Worldwide</p>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#1a237e]" />
                <p className="text-sm text-gray-600">Recipient of Outstanding Young Person of India Award</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#1a237e]" />
                <p className="text-sm text-gray-600">Featured on ZEE TV&apos;s &quot;The Real Heroes&quot;</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#1a237e]" />
                <p className="text-sm text-gray-600">Delivered talks in Singapore, Dubai, Thailand, Malaysia & more</p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/founder">
                <Button className="bg-[#1a237e] hover:bg-[#0d1642] shadow-md transition-all duration-300 hover:shadow-lg px-6 py-5">
                  Learn More About Our Founder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

