import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { CheckCircle, GraduationCap } from 'lucide-react'; // Using GraduationCap icon

export default function TeachersTrainingProgramPage() {
  const courseOutline = [
    'Principles of Teaching and learning',
    'Fundamentals of education',
    'Classroom Management',
    'Constructive lesson plan development',
    'Active learning',
    'Students Psychology',
    'Positive Appreciation',
    'Student Engagement',
    'Effective communication skills',
    'Mastery over English language',
    'Encouraging atmosphere of class',
    'Creative teaching methods',
  ];

  const programBenefits = [
    'Through this program Teachers understand from the perspective of the student as to what would make a classroom session significantly more intriguing.',
    'Through this program we provide the teaching techniques which can easily and effectively be applied in the classroom.',
    'Through this program we aim at developing quality and capable teachers.',
    'Through this program we help adopt the correct procedures, so you as a teacher can gain student’s confidence and help them learn more effectively.',
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
                  src="/ttp.jpg" // Using provided image
                  alt="Teachers Training Program" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
                  <GraduationCap className="h-4 w-4" />
                  <span>Training Program</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">Teachers Training Program</h1>
                <p className="mt-2 text-lg text-[#3949ab]">Be Not A Teacher But A Mentor</p>
              </div>
            </div>

            {/* Introduction Section with Image */}
            <div className="mb-10 space-y-8">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4 prose prose-indigo lg:prose-lg max-w-none">Introduction</h2>
              
              {/* Paragraph 1 with Image */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-2/5 flex-shrink-0 order-2 md:order-1">
                  <Image 
                    src="/pdc1.jpg" // Using provided image
                    alt="Teacher Training Image" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 order-1 md:order-2 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    Teachers are valuable assets of modern society and develop the future of the next generation. However, there is a well-documented shortage of quality teachers across educational institutions in the country. We have explored the best way to address this shortage and that is teacher training programs, with the aim of developing typical teachers into proficient, resourceful and skillful teachers. Our effective teacher training program will help the teachers in staying updated on the latest methods and processes being followed in the classroom.
                  </p>
                </div>
              </div>

              {/* Paragraph 2 */}
              <div className="prose prose-indigo lg:prose-lg max-w-none">
                <p>
                  Over the years of dedicated research done by research and development team, Aspire has invented the best in class training for teachers. We believe that learning and teaching depend largely on one another. The teacher training program aims at improving the teaching and training practices. It helps the teachers to understand the psychology of individual students to teach them better. We avoid the traditional methods of teaching. Aspire has discovered creative ways to lead the class successfully.
                </p>
              </div>

              {/* Program Benefits List */}
              <div className="prose prose-indigo lg:prose-lg max-w-none">
                <ul className="list-disc space-y-2 pl-5">
                  {programBenefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Course Outline Section */}
            <div className="mb-12"> 
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5">Outline</h2>
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