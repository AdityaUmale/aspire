'use client';

import React, { useEffect, useState } from 'react';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  enquiry: string;
  createdAt: string;
  // Add other fields if necessary, e.g., reviewed: boolean;
}

export default function AdminDashboardPage() {
  const [totalEnquiries, setTotalEnquiries] = useState<number | string>('--');
  const [pendingArticles, setPendingArticles] = useState<number | string>('--');
  // We can refine this once we know how to determine 'pending' enquiries
  const [pendingEnquiriesCount, setPendingEnquiriesCount] = useState<number | string>('--'); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace your existing fetchDashboardData function with this:
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/dashboard-stats');
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setTotalEnquiries(data.data.totalEnquiries);
          setPendingEnquiriesCount(data.data.pendingEnquiries);
          setPendingArticles(data.data.pendingArticles);
          // You can also add more stats if needed
        } else {
          throw new Error(data.message || 'Failed to fetch dashboard stats');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        setTotalEnquiries('Error');
        setPendingArticles('Error');
        setPendingEnquiriesCount('Error');
      }
      setIsLoading(false);
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        Admin Control Panel
      </div>

      <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1a237e] mb-3">Welcome Back, Admin</h1>
        <p className="text-gray-600 text-sm lg:text-lg">Select an option from the sidebar to manage your content.</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
        <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60 transform transition-transform hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-[#e8eaf6]">
              <svg className="h-4 w-4 lg:h-5 lg:w-5 text-[#1a237e]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Using a generic stats icon, can be changed */}
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
              </svg>
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-[#1a237e]">Quick Stats</h2>
          </div>
          <div className="space-y-2 text-sm lg:text-base text-gray-600">
            <p>Total Enquiries: {isLoading ? 'Loading...' : totalEnquiries}</p>
            <p>Pending Enquiries: {isLoading ? 'Loading...' : pendingEnquiriesCount}</p>
            <p>Pending Articles for Review: {isLoading ? 'Loading...' : pendingArticles}</p>
            <p>Active Courses: --</p> {/* Kept existing placeholder */}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60 transform transition-transform hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-[#e8eaf6]">
              <svg className="h-4 w-4 lg:h-5 lg:w-5 text-[#1a237e]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-[#1a237e]">Recent Activity</h2>
          </div>
          <div className="space-y-2 text-sm lg:text-base text-gray-600">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
