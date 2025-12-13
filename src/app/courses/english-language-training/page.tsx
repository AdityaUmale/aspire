import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Languages, CheckCircle, GraduationCap, ArrowRight } from 'lucide-react'; // Using Languages icon

export default function EnglishLanguageTrainingPage() {
  const courseLevels = [
    { category: 'English Language', level: 'L-1 Pre Basic' },
    { category: 'English Language', level: 'L-2 Basic' },
    { category: 'English Language', level: 'L-3 Intermediate' },
    { category: 'English Language', level: 'L-4 Advanced' },
    { category: 'English Language', level: 'L-5 Proficient' },
    { category: 'English For Kids', level: 'L-1 Basic (Age 8 to 12)' },
    { category: 'English For Kids', level: 'L-2 Intermediate (Age 8 to 12)' },
    { category: 'English For Kids', level: 'L-3 Advanced (Age 8 to 12)' },
    { category: 'Functional English', level: 'L-1' },
    { category: 'Functional English', level: 'L-2' },
  ];

  const courseOutline = [
    'Sentences Formation Activities (SFA)',
    'Language Improvement Games (LIG)',
    'Vocabulary Building Activities(VBA)',
    'Structured Activities For Language Enhancement (SALE)',
    'Article/Magazines/Blogs Based Learning (AMB)',
    'Social English Conversations (SEC)',
    'Real English Lessons(REL)',
    'Personal Experience Sharing (PRS)',
    'Mother Tongue influence(MTI)',
    'Daily Used Phrases, Expressions, Phrasal Verbs And Idioms (PEPVI)',
    'Talk Shows (TSH)',
    'Role Plays(RPL)',
    'Story Segment (SSE)',
    'Audio segment (AUS)',
    'Video Based Learning (VBL)',
    'Group Activities (GAC)',
    'Sounds And Phonics(SAP)',
    'Clichés And Hyperbole(CAH)',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
      <Navbar />
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] mix-blend-soft-light -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-radial from-[#1a237e]/10 to-transparent blur-3xl -z-10"></div>

      <main className="flex-1 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Themed Content Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200/60">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 border-b border-gray-200/80 pb-6">
              <div className="flex-shrink-0">
                <Image 
                  src="/elt.jpg" 
                  alt="English Language Training" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
                  <Languages className="h-4 w-4" />
                  <span>Course</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">English Language Training</h1>
              </div>
            </div>

            {/* Course Levels Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5 flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                <span>Course Levels Offered</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseLevels.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50/50 rounded-md border border-gray-200/70 text-center shadow-sm">
                    <p className="text-sm font-medium text-[#3949ab]">{item.category}</p>
                    <p className="text-gray-700 text-xs mt-1">{item.level}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Introduction Section */}
            <div className="mb-10 prose prose-indigo lg:prose-lg max-w-none prose-headings:text-[#1a237e] prose-a:text-[#3949ab] hover:prose-a:text-[#0d1642] prose-strong:text-gray-800">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4">Introduction</h2>
              <p>
                We have been teaching English language in India for more than 14 years. These English language courses give language learners confidence and skills to get mastery over English language. We train language learners using a natural way of teaching language. We have developed an encouraging culture that allows learners to commit mistakes and take free efforts when their English is just average. Our methodologies help learners to discover that, learning English is very easy. We have a range of 14 courses to suit your language learning needs. No matter you come from any age group and any profession, it&apos;s the right unit of English language courses to unleash your love for English language. We provide a variety of training according to the levels. From methodology to resources we seek the growth of our learners. The syllabus includes activities, stories, audios, videos and games to improve English.
              </p>
            </div>

            {/* Course Outline Section */}
            <div className="mb-12"> 
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5">Course Outline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {courseOutline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                    <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 pt-8 border-t border-gray-200/80">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Ready to Master English?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Improve your English language skills and open up new opportunities. Contact us to enroll in our English Language Training program.
                </p>
                <Link href="/#enquiry">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a237e] hover:bg-[#0d1642] text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-[#1a237e]/20 hover:shadow-xl hover:shadow-[#1a237e]/30 hover:-translate-y-1">
                    <span>Start Learning Today</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}