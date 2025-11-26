'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import {
  Award,
  Users,
  BookOpen,
  Target,
  Globe,
  Zap,
  Microscope,
  Heart,
  Star,
  CheckCircle,
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#e8eaf6]/30">
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.03] mix-blend-soft-light"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[#3949ab]/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-[#1a237e]/10 to-transparent blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-4 py-1.5 text-sm text-[#1a237e] shadow-sm mb-6">
              <Star className="h-4 w-4 mr-2 text-[#1a237e]" />
              <span>Transforming Lives Since 2009</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a237e] mb-6 tracking-tight leading-tight">
              Unlocking Potential, <br/>
              <span className="text-[#3949ab]">Shaping Futures</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We are one of India's largest personal and professional development training institutes, dedicated to empowering individuals to become the best version of themselves.
            </p>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
            {[
              { label: "Learners", value: "150K+", icon: Users },
              { label: "Participants", value: "3M+", icon: Globe },
              { label: "Years Legacy", value: "15+", icon: Award },
              { label: "Programs", value: "5000+", icon: BookOpen },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-[#e8eaf6] rounded-full text-[#1a237e]">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#1a237e] mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e]">Who We Are</h2>
                <div className="h-1.5 w-20 bg-gradient-to-r from-[#1a237e] to-[#3949ab] rounded-full"></div>
              </div>
              <div className="prose prose-lg text-gray-600 space-y-6">
                <p>
                  Aspire The Institute Of Human Development has a wide extensive variety of training programs with a vibrant curriculum to fit the needs of young and professional learners. We believe that everyone has the potential to become an incredible version of themselves.
                </p>
                <p>
                  Through our training programs, we help unlock the potential within each individual, providing them with the tools and knowledge they need to grow and transform positively. We look for a positive change that can lead the learners to live their lives confidently, positively and successfully.
                </p>
                <p>
                  We have built one of a kind culture that motivates learners to gain the utmost knowledge at the institute, striving to empower them for greater goals in their fields.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#e8eaf6] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#c5cae9] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { title: "Mission", content: "To provide an extensive variety of life-transforming programs to create effective Communicators, Self believers, Engaging leaders, Aspiring professionals and Visionary entrepreneurs.", icon: Target },
                    { title: "Vision", content: "Aspire envisions the world where people believe in themselves & live their true potential to make this world a better place to live.", icon: Zap },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-[#f8f9fa] to-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-[#1a237e] rounded-lg text-white">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a237e]">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Offerings & R&D */}
      <section className="py-20 bg-[#1a237e] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.05]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What We Offer</h2>
            <p className="text-[#c5cae9] text-lg">
              We provide trainings on Leadership development, Entrepreneurship development, Personality development, Public speaking, English language training, and more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { title: "Training Programs", items: ["Leadership Development", "Entrepreneurship", "Personality Development", "Public Speaking", "Teachers Training", "Corporate Training"] },
              { title: "Event Formats", items: ["Seminars", "Webinars", "Conferences", "Symposiums", "Residential Camps", "Workshops"] },
              { title: "Delivery Modes", items: ["Online Training", "In-Person Training", "Hybrid Models", "Interactive Sessions", "Practical Workshops", "Global Access"] },
            ].map((category, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold mb-6 text-[#e8eaf6] border-b border-white/20 pb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#c5cae9]">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-white text-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-[#e8eaf6] p-6 rounded-full">
                <Microscope className="h-24 w-24 text-[#1a237e]" />
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1a237e]">Research & Development</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our Research and Development department is at the heart of the institute. We timely discover the need of learners to design and update the training programs that makes us stay up to date in the field of personal development. Our methodology focuses on the pragmatic approach that makes our classroom encouraging, interactive and engaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honours & Awards */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-4">Honours & Awards</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#1a237e] to-[#3949ab] rounded-full mx-auto"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
              ASPIRE the Institute of Human Development is honoured and awarded with prestigious awards for our contribution to society and education.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {[
              {
                title: "Excellent Institute For Creating Leaders",
                year: "2019",
                desc: "Acknowledged as 'Excellent Institute for Creating Leaders and Discovering Potential of Students in India'.",
                guests: ["Hon'ble Sayed Shahnawaz Hussain", "Hon'ble Tarun Chugh", "Hon'ble Navin Sinha", "Hon'ble Mugdha Godse"]
              },
              {
                title: "The Most Innovative Institute",
                year: "2019",
                desc: "Recipient of the eminent award 'The Most Innovative Institute for Human Development Training in India' at World Education Summit.",
                guests: ["Hon'ble Murli Manoharji Joshi", "Hon'ble Aadarshji Shastri", "Padmashree Bajrangji Punia", "Hon'ble Alokji Mittal", "Hon'ble Gulshan Grover"]
              },
              {
                title: "Social Impact Awards",
                year: "2018-19",
                desc: "Awarded for Empowering Our Society Through Human Development Training Programs during Pratigya Stand for a cause event.",
                guests: ["Hon'ble Kiran Kher", "Hon'ble Shyam Jaju", "Hon'ble Laxmi Agarwal", "Hon'ble Namrata Goyal", "Hon'ble Manoj Tiwari"]
              },
              {
                title: "Best Institute in Maharashtra",
                year: "2018",
                desc: "Prestigious award 'Best Institute For Human Development Training In Maharashtra' in World Education Summit New Delhi.",
                guests: ["Padmshri Sharmila Tagore", "Hon'ble Parshottam Rupala", "Hon'ble Dr. C. P. Thakur", "Hon'ble Mrs. Anka Verma"]
              },
              {
                title: "National Achievers Award",
                year: "2018",
                desc: "Honoured with 'National Achievers Award for Education Excellence'.",
                guests: ["Hon'ble Ram Niwas Goel", "Hon'ble Kanahiya Lal Ganju", "Hon'ble Atishi Marlena"]
              }
            ].map((award, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#e8eaf6] rounded-xl text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 bg-[#e8eaf6] text-[#1a237e] text-sm font-bold rounded-full">{award.year}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a237e] mb-3 group-hover:text-[#3949ab] transition-colors">{award.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{award.desc}</p>
                
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Presented By / In Presence Of:</p>
                  <div className="flex flex-wrap gap-2">
                    {award.guests.map((guest, i) => (
                      <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Aspire Section */}
      <section className="py-20 bg-[#e8eaf6]/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-16 bg-[#1a237e] text-white flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Aspire?</h2>
                <p className="text-[#c5cae9] text-lg mb-8">
                  Our brand has a rich history of over 15 years in the industry, establishing a strong presence and credibility.
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Trusted by Millions</p>
                    <p className="text-[#c5cae9] text-sm">Consistent positive impact</p>
                  </div>
                </div>
              </div>
              <div className="p-10 md:p-16">
                <ul className="space-y-4">
                  {[
                    "Largest personal and professional development institute in India",
                    "Meticulously designed courses by skilled R&D Department",
                    "Abundant success stories of our learners",
                    "Vibrant curriculum for young and professional learners",
                    "Focus on professional skills and life skills",
                    "Positive culture encouraging knowledge gain",
                    "Unique methodology with practical approach",
                    "Online & In-Person trainings for convenience"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-green-100 rounded-full">
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
