import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Target, CheckCircle, ArrowRight } from 'lucide-react'; // Using Target icon for personality development

export default function PersonalityDevelopmentPage() {
  const courseOutline = [
    'Interpersonal skill',
    'Grooming',
    'Life management',
    'Goal setting',
    'Decision making',
    'Body language',
    'Corporate etiquette',
    'Positive thought process',
    'Common sense',
    'Stress management',
    'Healthy relationship',
    'Confidence building',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
      <Navbar />
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] mix-blend-soft-light -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-gradient-radial from-[#3949ab]/10 to-transparent blur-3xl -z-10"></div> {/* Adjusted position */}

      <main className="flex-1 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Themed Content Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200/60">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 border-b border-gray-200/80 pb-6">
              <div className="flex-shrink-0">
                <Image 
                  src="/pdc.jpg" 
                  alt="Personality Development Program" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#3949ab] rounded-full text-sm font-medium mb-3"> {/* Adjusted color */}
                  <Target className="h-4 w-4" />
                  <span>Course</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">Personality Development Program (PDP)</h1>
              </div>
            </div>

            {/* Introduction Section with Interspersed Images */}
            <div className="mb-10 space-y-8">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4 prose prose-indigo lg:prose-lg max-w-none">Introduction</h2>
              
              {/* Paragraph 1 (No Image) */}
              <p className="prose prose-indigo lg:prose-lg max-w-none">
                Knowing and exploring about oneself is personality development. We believe it is not just about one&apos;s outer appearance which is visible; it is more about inner self. It&apos;s about thoughts, feelings and behaviors that differentiate individual from one another. It is real development of the mind and behavior. You&apos;ll learn to do introspection and self development for everlasting change as the lessons reverberate confidence, enthusiasm, and serenity.
              </p>
              
              {/* Paragraph 2 with Image 1 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-2/5 flex-shrink-0 order-2 md:order-1">
                  <Image 
                    src="/pdc1.jpg" 
                    alt="Personality Development Image 1" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 order-1 md:order-2 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    Personality Development Course is one of the highly sought courses of Aspire. It enables participants to enrich and develop the quality of thoughts which eventually leads to successful life. This course mainly focuses on empowering participants to overcome obstacles, to face the fears, to inculcate the positive thoughts while eradicating the negative ones, to chase the greater goals and to learn social skills. We offer an experience of interactive classroom training with a focus on building an effective personality by bringing transformation in the mind.
                  </p>
                </div>
              </div>

              {/* Paragraph 3 (No Image) */}
              <p className="prose prose-indigo lg:prose-lg max-w-none">
                This training program enables students to explore more about their talent, abilities and trait of the personality. You&apos;ll ultimately learn to become the best version of yourself. You&apos;ll discover the way to listen to your instinct and follow it. This course provides you an attitude to find the opportunities in adversities. You&apos;ll unleash your hidden potential through the lessons of self-discovery. PDC will certainly help you embrace yourself, your weakness and strengths and It will certainly facilitate you get control over anxiety, depression, stress emotions and comparison. This program will also help you develop a practical action plan for continued development and will provide you the strategy to be doer.
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
                <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Ready to Transform Yourself?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Discover your true potential and build the personality you&apos;ve always dreamed of. Contact us to enroll in our Personality Development Program.
                </p>
                <Link href="/#enquiry">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a237e] hover:bg-[#0d1642] text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-[#1a237e]/20 hover:shadow-xl hover:shadow-[#1a237e]/30 hover:-translate-y-1">
                    <span>Get Started Today</span>
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