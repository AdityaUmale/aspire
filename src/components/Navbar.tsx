import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container flex h-20 items-center justify-between px-2 md:pl-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image%202-wKlvojVmZKfsKl6SY0T2zX1H92pLQT.jpeg"
            alt="Aspire Institute Logo"
            width={48}
            height={48}
            className="h-12 w-auto ml-10"
          />
          <span className="text-xl font-bold text-[#1a237e]">Aspire Institute</span>
        </Link>
        <nav className="hidden md:flex gap-8 ml-10">
          {["Courses", "About Us", "Founder", "Mission & Vision", "Contact"].map((item) => (
            <Link
              key={item}
              className="text-sm font-medium text-gray-600 hover:text-[#1a237e] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#1a237e] after:transition-all hover:after:w-full"
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-8">
          <Button className="bg-[#1a237e] hover:bg-[#0d1642] shadow-md transition-all duration-300 hover:shadow-lg hidden md:flex">
            Get Started
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-16 text-[#1a237e]" />
          </Button>
        </div>
      </div>
    </header>
  );
}