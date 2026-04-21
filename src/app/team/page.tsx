'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Heart,
  Microscope,
  Users,
} from 'lucide-react';

const coreValues = [
  'Collaboration Over Competition',
  'Learning Over Hierarchy',
  'Growth Over Comfort',
  'Dedication, Empathy, And Responsibility',
];

const trainerStandards = [
  'Thoughtfully selected for expertise and genuine human connection',
  'Focused on intellectually stimulating, emotionally supportive, practical learning',
  'Committed to individual attention, honest feedback, and disciplined progress',
  'Grounded in real-world experience, warmth, and strong classroom leadership',
];

const rdFocusAreas = [
  'Understanding how people learn and what they need to grow',
  'Studying learning patterns, student psychology, and emerging skill demands',
  'Designing and refining curriculum from real learner feedback',
  'Keeping every programme deeply relevant to the world learners step into',
];

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e] selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[20%] right-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] rounded-full bg-gradient-to-br from-[#7c4dff]/20 md:from-[#7c4dff]/25 via-[#536dfe]/15 md:via-[#536dfe]/20 to-transparent blur-[60px] md:blur-[120px]"></div>
        <div className="absolute top-[55%] left-[-8%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-tr from-[#448aff]/15 md:from-[#448aff]/20 via-[#7c4dff]/10 md:via-[#7c4dff]/15 to-transparent blur-[50px] md:blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-gradient-to-tl from-[#e040fb]/10 md:from-[#e040fb]/15 via-[#7c4dff]/10 md:via-[#7c4dff]/10 to-transparent blur-[40px] md:blur-[100px]"></div>
      </div>

      <Navbar />

      <section className="pt-32 pb-20 md:pt-48 md:pb-28 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center">


            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-gray-900 tracking-tight leading-[1.05] mb-8">
              The People Behind
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a237e] to-[#3949ab]">
                Every Transformation.
              </span>
            </h1>

            <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed font-light max-w-4xl mx-auto">
              <p>
                At Aspire, The Institute Of Human Development, people are not a part of the process; they are the process. Every breakthrough a learner experiences, every moment of clarity, every shift in confidence and capability, behind it stands a team that chose this work not for convenience, but for conviction.
              </p>
              <p>
                Team Aspire is a living, breathing collective of passionate educators, mentors, researchers, and professionals bound by one shared purpose: to help every aspirant evolve and unlock their true potential.
              </p>
              <p>
                From our trainers to our research and development team and support staff, every single member of Team Aspire shows up with dedication, empathy, and an uncompromising sense of responsibility toward every learner in our care.
              </p>
            </div>


          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a237e]/5 border border-[#1a237e]/10 text-[#1a237e] font-semibold text-xs tracking-[0.15em] uppercase mb-8">
                <Users className="h-4 w-4" />
                The Culture We Live
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-[1.1]">
                Shared Purpose.
                <br />
                Shared Standards.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed font-light max-w-md">
                The culture here is deeply cultivated. Collaboration over competition. Learning over hierarchy. Growth over comfort. These are the values we live by every day.
              </p>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
              {coreValues.map((value) => (
                <div
                  key={value}
                  className="rounded-[2rem] bg-white/70 backdrop-blur-sm border border-gray-100 shadow-[0_8px_32px_rgba(31,38,135,0.06)] p-6 md:p-8"
                >
                  <div className="h-12 w-12 rounded-2xl bg-[#eef1ff] text-[#1a237e] flex items-center justify-center mb-5">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">{value}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 relative z-10 border-y border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a237e]/5 text-[#1a237e] font-semibold text-[10px] tracking-[0.2em] uppercase mb-8">
                <BookOpen className="h-4 w-4" />
                Our Trainers
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
                Mentors First.
                <br />
                <span className="text-[#1a237e]">Educators Always.</span>
              </h2>

              <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-light">
                <p>
                  At Aspire Institute, teaching is far more than a profession. It is a calling. A commitment to shaping lives, building futures, and standing beside every aspirant on their journey toward becoming who they are meant to be.
                </p>
                <p>
                  Our trainers are among the most thoughtfully selected educators in the field, not simply for their subject expertise or academic credentials, but for something far harder to measure: their ability to genuinely connect with people.
                </p>
                <p>
                  At Aspire, we believe knowledge transferred without connection rarely transforms. Our trainers understand this deeply.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-5 mb-10">
                {trainerStandards.map((quality, index) => (
                  <div
                    key={quality}
                    className="group relative flex items-start gap-6 p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:border-[#1a237e]/15 hover:shadow-[0_8px_30px_rgb(26,35,126,0.06)] transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a237e] to-[#3949ab] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-3xl"></div>
                    <div className="flex-shrink-0 text-3xl md:text-4xl font-black text-gray-100 group-hover:text-[#c5cae9] transition-colors duration-500 select-none">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="pt-2">
                      <p className="text-lg md:text-xl font-medium text-gray-700 group-hover:text-[#1a237e] leading-snug transition-colors duration-300">
                        {quality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] bg-[#f8f9fc] border border-gray-100 p-8 md:p-10">
                <p className="text-gray-600 text-lg leading-relaxed font-light">
                  Inside every Aspire classroom, the trainer is not merely a facilitator of information. They are a mentor, a guide, and a powerful force of encouragement. Every session is designed to be intellectually stimulating, emotionally supportive, and practically relevant. Every learner receives individual attention, honest feedback, and consistent opportunities to practice, reflect, and grow.
                </p>
                <p className="text-[#1a237e] text-lg md:text-xl font-semibold leading-relaxed mt-6">
                  The goal is simple and powerful: every aspirant who walks into an Aspire programme walks out more confident, more capable, and genuinely future-ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 relative z-10 w-full overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a237e]/5 text-[#1a237e] font-semibold text-[10px] tracking-[0.2em] uppercase mb-8">
                <Microscope className="h-4 w-4" />
                Research & Development
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-8">
                Great Training Does Not Happen By Chance.
                <br />
                <span className="text-[#1a237e]">It Happens By Design.</span>
              </h2>

              <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-light">
                <p>
                  Behind every programme Aspire delivers, behind every module, every methodology, every carefully chosen learning experience, there is a team working tirelessly and invisibly to make it exceptional.
                </p>
                <p>
                  Our Research and Development Department is what makes Aspire Institute genuinely different. While many institutions teach, Aspire continuously studies, questions, refines, and reimagines.
                </p>
                <p>
                  Nothing at Aspire Institute is left to assumption. Every programme is thoughtfully researched, continuously improved, and precisely calibrated to meet the evolving needs of every learner we serve.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {rdFocusAreas.map((area) => (
                  <div
                    key={area}
                    className="rounded-[2rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(26,35,126,0.06)] p-6 md:p-8"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-[#eef1ff] text-[#1a237e] flex items-center justify-center mb-5">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 leading-relaxed">{area}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] p-8 md:p-10 text-white shadow-[0_20px_40px_-15px_rgba(26,35,126,0.3)]">
                <p className="text-lg md:text-xl leading-relaxed font-light">
                  Our R&D team dedicates itself to understanding how people learn, what they need, and what the world increasingly demands of them. Learning patterns, student psychology, emerging skill requirements, and global workforce trends all develop into Aspire&apos;s curriculum.
                </p>
                <p className="text-lg md:text-xl leading-relaxed font-semibold mt-6">
                  At Aspire, The Institute Of Human Development, we design transformative learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10 w-full border-t border-gray-100 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#1a237e]/5 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
              Be Part Of Something
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a237e] to-[#3949ab]">Meaningful.</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light max-w-2xl mx-auto mb-12">
              Because when committed individuals work together with a shared purpose, meaningful learning becomes inevitable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Link href="/careers" className="w-full sm:w-auto">
                <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1a237e] text-white font-bold text-lg rounded-2xl hover:bg-[#283593] shadow-[0_8px_30px_rgb(26,35,126,0.2)] hover:shadow-[0_8px_30px_rgb(26,35,126,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full">
                  <span className="relative z-10">View Open Roles</span>
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/#enquiry" className="w-full sm:w-auto">
                <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-200 text-gray-900 font-bold text-lg rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-300 w-full">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
