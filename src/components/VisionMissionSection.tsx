'use client';

import { GraduationCap, Globe, Target } from "lucide-react";

export default function VisionMissionSection() {
  return (
    <section id="vision-mission" className="py-12 md:py-16 lg:py-20 bg-white animate-on-scroll">
      <div className="container px-4 md:px-6 lg:ml-14 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm">
            <Target className="h-3.5 w-3.5 mr-1 text-[#1a237e]" />
            Our Purpose
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1a237e]">Guiding Principles</h2>
          <p className="text-gray-500 md:text-lg max-w-2xl">Our mission and vision drive us to empower individuals and shape a better future.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 items-center">
          {/* Mission Card with 3D Effect */}
          <div className="relative fade-in-up group" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#1a237e]/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#c5cae9]/20 rounded-full blur-xl"></div>
            <div className="relative z-10 p-8 rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-md border border-white/30 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]" style={{ transformStyle: 'preserve-3d', boxShadow: '0 25px 50px -12px rgba(26, 35, 126, 0.25)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6]/50 via-transparent to-[#c5cae9]/30 rounded-2xl"></div>
              <div className="absolute -top-2 -right-2 w-32 h-32 bg-gradient-radial from-[#1a237e]/15 to-transparent rounded-full blur-xl"></div>
              <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-gradient-radial from-[#3949ab]/10 to-transparent rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1a237e]/10 to-[#3949ab]/5 shadow-lg">
                    <GraduationCap className="h-6 w-6 text-[#1a237e]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1a237e]">Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">Our mission is to provide an extensive variety of life-transforming programs to create effective Communicators, Self believers, Engaging leaders, Aspiring professionals and Visionary entrepreneurs. Through our innovative training methodologies and expert guidance, we empower individuals to unlock their potential and achieve their personal and professional goals.</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-50 rounded-2xl"></div>
            </div>
          </div>

          {/* Vision Card with 3D Effect */}
          <div className="relative fade-in-up group" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#3949ab]/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-[#9fa8da]/20 rounded-full blur-xl"></div>
            <div className="relative z-10 p-8 rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-md border border-white/30 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]" style={{ transformStyle: 'preserve-3d', boxShadow: '0 25px 50px -12px rgba(57, 73, 171, 0.25)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6]/50 via-transparent to-[#9fa8da]/30 rounded-2xl"></div>
              <div className="absolute -top-2 -left-2 w-32 h-32 bg-gradient-radial from-[#3949ab]/15 to-transparent rounded-full blur-xl"></div>
              <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-radial from-[#1a237e]/10 to-transparent rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3949ab]/10 to-[#1a237e]/5 shadow-lg">
                    <Globe className="h-6 w-6 text-[#1a237e]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1a237e]">Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">Aspire The Institute Of Human Development envisions the world where people believe in themselves & live their true potential to make this world a better place to live. We strive to create a global community of empowered individuals who transform their lives and contribute meaningfully to society through continuous learning and personal development, fostering innovation and excellence in everything we do.</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-50 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

