'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { Terminal, CheckCircle, Trash2, Pencil, CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { COURSE_SECTIONS, getCourseSectionLabel, type CourseSection } from '@/lib/course-config';


interface Course {
  _id: string;
  courseName: string;
  description: string;
  courseDate?: string;
  courseOutline?: string | string[];
  courseTime?: string;
  courseDayLabel?: string;
  section?: string;
  sourceMonthLabel?: string;
}

interface EditFormState {
  courseName: string;
  description: string;
  courseOutlineStr: string;
  courseDate: Date | undefined;
  courseTime: string;
  courseDayLabel: string;
  section: CourseSection;
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

  // Edit state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    courseName: '',
    description: '',
    courseOutlineStr: '',
    courseDate: undefined,
    courseTime: '',
    courseDayLabel: '',
    section: 'REGULAR',
  });
  const [editCalendarOpen, setEditCalendarOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Close modal on backdrop click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseEdit();
    };
    if (editingCourse) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCourse]);

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

  const handleOpenEdit = (course: Course) => {
    const outlineArray = Array.isArray(course.courseOutline)
      ? course.courseOutline
      : course.courseOutline
        ? course.courseOutline.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    setEditForm({
      courseName: course.courseName,
      description: course.description,
      courseOutlineStr: outlineArray.join(', '),
      courseDate: course.courseDate ? new Date(course.courseDate) : undefined,
      courseTime: course.courseTime || '',
      courseDayLabel: course.courseDayLabel || '',
      section: (course.section as CourseSection) || 'REGULAR',
    });
    setEditError(null);
    setEditSuccess(null);
    setEditingCourse(course);
  };

  const handleCloseEdit = () => {
    setEditingCourse(null);
    setEditError(null);
    setEditSuccess(null);
    setEditCalendarOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);

    const courseOutline = editForm.courseOutlineStr
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!editForm.courseName || !editForm.description || courseOutline.length === 0 || !editForm.courseDate) {
      setEditError('Please fill in all required fields, including the start date.');
      setEditLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/course?id=${editingCourse._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: editForm.courseName,
          description: editForm.description,
          courseOutline,
          courseDate: editForm.courseDate,
          courseTime: editForm.courseTime,
          courseDayLabel: editForm.courseDayLabel,
          section: editForm.section,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update course');
      }

      // Update course in local state
      setCourses((prev) =>
        prev.map((c) =>
          c._id === editingCourse._id
            ? {
                ...c,
                courseName: editForm.courseName,
                description: editForm.description,
                courseOutline,
                courseDate: editForm.courseDate!.toISOString(),
                courseTime: editForm.courseTime,
                courseDayLabel: editForm.courseDayLabel,
                section: editForm.section,
              }
            : c
        )
      );

      setEditSuccess('Course updated successfully!');
      setTimeout(() => {
        handleCloseEdit();
      }, 1200);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update course. Please try again.';
      setEditError(errorMessage);
    } finally {
      setEditLoading(false);
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
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#1a237e]">{course.courseName}</h3>
                      {course.section && course.section !== 'REGULAR' && (
                        <Badge className="bg-[#eef2ff] text-[#1a237e] hover:bg-[#eef2ff]">
                          {getCourseSectionLabel(course.section)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                    {course.courseDate && (
                      <p className="text-xs text-gray-500">
                        Start Date: {format(new Date(course.courseDate), 'PPP')}
                      </p>
                    )}
                    {(course.courseTime || course.courseDayLabel) && (
                      <p className="mt-1 text-xs text-gray-500">
                        {[course.courseTime, course.courseDayLabel].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {course.sourceMonthLabel && (
                      <p className="mt-1 text-xs text-gray-400">Source: {course.sourceMonthLabel}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(course)}
                      className="border-[#1a237e]/30 text-[#1a237e] hover:bg-[#eef2ff] hover:border-[#1a237e]"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCourse(course._id, course.courseName)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseEdit();
          }}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 rounded-t-2xl">
              <h2 className="text-xl font-bold text-[#1a237e]">Edit Course</h2>
              <button
                type="button"
                onClick={handleCloseEdit}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-5">
              {editError && (
                <Alert variant="destructive" className="bg-red-100/50 border-red-300/50 text-red-800 rounded-lg">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{editError}</AlertDescription>
                </Alert>
              )}

              {editSuccess && (
                <Alert className="bg-green-100/50 border-green-300/50 text-green-800 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{editSuccess}</AlertDescription>
                </Alert>
              )}

              {/* Course Name */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-courseName" className="text-sm font-medium text-gray-700">
                  Course Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-courseName"
                  value={editForm.courseName}
                  onChange={(e) => setEditForm((f) => ({ ...f, courseName: e.target.value }))}
                  placeholder="e.g. Project Management Professional"
                  required
                  className="border-gray-300 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the course"
                  rows={3}
                  required
                  className="border-gray-300 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
                />
              </div>

              {/* Course Highlights */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-outline" className="text-sm font-medium text-gray-700">
                  Course Highlights <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-outline"
                  value={editForm.courseOutlineStr}
                  onChange={(e) => setEditForm((f) => ({ ...f, courseOutlineStr: e.target.value }))}
                  placeholder="Comma-separated highlights, e.g. Risk Management, Agile, Scheduling"
                  rows={2}
                  required
                  className="border-gray-300 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
                />
                <p className="text-xs text-gray-400">Separate each highlight with a comma.</p>
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Popover open={editCalendarOpen} onOpenChange={setEditCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal border-gray-300',
                        !editForm.courseDate && 'text-gray-400'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {editForm.courseDate ? format(editForm.courseDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editForm.courseDate}
                      onSelect={(date) => {
                        setEditForm((f) => ({ ...f, courseDate: date }));
                        setEditCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time & Day Label */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-courseTime" className="text-sm font-medium text-gray-700">
                    Course Time
                  </Label>
                  <Input
                    id="edit-courseTime"
                    value={editForm.courseTime}
                    onChange={(e) => setEditForm((f) => ({ ...f, courseTime: e.target.value }))}
                    placeholder="e.g. 10:15AM"
                    className="border-gray-300 focus:border-[#1a237e]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-courseDayLabel" className="text-sm font-medium text-gray-700">
                    Day Label
                  </Label>
                  <Input
                    id="edit-courseDayLabel"
                    value={editForm.courseDayLabel}
                    onChange={(e) => setEditForm((f) => ({ ...f, courseDayLabel: e.target.value }))}
                    placeholder="e.g. Monday"
                    className="border-gray-300 focus:border-[#1a237e]"
                  />
                </div>
              </div>

              {/* Section */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-section" className="text-sm font-medium text-gray-700">
                  Section
                </Label>
                <select
                  id="edit-section"
                  value={editForm.section}
                  onChange={(e) => setEditForm((f) => ({ ...f, section: e.target.value as CourseSection }))}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]/20"
                >
                  {COURSE_SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {getCourseSectionLabel(s)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEdit}
                  disabled={editLoading}
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editLoading}
                  className="bg-[#1a237e] hover:bg-[#1a237e]/90 text-white"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
