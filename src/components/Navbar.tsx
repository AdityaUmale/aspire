'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
        <nav className="relative rounded-2xl backdrop-blur-md bg-white/95 shadow-2xl border border-gray-200/30">
          <div className="relative flex h-16 lg:h-20 items-center justify-between px-4 lg:px-8">
            {/* Logo and brand name - Smaller on mobile */}
            <Link href="/" className="flex items-center gap-1 lg:gap-2 z-10 relative">
              <Image
                src="/logo1.png" 
                alt="Aspire Institute Logo"
                width={48}
                height={48}
                className="h-8 w-auto lg:h-10"
              />
              <span className="text-sm lg:text-lg xl:text-xl font-bold text-[#1a237e]">Aspire Institute</span>
            </Link>
            
            {/* Desktop Article links */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 z-10 relative">
              <Link
                className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full whitespace-nowrap"
                href="/publish-article"
              >
                Publish Article
              </Link>
              <Link
                className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full whitespace-nowrap"
                href="/student-articles"
              >
                Student Articles
              </Link>
              <Link
                className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full whitespace-nowrap"
                href="/articles"
              >
                Founder&apos;s Articles
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-[#1a237e] hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-xl shadow-2xl border border-gray-200/30 backdrop-blur-md py-4 animate-in slide-in-from-top-5">
              <nav className="flex flex-col space-y-1">
                <Link
                  href="/publish-article"
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#e8eaf6] hover:text-[#1a237e] transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Publish Article
                </Link>
                <Link
                  href="/student-articles"
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#e8eaf6] hover:text-[#1a237e] transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Student Articles
                </Link>
                <Link
                  href="/articles"
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#e8eaf6] hover:text-[#1a237e] transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Founder&apos;s Articles
                </Link>
              </nav>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}