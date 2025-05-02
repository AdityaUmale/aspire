import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { BookOpen, CheckCircle } from 'lucide-react'; // Using BookOpen icon for public speaking

export default function PublicSpeakingPage() {
  const courseOutline = [
    'Pausing',
    'Active listening',
    'Storytelling',
    'Principles of Public Speaking',
    'Public Speaking Assignments',
    'Fear of Public Speaking / Stage Fear',
    'Voice culture',
    'Audience Analysis',
    'Body language',
    'Power of words',
    'Public Speaking ethics',
    'Speech preparation',
    'Communication process',
    'Speech Pace',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
      <Navbar />
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] mix-blend-soft-light -z-10"></div>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-radial from-[#c5cae9]/10 to-transparent blur-3xl -z-10"></div> {/* Adjusted position */}

      <main className="flex-1 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Themed Content Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200/60">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 border-b border-gray-200/80 pb-6">
              <div className="flex-shrink-0">
                <Image 
                  src="/public-speaking.jpg" 
                  alt="Public Speaking Course" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
                  <BookOpen className="h-4 w-4" />
                  <span>Course</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">Public Speaking Course</h1>
              </div>
            </div>

            {/* Introduction Section with Interspersed Images - Adjusted Layout */}
            <div className="mb-10 space-y-8">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4 prose prose-indigo lg:prose-lg max-w-none">Introduction</h2>
              
              {/* Paragraph 1 with Image 1 */}
              {/* Removed items-start from the flex container below */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/5 flex-shrink-0 order-2 md:order-1">
                  <Image 
                    src="/psc.jpg" 
                    alt="Public Speaking Image 1" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 order-1 md:order-2 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    Public Speaking is the finest course designed by Aspire which avails you to know public speaking with a practical approach that makes you look Super-Confident. It gives you an ability to stand fearlessly on the stage and to voice your ideas to influence people. Everyone with this course can easily overcome public speaking fear by getting the training and lessons on it. We aim at making public speaking a joy rather than fear. It enables you to improve the quality of your thoughts and presentations. The lessons of public speaking help you speak effectively and discover an impressive speaker in yourself. We believe Public Speaking is a fearless process of the mind to inspire, inform or encourage audience. This course mainly focuses on individual growth. This program will train you to lead a team, a meeting, a conference or a class. It trains you to overcome nervousness and perform exceptionally well. It makes you able to represent your company or an organization in an effective way.
                  </p>
                </div>
              </div>

              {/* Paragraph 2 with Image 2 */}
              {/* Removed items-start from the flex container below */}
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="w-full md:w-2/5 flex-shrink-0 order-2">
                   <Image 
                    src="/psc1.jpg" 
                    alt="Public Speaking Image 2" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                 </div>
                <div className="w-full md:w-3/5 order-1 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    This course will advance your career and create countless opportunities. This program will certainly boost your self-confidence. Public speaking kills stage fear. It will enhance your talent to inspire others and will also make you look presentable.
                  </p>
                </div>
              </div>
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

          </div>
        </div>
      </main>
    </div>
  );
}