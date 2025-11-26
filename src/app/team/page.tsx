'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Users,
  Target,
  Award,
  Lightbulb,
  BookOpen,
  Heart,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Microscope,
  Sparkles,
  CheckCircle,
  Star,
  Briefcase,
} from 'lucide-react';

export default function TeamPage() {
  const coreValues = [
    { icon: Heart, title: "Trust & Respect", description: "Fostering an atmosphere of mutual trust and respect in everything we do" },
    { icon: Target, title: "Excellence", description: "Striving for the highest standards in teaching and learner outcomes" },
    { icon: Lightbulb, title: "Innovation", description: "Continuously improving our methods through research and creativity" },
    { icon: Users, title: "Inclusivity", description: "Creating a positive, welcoming environment for all learners" },
  ];

  const trainerQualities = [
    "Exceptional classroom management skills",
    "Deep commitment to learner success",
    "Expertise in their respective domains",
    "Trained under our R&D department",
    "Use of effective, varied pedagogies",
    "Create comfortable learning environments",
  ];

  const rdFocusAreas = [
    { 
      icon: Microscope, 
      title: "Research-Driven Learning", 
      description: "Exploring innovative teaching techniques and staying updated with the latest educational research" 
    },
    { 
      icon: Target, 
      title: "Barrier Identification", 
      description: "Studying and developing strategies to overcome obstacles that hinder self-growth and personal development" 
    },
    { 
      icon: Sparkles, 
      title: "Customised Programs", 
      description: "Designing tailored programs that address the unique needs and requirements of each learner" 
    },
    { 
      icon: Lightbulb, 
      title: "Future-Ready Skills", 
      description: "Focusing on creativity and essential skills to prepare learners for future challenges and opportunities" 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-white/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#9fa8da]/20 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white mb-6">
              <Users className="h-4 w-4 mr-2" />
              <span>The People Behind Aspire</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Team Aspire
            </h1>

            <p className="text-xl md:text-2xl text-[#c5cae9] leading-relaxed max-w-3xl">
              When your mission is to serve others the best, you need the best people driving your vision forward. Our team is the secret to our success.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Each of our team members is amazing in their own way, but together they are what make ASPIRE such a creative and rewarding place to work. The team at Aspire Institute is comprised of <span className="font-semibold text-[#1a237e]">highly talented and committed individuals</span> who are all devoted to providing learners with an exceptional experience.
            </p>
          </div>

          {/* Core Values */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#f8f9fa] to-white border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#e8eaf6] rounded-xl group-hover:bg-[#1a237e] transition-colors duration-300">
                    <value.icon className="h-6 w-6 text-[#1a237e] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="font-semibold text-[#1a237e] mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Philosophy Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#f8f9fa] to-[#e8eaf6]/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-4 py-1.5 text-sm text-[#1a237e] shadow-sm">
                <Star className="h-4 w-4 mr-2" />
                Our Philosophy
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e]">
                United by a Common Goal
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our team has a shared vision of delivering the best possible results for our learners, while also creating an environment which is encouraging, positive and inclusive.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By fostering an atmosphere of trust, respect, positivity and efficiency we work towards achieving greatness together. The members of Team Aspire – ranging from the Organisation Development department to Office Management – are each united by a common goal that puts the <span className="font-semibold text-[#1a237e]">success of our learners first</span>.
              </p>
              <div className="pt-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-700 italic">
                  &quot;We strive to attract, develop, train and retain high-performing professionals who can help us reach new heights.&quot;
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#1a237e]/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#3949ab]/10 rounded-full blur-2xl"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8eaf6] rounded-full mb-4">
                    <Award className="h-8 w-8 text-[#1a237e]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a237e]">Our Reputation</h3>
                </div>
                <div className="space-y-4">
                  {["Excellent Leadership", "Great Management", "Punctuality", "Timeliness"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                      <CheckCircle className="h-5 w-5 text-[#1a237e]" />
                      <span className="font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Trainers Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-4 py-1.5 text-sm text-[#1a237e] shadow-sm mb-6">
              <GraduationCap className="h-4 w-4 mr-2" />
              Expert Educators
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-4">Our Trainers</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#1a237e] to-[#3949ab] rounded-full mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {trainerQualities.map((quality, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#f8f9fa] to-white rounded-xl border border-gray-100">
                    <CheckCircle className="h-5 w-5 text-[#1a237e] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{quality}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <p className="text-gray-600 leading-relaxed text-lg">
                Our trainers have all been chosen for their exceptional classroom management skills and their commitment to helping our learners achieve the best of their abilities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Each one is highly competent and equipped with knowledge in their respective areas, striving to understand and deliver each learner&apos;s specific requirements. Our trainers make use of various effective pedagogies so that they foster <span className="font-semibold text-[#1a237e]">curiosity, honour, and integrity</span> amongst our learners while nurturing their interpersonal skills.
              </p>
              <p className="text-gray-600 leading-relaxed">
                They understand the importance of creating an environment where learners feel comfortable practicing what they learn and provide an atmosphere that is relaxed yet motivating. All of our trainers are trained under our research and development department to ensure excellence in teaching standards across the board.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* R&D Department Section */}
      <section className="py-16 md:py-24 bg-[#1a237e] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white mb-6">
              <Microscope className="h-4 w-4 mr-2" />
              Innovation Hub
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">R&D Department</h2>
            <p className="text-[#c5cae9] max-w-3xl mx-auto text-lg">
              At the forefront of understanding and improving the psychology of learners
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {rdFocusAreas.map((area, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <area.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-white text-center mb-2">{area.title}</h3>
                <p className="text-sm text-[#c5cae9] text-center">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <p className="text-[#c5cae9] leading-relaxed mb-6">
                The Research and Development (R&D) Department at Aspire Institute focuses on understanding and improving the psychology of learners. It plays a crucial role in designing courses and training programs by exploring innovative teaching techniques and staying updated with the latest research in education.
              </p>
              <p className="text-[#c5cae9] leading-relaxed mb-6">
                The department also studies barriers to self-growth and personal development, developing strategies to overcome them. Customisation is a key focus, as tailored programs address the unique needs of each learner.
              </p>
              <p className="text-white font-medium">
                Overall, the R&D Department at Aspire Institute enhances the learning experiences of students through research, development, customisation, and a commitment to personal growth and development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Careers CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#e8eaf6] to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <Briefcase className="h-5 w-5 text-[#1a237e]" />
              <span className="text-[#1a237e] font-medium">Join Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-6">
              Be Part of Something Meaningful
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              We&apos;re always looking for passionate individuals who share our vision of transforming lives through education. Join us in making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/careers">
                <Button className="bg-[#1a237e] hover:bg-[#0d1642] text-white px-8 py-6 text-lg">
                  View Career Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
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

