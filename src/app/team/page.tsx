'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Users,
  Target,
  Award,
  Lightbulb,
  Heart,
  GraduationCap,
  Microscope,
  CheckCircle,
  Star,
  Briefcase,
  Search,
} from 'lucide-react';

export default function TeamPage() {
  const coreValues = [
    { icon: Heart, title: "Trust & Respect", description: "Fostering mutual trust in every interaction." },
    { icon: Target, title: "Excellence", description: "Striving for the highest teaching standards." },
    { icon: Lightbulb, title: "Innovation", description: "Improving methods through creativity." },
    { icon: Users, title: "Inclusivity", description: "Creating a welcoming environment for all." },
  ];

  const rdFocusAreas = [
    {
      icon: Microscope,
      title: "Research-Driven",
      description: "Exploring innovative teaching techniques."
    },
    {
      icon: Target,
      title: "Barrier Identification",
      description: "Strategies to overcome growth obstacles."
    },
    {
      icon: Award,
      title: "Customised Programs",
      description: "Tailoring content to unique learner needs."
    },
    {
      icon: Lightbulb,
      title: "Future-Ready Skills",
      description: "Preparing learners for tomorrow's challenges."
    },
  ];

  return (
    <div className={`flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#1a237e] selection:text-white`}>
      <Navbar />

      {/* Grain Overlay */}
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Hero Section - Minimalist & Typography Driven */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[100px] opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#3949ab]/5 to-transparent blur-[100px] opacity-60 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
              <span className="h-px w-12 bg-[#1a237e]/30"></span>
              <span className="text-xs font-bold tracking-[0.2em] text-[#1a237e] uppercase">The Collective</span>
              <span className="h-px w-12 bg-[#1a237e]/30"></span>
            </div>

            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl font-medium text-[#1a237e] mb-8 tracking-tight leading-[1.1] animate-in slide-in-from-bottom-6 duration-700 delay-100 fade-in">
              The Architects of <br />
              <span className="text-[#3949ab]">Transformation.</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in">
              When your mission is to serve others, you need the best people driving your vision forward. Our team is the secret to our success.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction & Core Values */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Editorial Lead Text */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-[#1a237e]/10"></div>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed pl-6 font-bold">
                &quot;Each of our team members is amazing in their own way, but together they are what make ASPIRE such a creative and rewarding place to work.&quot;
              </p>
              <p className="mt-6 pl-6 text-sm font-bold text-[#1a237e] uppercase tracking-widest">
                Committed to Excellence
              </p>
            </div>

            {/* Values Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coreValues.map((value, index) => (
                  <div key={index} className="group p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 hover:border-[#1a237e]/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <value.icon className="h-6 w-6 text-[#1a237e] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg font-medium text-[#1a237e] mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - "Paper" Card Style */}
      <section className="py-24 bg-[#f4f5f7]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-gray-100 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
              <Award className="h-64 w-64 text-[#1a237e]" />
            </div>

            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Star className="h-4 w-4 text-[#1a237e] fill-current" />
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Our Philosophy</span>
                  </div>
                  <h2 className="font-bold text-4xl md:text-5xl text-[#1a237e] leading-tight">
                    United by a <br /> Common Goal
                  </h2>
                </div>

                <div className="space-y-6 text-gray-600 font-light text-lg">
                  <p>
                    Our team has a shared vision of delivering the best possible results for our learners. By fostering an atmosphere of trust, respect, and efficiency, we work towards achieving greatness together.
                  </p>
                  <p>
                    From Organisation Development to Office Management, we are united by a singular focus: <strong className="text-[#1a237e] font-medium">the success of our learners.</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="bg-[#f8f9fa] p-8 rounded-3xl border border-dashed border-gray-300">
                  <h3 className="font-bold text-2xl text-[#1a237e] mb-6 flex items-center gap-3">
                    <Award className="h-6 w-6" />
                    Our Reputation
                  </h3>
                  <div className="grid gap-4">
                    {["Excellent Leadership", "Great Management", "Punctuality", "Timeliness"].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                        <span className="font-medium text-gray-700">{item}</span>
                        <CheckCircle className="h-5 w-5 text-[#1a237e]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Section - Clean Editorial */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Abstract decorative element behind */}
              <div className="absolute -top-10 -left-10 w-full h-full bg-[#f0f1fa] rounded-[3rem] -z-10"></div>

              <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-lg">
                <h3 className="font-bold text-2xl text-[#1a237e] mb-8">The Educator&apos;s Standard</h3>
                <div className="grid gap-4">
                  {[
                    "Exceptional classroom management",
                    "Deep commitment to learner success",
                    "Expertise in respective domains",
                    "Trained under R&D department",
                    "Use of effective, varied pedagogies",
                    "Creating comfortable environments"
                  ].map((quality, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="mt-1 h-5 w-5 rounded-full border border-[#1a237e] flex items-center justify-center text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-colors">
                        <div className="h-1.5 w-1.5 bg-current rounded-full" />
                      </div>
                      <span className="text-gray-600 font-light">{quality}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8eaf6] text-[#1a237e] mb-6">
                <GraduationCap className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wider uppercase">Expert Educators</span>
              </div>
              <h2 className="font-bold text-4xl md:text-5xl text-[#1a237e] mb-6">Our Trainers</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 font-light">
                Our trainers have all been chosen for their exceptional classroom management skills and their commitment to helping our learners achieve the best of their abilities.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                Each trainer is highly competent, striving to deliver specific requirements while fostering <span className="font-medium text-[#1a237e]">curiosity, honour, and integrity</span>. All trainers are rigorously trained under our R&D department to ensure excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* R&D Section - "Dark Lab" Aesthetic */}
      <section className="py-24 bg-[#0d1642] text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#1a237e] rounded-full blur-[150px] opacity-30 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
              <Search className="h-4 w-4 text-[#9fa8da]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#9fa8da]">Innovation Hub</span>
            </div>
            <h2 className="font-bold text-4xl md:text-5xl mb-6">Research & Development</h2>
            <p className="text-[#c5cae9] max-w-2xl mx-auto text-lg font-light leading-relaxed">
              At the forefront of understanding and improving the psychology of learners through data-driven methodology.
            </p>
          </div>



          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {rdFocusAreas.map((area, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <area.icon className="h-8 w-8 text-[#9fa8da] mb-4 group-hover:text-white transition-colors" />
                <h3 className="font-bold text-xl mb-2">{area.title}</h3>
                <p className="text-sm text-[#c5cae9] font-light">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-[#1a237e]/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9fa8da] to-transparent opacity-50"></div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-[#c5cae9] font-light leading-relaxed">
                  <p>
                    The R&D Department plays a crucial role in designing courses by exploring innovative teaching techniques and staying updated with the latest research in education.
                  </p>
                  <p>
                    We study barriers to self-growth, developing strategies to overcome them through tailored, customised programs.
                  </p>
                </div>
                <div className="border-l border-white/10 pl-8">
                  <p className="font-bold text-2xl text-white leading-relaxed">
                    &quot;Enhancing learning experiences through research, customisation, and a commitment to personal growth.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Briefcase className="h-10 w-10 text-[#1a237e] mx-auto mb-6 opacity-80" />
            <h2 className="font-bold text-4xl md:text-5xl text-[#1a237e] mb-6">
              Be Part of Something <span>Meaningful</span>
            </h2>
            <p className="text-gray-600 text-lg mb-10 font-light max-w-2xl mx-auto">
              We&apos;re always looking for passionate individuals who share our vision of transforming lives through education.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/about-us">
                <Button className="h-14 px-10 rounded-full bg-[#1a237e] text-white hover:bg-[#10164f] text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  About Aspire
                </Button>
              </Link>
              <Link href="/#enquiry">
                <Button variant="outline" className="h-14 px-10 rounded-full border-gray-200 text-[#1a237e] hover:bg-gray-50 text-base font-medium transition-all">
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