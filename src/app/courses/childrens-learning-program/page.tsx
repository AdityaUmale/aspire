import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { CheckCircle, Baby, Clock, Users, BookOpen, Smile, Star } from 'lucide-react'; 

export default function ChildrensLearningProgramPage() {
  const sscComponents = [
    'English Language For kids',
    'Public Speaking For Kids',
    'Social Skills For Kids',
    'Personality Development For Kids',
  ];

  const outlineEnglish = [
    'Sentences Formation Activities (SFA)',
    'Language Improvement Games (LIG)',
    'Vocabulary Building Activities(VBA)',
    'Social English Conversations (SEC)',
    'Daily Used Phrases, Expressions, Phrasal Verbs And Idioms(PEPI)',
    'Audio segment (AUS)',
    'Movie and video Based Learning (MVBL)',
    'Phonics Training (FCT)',
  ];

  const outlinePublicSpeaking = [
    'Self Introduction',
    'Active listening',
    'Public Speaking Assignments',
    'Stage Fear',
    'Tips on Body language',
    'Personal Experience Sharing',
    'Storytelling',
    'Speech preparation',
    'Types of speeches',
    'Body language',
    'Confidence building',
  ];

  const outlineSocialSkills = [
    'General Manners',
    'Sharing and cooperation',
    'Learn greetings',
    'Group Activities',
    'Fun and engaging projects',
    'Group discussion',
    'Personal hygiene',
    'Team work',
    'Initiative taking',
    'Etiquettes for kids',
    'Communicating needs',
    'Social and emotional development',
  ];
  
  // Assuming the remaining points fall under Personality Development based on intro
  // Note: The provided outline didn't explicitly group the last set of points.
  // If specific points belong elsewhere, please let me know.

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
                  src="/elt.jpg" // Using the specified image
                  alt="Children's Learning Program" 
                  width={150} 
                  height={150} 
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                {/* Replaced Child with Baby in the component usage */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8eaf6]/70 text-[#1a237e] rounded-full text-sm font-medium mb-3">
                  <Baby className="h-4 w-4" /> 
                  <span>Program for Kids</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a237e]">Children’s Learning Program (SSC)</h1>
              </div>
            </div>

            {/* SSC Details Section */}
            <div className="mb-10 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <h3 className="text-lg font-semibold text-[#1a237e] mb-3">Summer Special Course (SSC) Details:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#3949ab]" />
                  <span><span className="font-medium">Age Group:</span> 8-12 Years old</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#3949ab]" />
                  <span><span className="font-medium">Duration:</span> 1 Month</span>
                </div>
              </div>
              <h4 className="text-md font-semibold text-[#1a237e] mt-4 mb-2">Core Components:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 pl-1">
                {sscComponents.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Introduction Section */}
            <div className="mb-10 prose prose-indigo lg:prose-lg max-w-none prose-headings:text-[#1a237e] prose-a:text-[#3949ab] hover:prose-a:text-[#0d1642] prose-strong:text-gray-800">
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-4">Introduction of SSC</h2>
              <p>
                Here after a great research on the developmental needs of kids during the age 8-12, we are presenting Summer Special Course for children. This course mainly focuses over the four unavoidable learning which every child should acquire at early age I.e. English Language, Public Speaking, Social Skills and Personality Development.
              </p>
              <p>
                 We have been teaching English language in India for more than 12 years. Our English language segment gives young learners confidence and skills to get mastery over English language. We have developed an encouraging culture that allows children to commit mistakes and take free efforts when their English is not just up to the mark. Our methodologies help them to discover that, learning English is very easy. For English Language we provide a variety of training according to the level of your child.
              </p>
              <p>
                 Besides, we have a uniquely designed Public Speaking lessons in SSC for your children to make them look Super-Confident. Your child may be an outstanding performer in studies however the fact that can’t be denied is the same child may be left behind just because of not being able to express in public. The prior your child starts the greater and the remarkable results you see. Children might easily overcome public speaking fear by getting the training and lessons on it early in their lives. We aim at making public speaking for children a joy rather than fear.
              </p>
              <p>
                 In addition to English language training and Public speaking we provide Social skills training and personality development for your children. Social skills give children a wide range of benefits. They are linked to greater success in school and better relationships with peers. Social skills are skills that can be learned and strengthened with effort and practice through our SSC. We mainly focus on the skills we use every day to interact and communicate with others.
              </p>
              <p>
                 Ultimately transform your child’s personality through SSC. We believe every child has a unique personality he is born with, but the surroundings the child is raised in also play a major role in shaping the personality. We train them at a young age, to groom them into strong and confident youngsters. Our research says, Children do not pick up values from endless lectures, but from mirroring your behavior. Therefore, we have the best methodology that makes them follow the right lessons at the right age for the everlasting positive change in to their personalities. From methodology to resources we seek the growth of our young learners.
              </p>
            </div>

            {/* Course Outline Section - Grouped */}
            <div className="mb-12 space-y-6"> 
              <h2 className="text-2xl font-semibold text-[#1a237e] mb-5">Course Outline</h2>
              
              {/* English Language Outline */}
              <div>
                <h3 className="text-lg font-semibold text-[#3949ab] mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5"/>English Language</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {outlineEnglish.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                      <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Public Speaking Outline */}
              <div>
                <h3 className="text-lg font-semibold text-[#3949ab] mb-3 flex items-center gap-2"><Star className="h-5 w-5"/>Public Speaking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {outlinePublicSpeaking.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                      <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Skills Outline */}
              <div>
                <h3 className="text-lg font-semibold text-[#3949ab] mb-3 flex items-center gap-2"><Smile className="h-5 w-5"/>Social Skills & Personality Development</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {outlineSocialSkills.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-md border border-gray-200/70">
                      <CheckCircle className="h-5 w-5 text-[#3949ab] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                  {/* Note: Personality Development points could be added here if separated */}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}