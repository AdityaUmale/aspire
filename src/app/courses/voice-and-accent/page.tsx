import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { CheckCircle, Mic, Briefcase, ArrowRight } from 'lucide-react'; // Using Mic and Briefcase icons

export default function VoiceAndAccentPage() {
  const voiceAccentOutline = [
    'Articulation Exercises',
    'MTI',
    'Sounds',
    'Voice Clarity',
    'The Sound Drills',
    'Tone of Voice',
    'International Phonetic Alphabet (phonetic Notion)',
    'Intonation',
    'English Accents around the world',
  ];

  const corporateTopics = [
    'Sales Training',
    'Customer Dealing and Handling',
    'Time Management and Productivity',
    'Business Ethics',
    'Corporate Manners and Etiquettes',
    'Conflict Management',
    'Team Work',
    'Team Communication',
    'Work-Life Balance',
    'Stress Management Leadership Development',
    'Coaching Skills for Leaders',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
      <Navbar />
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] mix-blend-soft-light -z-10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-gradient-radial from-[#e8eaf6]/10 to-transparent blur-3xl -z-10"></div>

      <main className="flex-1 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Themed Content Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200/60">
            {/* Header Section (No specific image provided, adjust if needed) */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 border-b border-gray-200/80 pb-6">
              {/* Optional Image Placeholder 
              <div className="flex-shrink-0">
                <Image 
                  src="/placeholder-voice.jpg" // Replace with actual image if available
                  alt="Voice & Accent Training" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              */}
              <div className="text-center md:text-left w-full"> {/* Adjusted for no image */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
                  <Mic className="h-4 w-4" />
                  <span>Training</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">Voice & Accent Training</h1>
              </div>
            </div>

            {/* Introduction Section with Interspersed Images */}
            <div className="mb-10 space-y-8">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4 prose prose-indigo lg:prose-lg max-w-none">Introduction</h2>
              
              {/* Paragraph 1 with Image 1 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-2/5 flex-shrink-0 order-2 md:order-1">
                  <Image 
                    src="/pdc1.jpg" // Using provided image
                    alt="Voice Training Image 1" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 order-1 md:order-2 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    Every time it’s not about what you speak it’s also about how you speak. Aspire The Institute Of Human Development Presents the uniquely designed Voice & Accent Training Program that helps learners to speak neutral English. This training module is an antidote over your pronunciations, MTI, sounds, intonation and accents problem. Through our voice and accents training program, you can identify your level and learn to improve accordingly. We believe your professional success will depend on your speaking skills. Our training program focuses on very specific need and trains you to get a neutral ENGLISH accent. It is said that, The sharper and more skilled you are with your pronunciations & accent, the easier and more effective your language is. This training helps you to sound like a native speaker.
                  </p>
                </div>
              </div>

              {/* Neutral Accent Section */}
              <div className="prose prose-indigo lg:prose-lg max-w-none">
                <h3 className="text-xl font-semibold text-[#1a237e]">What is Neutral English Accent?</h3>
                <p>
                  Neutral Accent is nothing but globally understandable and comprehensible English. Our priority is to remove the mother tongue influence and reach a level where our learners are being understood globally. Being clearly understood is the most obvious benefit of neutral accent training, however having the self-reliance to express your views and make yourself heard is of equal importance. We are glad that, we help learners cover both the aspects.
                </p>
              </div>

              {/* Who is it for Section with Image 2 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                 <div className="w-full md:w-2/5 flex-shrink-0 order-2">
                   <Image 
                    src="/psc1.jpg" // Using provided image
                    alt="Voice Training Image 2" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                 </div>
                <div className="w-full md:w-3/5 order-1 prose prose-indigo lg:prose-lg max-w-none">
                  <h3 className="text-xl font-semibold text-[#1a237e]">Who is it for?</h3>
                  <p>
                    Voice training is for anyone who desires to speak polished accent who is keen to master neutral accent who is looking for a career in this language like BPO & KPO call centers, English teachers & lectures, Who are doing PHD in English and as per below.
                  </p>
                </div>
              </div>
            </div>

            {/* Voice & Accent Outline Section */}
            <div className="mb-12"> 
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5">Voice & Accent Outline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {voiceAccentOutline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                    <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Corporate Training Topics Section */}
            <div className="mb-12"> 
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5 flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                <span>Corporate Training Topics</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {corporateTopics.map((item, index) => (
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
                <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Ready to Perfect Your Voice?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Master your voice modulation and accent for better communication. Contact us to enroll in our Voice & Accent training program.
                </p>
                <Link href="/#enquiry">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a237e] hover:bg-[#0d1642] text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-[#1a237e]/20 hover:shadow-xl hover:shadow-[#1a237e]/30 hover:-translate-y-1">
                    <span>Start Your Journey</span>
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