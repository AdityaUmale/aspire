import React from 'react';
import Link from 'next/link'; // Import Link for client-side navigation

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-semibold mb-6">Admin Menu</h2>
        <nav>
          <ul>
            <li>
              {/* Use Link component and absolute paths */}
              <Link href="/admin/courses" className="block py-2 px-4 rounded hover:bg-gray-700">
                Add Upcoming Courses
              </Link>
            </li>
            <li>
              <Link href="/admin/articles" className="block py-2 px-4 rounded hover:bg-gray-700">
                Add an Article
              </Link>
            </li>
            {/* Add more sidebar links here */}
            <li>
              <Link href="/admin/review-articles" className="block py-2 px-4 rounded hover:bg-gray-700">
                Review Articles
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area - Renders the specific page content */}
      <main className="flex-1 p-6 overflow-y-auto"> {/* Added overflow-y-auto */}
        {children}
      </main>
    </div>
  );
}