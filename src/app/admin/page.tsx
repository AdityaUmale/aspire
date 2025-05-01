import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        Admin Control Panel
      </div>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/60">
        <h1 className="text-3xl font-bold text-[#1a237e] mb-3">Welcome Back, Admin</h1>
        <p className="text-gray-600 md:text-lg">Select an option from the sidebar to manage your content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/60 transform transition-transform hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8eaf6]">
              <svg className="h-5 w-5 text-[#1a237e]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#1a237e]">Quick Stats</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>Total Articles: --</p>
            <p>Pending Reviews: --</p>
            <p>Active Courses: --</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/60 transform transition-transform hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8eaf6]">
              <svg className="h-5 w-5 text-[#1a237e]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#1a237e]">Recent Activity</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
