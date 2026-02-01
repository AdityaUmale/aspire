'use client';

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, Linkedin, Instagram, Facebook, Twitter, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#FAFAFA] pt-20 pb-10 overflow-hidden border-t border-[#1a237e]/5">

      {/* 1. Atmospheric Background Layers (Matching Parent Vibe) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Radial Gradient - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[80px] opacity-60"></div>
        {/* Soft Radial Gradient - Top Left */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#3949ab]/5 to-transparent blur-[80px] opacity-40"></div>

        {/* Grain Texture (Consistent with Home) */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">

          {/* --- Brand Column --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {/* Logo Block */}
              <div className="inline-flex items-center gap-3 p-3 pl-0 rounded-2xl transition-all">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[#1a237e]/10 shadow-sm bg-white p-1">
                  <Image
                    src="/logo1.png"
                    alt="Aspire Institute Logo"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold text-[#1a237e] leading-tight tracking-tight">
                    Aspire - The Institute of Human Development
                  </span>
                </div>
              </div>

              <p className="font-sans text-gray-500 text-base leading-relaxed max-w-md font-light">
                Unlocking potential from classrooms to careers. We are dedicated to shaping the future, one learner at a time, through world-class training and mentorship.
              </p>
            </div>

            {/* Social Icons - Styled like the parent's "Ghost Buttons" */}
            <div className="flex items-center gap-3">
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/company/aspire-the-institute-of-human-development/" },
                { icon: Instagram, href: "https://www.instagram.com/official_aspire_institute/" },
                { icon: Facebook, href: "https://www.facebook.com/share/17VrNSbnhG/" },
                { icon: Twitter, href: "https://x.com/AspireTIHD" }
              ].map((Social, index) => (
                <Link
                  key={index}
                  href={Social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a237e] shadow-sm transition-all duration-300 hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] hover:-translate-y-1"
                >
                  <Social.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* --- Navigation Columns --- */}
          <div className="lg:col-span-3 lg:pl-8">
            <h3 className="font-serif text-xl font-semibold text-[#1a237e] mb-6">Explore</h3>
            <ul className="space-y-4 font-sans">
              {[
                { name: "Our Founder", href: "/founder" },
                { name: "Success Stories", href: "/success-stories" },
                { name: "Salute Learning Spirit", href: "/salute-learning-spirit" },
                { name: "Our Team", href: "/team" },
                { name: "About Us", href: "/about-us" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a237e] transition-colors duration-300"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#3949ab]" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Contact Column --- */}
          <div className="lg:col-span-4">
            <h3 className="font-serif text-xl font-semibold text-[#1a237e] mb-6">Contact Us</h3>
            <ul className="space-y-6 font-sans">
              <li className="flex items-start gap-4 group">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f0f1fa] text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#3949ab] uppercase tracking-wider">Headquarters</span>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                    Sahakar Nagar, Gaurakhshan Road,<br />
                    Akola - 444001, Maharashtra (India)
                  </p>
                </div>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f0f1fa] text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#3949ab] uppercase tracking-wider">Email</span>
                  <a href="mailto:infoaspire2009@gmail.com" className="text-sm text-gray-600 hover:text-[#1a237e] transition-colors">
                    infoaspire2009@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f0f1fa] text-[#1a237e] group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#3949ab] uppercase tracking-wider">Phone</span>
                  <a href="tel:+918275726016" className="text-sm text-gray-600 hover:text-[#1a237e] transition-colors">
                    +91-8275726016 / 17
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>


      </div>
    </footer>
  );
}