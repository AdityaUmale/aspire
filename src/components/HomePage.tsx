'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FounderSection from "@/components/FounderSection";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Calendar,
  GraduationCap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import SocialPostsSection from "@/components/SocialPostsSection";
import { findProgramByCourseName, getCourseSectionLabel } from "@/lib/course-config";

interface Course {
  _id: string;
  courseName: string;
  description: string;
  courseDate?: string;
  courseOutline?: string | string[];
  courseTime?: string;
  courseDayLabel?: string;
  section?: string;
  ctaMode?: string;
}

export default function HomePage() {
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
        const response = await fetch("/api/course");
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
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
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
          if (entry.isIntersecting) entry.target.classList.add("animate-active");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-transparent font-sans selection:bg-[#1a237e] selection:text-white">
      {/* ────────────────────────────────────────────────
        GLOBAL GRADIENT BACKGROUND - fixed, spans entire page
       ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
        <div className="absolute top-[20%] right-[-10%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-gradient-to-br from-[#7c4dff]/15 via-[#536dfe]/10 to-transparent blur-[80px]"></div>
        <div className="absolute top-[55%] left-[-8%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full bg-gradient-to-tr from-[#448aff]/10 via-[#7c4dff]/8 to-transparent blur-[80px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full bg-gradient-to-tl from-[#e040fb]/8 via-[#7c4dff]/8 to-transparent blur-[80px]"></div>
      </div>

      <Navbar />

      {/* Global Grain Texture */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none z-50"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, willChange: 'transform', transform: 'translateZ(0)' }}
      ></div>

      {/* Spacer for fixed navbar */}
      <div className="h-20 lg:h-24"></div>

      <main className="flex-1 relative">
        {/* Hero & Intro Sections */}
        <HeroSection />

        <div className="relative z-10">
          <FounderSection />
        </div>

        {/* --- PROGRAMS SECTION --- */}
        <section id="courses" className="py-20 md:py-28 relative z-10 animate-on-scroll">
          <div className="container px-4 md:px-6 mx-auto">
            {/* Section Header */}
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a237e]/10 bg-white/50 backdrop-blur-sm shadow-sm">
                <GraduationCap className="h-3.5 w-3.5 text-[#1a237e]" />
                <span className="text-xs font-bold tracking-widest text-[#1a237e] uppercase">Our Programs</span>
              </div>

              <div className="max-w-3xl space-y-4">
                <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-[#1a237e] leading-tight">
                  Training Programs That Help You <br />
                  <span className="text-[#3949ab]">Communicate And Lead.</span>
                </h2>
                <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed">
                  Discover Our Comprehensive Range Of Training Programs Designed To Transform Lives And Careers.
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
              className="flex flex-row overflow-x-auto gap-4 lg:gap-5 pb-8 -mx-4 px-8 md:mx-0 md:px-0 scrollbar-hide snap-x"
            >
              {[
                { title: "Leadership Development", tag: "For Professionals", description: "Lead people, not just projects, learn now", image: "/ldp.jpg", slug: "/courses/leadership-development", features: ["Strategic thinking", "Team management", "Decision making", "Conflict resolution"] },
                { title: "Personality Development", tag: "For Everyone", description: "Unlock the best version of yourselves. It starts here", image: "/pdc.jpg", slug: "/courses/personality-development", features: ["Self-confidence", "Communication skills", "Emotional intelligence", "Personal branding"] },
                { title: "Effective Public Speaking and Communication", tag: "For Everyone", description: "Communicate in a way that opens every door for you.", image: "/public-speaking.jpg", slug: "/courses/public-speaking", features: ["Speech preparation", "Delivery techniques", "Audience engagement", "Overcoming anxiety"] },
                { title: "English Language Training", tag: "For Adults & Students", description: "Master Global English, own every room.", image: "/elt8.jpg", slug: "/courses/english-language-training", features: ["Vocabulary", "Pronunciation", "Fluency", "Confidence"] },
                { title: "Voice & Accent", tag: "For Professionals", description: "Your voice is your identity, train it to lead.", image: "/voice-and-accent.jpg", slug: "/courses/voice-and-accent", features: ["Clarity", "Tone", "Accent training", "Expression"] },
                { title: "Entrepreneurship Development", tag: "For Entrepreneurs", description: "Your Ideas deserve a plan. We help you build it.", image: "/edp-logo.jpg", slug: "/courses/entrepreneurship-development", features: ["Innovation", "Business planning", "Leadership", "Risk management"] },
                { title: "Interview Skills & Techniques", tag: "For Professionals & Students", description: "Your Dream Job is one confident interview ahead.", image: "/ist2.jpg", slug: "/courses/interview-skills-techniques", features: ["Interview Prep", "Group Discussion", "Mindset Shift", "Placement Readiness"] },
                { title: "ARISE Language and Thoughts Enrichment Camp", tag: "For Students", description: "One Camp. New Mindset. Lifelong impact where you rise", image: "/arise-logo.jpg", slug: "/courses/arise-camp", features: ["Mindset", "Language Skills", "Critical Thinking", "Self-Expression"] },
                { title: "International Workshop", tag: "For Global Learners", description: "A global stage for your next big transformation.", image: "/international.jpg", slug: "/courses/international-workshop", features: ["Cross-cultural skills", "Global trends", "Networking", "Innovation"] },
                { title: "Exclusive Workshops & Keynote Talks", tag: "For Professionals & Organisations", description: "Because the right two hours can rewrite the next twenty years. High-impact sessions that cut straight to what matters.", image: "/workshop1.jpeg", slug: "/courses/workshops-keynote-talks", features: ["Mindset & Confidence", "Communication Mastery", "Leadership & Growth", "Customised Topics"] },
                { title: "Summer Special Course For Kids", tag: "For Children", description: "Give them a summer that builds them for life.", image: "/elt.jpg", slug: "/courses/childrens-learning-program", features: ["Creativity", "Learning Skills", "Teamwork", "Confidence"] },
                { title: "Teachers Training Program", tag: "For Educators", description: "Teach with purpose. Inspire with impact", image: "/teacher2.png", slug: "/courses/teachers-training-program", features: ["Pedagogy", "Classroom management", "Engagement", "Assessment"] },
              ].map((course, index) => (
                <Link key={index} href={course.slug} legacyBehavior passHref>
                  <a className="group relative flex flex-col rounded-[1.5rem] bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(26,35,126,0.25)] hover:border-[#1a237e]/30 hover:-translate-y-2 block flex-shrink-0 w-[300px] sm:w-[340px] snap-start overflow-hidden h-[480px]">
                    {/* Image Area */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image src={course.image} alt={`${course.title} workshop in progress at Aspire Institute`} width={400} height={300} sizes="(max-width: 640px) 300px, (max-width: 1024px) 340px, 340px" className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/80 via-transparent to-transparent opacity-80"></div>

                      {/* Title Overlay on Image */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-xl font-medium text-white leading-tight drop-shadow-md">{course.title}</h3>
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
        <section id="upcoming-courses" className="py-20 md:py-28 lg:ml-18 relative z-10 animate-on-scroll">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a237e]/10 bg-white/50 backdrop-blur-sm shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-[#1a237e]" />
                <span className="text-xs font-bold tracking-widest text-[#1a237e] uppercase">Enroll Now</span>
              </div>

              <div className="max-w-3xl space-y-4">
                <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-[#1a237e]">
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
              <div className="text-center py-16 px-6 bg-[#FAFAFA] rounded-[2rem] border border-gray-200/50 shadow-sm">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-[#e8eaf6] flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-[#1a237e]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#1a237e] mb-3">Next Cohort Starting Soon</h3>
                <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                  Join the next cohort, share your interest and we&apos;ll notify you when dates are announced.
                </p>
                <Link href="#enquiry">
                  <Button className="h-12 px-8 rounded-full bg-[#1a237e] text-white hover:bg-[#10164f] shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
                    Notify Me
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
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
                  className="flex flex-row overflow-x-auto gap-4 lg:gap-5 pb-8 -mx-4 px-8 md:mx-0 md:px-0 scrollbar-hide snap-x"
                >
                  {courses.map((course, index) => {
                    const programEntry = findProgramByCourseName(course.courseName);
                    const programSlug = programEntry?.slug ?? null;
                    const courseSectionLabel = getCourseSectionLabel(course.section);
                    const ctaHref = "/#enquiry";
                    return (
                      <div key={index} className="group relative rounded-[1.5rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(26,35,126,0.25)] hover:border-[#1a237e]/30 hover:-translate-y-2 w-[300px] sm:w-[340px] flex-shrink-0 flex flex-col snap-start overflow-hidden h-[540px]">
                        {/* Top Decorative Stripe */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] flex-shrink-0"></div>

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="relative flex flex-col items-start space-y-3 flex-1">
                            {courseSectionLabel && course.section !== "REGULAR" && (
                              <Badge className="bg-[#eef2ff] text-[#1a237e] hover:bg-[#eef2ff]">
                                {courseSectionLabel}
                              </Badge>
                            )}

                            <h3 className="font-bold text-xl text-[#1a237e] leading-tight group-hover:text-[#3949ab] transition-colors">{course.courseName}</h3>

                            {/* Date Info */}
                            {course.courseDate && (
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 font-medium">
                                <Calendar className="h-4 w-4 text-[#1a237e]" />
                                <span>Starts: <span className="text-[#1a237e]">{format(new Date(course.courseDate), "PPP")}</span></span>
                                {course.courseTime && (
                                  <span className="rounded-full bg-[#f5f7ff] px-2.5 py-1 text-xs text-[#1a237e]">
                                    {course.courseTime}
                                  </span>
                                )}
                                {course.courseDayLabel && (
                                  <span className="rounded-full bg-[#f8fafc] px-2.5 py-1 text-xs text-gray-600">
                                    {course.courseDayLabel}
                                  </span>
                                )}
                              </div>
                            )}

                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{course.description}</p>

                            {course.courseOutline && (
                              <div className="w-full pt-3 mt-3 border-t border-dashed border-gray-200 flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Highlights</p>
                                <ul className="space-y-1">
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
                          <div className="mt-6 flex gap-2">
                            <Link href={ctaHref} className={programSlug ? "flex-1" : "w-full"}>
                              <Button
                                className="w-full h-10 rounded-xl bg-[#1a237e] hover:bg-[#0d1642] text-white shadow-lg shadow-[#1a237e]/20 transition-all duration-300 text-sm font-medium hover:scale-[1.02]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Enquire Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                            {programSlug && (
                              <Link href={programSlug} className="flex-1">
                                <Button
                                  variant="ghost"
                                  className="w-full h-10 rounded-xl border border-gray-200 text-[#1a237e] hover:bg-[#1a237e] hover:text-white transition-all duration-300 text-sm font-medium group/btn"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Program
                                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                </Button>
                              </Link>
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
      {/* <ArticlesSection /> */}
      <FAQSection />
      <SocialPostsSection />
      <EnquiryForm />
      <Footer />

      {/* Floating Action Button pointing to Upcoming Courses */}
      <div className="fixed bottom-6 right-6 z-[90] md:bottom-8 md:right-8" style={{ animation: 'fab-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s both' }}>
        {/* Pulsing attention ring */}
        <div className="absolute inset-0 rounded-full bg-[#1a237e]/10" style={{ animation: 'fab-pulse 3s ease-in-out infinite' }} />

        <button
          onClick={() => {
            const el = document.getElementById('upcoming-courses');
            if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }}
          className="group relative flex items-center gap-3 bg-white/60 backdrop-blur-xl border border-white/70 pl-4 pr-5 py-3 md:pl-5 md:pr-6 md:py-3.5 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] hover:bg-white/80 hover:shadow-[0_12px_40px_0_rgba(26,35,126,0.18)] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03] cursor-pointer overflow-hidden"
          aria-label="Scroll to Upcoming Courses"
        >
          {/* Glass sheen highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />

          {/* Icon circle */}
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#1a237e]/10 text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="font-semibold text-[13px] md:text-sm tracking-wide text-[#1a237e] whitespace-nowrap">Upcoming Batches</span>
          <ArrowRight className="h-4 w-4 text-[#1a237e]/40 group-hover:text-[#1a237e] group-hover:translate-x-0.5 transition-all duration-300" />
        </button>
      </div>

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

        @keyframes fab-entrance {
          0% { opacity: 0; transform: translateY(40px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes fab-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.25); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
