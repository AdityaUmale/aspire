import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import { CheckCircle, Globe, MapPin, ArrowRight } from 'lucide-react'; // Using appropriate icons

export default function InternationalWorkshopPage() {
  const courseOutline = [
    'Enhance your cross-cultural management skills.',
    'Experience the brilliance in overseas education.',
    'Get a life-changing experience',
    'Become the eyewitness of your own transformation.',
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
                  src="/iw.jpg" 
                  alt="International Workshop" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
                  <Globe className="h-4 w-4" />
                  <span>International Program</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">International Workshop</h1>
                <p className="mt-2 text-lg italic text-[#3949ab]">&ldquo;Travel far enough, you meet yourself.&rdquo;</p>
              </div>
            </div>

            {/* Introduction Section with Images */}
            <div className="mb-10 space-y-8">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4 prose prose-indigo lg:prose-lg max-w-none">Meet Yourself</h2>
              
              {/* Paragraph 1 with Image 1 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-2/5 flex-shrink-0 order-2 md:order-1">
                  <Image 
                    src="/iw1.jpg" 
                    alt="International Workshop Image 1" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 order-1 md:order-2 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    Traveling is NOT just a journey where you visit places, learn new language, see different cultures and update your social media. When it comes to Meet Yourself, traveling is indeed a journey right within, where you learn about yourself. The moments of self-reflection helps you to understand yourself better, and find a better version of yourself.
                  </p>
                  <p>
                    You&apos;ll meet the real you, hidden somewhere on the roads you would travel. This experience comes by crossing the borders that certainly improves and develops the horizon, and also enlarges the view of developing globally.
                  </p>
                </div>
              </div>

              {/* Paragraph 2 with Image 2 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                 <div className="w-full md:w-2/5 flex-shrink-0 order-2">
                   <Image 
                    src="/iw2.jpg" 
                    alt="International Workshop Image 2" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                 </div>
                <div className="w-full md:w-3/5 order-1 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    Here is an overseas program &ldquo;Meet Yourself&rdquo; to gain the excellent global experience. Since 2013 Aspire has been hosting this training program in different countries like Singapore, Malaysia, Thailand, Dubai and Qatar. Through Meet Yourself ASPIRE provides a platform for students to seize the opportunities. Meet yourself is a well-designed course for change seekers. This training program helps participants to reveal opinions about themselves, and views about themselves and it helps to create a positive self-image.
                  </p>
                </div>
              </div>
              
              {/* Paragraph 3 */}
              <div className="prose prose-indigo lg:prose-lg max-w-none">
                <p>
                  Participants learn to start the journey of self-discovery. It deals with factors causing success: Thoughts, Attitude, Karma, Influence, Eternal Positivity, Communication, Self Analysis, and Learning Dexterity. This training program is all about common people looking for uncommon results and a unique career advancement opportunity. It&apos;s a perfect training program for those who are seeking to develop their highest potential. The participants are taught leadership, values, confidence-building, and special sessions by the experts of the institute and by our international faculty members to explore English and foreign culture.
                </p>
              </div>
            </div>

            {/* Course Outline Section */}
            <div className="mb-12"> 
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5">Outline</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3">
                {courseOutline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                    <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Pin Section - Optional */}
            <div className="mt-10 pt-6 border-t border-gray-200/80 flex items-center justify-center gap-2 text-[#3949ab]">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Singapore • Malaysia • Thailand • Dubai • Qatar</span>
            </div>

            {/* CTA Section */}
            <div className="mt-12 pt-8 border-t border-gray-200/80">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Ready for Global Learning?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Experience transformative learning experiences across international locations. Contact us to join our International Workshop.
                </p>
                <Link href="/#enquiry">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a237e] hover:bg-[#0d1642] text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-[#1a237e]/20 hover:shadow-xl hover:shadow-[#1a237e]/30 hover:-translate-y-1">
                    <span>Reserve Your Spot</span>
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