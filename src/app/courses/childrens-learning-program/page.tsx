import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Baby, Clock, Users, ArrowRight, Award, CheckCircle } from 'lucide-react';

export default function ChildrensLearningProgramPage() {
  const outlineEnglish = [
    'Building sentences that actually make sense',
    'Playing with language to make it stick',
    'Growing the words you use every day',
    'Conversations that sound natural, not textbook',
    'Phrases, idioms and expressions real people use',
    'Training your ear with audio-based learning',
    'Learning English through stories and real content',
    'Getting your pronunciation right from the ground up',
  ];

  const outlinePublicSpeaking = [
    'Introducing yourself with confidence',
    'The art of listening',
    'Speaking assignments',
    'Turning stage fear into stage presence',
    'Using the right body language',
    'The craft of telling a story',
    'Walking in prepared every single time',
    'Building the confidence to hold any room',
  ];

  const outlineSocialSkills = [
    'The basics of being social skills',
    'Learning to give, share and collaborate naturally',
    'Working well with others in any setting',
    'Hands-on projects that make learning feel like fun',
    'Showing up well in every situation',
    'Being a team player',
    'Asking for help and helping others',
    'Emotional Intelligence',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]"></div>
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#c5cae9]/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#c5cae9]/10 to-transparent blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <Baby className="h-4 w-4 text-[#c5cae9]" />
                  <span className="text-white/90 text-sm font-medium">Program for Kids (Ages 8-12)</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
                  Summer Special Course For Kids
                </h1>
                <p className="text-lg md:text-xl text-[#c5cae9] mb-4 leading-relaxed">
                  A Fun, Structured Learning Experience For Children
                </p>

                {/* Details */}
                <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                    <Users className="h-4 w-4 text-[#c5cae9]" />
                    <span className="text-white text-sm">Ages 8-12</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                    <Clock className="h-4 w-4 text-[#c5cae9]" />
                    <span className="text-white text-sm">1 Month</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/#enquiry">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                      <span>Enroll Your Child</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="#outline">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 w-full sm:w-auto">
                      <span>View Course Outline</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right - Image */}
              <div className="hidden md:block">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c5cae9]/30 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <Image
                      src="/clp1.jpg"
                      alt="Children's Learning Program"
                      width={600}
                      height={500}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/40 to-transparent"></div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-[#e8eaf6] flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#e8eaf6] flex items-center justify-center">
                      <Award className="h-6 w-6 text-[#1a237e]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">17+ Years</p>
                      <p className="text-[#1a237e] font-bold">Trusted Program</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45.8C96 41.7 192 33.3 288 29.2C384 25 480 25 576 33.3C672 41.7 768 58.3 864 62.5C960 66.7 1056 58.3 1152 50C1248 41.7 1344 33.3 1392 29.2L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-[#1a237e]"></span>
                <span className="text-[#1a237e] uppercase tracking-wider text-sm font-bold">Introduction</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-6 leading-tight">
                Summer Special Course For Kids
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="mb-6">
                  In a world of screens and digital distractions, children often experience growing gaps in their fundamental life skills. Many parents notice their children struggling with a lack of focus, hesitation in speaking, poor social interaction, and a general lack of confidence. At Aspire Institute, we understand that true education goes beyond textbooks. It&apos;s about nurturing the &quot;Human&quot; in every child.
                </p>
                <p className="mb-6">
                  Our Social Intelligence & Personality Growth Program is specifically designed for children aged 8 to 15 to address these modern-day challenges.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#e8eaf6] rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#c5cae9] rounded-full blur-xl"></div>
              <Image
                src="/clp3.jpg"
                alt="Children learning activities"
                width={600}
                height={450}
                className="relative rounded-2xl shadow-xl w-full object-cover"
              />
            </div>
          </div>

          {/* Feature Section */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-[#1a237e]/5 rounded-2xl transform -rotate-2 scale-[1.02]"></div>
              <Image
                src="/clp2.jpg"
                alt="Children developing social skills"
                width={600}
                height={450}
                className="relative rounded-2xl shadow-lg w-full object-cover transform rotate-0 hover:rotate-1 transition-transform duration-500"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1a237e] mb-4">Nurture Future Leaders</h3>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Through activity-based learning, we help kids build strong communication, emotional intelligence, and values that last a lifetime. In this program, kids learn to overcome stage fear, speak clearly, understand others, and manage their time and emotions effectively. With over 17 years of expertise, we provide an environment where your child can explore their potential, build real-world confidence, and grow into a socially intelligent and well-rounded individual.
                </p>
                <p className="mb-6">
                  Empower your child to think creatively, speak fearlessly, and lead with kindness.
                </p>
                <p className="font-bold text-[#1a237e] text-xl">
                  Because the right foundation today makes a successful leader tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Outline Section */}
      <section id="outline" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a237e] mb-4">Course Outline</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A meticulously crafted roadmap designed to unlock confidence, clarity, and connection.
            </p>
          </div>

          <div className="space-y-16">
            {[
              {
                title: "English Language",
                outline: outlineEnglish,
              },
              {
                title: "Public Speaking",
                outline: outlinePublicSpeaking,
              },
              {
                title: "Social Skills",
                outline: outlineSocialSkills,
              }
            ].map((module, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-[#1a237e] flex items-center justify-center font-bold text-white tracking-widest text-sm">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a237e]">{module.title}</h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {module.outline.map((item, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl border-l-4 border-[#1a237e] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-[#e8eaf6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a237e] transition-colors duration-300">
                          <CheckCircle className="h-5 w-5 text-[#1a237e] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="text-gray-700 font-medium leading-snug group-hover:text-[#1a237e] transition-colors duration-300">
                          {item}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Rounded Rectangle CTA */}
            <div className="relative bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] rounded-3xl py-16 md:py-20 px-8 md:px-16 lg:px-20 overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5"></div>
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-60 h-60 bg-[#c5cae9]/20 rounded-full blur-3xl"></div>
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-60 h-60 bg-[#c5cae9]/20 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                {/* Text Content */}
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Give Your Child the Best Start
                  </h2>
                  <p className="text-[#c5cae9] text-base md:text-lg max-w-xl">
                    Watch your child grow into a confident, articulate, and socially aware individual. Enroll in the Summer Special Course today!
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                  <Link href="/#enquiry">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap">
                      <span>Enroll Now</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="/#courses">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 whitespace-nowrap">
                      <span>View All Programs</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
