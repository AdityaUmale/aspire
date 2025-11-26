'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Users,
  Heart,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Target,
  Star,
  CheckCircle,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';

export default function CareersPage() {
  const benefits = [
    { icon: Heart, title: "Meaningful Work", description: "Make a real difference in people's lives through education" },
    { icon: Users, title: "Collaborative Culture", description: "Work with passionate, like-minded professionals" },
    { icon: Lightbulb, title: "Growth Opportunities", description: "Continuous learning and professional development" },
    { icon: Target, title: "Impact-Driven", description: "Be part of a mission to transform education in India" },
  ];

  const openPositions = [
    {
      title: "Soft Skills Trainer",
      department: "Training",
      location: "Akola, Maharashtra",
      type: "Full-time",
      description: "Looking for passionate trainers to deliver personality development and communication skills programs.",
    },
    {
      title: "English Language Trainer",
      department: "Training",
      location: "Akola, Maharashtra",
      type: "Full-time",
      description: "Seeking experienced English trainers to help learners improve their language proficiency.",
    },
    {
      title: "Program Coordinator",
      department: "Operations",
      location: "Akola, Maharashtra",
      type: "Full-time",
      description: "Coordinate and manage training programs, ensuring smooth execution and learner satisfaction.",
    },
    {
      title: "Content Developer",
      department: "R&D",
      location: "Remote / Akola",
      type: "Full-time",
      description: "Create engaging educational content and training materials for our various programs.",
    },
  ];

  const whyJoinUs = [
    "Be part of India's leading human development training institute",
    "Work with a team of 50+ expert professionals",
    "Opportunity to impact 100,000+ learners",
    "Competitive compensation and benefits",
    "Flexible work environment",
    "Regular training and skill development sessions",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-white/10 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white mb-6">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>Career Opportunities</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Join Team Aspire
            </h1>

            <p className="text-xl md:text-2xl text-[#c5cae9] leading-relaxed max-w-3xl mb-8">
              Build your career while making a difference. Join us in our mission to transform lives through education and personal development.
            </p>

            <a href="#positions">
              <Button className="bg-white text-[#1a237e] hover:bg-[#e8eaf6] px-8 py-6 text-lg">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-4 py-1.5 text-sm text-[#1a237e] shadow-sm mb-6">
              <Star className="h-4 w-4 mr-2" />
              Why Aspire
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-4">Why Work With Us?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              At Aspire, we believe in nurturing not just our learners, but also our team members.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#f8f9fa] to-white border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#e8eaf6] rounded-xl group-hover:bg-[#1a237e] transition-colors duration-300">
                    <benefit.icon className="h-6 w-6 text-[#1a237e] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="font-semibold text-[#1a237e] mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#f8f9fa] to-[#e8eaf6]/30 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#1a237e] mb-6 text-center">What You&apos;ll Get</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {whyJoinUs.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#1a237e] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-16 md:py-24 bg-gradient-to-br from-[#f8f9fa] to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-4 py-1.5 text-sm text-[#1a237e] shadow-sm mb-6">
              <GraduationCap className="h-4 w-4 mr-2" />
              Current Openings
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-4">Open Positions</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore our current job openings and find the perfect role for you.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#1a237e]">{position.title}</h3>
                    <p className="text-gray-600">{position.description}</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e8eaf6] text-[#1a237e] rounded-full text-sm">
                        <Briefcase className="h-3.5 w-3.5" />
                        {position.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        {position.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        <Clock className="h-3.5 w-3.5" />
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <a href="mailto:infoaspire2009@gmail.com?subject=Application for ${position.title}">
                      <Button className="bg-[#1a237e] hover:bg-[#0d1642] text-white">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 md:py-24 bg-[#1a237e] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Get in Touch</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Don&apos;t See a Perfect Fit?
            </h2>
            <p className="text-[#c5cae9] text-lg mb-8">
              We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll keep you in mind for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:infoaspire2009@gmail.com?subject=General Application - Team Aspire">
                <Button className="bg-white text-[#1a237e] hover:bg-[#e8eaf6] px-8 py-6 text-lg">
                  <Mail className="mr-2 h-5 w-5" />
                  Send Your Resume
                </Button>
              </a>
              <Link href="/team">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Learn About Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

