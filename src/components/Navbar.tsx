import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full relative h-24 pl-8">
      {/* Blue gradient overlay fading from top to bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a237e] to-transparent"></div>
      
      {/* Semi-transparent white background with blur effect */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>
      
      <div className="container relative flex h-20 items-center px-2 md:pl-6">
        {/* Logo and brand name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            // Correct the path here
            src="/logo1.png" 
            alt="Aspire Institute Logo"
            width={40}
            height={40}
            className="h-8 w-auto ml-10"
          />
          <span className="text-xl font-bold text-[#1a237e]">Aspire Institute</span>
        </Link>
        
        {/* Navigation links */}
        <nav className="hidden md:flex gap-8 ml-auto mr-24"> {/* Adjusted margin for spacing */}
          {/* Existing Links - Filtered */}
          {[ "Mission & Vision"].map((item) => ( // Removed "About Us", "Founder", "Contact"
            <Link
              key={item}
              className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full"
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {item}
            </Link>
          ))}
          {/* New Article Links */}
           <Link
              key="Courses"
              className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full"
              href="/courses" // Changed to navigate to /courses page
            >
              Courses
            </Link>
          <Link
              key="Publish Article"
              className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full"
              href="/publish-article"
            >
              Publish Article
            </Link>
             <Link
              key="Student Articles"
              className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full"
              href="/student-articles"
            >
              Student Articles
            </Link>
             <Link
              key="Founder Articles"
              className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full"
              href="/articles"
            >
              Founder's Articles
            </Link>
        </nav>
        
        {/* Social Icons */} 
        <div className="flex items-center gap-4"> {/* Removed margin */}
          <Instagram/>
          <Facebook/>
          <Linkedin/>
          <Twitter/>
        </div>
      </div>
    </header>
  );
}