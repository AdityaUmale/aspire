import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { CheckCircle, Lightbulb, Clock } from 'lucide-react'; // Using Lightbulb icon

export default function EntrepreneurshipDevelopmentPage() {
  const keyConcepts = [
    'Maslow’s Theory',
    'Herjburh’s Theory',
    'MCGragor’s Theory',
    'Achievement Theory (Mcclelland’s Need)',
    'Developing a business model',
    'Exploring Business opportunity',
    'Growth Mindset',
    'Concepts of entrepreneurship',
    'Myths about entrepreneurs and entrepreneurship',
    'Idea /generation',
    'Idea Evaluation',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
      <Navbar />
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] mix-blend-soft-light -z-10"></div>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-radial from-[#c5cae9]/10 to-transparent blur-3xl -z-10"></div>

      <main className="flex-1 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Themed Content Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200/60">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 border-b border-gray-200/80 pb-6">
              <div className="flex-shrink-0">
                <Image 
                  src="/edp.jpg" // Using provided image
                  alt="Entrepreneurship Development Program" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
                  <Lightbulb className="h-4 w-4" />
                  <span>Development Program</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">Entrepreneurship Development</h1>
              </div>
            </div>

            {/* Introduction Section with Image */}
            <div className="mb-10 space-y-8">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4 prose prose-indigo lg:prose-lg max-w-none">Introduction</h2>
              
              {/* Paragraph 1 with Image */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-2/5 flex-shrink-0 order-2 md:order-1">
                  <Image 
                    src="/edp1.jpg" // Using provided image
                    alt="Entrepreneurship Image" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 order-1 md:order-2 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    Entrepreneurship development at Aspire is all about enhancing the knowledge and skill of entrepreneurs through several classroom training and programs. We look for strengthening the youth in order to increase the number of entrepreneurs in India. We believe an entrepreneur is an individual with a creative idea to initiate and establish a new venture.
                  </p>
                </div>
              </div>

              {/* Paragraph 2 */}
              <div className="prose prose-indigo lg:prose-lg max-w-none">
                <p>
                  We develop the entrepreneurial abilities in this course. We aim at individuals who want to start or possibly expand a business. Entrepreneurship development focuses on enhancing the ideas and potential of an entrepreneur. We provide an easy yet detailed methodology that will help entrepreneurs improve in the short and long-run. You will learn to successfully exploit the local market. In this training program explore the process of designing, launching and running a business.
                </p>
              </div>
            </div>

            {/* Key Concepts Section */}
            <div className="mb-12"> 
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5">Key Concepts & Theories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {keyConcepts.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                    <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outline Placeholder Section */}
            <div className="mb-12 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-3 flex items-center justify-center gap-2">
                <Clock className="h-6 w-6" />
                <span>Course Outline</span>
              </h2>
              <p className="text-gray-600 italic">Detailed outline coming soon.</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}