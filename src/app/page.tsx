'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FounderSection from "@/components/FounderSection";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Calendar,
  GraduationCap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from 'date-fns';
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "../components/Footer";
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import ArticlesSection from "@/components/ArticlesSection";

// Font Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });

interface Course {
  _id: string;
  courseName: string;
  description: string;
  courseDate?: string;
  courseOutline?: string | string[];
}

// Map course names to program slugs
const getProgramSlug = (courseName: string): string | null => {
  const courseSlugMap: { [key: string]: string } = {
    "Leadership Development": "/courses/leadership-development",
    "Personality Development": "/courses/personality-development",
    "Public Speaking": "/courses/public-speaking",
    "English Language Training": "/courses/english-language-training",
    "Children's Learning Program": "/courses/childrens-learning-program",
    "Voice & Accent": "/courses/voice-and-accent",
    "Entrepreneurship Development": "/courses/entrepreneurship-development",
    "Teachers Training Program": "/courses/teachers-training-program",
    "ARISE – Language and Thought Enrichment Camp": "/courses/arise-camp",
    "International Workshop": "/courses/international-workshop",
  };

  return courseSlugMap[courseName] || null;
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const programsRef = useRef<HTMLDivElement | null>(null);
  const upcomingCoursesRef = useRef<HTMLDivElement | null>(null);

  const scrollPrograms = (direction: "left" | "right") => {
    const container = programsRef.current;
    if (!container) return;
    const scrollAmount = direction === "left" ? -350 : 350;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollUpcomingCourses = (direction: "left" | "right") => {
    const container = upcomingCoursesRef.current;
    if (!container) return;
    const scrollAmount = direction === "left" ? -350 : 350;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/course');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        const validCourses = Array.isArray(data?.courses)
          ? data.courses.filter((course: Course | null | undefined) =>
            course &&
            course.courseName &&
            course.description
          )
          : [];

        setCourses(validCourses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Intersection Observer for fade-ins
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-active');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen bg-white ${playfair.variable} ${jakarta.variable} font-sans selection:bg-[#1a237e] selection:text-white`}>
      <Navbar />

      {/* Global Grain Texture */}
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-20 lg:h-24"></div>

      <main className="flex-1 relative">
        {/* Hero & Intro Sections */}
        <HeroSection />

        <div className="relative">
          {/* Ambient Background Gradient for Middle Sections */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[100px] opacity-60 pointer-events-none -z-10"></div>
          <FounderSection />
          {/* <VisionMissionSection /> */}
        </div>

        {/* --- PROGRAMS SECTION --- */}
        <section id="courses" className="py-20 md:py-28 relative animate-on-scroll">
          <div className="container px-4 md:px-6 mx-auto">

            {/* Section Header */}
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a237e]/10 bg-white shadow-sm">
                <GraduationCap className="h-3.5 w-3.5 text-[#1a237e]" />
                <span className="text-xs font-bold tracking-widest text-[#1a237e] uppercase">Our Programs</span>
              </div>

              <div className="max-w-3xl space-y-4">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a237e] leading-tight">
                  Training programs that help you <br />
                  <span className="italic text-[#3949ab]">Communicate and Lead.</span>
                </h2>
                <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed">
                  Discover our comprehensive range of training programs designed to transform lives and careers.
                </p>
              </div>
            </div>

            {/* Scroll Controls */}
            <div className="flex justify-end gap-3 mb-6 px-4 md:px-0">
              <button
                type="button"
                onClick={() => scrollPrograms("left")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a237e] hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] shadow-sm transition-all duration-300"
                aria-label="Scroll programs left"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollPrograms("right")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a237e] hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] shadow-sm transition-all duration-300"
                aria-label="Scroll programs right"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Horizontal Scroll Container */}
            <div
              ref={programsRef}
              className="flex flex-row overflow-x-auto gap-6 lg:gap-8 pb-8 -mx-4 px-8 md:mx-0 md:px-0 scrollbar-hide snap-x"
            >
              {[
                { title: "Leadership Development", description: "Develop essential leadership skills for the modern workplace and learn to inspire teams.", image: "/ldp.jpg", slug: "/courses/leadership-development", features: ["Strategic thinking", "Team management", "Decision making", "Conflict resolution"] },
                { title: "Personality Development", description: "Build confidence and enhance your personal growth through comprehensive self-improvement.", image: "/pdc.jpg", slug: "/courses/personality-development", features: ["Self-confidence", "Communication skills", "Emotional intelligence", "Personal branding"] },
                { title: "Public Speaking", description: "Master the art of effective communication and captivate any audience with your words.", image: "/public-speaking.jpg", slug: "/courses/public-speaking", features: ["Speech preparation", "Delivery techniques", "Audience engagement", "Overcoming anxiety"] },
                { title: "English Language Training", description: "Enhance your English skills for better communication.", image: "/elt3.jpg", slug: "/courses/english-language-training", features: ["Grammar", "Vocabulary", "Pronunciation", "Fluency"] },
                { title: "Children's Learning Program", description: "Fun and educational programs for kids.", icon: BookOpen, image: "/elt.jpg", slug: "/courses/childrens-learning-program", features: ["Creativity", "Learning skills", "Teamwork", "Confidence"] },
                { title: "Voice & Accent", description: "Improve your voice modulation and accent.", image: "/voice-and-accent.jpg", slug: "/courses/voice-and-accent", features: ["Clarity", "Tone", "Accent training", "Expression"] },
                { title: "Entrepreneurship Development", description: "Build skills to start and grow your business.", image: "/edp-logo.jpg", slug: "/courses/entrepreneurship-development", features: ["Innovation", "Business planning", "Leadership", "Risk management"] },
                { title: "Teachers Training Program", description: "Empower educators with modern teaching methods.", image: "/teacher2.png", slug: "/courses/teachers-training-program", features: ["Pedagogy", "Classroom management", "Engagement", "Assessment"] },
                { title: "ARISE – Language and Thought Enrichment Camp", description: "A unique camp for personal growth.", image: "/arise-logo.jpg", slug: "/courses/arise-camp", features: ["Mindset", "Language skills", "Critical thinking", "Self-expression"] },
                { title: "International Workshop", description: "Global learning experiences.", image: "/international.jpg", slug: "/courses/international-workshop", features: ["Cross-cultural skills", "Global trends", "Networking", "Innovation"] },
              ].map((course, index) => (
                <Link key={index} href={course.slug} legacyBehavior passHref>
                  <a className="group relative flex flex-col rounded-[1.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(26,35,126,0.15)] hover:-translate-y-2 block flex-shrink-0 w-[300px] sm:w-[340px] snap-start overflow-hidden h-[480px]">

                    {/* Image Area */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image src={course.image} alt={`${course.title} workshop in progress at Aspire Institute`} width={400} height={300} className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/80 via-transparent to-transparent opacity-80"></div>



                      {/* Title Overlay on Image */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-serif text-xl font-medium text-white leading-tight drop-shadow-md">{course.title}</h3>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col bg-white relative z-10 h-[280px]">
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed font-light line-clamp-3">{course.description}</p>

                      {/* Features List */}
                      <div className="w-full pt-4 border-t border-dashed border-gray-200 mb-6 flex-grow">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Focus Areas</p>
                        <ul className="grid grid-cols-1 gap-2">
                          {course.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                              <CheckCircle className="h-3 w-3 text-[#3949ab]" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action */}
                      <div className="mt-auto">
                        <Button variant="ghost" className="w-full justify-between border border-gray-100 text-[#1a237e] hover:bg-[#1a237e] hover:text-white transition-all duration-300 group/btn">
                          <span className="text-sm font-medium">View Program</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- UPCOMING COURSES SECTION --- */}
        <section id="upcoming-courses" className="py-20 md:py-28 lg:ml-18 animate-on-scroll">
          <div className="container px-4 md:px-6 mx-auto">

            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a237e]/10 bg-white shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-[#1a237e]" />
                <span className="text-xs font-bold tracking-widest text-[#1a237e] uppercase">Enroll Now</span>
              </div>

              <div className="max-w-3xl space-y-4">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a237e]">
                  Upcoming Batches
                </h2>
                <p className="text-gray-500 text-lg font-light">
                  Secure your spot in these transformative learning experiences starting soon.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a237e]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-600">{error}</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[2rem] border border-gray-200/50">
                <p className="text-gray-400 text-lg font-serif italic">No upcoming courses available at the moment. Check back soon!</p>
              </div>
            ) : (
              <>
                {/* Scroll Controls */}
                <div className="flex justify-end gap-3 mb-6 px-4 md:px-0">
                  <button
                    type="button"
                    onClick={() => scrollUpcomingCourses("left")}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a237e] hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] shadow-sm transition-all duration-300"
                    aria-label="Scroll upcoming courses left"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollUpcomingCourses("right")}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a237e] hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] shadow-sm transition-all duration-300"
                    aria-label="Scroll upcoming courses right"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                <div
                  ref={upcomingCoursesRef}
                  className="flex flex-row overflow-x-auto gap-6 lg:gap-8 pb-8 -mx-4 px-8 md:mx-0 md:px-0 scrollbar-hide snap-x"
                >
                  {courses.map((course, index) => {
                    const programSlug = getProgramSlug(course.courseName);
                    return (
                      <div key={index} className="group relative rounded-[1.5rem] bg-white shadow-sm border border-gray-200 transition-all hover:shadow-[0_20px_40px_-10px_rgba(26,35,126,0.1)] w-[300px] sm:w-[340px] flex-shrink-0 flex flex-col h-full snap-start overflow-hidden">
                        {/* Top Decorative Stripe */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab]"></div>

                        <div className="p-8 flex-1 flex flex-col h-full">
                          <div className="relative flex flex-col items-start space-y-4 flex-1">



                            <h3 className="font-serif text-2xl text-[#1a237e] leading-tight group-hover:text-[#3949ab] transition-colors">{course.courseName}</h3>

                            {/* Date Info */}
                            {course.courseDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <Calendar className="h-4 w-4 text-[#1a237e]" />
                                <span>Starts: <span className="text-[#1a237e]">{format(new Date(course.courseDate), 'PPP')}</span></span>
                              </div>
                            )}

                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{course.description}</p>

                            {course.courseOutline && (
                              <div className="w-full pt-4 mt-4 border-t border-dashed border-gray-200 flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Highlights</p>
                                <ul className="space-y-2">
                                  {Array.isArray(course.courseOutline) ? course.courseOutline.slice(0, 3).map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                      <div className="h-1.5 w-1.5 rounded-full bg-[#3949ab] mt-1.5 flex-shrink-0"></div>
                                      <span className="line-clamp-1">{item}</span>
                                    </li>
                                  )) : (
                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                      <div className="h-1.5 w-1.5 rounded-full bg-[#3949ab] mt-1.5 flex-shrink-0"></div>
                                      <span className="line-clamp-1">{course.courseOutline}</span>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Button Area */}
                          <div className="mt-8">
                            {programSlug ? (
                              <Link href={programSlug}>
                                <Button
                                  className="w-full h-12 rounded-xl bg-[#1a237e] hover:bg-[#0d1642] text-white shadow-lg shadow-[#1a237e]/20 transition-all duration-300 text-sm font-medium hover:scale-[1.02]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Details
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                variant="secondary"
                                className="w-full h-12 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
                                disabled
                              >
                                Registration Closed
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <ArticlesSection />

      <EnquiryForm />
      <Footer />

      <style jsx global>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-active {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Hide scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  
          scrollbar-width: none;  
        }
        
        .overflow-x-auto {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}