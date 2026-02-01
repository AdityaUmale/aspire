import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { CheckCircle, Baby, Clock, Users, ArrowRight, Languages, Mic, Heart, Star, Award } from 'lucide-react';

export default function ChildrensLearningProgramPage() {
  const outlineEnglish = [
    'Sentences Formation Activities (SFA)',
    'Language Improvement Games (LIG)',
    'Vocabulary Building Activities (VBA)',
    'Social English Conversations (SEC)',
    'Daily Used Phrases, Expressions, Phrasal Verbs And Idioms (PEPI)',
    'Audio Segment (AUS)',
    'Movie and Video Based Learning (MVBL)',
    'Phonics Training (FCT)',
  ];

  const outlinePublicSpeaking = [
    'Self Introduction',
    'Active Listening',
    'Public Speaking Assignments',
    'Stage Fear',
    'Tips on Body Language',
    'Personal Experience Sharing',
    'Storytelling',
    'Speech Preparation',
    'Types of Speeches',
    'Body Language',
    'Confidence Building',
  ];

  const outlineSocialSkills = [
    'General Manners',
    'Sharing and Cooperation',
    'Learn Greetings',
    'Group Activities',
    'Fun and Engaging Projects',
    'Group Discussion',
    'Personal Hygiene',
    'Team Work',
    'Initiative Taking',
    'Etiquettes for Kids',
    'Communicating Needs',
    'Social and Emotional Development',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]"></div>
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#c5cae9]/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#c5cae9]/10 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <Baby className="h-4 w-4 text-[#c5cae9]" />
                  <span className="text-white/90 text-sm font-medium">Program for Kids (Ages 8-12)</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
                  Children&apos;s Learning Program
                </h1>
                <p className="text-lg md:text-xl text-[#c5cae9] mb-4 leading-relaxed">
                  Summer Special Course (SSC)
                </p>

                {/* Details */}
                <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                    <Users className="h-4 w-4 text-[#c5cae9]" />
                    <span className="text-white text-sm">Ages 8-12</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                    <Clock className="h-4 w-4 text-[#c5cae9]" />
                    <span className="text-white text-sm">1 Month</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/#enquiry">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                      <span>Enroll Your Child</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="#outline">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 w-full sm:w-auto">
                      <span>View Course Outline</span>
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
                      src="/clp1.jpg"
                      alt="Children's Learning Program"
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
                      <p className="text-xs text-gray-500 font-medium">17+ Years</p>
                      <p className="text-[#1a237e] font-bold">Trusted Program</p>
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
                Building Essential Life Skills
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Designed after in-depth research on the developmental needs of children aged 8–12, ASPIRE Institute&apos;s Summer Special Course (SSC) builds the four essential life skills every child needs early — English Language, Public Speaking, Social Skills, and Personality Development.
                </p>
                <p>
                  This one-month program lays a strong foundation for confidence, communication, and overall growth.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#e8eaf6] rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#c5cae9] rounded-full blur-xl"></div>
              <Image
                src="/clp2.jpg"
                alt="Children learning together"
                width={600}
                height={450}
                className="relative rounded-2xl shadow-xl w-full object-cover"
              />
            </div>
          </div>

          {/* Feature Section */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-[#1a237e]/5 rounded-2xl transform -rotate-2 scale-[1.02]"></div>
              <Image
                src="/elt.jpg"
                alt="Kids in classroom"
                width={600}
                height={450}
                className="relative rounded-2xl shadow-lg w-full object-cover transform rotate-0 hover:rotate-1 transition-transform duration-500"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1a237e] mb-4">17+ Years of Expertise</h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                With 17+ years of expertise, ASPIRE follows a natural, stress-free learning approach where children feel safe to make mistakes, practice freely, and enjoy learning.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                English training is level-based and engaging, while public speaking sessions help children overcome stage fear early, express ideas clearly, and speak with confidence.
              </p>
            </div>
          </div>

          {/* Third Section */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1a237e] mb-4">Social Intelligence & Personality Growth</h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                SSC also nurtures social intelligence and personality growth, helping children communicate better, build healthy relationships, and develop emotional balance.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Through guided activities and role-model-based learning, children grow into confident, balanced, and value-driven individuals — creating positive change that lasts well beyond summer.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#1a237e]/5 rounded-2xl transform rotate-2 scale-[1.02]"></div>
              <Image
                src="/clp1.jpg"
                alt="Children developing social skills"
                width={600}
                height={450}
                className="relative rounded-2xl shadow-lg w-full object-cover transform rotate-0 hover:-rotate-1 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      {/* Four Pillars Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] rounded-3xl py-16 md:py-20 px-8 md:px-12 overflow-hidden shadow-2xl">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#c5cae9]/15 to-transparent blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#c5cae9]/10 to-transparent blur-3xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Four Pillars of Growth</h2>
                  <p className="text-[#c5cae9] text-base md:text-lg max-w-2xl mx-auto">
                    A holistic approach to child development covering all essential life skills
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Languages, title: 'English Language', desc: 'Level-based, engaging training for mastery' },
                    { icon: Mic, title: 'Public Speaking', desc: 'Overcome stage fear, speak with confidence' },
                    { icon: Heart, title: 'Social Skills', desc: 'Build healthy relationships & communication' },
                    { icon: Star, title: 'Personality Development', desc: 'Grow into confident, balanced individuals' },
                  ].map((pillar, i) => {
                    const Icon = pillar.icon;
                    return (
                      <div
                        key={i}
                        className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:border-white/40 hover:-translate-y-2 transition-all duration-300 text-center"
                      >


                        <div className="h-14 w-14 rounded-2xl bg-white/20 mb-5 flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors duration-300">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">{pillar.title}</h3>
                        <p className="text-[#c5cae9] text-sm leading-relaxed">{pillar.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Outlines Section */}
      <section id="outline" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-3">Course Outlines</h2>
            <p className="text-gray-600 text-base max-w-xl mx-auto">Engaging curriculum designed for young minds</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* English Language */}
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-[#e8eaf6]">
              {/* Top Gradient Accent */}
              <div className="h-2 bg-gradient-to-r from-[#1a237e] to-[#3949ab]"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#1a237e] to-[#3949ab] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Languages className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a237e]">English Language</h3>
                </div>
                <ul className="space-y-3">
                  {outlineEnglish.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 text-sm group/item">
                      <div className="h-5 w-5 rounded-full bg-[#e8eaf6] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-[#1a237e] transition-colors duration-300">
                        <CheckCircle className="h-3 w-3 text-[#3949ab] group-hover/item:text-white transition-colors duration-300" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Public Speaking */}
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-[#e8eaf6]">
              {/* Top Gradient Accent */}
              <div className="h-2 bg-gradient-to-r from-[#3949ab] to-[#5c6bc0]"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#3949ab] to-[#5c6bc0] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Mic className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a237e]">Public Speaking</h3>
                </div>
                <ul className="space-y-3">
                  {outlinePublicSpeaking.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 text-sm group/item">
                      <div className="h-5 w-5 rounded-full bg-[#e8eaf6] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-[#3949ab] transition-colors duration-300">
                        <CheckCircle className="h-3 w-3 text-[#3949ab] group-hover/item:text-white transition-colors duration-300" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social Skills */}
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-[#e8eaf6]">
              {/* Top Gradient Accent */}
              <div className="h-2 bg-gradient-to-r from-[#5c6bc0] to-[#7986cb]"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5c6bc0] to-[#7986cb] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a237e]">Social Skills</h3>
                </div>
                <ul className="space-y-3">
                  {outlineSocialSkills.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 text-sm group/item">
                      <div className="h-5 w-5 rounded-full bg-[#e8eaf6] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-[#5c6bc0] transition-colors duration-300">
                        <CheckCircle className="h-3 w-3 text-[#3949ab] group-hover/item:text-white transition-colors duration-300" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
                    Give Your Child the Best Start
                  </h2>
                  <p className="text-[#c5cae9] text-base md:text-lg max-w-xl">
                    Watch your child grow into a confident, articulate, and socially aware individual. Enroll in the Summer Special Course today!
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                  <Link href="/#enquiry">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap">
                      <span>Enroll Now</span>
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