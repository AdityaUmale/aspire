'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';


interface Course {
  _id: string;
  courseName: string;
  description: string;
  courseDate?: string;
  courseOutline?: string | string[];
}

export default function AdminDashboardPage() {
  const [totalEnquiries, setTotalEnquiries] = useState<number | string>('--');
  const [pendingArticles, setPendingArticles] = useState<number | string>('--');
  const [pendingEnquiriesCount, setPendingEnquiriesCount] = useState<number | string>('--'); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  useEffect(() => {
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

    async function fetchCourses() {
      setCoursesLoading(true);
      try {
        const response = await fetch('/api/course');
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
      setCoursesLoading(false);
    }

    fetchDashboardData();
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"?`)) {
      return;
    }

    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const response = await fetch(`/api/course?id=${courseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete course');
      }

      setDeleteSuccess('Course deleted successfully!');
      setCourses(courses.filter(course => course._id !== courseId));
      
      // Clear success message after 3 seconds
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete course. Please try again.';
      setDeleteError(errorMessage);
    }
  };

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

      {/* Courses Management Section */}
      <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-[#1a237e]">Manage Upcoming Courses</h2>
          <p className="text-sm text-gray-500">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>

        {deleteError && (
          <Alert variant="destructive" className="mb-4 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}

        {deleteSuccess && (
          <Alert className="mb-4 bg-green-100/50 border-green-300/50 text-green-800 rounded-lg shadow-sm">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{deleteSuccess}</AlertDescription>
          </Alert>
        )}

        {coursesLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming courses yet. Add courses from the sidebar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1a237e] mb-2">{course.courseName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                    {course.courseDate && (
                      <p className="text-xs text-gray-500">
                        Start Date: {format(new Date(course.courseDate), 'PPP')}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCourse(course._id, course.courseName)}
                    className="ml-4 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
