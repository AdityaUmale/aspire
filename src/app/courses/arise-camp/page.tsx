import React from 'react';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import { CheckCircle, Tent, Languages, Sparkles, Users } from 'lucide-react'; // Changed Campfire to Tent

export default function AriseCampPage() {
  const languageFocusOutline = [
    'Introduction to organic way of learning English Language',
    'Listening and Speaking Exercises',
    'Vocabulary Building Activities',
    'Sentence Structure Exercises',
    'Verbal Presentation Techniques',
    'Drama Sessions',
    'Song Sessions',
    'Educational videos and language Games',
  ];

  const selfAwarenessOutline = [
    'Group activities to build empathy & creativity',
    'Interactive Group Games',
    'Inspiring Talks',
    'Self-Reflection Practices',
    'Open Mic Debates & Discussions',
    'Camp Fire',
    'High Energy Activities To Build Confidence',
    'Break through communication barriers',
    'Team Building Activities',
    'Leadership Development Activities',
    'Presentations and Stage Performances',
  ];

  const culturalExchange = [
    'Meeting with people from different cultures and backgrounds.',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
      <Navbar />
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] mix-blend-soft-light -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-gradient-radial from-[#3949ab]/10 to-transparent blur-3xl -z-10"></div>

      <main className="flex-1 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Themed Content Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200/60">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 border-b border-gray-200/80 pb-6">
              <div className="flex-shrink-0">
                <Image 
                  src="/arise.jpg" // Using provided image
                  alt="ARISE Camp" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
  <Tent className="h-4 w-4" /> 
  <span>Residential Camp</span>
</div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">ARISE - Language & Thoughts Enrichment Camp</h1>
                <p className="mt-2 text-lg text-[#3949ab]">(3 DAYS RESIDENTIAL CAMP)</p>
              </div>
            </div>

            {/* Inspiration Section */}
            <div className="mb-10 prose prose-indigo lg:prose-lg max-w-none prose-headings:text-[#1a237e]">
              <h2 className="text-2xl font-semibold mb-4">Inspiration</h2>
              <p>
                Our inspiration behind the Arise Language And Thoughts Enrichment Camp is the world renowned Viswa Bharati University (Shantineketan), It is established by Shri Rabindranath Tagore in 1921. Tagore&apos;s idea on education was that every person is genius and that all students may not bloom at the same time. This perspective inspired us to create Arise Camp, where we can stimulate learners to fully develop their potential. The first ARISE camp was held in year 2012. & This revolution is still on.
              </p>
            </div>

            {/* Introduction Section with Images */}
            <div className="mb-10 space-y-8">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4 prose prose-indigo lg:prose-lg max-w-none">Introduction</h2>
              
              {/* Paragraph 1 with Image 1 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-2/5 flex-shrink-0 order-2 md:order-1">
                  <Image 
                    src="/arise1.jpg" // Using provided image
                    alt="Arise Camp Activity 1" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-3/5 order-1 md:order-2 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    The ARISE Residential Camp is a 3-day program dedicated to enriching language and thoughts. At Arise, we provide campers with an organic way of learning the English language. Our environment motivates enthusiastic participation and encourages mistakes, hence allowing learners to try wholeheartedly. Our training methods assist them in realising how easy learning the language can be. No matter where the campers originate from, what their age group is, or the type of profession they come from, ARISE offers a perfect platform to explore their affinity for the English language. The thoughtfully crafted sessions and modules are adapted to each participant’s unique level of proficiency in language skills, presenting material ranging from sentences formation, idioms, videos, audio clips, language games, slang expressions, story sections and improvisation activities.
                  </p>
                </div>
              </div>

              {/* Paragraph 2 with Image 2 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                 <div className="w-full md:w-2/5 flex-shrink-0 order-2">
                   <Image 
                    src="/arise2.jpg" // Using provided image
                    alt="Arise Camp Activity 2" 
                    width={350} 
                    height={233} 
                    className="rounded-lg shadow-md border border-gray-200/60 w-full h-auto object-cover"
                  />
                 </div>
                <div className="w-full md:w-3/5 order-1 prose prose-indigo lg:prose-lg max-w-none">
                  <p>
                    In addition to language improvement, our thought enrichment training emphasises self-awareness and confidence building through interactive sessions. Campers will learn how to identify pessimistic thoughts, barriers to self-growth, as well as be equipped with the necessary tools for a practical action plan towards self-improvement. Campers will learn to do introspection and self-development for everlasting change as the lessons reverberate confidence, enthusiasm, and serenity. Through interactive training, we empower campers to conquer obstacles and achieve their dreams while identifying what triggers their negative feelings.
                  </p>
                </div>
              </div>
              
              {/* Paragraph 3 */}
              <div className="prose prose-indigo lg:prose-lg max-w-none">
                <p>
                  In nutshell, ARISE Camp enables campers to Learn social English and explore more about their talent, abilities, and area of interest. Campers ultimately learn to become the best version of themselves.
                </p>
              </div>
            </div>

            {/* Course Outline Section - Grouped */}
            <div className="mb-12 space-y-6"> 
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5">Outline</h2>
              
              {/* Language Focus Outline */}
              <div>
                <h3 className="text-lg font-semibold text-[#3949ab] mb-3 flex items-center gap-2"><Languages className="h-5 w-5"/>Language Focus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {languageFocusOutline.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                      <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Self Awareness Focus Outline */}
              <div>
                <h3 className="text-lg font-semibold text-[#3949ab] mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5"/>Self Awareness Focus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {selfAwarenessOutline.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                      <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Exchange Outline */}
              <div>
                <h3 className="text-lg font-semibold text-[#3949ab] mb-3 flex items-center gap-2"><Users className="h-5 w-5"/>Cultural Exchange</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {culturalExchange.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                      <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Conclusion Section */}
            <div className="mt-10 pt-6 border-t border-gray-200/80 prose prose-indigo lg:prose-lg max-w-none">
               <p>
                 In conclusion, ARISE Residential Camp is a great way to help build language, thought processes and confidence in campers. Furthermore, camp activities are designed to enhance their communication abilities while enriching their social connections and better understanding of themselves.
               </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}