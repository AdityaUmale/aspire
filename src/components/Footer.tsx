'use client';

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-40 overflow-hidden z-10">

      <div className="container relative z-10 px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">

          {/* --- Brand Column --- */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Logo Block */}
              <div className="inline-flex items-center gap-3 p-3 pl-0 rounded-2xl transition-all">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl">
                  <Image
                    src="/logo1.png"
                    alt="Aspire Institute Logo"
                    width={56}
                    height={56}
                    sizes="56px"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-[#1a237e] leading-tight tracking-tight">
                    Aspire - The Institute of Human Development
                  </span>
                </div>
              </div>

              <p className="font-sans text-gray-500 text-base leading-relaxed max-w-md font-light">
                Unlocking potential from classrooms to careers. We are dedicated to shaping the future, one learner at a time, through world-class training and mentorship.
              </p>
            </div>

            {/* Social Icons - Premium Glass Style */}
            <div className="flex items-center gap-4">
              {[
                { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/aspire-the-institute-of-human-development/" },
                { icon: FaInstagram, href: "https://www.instagram.com/official_aspire_institute/" },
                { icon: FaFacebookF, href: "https://www.facebook.com/share/17VrNSbnhG/" },
                { icon: FaXTwitter, href: "https://x.com/AspireTIHD" }
              ].map((Social, index) => (
                <Link
                  key={index}
                  href={Social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a237e]/5 border border-[#1a237e]/10 text-[#1a237e] transition-all duration-500 overflow-hidden hover:text-white hover:border-transparent hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(26,35,126,0.3)]"
                >
                  {/* Hover background layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] to-[#3949ab] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon */}
                  <Social.icon className="relative z-10 h-5 w-5 transition-transform duration-500 group-hover:rotate-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* --- Navigation & Contact Columns --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:pl-8">
            <div>
              <h3 className="font-bold text-xl text-[#1a237e] mb-6">Explore</h3>
              <ul className="space-y-4 font-sans">
                {[
                  { name: "Our Founder", href: "/founder" },
                  { name: "Success Stories", href: "/success-stories" },
                  { name: "Salute Learning Spirit", href: "/salute-learning-spirit" },
                  { name: "Our Team", href: "/team" },
                  { name: "About Us", href: "/about-us" },
                  { name: "Careers", href: "/careers" }
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

            <div>
              <h3 className="font-bold text-xl text-[#1a237e] mb-6">Contact Us</h3>
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
      </div>
    </footer>
  );
}
