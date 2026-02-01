'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, PenTool, ChevronDown, FileText } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [articlesDropdown, setArticlesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for the "Island" navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (articlesDropdown && !(event.target as Element).closest('.articles-dropdown')) {
        setArticlesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [articlesDropdown]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none">
      <div className={`w-full max-w-7xl px-4 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4 lg:py-6'}`}>

        {/* The Glass Island */}
        <nav
          className={`
            relative mx-auto rounded-2xl pointer-events-auto
            bg-[#e3e4e8]/95 backdrop-blur-xl 
            border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
            transition-all duration-300 ease-in-out
            ${scrolled ? 'shadow-[0_8px_30px_rgb(0,0,0,0.08)]' : ''}
          `}
        >
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">

            {/* Logo Section */}
            <Link href="/" className="group flex items-center gap-3 z-10">


              <Image
                src="/logo1.png"
                alt="Aspire Logo"
                width={72}
                height={72}
                className="h-10 w-auto"
              />


              <span className="font-bold text-lg lg:text-xl text-[#1a237e] tracking-tight group-hover:text-[#3949ab] transition-colors">
                Aspire Institute
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 z-10">
              <NavLink href="/success-stories">Success Stories</NavLink>
              <NavLink href="/about-us">About Us</NavLink>

              {/* Articles Dropdown */}
              <div className="relative articles-dropdown">
                <button
                  onClick={() => setArticlesDropdown(!articlesDropdown)}
                  className="relative px-4 py-2 text-sm font-sans font-medium text-gray-700 transition-all duration-300 hover:text-[#1a237e] group flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span className="relative z-10">Articles</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${articlesDropdown ? 'rotate-180' : ''}`} />
                  <span className="absolute inset-0 rounded-lg bg-[#1a237e]/10 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"></span>
                </button>

                {/* Dropdown Menu */}
                {articlesDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_10px_30px_rgb(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
                    <Link
                      href="/publish-article"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#f0f1fa] hover:text-[#1a237e] transition-colors"
                      onClick={() => setArticlesDropdown(false)}
                    >
                      <PenTool className="h-4 w-4" />
                      Publish Article
                    </Link>
                    <Link
                      href="/student-articles"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#f0f1fa] hover:text-[#1a237e] transition-colors"
                      onClick={() => setArticlesDropdown(false)}
                    >
                      <FileText className="h-4 w-4" />
                      Student Articles
                    </Link>
                    <Link
                      href="/articles"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#f0f1fa] hover:text-[#1a237e] transition-colors"
                      onClick={() => setArticlesDropdown(false)}
                    >
                      <FileText className="h-4 w-4" />
                      Founder&apos;s Articles
                    </Link>
                  </div>
                )}
              </div>

              {/* Highlighted CTA */}
              <div className="pl-2 ml-2 border-l border-[#1a237e]/20">
                <Link
                  href="/#courses"
                  className="group flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium text-white bg-[#1a237e] hover:bg-[#283593] rounded-xl transition-all shadow-[0_4px_14px_0_rgba(26,35,126,0.39)] hover:shadow-[0_6px_20px_rgba(26,35,126,0.23)] hover:-translate-y-0.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Explore Programs</span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-[#1a237e]/10 hover:text-[#1a237e] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu Dropdown - Integrated into the Island */}
          <div
            className={`
              md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isOpen ? 'max-h-[450px] opacity-100 pb-4' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="px-4 space-y-1 pt-2 border-t border-[#1a237e]/10">
              <MobileNavLink href="/#courses" onClick={() => setIsOpen(false)}>
                Explore Programs
              </MobileNavLink>
              <MobileNavLink href="/success-stories" onClick={() => setIsOpen(false)}>
                Success Stories
              </MobileNavLink>
              <MobileNavLink href="/about-us" onClick={() => setIsOpen(false)}>
                About Us
              </MobileNavLink>

              {/* Articles Section */}
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Articles</div>
                <MobileNavLink href="/publish-article" onClick={() => setIsOpen(false)}>
                  Publish Article
                </MobileNavLink>
                <MobileNavLink href="/student-articles" onClick={() => setIsOpen(false)}>
                  Student Articles
                </MobileNavLink>
                <MobileNavLink href="/articles" onClick={() => setIsOpen(false)}>
                  Founder&apos;s Articles
                </MobileNavLink>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

// Sub-component for Desktop Links with "Pill" Hover
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-sm font-sans font-medium text-gray-700 transition-all duration-300 hover:text-[#1a237e] group"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-lg bg-[#1a237e]/10 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"></span>
    </Link>
  );
}

// Sub-component for Mobile Links
function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#1a237e]/10 hover:text-[#1a237e] transition-all group"
    >
      <span>{children}</span>
      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[#1a237e]" />
    </Link>
  );
}