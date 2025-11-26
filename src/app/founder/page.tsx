'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Award,
  Users,
  Globe,
  Mic,
  Star,
  CheckCircle,
  Calendar,
  MapPin,
  Quote,
  ArrowLeft,
  Heart,
} from 'lucide-react';

export default function FounderPage() {
  const achievements = [
    { icon: Users, value: "3M+", label: "Lives Impacted Globally" },
    { icon: Calendar, value: "5000+", label: "Workshops & Programs" },
    { icon: Globe, value: "15+", label: "Countries Worldwide" },
    { icon: Mic, value: "20+", label: "Years of Excellence" },
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
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6] via-white to-[#c5cae9]/30"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#1a237e]/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#3949ab]/10 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1a237e] hover:text-[#3949ab] mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image Side */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-8 -left-8 w-48 h-48 bg-[#1a237e]/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#3949ab]/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e]/20 to-[#3949ab]/20 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white p-3 rounded-3xl shadow-2xl">
                  <Image
                    src="/founder3.jpg"
                    alt="Hon'ble Mr. Sachin Burghate - Founder of Aspire Institute"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 lg:bottom-8 lg:-right-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#e8eaf6] rounded-full">
                    <Award className="h-6 w-6 text-[#1a237e]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Recipient of</p>
                    <p className="text-sm font-bold text-[#1a237e]">OYP India Award</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-4 py-1.5 text-sm text-[#1a237e] shadow-sm">
                <Star className="h-4 w-4 mr-2 text-[#1a237e]" />
                <span>Meet Our Founder</span>
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a237e] mb-2 tracking-tight">
                  The Visionary Behind Aspire
                </h1>
                <p className="text-2xl md:text-3xl font-semibold text-[#3949ab]">
                  Hon&apos;ble Mr. Sachin Burghate
                </p>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                Internationally acclaimed speaker with 20+ years in education & empowerment. 
                A leader who inspires leaders. His vision is simple: <span className="font-semibold text-[#1a237e]">every learner can lead with purpose and confidence.</span>
              </p>

              <div className="flex flex-wrap gap-3">
                {countries.slice(0, 5).map((country, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8eaf6] text-[#1a237e] rounded-full text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    {country}
                  </span>
                ))}
                <span className="inline-flex items-center px-3 py-1.5 bg-[#1a237e] text-white rounded-full text-sm font-medium">
                  +{countries.length - 5} more
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#1a237e]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-[#c5cae9] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Message Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8eaf6] rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-4 py-1.5 text-sm text-[#1a237e] shadow-sm mb-6">
                <Quote className="h-4 w-4 mr-2 text-[#1a237e]" />
                <span>Founder&apos;s Message</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e]">A Message from the Heart</h2>
            </div>

            <div className="bg-gradient-to-br from-white to-[#f8f9fa] p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative">
              <div className="absolute top-6 left-6 text-[#e8eaf6]">
                <Quote className="h-16 w-16" />
              </div>
              
              <div className="relative z-10 space-y-6 text-gray-700 leading-relaxed">
                <p className="text-xl md:text-2xl font-medium text-[#1a237e] italic">
                  Welcome to the world of Aspire - The Institute Of Human Development, where we help you explore yourself and show you the path of success!
                </p>
                
                <p>
                  It&apos;s an honour to welcome you to our institution, which has been transforming the face of education since 2009. We understand that studying isn&apos;t just about academics; true development involves honing all areas of personal and professional life. This is why we offer a variety of courses in order to help millions of people grow and find success on their own path.
                </p>

                <p>
                  At ASPIRE the Institute of Human Development, our focus is on personal and professional growth that goes beyond academic goals. Our university of life philosophy recognizes that learning opportunities are everywhere – living, working and thriving in a changing world.
                </p>

                <p>
                  As founder of ASPIRE, I strive for everyone&apos;s overall success. The unique curriculum at ASPIRE provides you with an opportunity to cultivate yourself into a better person – one who is capable of tackling any challenge while overcoming adversity. Our dedicated faculty understand that each individual possesses his or her own strengths which must be nurtured in order to unleash their true potential.
                </p>

                <p>
                  I am proud of this revolution taking place here at ASPIRE and invite you all to join us as we move forward! We want each person who passes through our doors to leave with not only new knowledge but also newfound confidence and ambition that will help propel them towards greatness and their next venture in life.
                </p>

                <p className="text-lg font-medium text-[#1a237e]">
                  I wish for every student enrolled here at our institute: &quot;a bright and wonderful learning experience&quot;!
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[#1a237e]/20">
                    <Image
                      src="/founder3.jpg"
                      alt="Sachin Burghate"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warm regards and all the best!</p>
                    <p className="text-xl font-bold text-[#1a237e]">SACHIN BURGHATE</p>
                    <p className="text-sm text-[#3949ab]">Founder, Aspire - The Institute Of Human Development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-4">Honours & Recognition</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#1a237e] to-[#3949ab] rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {awards.map((award, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#e8eaf6] rounded-lg text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors flex-shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700 font-medium">{award}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 bg-[#1a237e] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Global Presence</h2>
            <p className="text-[#c5cae9] max-w-2xl mx-auto">
              Delivered transformative talks and workshops in 15+ countries, impacting millions of lives worldwide.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {countries.map((country, index) => (
              <div key={index} className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                <MapPin className="h-4 w-4 text-[#c5cae9]" />
                <span className="font-medium">{country}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#e8eaf6] to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <Heart className="h-5 w-5 text-[#1a237e]" />
              <span className="text-[#1a237e] font-medium">Join the Movement</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Join over 150,000+ learners who have discovered their true potential with Aspire Institute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#courses">
                <Button className="bg-[#1a237e] hover:bg-[#0d1642] text-white px-8 py-6 text-lg">
                  Explore Our Programs
                </Button>
              </Link>
              <Link href="/#enquiry">
                <Button variant="outline" className="border-[#1a237e] text-[#1a237e] hover:bg-[#e8eaf6] px-8 py-6 text-lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

