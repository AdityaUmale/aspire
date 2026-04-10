'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Microscope,
  CheckCircle,
  ArrowUpRight,
  Milestone,
  Camera,
  ChevronLeft,
  ChevronRight,
  Building2,
  X
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Gallery image data
   ────────────────────────────────────────────── */
const galleryImages: { src: string; caption: string; tall?: boolean }[] = [
  { src: '/gallery/Annual Function address.jpg.jpg', caption: 'Annual Function Address', tall: true },
  { src: '/gallery/Arise Camp.jpg.jpg', caption: 'Arise Camp' },
  { src: '/gallery/Foundation Day.jpg.jpg', caption: 'Foundation Day', tall: true },
  { src: '/gallery/Excellect institute for creating leaders award.jpg.jpg', caption: 'Excellence in Creating Leaders Award' },
  { src: '/gallery/Indo Japan Council Symposium (2).jpg.jpg', caption: 'Indo-Japan Council Symposium' },
  { src: '/gallery/International Workshop Doha qatar.jpg.jpg', caption: 'International Workshop — Doha, Qatar', tall: true },
  { src: '/gallery/Annual Function winner applaud news.jpg.jpg', caption: 'Annual Function Winners' },
  { src: '/gallery/Social Diwali at Pramilatai Oak Hall.jpg.jpg', caption: 'Social Diwali at Pramilatai Oak Hall' },
  { src: '/gallery/Most innovative institute for human development training award.jpg.jpg', caption: 'Most Innovative Institute Award', tall: true },
  { src: '/gallery/Social Impact Award 2018.jpg.jpg', caption: 'Social Impact Award 2018' },
  { src: '/gallery/Nagpur Workshop.jpg.jpg', caption: 'Nagpur Workshop' },
  { src: "/gallery/State commisioner officer aspire institute's guest.jpg.jpg", caption: 'State Commissioner as Guest' },
  { src: '/gallery/Social Diwali.jpg.jpg', caption: 'Social Diwali Celebration' },
  { src: "/gallery/India's own University of life.jpg.jpg", caption: "India's Own University of Life", tall: true },
  { src: '/gallery/Life is an echo.jpg.jpg', caption: 'Life Is an Echo' },
  { src: '/gallery/DSC03099.jpg', caption: 'Workshop in Action' },
  { src: '/gallery/IMG_0460.jpg', caption: 'Training Session' },
  { src: '/gallery/IMG_6678.jpg', caption: 'Interactive Learning', tall: true },
  { src: '/gallery/IMG_2428.jpg', caption: 'Team Activity' },
];

const campusImages: { src: string; caption: string }[] = [
  { src: '/gallery/campus/12x18 == ok print.jpg', caption: 'Campus Entrance' },
  { src: '/gallery/campus/DSC_1355.jpg', caption: 'Main Building' },
  { src: '/gallery/campus/DSC_1357.jpg', caption: 'Training Hall' },
  { src: '/gallery/campus/DSC_1361.jpg', caption: 'Learning Space' },
  { src: '/gallery/campus/DSC_1362.jpg', caption: 'Seminar Room' },
  { src: '/gallery/campus/DSC_1363.jpg', caption: 'Conference Area' },
  { src: '/gallery/campus/DSC_1367.jpg', caption: 'Library Wing' },
  { src: '/gallery/campus/DSC_1369.jpg', caption: 'Open Space' },
  { src: '/gallery/campus/DSC_1372.jpg', caption: 'Lobby' },
  { src: '/gallery/campus/DSC_1373.jpg', caption: 'Reception' },
  { src: '/gallery/campus/DSC_1375.jpg', caption: 'Auditorium' },
  { src: '/gallery/campus/DSC_1377.jpg', caption: 'Workshop Room' },
  { src: '/gallery/campus/DSC_1381.jpg', caption: 'Breakout Area' },
  { src: '/gallery/campus/DSC_1384.jpg', caption: 'Corridor' },
  { src: '/gallery/campus/DSC_1397.jpg', caption: 'Garden' },
  { src: '/gallery/campus/DSC_1399.jpg', caption: 'Exterior View' },
  { src: '/gallery/campus/DSC_1400.jpg', caption: 'Front Facade' },
  { src: '/gallery/campus/DSC_1401.jpg', caption: 'Campus Panorama' },
];

