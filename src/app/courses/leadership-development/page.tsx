import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Users, CheckCircle } from 'lucide-react';

export default function LeadershipDevelopmentPage() {
  const courseOutline = [
    'Leadership in crisis',
    'Principles of Leadership',
    'Team Building',
    'Vision Creation',
    'Leadership styles',
    'Powerful Leadership Language',
    'Micro planning and Macro planning',
    'Networking',
    'Conflict management',
    'Ethical Leadership',
    'Engaging strengths',
    'Law of adaptability',
    'Developing administrative skills',
    'Path goal theory',
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
                  src="/ldp.jpg" 
                  alt="Leadership Development Program" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
                  <Users className="h-4 w-4" />
                  <span>Course</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">Leadership Development Program (LDP)</h1>
              </div>
            </div>

            {/* Introduction Section - Refactored with Flexbox */}
            <div className="mb-10 space-y-8"> {/* Added space-y for vertical spacing */}
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4 prose prose-indigo lg:prose-lg max-w-none">Introduction</h2>
              
              {/* Paragraph 1 (No Image) */}
              <p className="prose prose-indigo lg:prose-lg max-w-none">
                For us Leadership Development is all about expanding the capacity of individuals to discover a leader in them or to perform leadership roles within organizations, for the betterment of Life and for career advancement. The world believes Leadership matters today. Our highly researched lessons of Leadership give the right turn to the careers and largely the existence of the participants. We strive to develop your functional expertise and enhance strategic planning throughout leadership development program.
              </p>
              
              {/* Paragraph 2 with Image 1 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-2/5 flex-shrink-0 order-2 md:order-1">
                  <Image 
                    src="/ldp1.jpg" 
                    alt="Leadership Development Image 1" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 order-1 md:order-2 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    We work on the development of Leaders at all stages from bottom to the top. Our Leadership lessons are designed to the specific requirements and environment of each Organization. These LDP lessons are for long-term leaderships at individual and organizational levels. Learn and grow your leadership with the uniquely nevertheless practically designed course.
                  </p>
                </div>
              </div>

              {/* Paragraph 3 with Image 2 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                 <div className="w-full md:w-2/5 flex-shrink-0 order-2">
                   <Image 
                    src="/lpd2.jpg" 
                    alt="Leadership Development Image 2" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                 </div>
                <div className="w-full md:w-3/5 order-1 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    The LDP will provide you insights to know yourself and will give you tools and skills to become a better leader. Participants here learn all the necessary skill set and awareness as they realize their potential and roles during this program. LDP is Topical and highly interactive, it prepares you to strengthen your leadership at individual level and also improves organizations performance.
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