import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { CheckCircle, Globe, ArrowRight, Compass, Award } from 'lucide-react';

export default function InternationalWorkshopPage() {
  const courseOutline = [
    'Enhance your cross-cultural management skills',
    'Experience the brilliance in overseas education',
    'Get a life-changing experience',
    'Become the eyewitness of your own transformation',
    'Leadership development sessions',
    'Values and confidence building',
    'Special sessions by international faculty',
    'Thoughts and attitude transformation',
    'Karma and influence understanding',
    'Eternal positivity training',
    'Communication mastery',
    'Self analysis and learning dexterity',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]"></div>
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#c5cae9]/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#c5cae9]/10 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <Globe className="h-4 w-4 text-[#c5cae9]" />
                  <span className="text-white/90 text-sm font-medium">International Program</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
                  Meet Yourself
                </h1>
                <p className="text-xl md:text-2xl text-[#c5cae9] mb-6">
                  &ldquo;Travel far enough, you meet yourself.&rdquo;
                </p>
                <p className="text-base text-white/70 mb-8">
                  An overseas journey that becomes a journey within. Since 2013.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/#enquiry">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                      <span>Begin Your Journey</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="#outline">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 w-full sm:w-auto">
                      <span>View Program Outline</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right - Image */}
              <div className="hidden md:block">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c5cae9]/30 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <Image
                      src="/iw.jpg"
                      alt="International Workshop"
                      width={600}
                      height={500}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/40 to-transparent"></div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-[#e8eaf6] flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#e8eaf6] flex items-center justify-center">
                      <Award className="h-6 w-6 text-[#1a237e]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Since 2013</p>
                      <p className="text-[#1a237e] font-bold">Global Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45.8C96 41.7 192 33.3 288 29.2C384 25 480 25 576 33.3C672 41.7 768 58.3 864 62.5C960 66.7 1056 58.3 1152 50C1248 41.7 1344 33.3 1392 29.2L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-[#1a237e]"></span>
                <span className="text-[#1a237e] uppercase tracking-wider text-sm font-bold">Introduction</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-6 leading-tight">
                A Journey Within
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Traveling is NOT just a journey where you visit places, learn new language, see different cultures and update your social media. When it comes to Meet Yourself, traveling is indeed a <span className="font-bold text-[#1a237e]">journey right within</span>, where you learn about yourself.
                </p>
                <p>
                  The moments of self-reflection help you to understand yourself better, and find a better version of yourself. You&apos;ll meet the real you, hidden somewhere on the roads you would travel.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#e8eaf6] rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#c5cae9] rounded-full blur-xl"></div>
              <Image
                src="/iw1.jpg"
                alt="Meet Yourself international workshop"
                width={600}
                height={450}
                className="relative rounded-2xl shadow-xl w-full object-cover"
              />
            </div>
          </div>

          {/* Feature Sections */}
          <div className="space-y-20">
            {/* Block 1 */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute inset-0 bg-[#1a237e]/5 rounded-2xl transform -rotate-2 scale-[1.02]"></div>
                <Image
                  src="/iw2.jpg"
                  alt="Meet Yourself workshop abroad"
                  width={600}
                  height={450}
                  className="relative rounded-2xl shadow-lg w-full object-cover transform rotate-0 hover:rotate-1 transition-transform duration-500"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl md:text-3xl font-bold text-[#1a237e] mb-4">Global Experience</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Here is an overseas program &ldquo;Meet Yourself&rdquo; to gain the excellent global experience. Since 2013 Aspire has been hosting this training program in different countries like <span className="font-bold text-[#1a237e]">Singapore, Malaysia, Thailand, Dubai and Qatar</span>.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Through Meet Yourself, ASPIRE provides a platform for students to seize opportunities. This is a well-designed course for change seekers that helps participants reveal opinions about themselves and create a positive self-image.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Outline Section */}
      <section id="outline" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a237e] mb-4">What You&apos;ll Gain</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our international workshops are designed to provide profound personal and professional growth through immersive global experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courseOutline.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl border-l-4 border-[#1a237e] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#e8eaf6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a237e] transition-colors duration-300">
                    <CheckCircle className="h-5 w-5 text-[#1a237e] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-gray-700 font-medium leading-snug group-hover:text-[#1a237e] transition-colors duration-300">
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Rounded Rectangle CTA */}
            <div className="relative bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] rounded-3xl py-16 md:py-20 px-8 md:px-16 lg:px-20 overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5"></div>
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-60 h-60 bg-[#c5cae9]/20 rounded-full blur-3xl"></div>
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-60 h-60 bg-[#c5cae9]/20 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                {/* Text Content */}
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Ready for Global Learning?
                  </h2>
                  <p className="text-[#c5cae9] text-base md:text-lg max-w-xl">
                    Experience transformative learning experiences across international locations. This is a privilege meant to change you forever.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                  <Link href="/#enquiry">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap">
                      <span>Reserve Your Spot</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="/#courses">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 whitespace-nowrap">
                      <span>View All Programs</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
