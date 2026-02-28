'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight, PenTool, ChevronDown, FileText, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [articlesDropdown, setArticlesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for the "Island" navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdown seamlessly
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setArticlesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => window.innerWidth >= 768 && setIsOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none pt-4 lg:pt-6 px-4 transition-all duration-500 ease-out">
      <div
        className={`
          w-full max-w-5xl pointer-events-auto transition-all duration-500
          ${scrolled ? 'translate-y-0' : 'translate-y-2'}
        `}
      >
        {/* The Glass Island */}
        <nav
          className={`
            relative mx-auto bg-white/90 backdrop-blur-2xl border border-gray-200 
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isOpen ? 'rounded-[2rem] shadow-2xl bg-white' : 'rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'}
          `}
        >
          <div className="flex h-16 lg:h-18 items-center justify-between px-5 lg:px-8">

            {/* Logo Section */}
            <Link
              href="/"
              className="group flex items-center gap-3 z-20 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-[#1a237e]/50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                <Image
                  src="/logo1.png"
                  alt="Aspire Logo"
                  width={72}
                  height={72}
                  sizes="72px"
                  className="h-9 w-auto object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-lg lg:text-xl text-[#1a237e] tracking-tight group-hover:text-[#3949ab] transition-colors duration-300">
                Aspire Institute
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 z-10">
              <NavLink href="/success-stories">Success Stories</NavLink>
              <NavLink href="/about-us">About Us</NavLink>
              <NavLink href="/careers">Careers</NavLink>

              {/* Articles Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setArticlesDropdown(!articlesDropdown)}
                  aria-expanded={articlesDropdown}
                  aria-haspopup="true"
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-[#1a237e]/50
                    ${articlesDropdown ? 'text-[#1a237e] bg-[#1a237e]/5' : 'text-gray-600 hover:text-[#1a237e]'}
                  `}
                >
                  <span className="absolute inset-0 rounded-full bg-[#1a237e]/5 scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                  <FileText className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Articles</span>
                  <ChevronDown className={`h-3.5 w-3.5 relative z-10 transition-transform duration-300 ease-out ${articlesDropdown ? 'rotate-180 text-[#1a237e]' : 'text-gray-400 group-hover:text-[#1a237e]'}`} />
                </button>

                {/* Dropdown Menu - Premium Bento Style */}
                {articlesDropdown && (
                  <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
                    <div className="flex flex-col gap-1">
                      <DropdownLink href="/publish-article" icon={PenTool} onClick={() => setArticlesDropdown(false)}>
                        Publish Article
                      </DropdownLink>
                      <DropdownLink href="/student-articles" icon={FileText} onClick={() => setArticlesDropdown(false)}>
                        Student Articles
                      </DropdownLink>
                      <DropdownLink href="/articles" icon={FileText} onClick={() => setArticlesDropdown(false)}>
                        Founder&apos;s Articles
                      </DropdownLink>
                    </div>
                  </div>
                )}
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-gray-200 mx-2" />

              {/* Highlighted CTA */}
              <Link
                href="/#courses"
                className="group relative flex items-center gap-2 px-5 py-2.5 ml-1 text-sm font-sans font-medium text-white bg-[#1a237e] rounded-full overflow-hidden transition-all duration-300 shadow-[0_4px_14px_0_rgba(26,35,126,0.3)] hover:shadow-[0_6px_20px_rgba(26,35,126,0.4)] hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1a237e]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <FileText className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Explore Programs</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-20 p-2.5 rounded-full text-gray-700 bg-gray-50/50 hover:bg-[#1a237e]/10 hover:text-[#1a237e] transition-colors border border-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-[#1a237e]/50"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu Dropdown - Smooth morphing expansion */}
          <div
            className={`
              md:hidden grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
            `}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-6 pt-2 space-y-2 border-t border-gray-100/50 mt-2">
                <MobileNavLink href="/#courses" onClick={() => setIsOpen(false)} highlight>
                  Explore Programs
                </MobileNavLink>
                <MobileNavLink href="/success-stories" onClick={() => setIsOpen(false)}>
                  Success Stories
                </MobileNavLink>
                <MobileNavLink href="/about-us" onClick={() => setIsOpen(false)}>
                  About Us
                </MobileNavLink>
                <MobileNavLink href="/careers" onClick={() => setIsOpen(false)}>
                  Careers
                </MobileNavLink>

                {/* Mobile Articles Section */}
                <div className="pt-4 pb-2">
                  <div className="px-4 pb-3 text-[10px] font-bold text-[#1a237e]/50 uppercase tracking-[0.2em]">
                    Articles
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-2 space-y-1 border border-gray-100">
                    <MobileNavLink href="/publish-article" onClick={() => setIsOpen(false)} nested>
                      Publish Article
                    </MobileNavLink>
                    <MobileNavLink href="/student-articles" onClick={() => setIsOpen(false)} nested>
                      Student Articles
                    </MobileNavLink>
                    <MobileNavLink href="/articles" onClick={() => setIsOpen(false)} nested>
                      Founder&apos;s Articles
                    </MobileNavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

// Sub-component for Desktop Links with Refined "Pill" Hover
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 rounded-full text-sm font-sans font-medium text-gray-600 transition-all duration-300 hover:text-[#1a237e] group outline-none focus-visible:ring-2 focus-visible:ring-[#1a237e]/50"
    >
      <span className="absolute inset-0 rounded-full bg-[#1a237e]/5 scale-75 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

// Sub-component for Desktop Dropdown Links
function DropdownLink({ href, onClick, icon: Icon, children }: { href: string; onClick: () => void; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#1a237e] hover:bg-[#1a237e]/5 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white border border-gray-100 shadow-sm group-hover:border-[#1a237e]/20 group-hover:text-[#1a237e] transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <span>{children}</span>
      </div>
      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 text-[#1a237e] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
    </Link>
  );
}

// Sub-component for Mobile Links
function MobileNavLink({
  href,
  onClick,
  children,
  highlight = false,
  nested = false
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  highlight?: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all group active:scale-[0.98]
        ${highlight
          ? 'bg-[#1a237e] text-white shadow-md hover:bg-[#283593]'
          : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-[#1a237e] border border-transparent hover:border-gray-100'}
        ${nested ? 'py-3 text-[13px] bg-transparent hover:bg-white' : ''}
      `}
    >
      <span>{children}</span>
      <ChevronRight className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${highlight ? 'text-white/70' : 'text-gray-400 group-hover:text-[#1a237e]'}`} />
    </Link>
  );
}
