import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9] -z-10"></div>
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.03] mix-blend-soft-light -z-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a237e]/5 rounded-bl-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1a237e]/5 blur-3xl -z-10"></div>

        {/* Sidebar */}
        <aside className="relative z-10 w-64 bg-white/90 backdrop-blur-md border-r border-[#1a237e]/10 p-6 space-y-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#1a237e]">Admin Dashboard</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admin/courses" 
                  className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-gray-700 hover:bg-[#e8eaf6] hover:text-[#1a237e] transition-all duration-200"
                >
                  <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-1"></span>
                  Add Upcoming Courses
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/articles" 
                  className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-gray-700 hover:bg-[#e8eaf6] hover:text-[#1a237e] transition-all duration-200"
                >
                  <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-1"></span>
                  Add an Article
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/review-articles" 
                  className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-gray-700 hover:bg-[#e8eaf6] hover:text-[#1a237e] transition-all duration-200"
                >
                  <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-1"></span>
                  Review Articles
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}