const guestImages: { src: string; caption: string }[] = [
  { src: '/gallery/annual-function-guests/WhatsApp Image 2026-03-21 at 17.02.10 (2).jpeg', caption: 'Annual Function Special Guest' },
  { src: '/gallery/annual-function-guests/WhatsApp Image 2026-03-21 at 17.02.10 (3).jpeg', caption: 'Annual Function Special Guest' },
  { src: '/gallery/annual-function-guests/WhatsApp Image 2026-03-21 at 17.02.10.jpeg', caption: 'Annual Function Special Guest' },
  { src: '/gallery/annual-function-guests/WhatsApp Image 2026-03-21 at 17.02.11 (1).jpeg', caption: 'Annual Function Special Guest' },
  { src: '/gallery/annual-function-guests/WhatsApp Image 2026-03-21 at 17.03.34 (2).jpeg', caption: 'Annual Function Special Guest' },
  { src: '/gallery/annual-function-guests/WhatsApp Image 2026-03-21 at 17.03.35 (1).jpeg', caption: 'Annual Function Special Guest' },
  { src: '/gallery/annual-function-guests/WhatsApp Image 2026-03-21 at 17.03.36.jpeg', caption: 'Annual Function Special Guest' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function AboutUsPage() {
  const campusScrollRef = useRef<HTMLDivElement>(null);
  const guestScrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<{ index: number; type: 'gallery' | 'campus' | 'guests' } | null>(null);

  const scrollCampus = (direction: 'left' | 'right') => {
    if (!campusScrollRef.current) return;
    const amount = campusScrollRef.current.clientWidth * 0.8;
    campusScrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const scrollGuest = (direction: 'left' | 'right') => {
    if (!guestScrollRef.current) return;
    const amount = guestScrollRef.current.clientWidth * 0.8;
    guestScrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const openLightbox = (index: number, type: 'gallery' | 'campus' | 'guests') => {
    setSelectedImage({ index, type });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateLightbox = useCallback((direction: 'next' | 'prev') => {
    if (!selectedImage) return;
    const { index, type } = selectedImage;
    const list = type === 'gallery' ? galleryImages : (type === 'campus' ? campusImages : guestImages);
    let newIndex = direction === 'next' ? index + 1 : index - 1;

    if (newIndex >= list.length) newIndex = 0;
    if (newIndex < 0) newIndex = list.length - 1;

    setSelectedImage({ index: newIndex, type });
  }, [selectedImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, closeLightbox, navigateLightbox]);

  const currentImageData = selectedImage 
    ? (selectedImage.type === 'gallery' ? galleryImages[selectedImage.index] : (selectedImage.type === 'campus' ? campusImages[selectedImage.index] : guestImages[selectedImage.index]))
    : null;

  return (
    <div className={`flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e] selection:text-white`}>

      {/* ────────────────────────────────────────────────
        GLOBAL GRADIENT BACKGROUND — fixed, spans entire page
       ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[20%] right-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] rounded-full bg-gradient-to-br from-[#7c4dff]/20 md:from-[#7c4dff]/25 via-[#536dfe]/15 md:via-[#536dfe]/20 to-transparent blur-[60px] md:blur-[120px]"></div>
        <div className="absolute top-[55%] left-[-8%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-tr from-[#448aff]/15 md:from-[#448aff]/20 via-[#7c4dff]/10 md:via-[#7c4dff]/15 to-transparent blur-[50px] md:blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-gradient-to-tl from-[#e040fb]/10 md:from-[#e040fb]/15 via-[#7c4dff]/10 md:via-[#7c4dff]/10 to-transparent blur-[40px] md:blur-[100px]"></div>
      </div>

      <Navbar />

      {/* ════════════════════════════════════════════════
          HERO SECTION — Clean, editorial
         ════════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-20 lg:pt-52 lg:pb-28 z-10 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="h-px w-12 bg-[#1a237e]/30"></span>
              <span className="text-sm font-bold tracking-[0.2em] text-[#1a237e] uppercase">Since 2009</span>
              <span className="h-px w-12 bg-[#1a237e]/30"></span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.1] mb-8">
              Unlocking Potential, <br />
              <span className="text-[#3949ab]">Shaping Futures.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light max-w-3xl mx-auto mb-16">
              We are India&apos;s premier institute for personal and professional development, dedicated to the belief that every individual holds the power to transform.
            </p>

            {/* Unique Architectural Stats Grid */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-16 text-center md:text-left">
                {[
                  { label: "Active Learners", value: "150K+", sub: "Across India" },
                  { label: "Global Reach", value: "3M+", sub: "Digital Footprint" },
                  { label: "Years Legacy", value: "15+", sub: "Since 2009" },
                  { label: "Programs", value: "5000+", sub: "Success Stories" },
                ].map((stat, index) => (
                  <div key={index} className="group relative pt-10">
                    {/* Minimalist Top Accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-[80%] md:w-full h-[1px] bg-gray-100 group-hover:bg-[#1a237e]/20 transition-colors duration-500">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-[2px] bg-[#1a237e] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center md:origin-left"></div>
                    </div>

                    <div className="space-y-1 text-center md:text-left">
                      <h3 className="font-black text-4xl md:text-5xl text-[#1a237e] tracking-tighter group-hover:-translate-y-1 transition-transform duration-500">
                        {stat.value}
                      </h3>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f1337] mb-1">
                          {stat.label}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 italic">
                          {stat.sub}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          NARRATIVE — Editorial Manifesto Layout
         ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">

          {/* Intro */}
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f1337] leading-tight tracking-tight mb-8">
              More than just an institute, we are a <span className="text-[#1a237e]">movement.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              Aspire offers a vibrant curriculum tailored for both young minds and seasoned professionals. We operate on a fundamental truth:
              <strong className="text-[#1a237e] font-medium"> everyone has the potential to become an incredible version of themselves.</strong>
            </p>
          </div>

          {/* Mission */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start pb-16 md:pb-20 border-b border-gray-100">
            <div className="lg:col-span-4">
              <span className="font-black text-7xl md:text-8xl text-[#1a237e]/10 leading-none select-none block mb-4">01</span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f1337] tracking-tight">Our Mission</h3>
            </div>
            <div className="lg:col-span-8 lg:pt-6">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                Our mission is to provide an extensive variety of life-transforming programs to create effective <strong className="text-[#0f1337] font-semibold">Communicators</strong>, <strong className="text-[#0f1337] font-semibold">Self-believers</strong>, <strong className="text-[#0f1337] font-semibold">Engaging leaders</strong>, <strong className="text-[#0f1337] font-semibold">Aspiring professionals</strong> and <strong className="text-[#0f1337] font-semibold">Visionary entrepreneurs</strong>.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start pt-16 md:pt-20">
            <div className="lg:col-span-4">
              <span className="font-black text-7xl md:text-8xl text-[#1a237e]/10 leading-none select-none block mb-4">02</span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f1337] tracking-tight">Our Vision</h3>
            </div>
            <div className="lg:col-span-8 lg:pt-6">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                Aspire envisions a world where people <strong className="text-[#0f1337] font-semibold">believe in themselves</strong> and live their true potential to make this world a <strong className="text-[#0f1337] font-semibold">better place to live</strong>.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          OFFERINGS — Light Glassmorphic Layout (matches Careers Core Values)
         ════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* Left — Sticky Heading */}
            <div className="lg:sticky lg:top-40">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-[#1a237e]/20"></span>
                <span className="text-[#1a237e] font-bold tracking-[0.2em] text-xs uppercase">What We Do</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-[#0f1337] leading-tight mb-6">
                Comprehensive Growth Ecosystem
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md mb-8">
                From public speaking to leadership development, our R&D-backed modules cover every aspect of human development.
              </p>

              {/* R&D Badge */}
              <div className="flex items-center gap-4 bg-[#f8f9fc] px-6 py-5 rounded-[2rem] border border-gray-100 shrink-0">
                <div className="p-3 bg-[#f5f6fa] rounded-full text-[#1a237e]">
                  <Microscope className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-[#0f1337] text-base tracking-tight">Research Backed R&D</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Methodology updated quarterly</p>
                </div>
              </div>
            </div>

            {/* Right — Stacked glassmorphism cards */}
            <div className="space-y-5 relative">
              {/* Colorful blobs behind the cards */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7c4dff] to-[#e040fb] rounded-full blur-[80px] opacity-30 -z-10 mix-blend-multiply"></div>
              <div className="absolute bottom-10 left-0 w-48 h-48 bg-gradient-to-tr from-[#448aff] to-[#536dfe] rounded-full blur-[60px] opacity-30 -z-10 mix-blend-multiply"></div>

              {[
                { title: "Training Programs", items: ["Leadership Development", "Entrepreneurship Development", "Personality Development", "Public Speaking", "Teachers Training", "Interview Skills & Techniques"] },
                { title: "Event Formats", items: ["Seminars & Keynotes", "Interactive Webinars", "Global Conferences", "Symposiums", "Residential Camps", "Hands-on Workshops", "Youth empowerment summit ‘YES’ Summit"] },
                { title: "Delivery Modes", items: ["Live Online Training", "In-Person Classroom", "Group Discussions", "Practical Assignments", "Blended Learning"] },
              ].map((category, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2rem] p-6 md:p-8 hover:bg-white/20 hover:border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-[0_20px_48px_0_rgba(26,35,126,0.1)] transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Glass sheen */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 pointer-events-none"></div>
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#1a237e]/5 rounded-full blur-2xl group-hover:bg-[#1a237e]/10 transition-colors duration-500 pointer-events-none"></div>

                  <h3 className="relative z-10 font-bold text-xl text-gray-900 mb-6 pb-4 border-b border-gray-100 group-hover:text-[#1a237e] transition-colors duration-300">
                    {category.title}
                  </h3>

                  <ul className="relative z-10 space-y-4">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex items-center justify-center h-5 w-5 rounded-full border border-[#1a237e]/20 text-[#3949ab] shrink-0 group-hover:bg-[#1a237e] group-hover:border-[#1a237e] group-hover:text-white transition-all duration-300">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HALL OF RECOGNITION — Preserved as-is
         ════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6 tracking-tight">Hall of Recognition</h2>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Our commitment to excellence has been recognized on national and international platforms by esteemed dignitaries.
            </p>
          </div>

          {/* Timeline Structure */}
          <div className="max-w-7xl mx-auto relative">
            {/* Center Line (Hidden on mobile, visible on md) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#1a237e]/0 via-[#1a237e]/20 to-[#1a237e]/0 -translate-x-1/2" />

            <div className="space-y-12 md:space-y-0 relative">
              {[
                { title: "Excellent Institute for Creating Leaders & Discovering Student Potential in India", year: "2019", org: "World Education Summit", guests: ["Hon'ble Sayed Shahnawaz Hussain", "Hon'ble Tarun Chugh", "Hon'ble Navin Sinha", "Hon'ble Mugdha Godse"], image: "/Excellent institute of creating leaders & discovering the potential in student in india.jpg" },
                { title: "The Most Innovative Institute for Human Development Training in India", year: "2019", org: "Human Development Awards", guests: ["Hon'ble Murli Manohar Joshi", "Hon'ble Adarsh Shastri", "Padma Shri Bajrang Punia", "Hon'ble Alok Mittal", "Hon'ble Gulshan Grover"], image: "/the most innovative istitute of human development training in india.jpg" },
                { title: "Social Impact Award 2018–19", year: "2018", org: "Pratigya Foundation", guests: ["Hon'ble Kiran Kher", "Hon'ble Shyam Jaju", "Hon'ble Laxmi Agarwal", "Hon'ble Namrata Goyal", "Hon'ble Poonam Dhillon", "Hon'ble Manoj Tiwari"], image: "/SOCIAL IMPACT AWARD 2018-19 FOR EMPOWERING SOCIETY THROUGH HUMAN DEVELOPMENT TRAINING PROGRAM.jpg" },
                { title: "Best Institute for Human Development Training in Maharashtra", year: "2018", org: "Education Excellence", guests: ["Padma Shri Sharmila Tagore", "Hon'ble Parshottam Rupala", "Hon'ble Dr. C. P. Thakur", "Hon'ble Anka Verma"], image: "/best institute of human development training in india.jpg" },
                { title: "National Achievers Award for Education Excellence", year: "2018", org: "Education Excellence", guests: ["Hon'ble Ram Niwas Goel", "Hon'ble Kanhaiya Lal Ganju", "Hon'ble Atishi Marlena"], image: "/NATIONAL ACHIEVERS AWARD FOR EDUCATION EXCELLENCE.jpg" }
              ].map((award, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}>

                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center z-10 group-hover:border-[#1a237e] transition-colors shadow-sm">
                    <Milestone className="h-4 w-4 text-[#3949ab]" />
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-[48%]" />

                  {/* Card Content — Compact Horizontal */}
                  <div className="w-full md:w-[48%] bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(26,35,126,0.12)] hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row group/card md:min-h-[280px]">

                    {/* Award Image — Left Side with soft fade transition */}
                    <div 
                      className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-32 md:w-86"
                      style={{
                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                      }}
                    >
                      {/* Responsive Desktop Fade override */}
                      <style jsx>{`
                        @media (min-width: 640px) {
                          div {
                            mask-image: linear-gradient(to right, black 50%, transparent 100%) !important;
                            -webkit-mask-image: linear-gradient(to right, black 50%, transparent 100%) !important;
                          }
                        }
                      `}</style>
                      <Image
                        src={award.image}
                        alt={award.title}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Year badge bottom of image */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a237e]/80 to-transparent px-3 py-3 z-10">
                        <span className="font-black text-xs text-white tracking-wider">{award.year}</span>
                      </div>
                    </div>

                    {/* Text Content — Right Side */}
                    <div className="p-5 md:p-6 flex flex-col justify-between flex-1 min-w-0">
                      <div className="min-h-[90px]">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#3949ab] mb-2">{award.org}</p>
                        <h3 className="font-bold text-base text-gray-900 leading-snug group-hover/card:text-[#1a237e] transition-colors duration-300">
                          {award.title}
                        </h3>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Honoured By</p>
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {award.guests.map((guest, i) => (
                            <span key={i} className="min-w-0 text-[10px] leading-tight font-semibold text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-2xl border border-gray-100 whitespace-normal break-words">
                              {guest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════════════
          SPECIAL GUESTS — Annual Function Special Guests
         ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative z-10 overflow-hidden" id="guests">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-[#1a237e]/20"></span>
                <span className="text-[#1a237e] font-bold tracking-[0.2em] text-xs uppercase">Annual Function</span>
              </div>
              <div className="flex items-start gap-6">
                <span className="font-black text-7xl md:text-8xl text-[#1a237e]/10 leading-none select-none hidden md:block shrink-0">03</span>
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f1337] leading-tight tracking-tight mb-4">
                    Special <span className="text-[#1a237e]">Guests</span>
                  </h2>
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
                    Moments with distinguished luminaries who have graced our Annual Functions, inspiring our community.
                  </p>
                </div>
              </div>
            </div>

            {/* Scroll Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => scrollGuest('left')}
                className="h-11 w-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a237e] hover:text-[#1a237e] hover:bg-[#1a237e]/5 transition-all duration-300"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollGuest('right')}
                className="h-11 w-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a237e] hover:text-[#1a237e] hover:bg-[#1a237e]/5 transition-all duration-300"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Carousel */}
          <div
            ref={guestScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {guestImages.map((img, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                variants={fadeUp}
                className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw]"
                onClick={() => openLightbox(i, 'guests')}
              >
                <div className="group relative overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_24px_0_rgba(31,38,135,0.04)] hover:shadow-[0_16px_48px_0_rgba(26,35,126,0.12)] transition-all duration-500 cursor-zoom-in">
                  {/* Glass sheen */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 pointer-events-none z-10"></div>

                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.caption}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 30vw"
                    />

                    {/* Bottom vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1337]/70 via-transparent to-transparent z-10"></div>

                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-20">
                      <div className="flex items-center gap-2 mb-1">
                        <Camera className="h-3 w-3 text-white/70" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Special Guests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════
          GALLERY — Moments That Define Us
         ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative z-10" id="gallery">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">

          {/* Section Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#1a237e]/20"></span>
              <span className="text-[#1a237e] font-bold tracking-[0.2em] text-xs uppercase">Gallery</span>
            </div>
            <div className="flex items-start gap-6">
              <span className="font-black text-7xl md:text-8xl text-[#1a237e]/10 leading-none select-none hidden md:block shrink-0">04</span>
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f1337] leading-tight tracking-tight mb-4">
                  Moments That <span className="text-[#1a237e]">Define Us</span>
                </h2>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
                  A visual journey through workshops, awards, international events and celebrations that have shaped the Aspire legacy.
                </p>
              </div>
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-5 [column-fill:_balance]">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                className="break-inside-avoid mb-4 md:mb-5"
              >
                <div 
                  onClick={() => openLightbox(i, 'gallery')}
                  className="group relative overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_24px_0_rgba(31,38,135,0.04)] hover:shadow-[0_16px_48px_0_rgba(26,35,126,0.12)] transition-all duration-500 hover:-translate-y-1 cursor-zoom-in"
                >
                  {/* Glass top sheen */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 pointer-events-none z-10"></div>

                  {/* Image */}
                  <div className={`relative w-full overflow-hidden ${img.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                    <Image
                      src={img.src}
                      alt={img.caption}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1337]/80 via-[#0f1337]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                    {/* Caption on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Camera className="h-3 w-3 text-white/70" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Aspire Gallery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CAMPUS — Our Campus
         ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative z-10 overflow-hidden" id="campus">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-[#1a237e]/20"></span>
                <span className="text-[#1a237e] font-bold tracking-[0.2em] text-xs uppercase">Campus</span>
              </div>
              <div className="flex items-start gap-6">
                <span className="font-black text-7xl md:text-8xl text-[#1a237e]/10 leading-none select-none hidden md:block shrink-0">05</span>
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f1337] leading-tight tracking-tight mb-4">
                    Our <span className="text-[#1a237e]">Campus</span>
                  </h2>
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
                    A purpose-built environment designed to inspire learning, foster collaboration, and ignite transformation.
                  </p>
                </div>
              </div>
            </div>

            {/* Scroll Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => scrollCampus('left')}
                className="h-11 w-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a237e] hover:text-[#1a237e] hover:bg-[#1a237e]/5 transition-all duration-300"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollCampus('right')}
                className="h-11 w-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a237e] hover:text-[#1a237e] hover:bg-[#1a237e]/5 transition-all duration-300"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Carousel */}
          <div
            ref={campusScrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {campusImages.map((img, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                variants={fadeUp}
                className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw]"
                onClick={() => openLightbox(i, 'campus')}
              >
                <div className="group relative overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_24px_0_rgba(31,38,135,0.04)] hover:shadow-[0_16px_48px_0_rgba(26,35,126,0.12)] transition-all duration-500 cursor-zoom-in">
                  {/* Glass sheen */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 pointer-events-none z-10"></div>

                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.caption}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 30vw"
                    />

                    {/* Bottom vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1337]/70 via-transparent to-transparent z-10"></div>

                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-20">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-3 w-3 text-white/70" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Campus</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          WHY CHOOSE ASPIRE — Clean editorial CTA
         ════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-16 items-start">

              {/* Left — Heading */}
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                  Why Choose <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a237e] to-[#3949ab]">Aspire?</span>
                </h2>
                <p className="text-gray-500 text-lg font-light leading-relaxed">
                  Our institute carries 17+ years of meaningful work in education, built on consistency, trust and credibility. We do not simply conduct courses; we help individuals unlock their potential.
                </p>
              </div>

              {/* Right — List */}
              <div className="lg:col-span-7">
                <div className="space-y-4">
                  {[
                    "Largest personal & professional development institute in India",
                    "Meticulously designed courses by skilled R&D Department",
                    "Abundant success stories of our learners",
                    "Vibrant curriculum for young and professional learners",
                    "Unique methodology with a pragmatic approach",
                    "Flexible Online & In-Person training models"
                  ].map((item, i) => (
                    <div key={i} className="group relative flex items-start gap-6 p-6 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:border-[#1a237e]/15 hover:shadow-[0_8px_30px_rgb(26,35,126,0.06)] transition-all duration-500 overflow-hidden">
                      {/* Hover accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a237e] to-[#3949ab] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl"></div>

                      <div className="mt-0.5 h-8 w-8 rounded-full border border-[#1a237e]/20 flex items-center justify-center text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                      <span className="text-gray-600 text-lg group-hover:text-[#1a237e] transition-colors duration-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ────────────────────────────────────────────────
          LIGHTBOX MODAL
         ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedImage && currentImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f1337]/95 backdrop-blur-md p-4 md:p-10"
            onClick={closeLightbox}
          >
            {/* Controls */}
            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={closeLightbox}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-20 hidden sm:block"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-20 hidden sm:block"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Image Container */}
            <motion.div
              layoutId={`modal-image-${selectedImage.type}-${selectedImage.index}`}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh] md:h-[80vh]">
                <Image
                  src={currentImageData.src}
                  alt={currentImageData.caption}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <div className="mt-8 text-center max-w-2xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="h-px w-6 bg-[#1a237e]/10"></span>
                  <span className="text-[#1a237e]/60 font-medium tracking-[0.2em] text-[10px] uppercase">
                    {selectedImage.type === 'gallery' ? 'Aspire Gallery' : (selectedImage.type === 'campus' ? 'Aspire Campus' : 'Special Guests')}
                  </span>
                  <span className="h-px w-6 bg-[#1a237e]/10"></span>
                </div>
                <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase">
                  Image {selectedImage.index + 1} of {(selectedImage.type === 'gallery' ? galleryImages : (selectedImage.type === 'campus' ? campusImages : guestImages)).length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
