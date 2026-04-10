import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { CheckCircle, ArrowRight, Award, Zap } from 'lucide-react';

export default function WorkshopsKeynoteTalksPage() {
    const topics = [
        'How to stop overthinking?',
        'Psychology of successful people',
        'The hidden power of self talk',
        'How To Improve Time Management?',
        'How To Be Self Disciplined?',
        'How To Improve Your Attitude?',
        'How To Develop Interpersonal Skills?',
        'How To Develop Communication Skills?',
        'How To Improve Social Skills?',
        'How To Improve Soft Skills?',
        'How To Build Self Confidence?',
        'How To Develop Common Sense?',
        'How To Overcome Fear?',
        'How To Get Rid Of An Inferiority Complex?',
        'Growth Mindset',
        'It\'s All About Mindset',
        'How To Get Out Of Your Comfort Zone?',
        'How To Say No?',
        'How To Achieve Your Dreams?',
        'Joy Of Relationship',
        'Power Of Visualisation',
        '11 Principles Of Success',
        '7 Principles Of Communication',
        '10 Powerful Ways To Improve Body Language',
        'Stress Management',
        '11 Powerful Habits Of Successful People',
        'How To Get Financial Freedom?',
        'How To Build Connections For Growth?',
        'How To Start New Year?',
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
                                    <Zap className="h-4 w-4 text-[#c5cae9]" />
                                    <span className="text-white/90 text-sm font-medium">High-Impact Focus Sessions</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                                    Exclusive Workshops & Keynote Talks
                                </h1>
                                <p className="text-lg md:text-xl text-[#c5cae9] mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                                    Some transformations don&apos;t need months; they need the right two hours. Aspire&apos;s workshops are built to move you, challenge you, and leave you changed.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Link href="/#enquiry">
                                        <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                                            <span>Book a Session</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </Link>
                                    <Link href="#topics">
                                        <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 w-full sm:w-auto">
                                            <span>Explore Topics</span>
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
                                            src="/workshop7.jpeg"
                                            alt="Exclusive Workshops & Keynote Talks"
                                            width={600}
                                            height={500}
                                            className="object-cover w-full h-[500px] transform group-hover:scale-105 transition-transform duration-700"
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
                                            <p className="text-xs text-gray-500 font-medium">Led by</p>
                                            <p className="text-[#1a237e] font-bold">Sachin Burghate</p>
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
                                High-Impact, Focused Sessions
                            </h2>
                            <div className="prose prose-lg text-gray-700 leading-relaxed">
                                <p className="mb-6">
                                    Some transformations don&apos;t need months; they need the right two hours. Aspire&apos;s workshops and talks are designed for exactly that: high-impact, focused sessions that cut straight to what matters.
                                </p>
                                <p className="mb-6">
                                    Whether you&apos;re a student stepping into the world, a professional looking to sharpen your edge, or an organisation ready to invest in its people, our sessions are built to move you, challenge you, and leave you with something you&apos;ll carry long after you walk out the door.
                                </p>
                                <p className="mb-6">
                                    Led by Aspire Institute’s founder, Mr. Sachin Burghate, each session is more than a talk; it&apos;s an experience. From mastering the art of communication to building unshakeable confidence, every workshop is crafted to deliver maximum impact in minimum time.
                                </p>
                                <p className="font-bold text-[#1a237e]">
                                    Because real growth doesn&apos;t always need a long runway. Sometimes, all it takes is one powerful session to change the direction of everything.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#e8eaf6] rounded-full blur-xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#c5cae9] rounded-full blur-xl"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                                <Image
                                    src="/workshop3.jpeg"
                                    alt="Sachin Burghate leading a workshop"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feature Section */}
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute inset-0 bg-[#1a237e]/5 rounded-2xl transform -rotate-2 scale-[1.02]"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] transform rotate-0 hover:rotate-1 transition-transform duration-500">
                                <Image
                                    src="/workshop2.jpeg"
                                    alt="Audience engaged in an Aspire workshop"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#1a237e] mb-4">Experience the Change</h3>
                            <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                From leadership insights to mindset breakthroughs, every workshop is crafted to deliver maximum impact in minimum time. We focus on practical application and immediate transformation.
                            </p>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                Our sessions covered topics ranging from interpersonal skills to financial freedom, ensuring a holistic approach to personal and professional development.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Topics Section */}
            <section id="topics" className="py-20 md:py-28 bg-[#FAFAFA]">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a237e] mb-4">Workshop Topics</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Choose from a wide range of topics designed for maximum impact.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {topics.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl border-l-4 border-[#1a237e] hover:-translate-y-1 transition-all duration-300"
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
                                        Ready for a Breakthrough?
                                    </h2>
                                    <p className="text-[#c5cae9] text-base md:text-lg max-w-xl">
                                        Book a 2-hour high-impact session for your organisation or join our upcoming public workshops.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                                    <Link href="/#enquiry">
                                        <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1a237e] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap">
                                            <span>Inquire Now</span>
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

