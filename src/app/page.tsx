'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {
  ChevronRight,
  GraduationCap,
  Users,
  Target,
  BookOpen,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  Award,
  Globe,
  Calendar,
  Newspaper,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import EnquiryForm from "@/components/EnquiryForm";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/course');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden pl-14 mt-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9] -z-10"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] bg-no-repeat bg-cover opacity-5 -z-10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a237e]/5 rounded-bl-[100px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1a237e]/5 blur-3xl -z-10 pulse"></div>

          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm fade-in" style={{ animationDelay: '0.1s' }}>
                  <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
                  Transforming Lives Since 2009
                </div>
                <div className="space-y-4 fade-in" style={{ animationDelay: '0.2s' }}>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#1a237e]">
                    Unlock Your{" "}
                    <span className="relative inline-block">
                      Potential
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-[#c5cae9]/50 -z-10"></span>
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed">
                    Join over 800,000+ learners who have transformed their lives through our comprehensive personal and professional development programs.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row fade-in" style={{ animationDelay: '0.3s' }}>
                  <Button className="bg-[#1a237e] hover:bg-[#0d1642] shadow-md transition-all duration-300 hover:shadow-lg">
                    Explore Courses
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="text-[#1a237e] border-[#1a237e] hover:bg-[#e8eaf6] transition-all duration-300">
                    Learn More
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4 fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-[#e8eaf6] flex items-center justify-center text-xs font-medium text-[#1a237e]">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-[#1a237e]">800K+</span> satisfied learners
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#1a237e]/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#1a237e]/10 rounded-full blur-xl"></div>
                  <div className="relative z-10 flex justify-center items-center p-4" style={{ perspective: '1500px' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6]/70 via-[#c5cae9]/60 to-[#9fa8da]/50 rounded-2xl transform rotate-1 scale-[1.01] shadow-lg z-0"></div>
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 z-[1]"></div>
                    <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5 mix-blend-overlay rounded-xl z-[2]"></div>
                    <div className="absolute -top-5 -right-5 w-32 h-32 bg-gradient-radial from-[#1a237e]/15 to-transparent rounded-full blur-xl z-[3]"></div>
                    <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-gradient-radial from-[#3949ab]/15 to-transparent rounded-full blur-xl z-[3]"></div>
                    <div className="relative transform transition-all duration-500 ease-out group z-[5] hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(0deg) rotateY(0deg) scale(1)' }}>
                      <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-xl p-8 border border-white/30 shadow-2xl overflow-hidden" style={{ transform: 'translateZ(20px)', boxShadow: '0 25px 50px -12px rgba(26, 35, 126, 0.25)' }}>
                        <div className="relative" style={{ transform: 'translateZ(30px)' }}>
                          <Image src="/logo2.png" alt="Aspire Institute Secondary Logo" width={400} height={400} className="object-contain relative z-10 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:drop-shadow-[0_20px_30px_rgba(26,35,126,0.3)]" style={{ transform: 'translateZ(10px)' }} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-50"></div>
                        <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-25deg] animate-[shine_7s_ease-in-out_infinite]" style={{ transform: 'translateZ(10px)' }}></div>
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-black/5 shadow-[0_5px_15px_rgba(0,0,0,0.1)]" style={{ transform: 'translateZ(5px)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="founder" className="py-16 md:py-20 bg-white animate-on-scroll">
          <div className="container px-4 md:px-6 ml-14">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-18">
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm">
                <Star className="h-3.5 w-3.5 mr-1 text-[#1a237e]" />
                Meet Our Founder
              </div>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1a237e]">Visionary Leadership</h2>
                <p className="text-gray-500 md:text-lg">
                  The driving force behind Aspire Institute's mission to transform lives across India and beyond.
                </p>
              </div>
            </div>
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="relative slide-in-left">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#1a237e]/5 rounded-full blur-xl"></div>
                <div className="relative z-10 overflow-hidden rounded-2xl shadow-xl">
                  <Image src="/founder3.jpg" alt="Founder of Aspire Institute" width={400} height={400} className="w-full h-auto object-cover transform transition-transform hover:scale-105 duration-500" />
                </div>
              </div>
              <div className="space-y-6 pl-18 slide-in-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                  <Award className="h-5 w-5 text-[#1a237e]" />
                  <span className="text-sm font-medium text-[#1a237e]">Award-Winning Educator</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1a237e]">Transforming Education for Over 19 Years</h3>
                <p className="text-gray-600 leading-relaxed">
                  The founder of Aspire The Institute of Human Development is a visionary educator who has been transforming the education industry for over 19 years. Under his leadership, Aspire has become India's leading training institute, creating a revolution in personal and professional development.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eaf6] text-[#1a237e]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1a237e]">800,000+</h4>
                      <p className="text-sm text-gray-500">Audience as keynote speaker across India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eaf6] text-[#1a237e]">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1a237e]">1000+</h4>
                      <p className="text-sm text-gray-500">Programs and workshops organized worldwide</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="bg-[#1a237e] hover:bg-[#0d1642] shadow-md transition-all duration-300 hover:shadow-lg">
                    Learn More About Our Founder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-28 ml-4">
              <div className="grid gap-18 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e0e0] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-6 w-6 text-[#1a237e]" />
                    <h3 className="font-semibold text-[#1a237e]">Awards & Recognition</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Awarded Excellent Institute For Creating Leaders and Discovering The Potential Of Students In India</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">National Achievers Award for Education Excellence</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Outstanding Young Persons of India (OYP) by JCI in 2014</p>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e0e0] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-6 w-6 text-[#1a237e]" />
                    <h3 className="font-semibold text-[#1a237e]">Global Presence</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Conducted workshops in Singapore, Malaysia, Thailand, UAE, Qatar, and Vietnam</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Invited by HUB Singapore to address youth in 2014</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Successful motivational talk in Dubai organized by SKS Events UAE in 2017</p>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e0e0] hover:shadow-md transition-all md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Newspaper className="h-6 w-6 text-[#1a237e]" />
                    <h3 className="font-semibold text-[#1a237e]">Media & Publications</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Life and success story featured on ZEE TV in The Real Heroes</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Columnist for renowned newspapers like Sakal and Maharashtra Times</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#1a237e] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Honored with Vidharbha MAITRI GAURAV PURSKAR in Nagpur</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="vision-mission" className="py-16 md:py-20 bg-white animate-on-scroll">
          <div className="container px-4 md:px-6 ml-14">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm">
                <Target className="h-3.5 w-3.5 mr-1 text-[#1a237e]" />
                Our Purpose
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1a237e]">Guiding Principles</h2>
              <p className="text-gray-500 md:text-lg max-w-2xl">Our mission and vision drive us to empower individuals and shape a better future.</p>
            </div>
            <div className="grid gap-12 md:grid-cols-2 items-start">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-[#e0e0e0] hover:shadow-xl transition-all fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="h-8 w-8 text-[#1a237e]" />
                  <h3 className="text-2xl font-semibold text-[#1a237e]">Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">Our mission is to provide an extensive variety of life-transforming programs to create effective Communicators, Self believers, Engaging leaders, Aspiring professionals and Visionary entrepreneurs.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg border border-[#e0e0e0] hover:shadow-xl transition-all fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-8 w-8 text-[#1a237e]" />
                  <h3 className="text-2xl font-semibold text-[#1a237e]">Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">Aspire The Institute Of Human Development envisions the world where people believe in themselves & live their true potential to make this world a better place to live.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="courses" className="ml-18 animate-on-scroll">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm">
                <BookOpen className="h-3.5 w-3.5 mr-1 text-[#1a237e]" />
                Our Programs
              </div>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1a237e]">Transformative Learning Experiences</h2>
                <p className="text-gray-500 md:text-lg">Discover our comprehensive range of training programs designed to transform lives and careers.</p>
              </div>
            </div>
            <div className="flex flex-row overflow-x-auto gap-8 pb-4">
              {[
                { title: "Leadership Development", description: "Develop essential leadership skills for the modern workplace and learn to inspire teams.", icon: Users, image: "/ldp.jpg", slug: "/courses/leadership-development", features: ["Strategic thinking", "Team management", "Decision making", "Conflict resolution"] },
                { title: "Personality Development", description: "Build confidence and enhance your personal growth through comprehensive self-improvement.", icon: Target, image: "/pdc.jpg", slug: "/courses/personality-development", features: ["Self-confidence", "Communication skills", "Emotional intelligence", "Personal branding"] },
                { title: "Public Speaking", description: "Master the art of effective communication and captivate any audience with your words.", icon: BookOpen, image: "/public-speaking.jpg", slug: "/courses/public-speaking", features: ["Speech preparation", "Delivery techniques", "Audience engagement", "Overcoming anxiety"] },
                { title: "English Language Training", description: "Enhance your English skills for better communication.", icon: BookOpen, image: "/public-speaking.jpg", slug: "/courses/english-language-training", features: ["Grammar", "Vocabulary", "Pronunciation", "Fluency"] },
                { title: "Childrens Learning Program", description: "Fun and educational programs for kids.", icon: BookOpen, image: "/public-speaking.jpg", slug: "/courses/childrens-learning-program", features: ["Creativity", "Learning skills", "Teamwork", "Confidence"] },
                { title: "Voice & Accent", description: "Improve your voice modulation and accent.", icon: BookOpen, image: "/public-speaking.jpg", slug: "/courses/voice-and-accent", features: ["Clarity", "Tone", "Accent training", "Expression"] },
                { title: "Entrepreneurship Development", description: "Build skills to start and grow your business.", icon: BookOpen, image: "/public-speaking.jpg", slug: "/courses/entrepreneurship-development", features: ["Innovation", "Business planning", "Leadership", "Risk management"] },
                { title: "Teachers Training Program", description: "Empower educators with modern teaching methods.", icon: BookOpen, image: "/public-speaking.jpg", slug: "/courses/teachers-training-program", features: ["Pedagogy", "Classroom management", "Engagement", "Assessment"] },
                { title: "ARISE - LANGUAGE AND THOUGHTS ENRICHMENT CAMP", description: "A unique camp for personal growth.", icon: BookOpen, image: "/public-speaking.jpg", slug: "/courses/arise-camp", features: ["Mindset", "Language skills", "Critical thinking", "Self-expression"] },
                { title: "International Workshop", description: "Global learning experiences.", icon: BookOpen, image: "/public-speaking.jpg", slug: "/courses/international-workshop", features: ["Cross-cultural skills", "Global trends", "Networking", "Innovation"] },
              ].map((course, index) => (
                <Link key={index} href={course.slug} legacyBehavior passHref>
                  <a className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block flex-shrink-0 w-80 course-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image src={course.image} alt={`${course.title} image`} layout="fill" objectFit="cover" className="transition-transform duration-500 ease-in-out group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#1a237e] shadow-md">
                        <course.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-[#1a237e] mb-2 group-hover:text-[#0d1642] transition-colors duration-300">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">{course.description}</p>
                      <div className="w-full pt-3 mt-auto border-t border-gray-200/80">
                        <p className="text-xs font-medium text-gray-500 mb-2">Key Focus Areas:</p>
                        <ul className="space-y-1.5">
                          {course.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                              <CheckCircle className="h-3.5 w-3.5 text-[#3949ab] flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-5 w-full">
                        <Button variant="outline" className="w-full border-[#1a237e]/50 text-[#1a237e] hover:bg-[#e8eaf6]/60 hover:border-[#1a237e]/80 hover:text-[#0d1642] transition-all duration-300 text-sm py-2 group-hover:bg-[#e8eaf6]/80" tabIndex={-1}>
                          Learn More
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-24 overflow-hidden ml-18 animate-on-scroll">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b bg-white"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm">
                <Star className="h-3.5 w-3.5 mr-1 text-[#1a237e]" />
                Why Choose Aspire
              </div>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1a237e]">India's Premier Institute for Human Development</h2>
                <p className="text-gray-500 md:text-lg">We are one of the largest personal and professional development training institutes in India with over 100,000 learners in our full-time training programs.</p>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[{ icon: CheckCircle, title: "Proven Methodology", description: "Our research-backed approach ensures effective learning and measurable results for all participants." }, { icon: Users, title: "Expert Trainers", description: "Learn from industry professionals with years of experience in their respective fields." }, { icon: Target, title: "Practical Focus", description: "Our programs emphasize real-world application, not just theoretical knowledge." }].map((feature, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md border border-[#e0e0e0] transition-all hover:shadow-lg">
                  <div className="absolute top-0 right-0 h-20 w-20 bg-[#e8eaf6] rounded-bl-full opacity-50 transition-all group-hover:bg-[#c5cae9]"></div>
                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eaf6] text-[#1a237e] transition-all group-hover:bg-[#1a237e] group-hover:text-white">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-[#1a237e]">{feature.title}</h3>
                    <p className="text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-2 items-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#1a237e]/5 rounded-full blur-xl"></div>
                <div className="relative z-10 grid grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow-lg border border-[#e0e0e0]">
                  <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
                    <div className="text-4xl font-bold text-[#1a237e]">100K+</div>
                    <p className="text-sm text-gray-500">Full-time Learners</p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center border-l border-[#e0e0e0]">
                    <div className="text-4xl font-bold text-[#1a237e]">800K+</div>
                    <p className="text-sm text-gray-500">Program Participants</p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center border-t border-[#e0e0e0]">
                    <div className="text-4xl font-bold text-[#1a237e]">19+</div>
                    <p className="text-sm text-gray-500">Years Experience</p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center border-t border-l border-[#e0e0e0]">
                    <div className="text-4xl font-bold text-[#1a237e]">50+</div>
                    <p className="text-sm text-gray-500">Expert Trainers</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 ml-16">
                <h3 className="text-2xl font-bold text-[#1a237e]">Comprehensive Programs</h3>
                <p className="text-gray-600">Our wide variety of training programs with vibrant curriculum fits the needs of young and professional learners, helping them unlock their true potential.</p>
                <div className="space-y-3 mt-6">
                  {["Research-driven curriculum development", "Practical, hands-on learning experiences", "Industry-relevant skill development", "Personalized learning paths"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8eaf6] text-[#1a237e]">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Button className="bg-[#1a237e] hover:bg-[#0d1642] shadow-md transition-all duration-300 hover:shadow-lg">
                    Learn More About Our Approach
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="upcoming-courses" className="py-16 md:py-24 bg-white ml-18 animate-on-scroll">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm">
                <Calendar className="h-3.5 w-3.5 mr-1 text-[#1a237e]" />
                Upcoming Courses
              </div>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1a237e]">Enroll in Our Latest Programs</h2>
                <p className="text-gray-500 md:text-lg">Discover our newest course offerings and secure your spot in these transformative learning experiences.</p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a237e]"></div>
                <span className="ml-4 text-[#1a237e]">Loading courses...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No upcoming courses available at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="flex flex-row overflow-x-auto gap-8 pb-4">
                {courses.map((course, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-[#e0e0e0] transition-all hover:shadow-xl hover:border-[#1a237e]/20 w-80 flex-shrink-0 course-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="absolute top-0 right-0 h-24 w-24 bg-[#e8eaf6] rounded-bl-full opacity-50 transition-all group-hover:bg-[#c5cae9]"></div>
                    <div className="p-6">
                      <div className="relative flex flex-col items-start space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eaf6] text-[#1a237e] transition-all group-hover:bg-[#1a237e] group-hover:text-white">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a237e]">{course.courseName}</h3>
                        <p className="text-gray-500">{course.description}</p>
                        {course.courseDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                            <Calendar className="h-4 w-4 text-[#1a237e]" />
                            <span>Starts: {format(new Date(course.courseDate), 'PPP')}</span>
                          </div>
                        )}
                        <div className="w-full pt-4 mt-2 border-t border-[#e0e0e0]">
                          <p className="text-sm font-medium text-[#1a237e] mb-3">Course Outline:</p>
                          <ul className="space-y-2">
                            {Array.isArray(course.courseOutline) ? course.courseOutline.slice(0, 4).map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-[#1a237e]" />
                                {item}
                              </li>
                            )) : (
                              <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-[#1a237e]" />
                                {course.courseOutline}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <EnquiryForm />
      <footer className="border-t bg-white ml-18">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image%202-wKlvojVmZKfsKl6SY0T2zX1H92pLQT.jpeg" alt="Aspire Institute Logo" width={40} height={40} className="h-10 w-auto" />
                <span className="text-lg font-semibold text-[#1a237e]">Aspire Institute</span>
              </div>
              <p className="text-sm text-gray-500">One of India's largest personal and professional development training institutes, transforming lives since 2009.</p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <Link key={social} href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8eaf6] text-[#1a237e] hover:bg-[#1a237e] hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1a237e]">Programs</h3>
              <ul className="space-y-2">
                {["Leadership Development", "Personality Development", "Public Speaking", "English Speaking", "Corporate Training"].map((program) => (
                  <li key={program}>
                    <Link href="#" className="text-sm text-gray-500 hover:text-[#1a237e]">{program}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1a237e]">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Mission & Vision", "Our Team", "Testimonials", "Careers"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-500 hover:text-[#1a237e]">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1a237e]">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-[#1a237e]" />
                  <span className="text-sm text-gray-500">Sahakar Nagar, Gaurakhshan Road, Akola- 444001 Maharashtra(India)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-[#1a237e]" />
                  <span className="text-sm text-gray-500">infoaspire2009@gmail.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-[#1a237e]" />
                  <span className="text-sm text-gray-500">+91-8275726016/17</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-in forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .slide-in-left {
          opacity: 0;
          transform: translateX(-50px);
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .slide-in-right {
          opacity: 0;
          transform: translateX(50px);
          animation: slideInRight 0.8s ease-out forwards;
        }
        @keyframes slideInLeft {
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          to { opacity: 1; transform: translateX(0); }
        }
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .course-card {
          opacity: 0;
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease-out;
        }
        .animate-on-scroll.animate {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}