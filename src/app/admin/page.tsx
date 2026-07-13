'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CalendarIcon,
  FileText,
  Inbox,
  Loader2,
  Pencil,
  Trash2,
  X,
  GraduationCap,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  COURSE_SECTIONS,
  getCourseSectionLabel,
  type CourseSection,
} from '@/lib/course-config';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminEmptyState } from '@/components/admin/empty-state';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';

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

function StatCard({
  label,
  value,
  loading,
  href,
  icon: Icon,
  tone = 'default',
}: {
  label: string;
  value: number | string;
  loading: boolean;
  href?: string;
  icon: React.ElementType;
  tone?: 'default' | 'warning' | 'success';
}) {
  const toneClasses =
    tone === 'warning'
      ? 'from-amber-50 to-white border-amber-100'
      : tone === 'success'
        ? 'from-emerald-50 to-white border-emerald-100'
        : 'from-[#eef2ff] to-white border-[#1a237e]/10';

  const iconTone =
    tone === 'warning'
      ? 'bg-amber-100 text-amber-700'
      : tone === 'success'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-[#e8eaf6] text-[#1a237e]';

  const content = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-all duration-300',
        toneClasses,
        href && 'hover:-translate-y-0.5 hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-16 rounded-md" />
          ) : (
            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
          )}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconTone)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {href ? (
        <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#1a237e] opacity-80 transition-opacity group-hover:opacity-100">
          View <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </p>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a237e]/30 rounded-2xl">
        {content}
      </Link>
    );
  }
  return content;
}

export default function AdminDashboardPage() {
  const toast = useAdminToast();
  const [totalEnquiries, setTotalEnquiries] = useState<number | string>('--');
  const [pendingArticles, setPendingArticles] = useState<number | string>('--');
  const [pendingEnquiriesCount, setPendingEnquiriesCount] = useState<number | string>('--');
  const [isLoading, setIsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setStatsError(null);
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
        const message = getFriendlyError(err, 'Could not load dashboard statistics.');
        setStatsError(message);
        setTotalEnquiries('—');
        setPendingArticles('—');
        setPendingEnquiriesCount('—');
        toast.error('Stats unavailable', message);
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
        toast.error(
          'Could not load courses',
          getFriendlyError(err, 'Please refresh the page and try again.')
        );
      }
      setCoursesLoading(false);
    }

    fetchDashboardData();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseEdit();
    };
    if (editingCourse) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [editingCourse]);

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!confirm(`Delete “${courseName}”? This cannot be undone.`)) {
      return;
    }

    setDeletingId(courseId);

    try {
      const response = await fetch(`/api/course?id=${courseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete course');
      }

      setCourses((current) => current.filter((course) => course._id !== courseId));
      toast.success('Course deleted', `“${courseName}” was removed from upcoming courses.`);
    } catch (err: unknown) {
      toast.error(
        'Delete failed',
        getFriendlyError(err, 'Could not delete this course. Please try again.')
      );
    } finally {
      setDeletingId(null);
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
    setEditingCourse(course);
  };

  const handleCloseEdit = () => {
    setEditingCourse(null);
    setEditError(null);
    setEditCalendarOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setEditLoading(true);
    setEditError(null);

    const courseOutline = editForm.courseOutlineStr
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!editForm.courseName || !editForm.description || courseOutline.length === 0 || !editForm.courseDate) {
      setEditError('Please fill in all required fields, including the start date and at least one highlight.');
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

      toast.success('Course updated', `“${editForm.courseName}” was saved successfully.`);
      handleCloseEdit();
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not update this course. Please try again.');
      setEditError(errorMessage);
      toast.error('Update failed', errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Overview"
        title="Welcome back"
        description="Monitor enquiries, student submissions, and manage upcoming course cards from one place."
      />

      {statsError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Some stats could not be loaded</p>
            <p className="mt-0.5 text-amber-800/80">{statsError}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total enquiries"
          value={totalEnquiries}
          loading={isLoading}
          href="/admin/review-enquiries"
          icon={Inbox}
        />
        <StatCard
          label="Pending enquiries"
          value={pendingEnquiriesCount}
          loading={isLoading}
          href="/admin/review-enquiries"
          icon={Inbox}
          tone={
            !isLoading && typeof pendingEnquiriesCount === 'number' && pendingEnquiriesCount > 0
              ? 'warning'
              : 'default'
          }
        />
        <StatCard
          label="Articles to review"
          value={pendingArticles}
          loading={isLoading}
          href="/admin/review-articles"
          icon={FileText}
          tone={
            !isLoading && typeof pendingArticles === 'number' && pendingArticles > 0
              ? 'warning'
              : 'default'
          }
        />
        <StatCard
          label="Active courses"
          value={coursesLoading ? '--' : courses.length}
          loading={coursesLoading}
          href="/admin/courses"
          icon={GraduationCap}
          tone="success"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1a237e]">Upcoming courses</h2>
            <p className="text-sm text-gray-500">Edit or remove cards shown on the website.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-[#1a237e]/20 text-[#1a237e]">
              {coursesLoading ? '…' : `${courses.length} course${courses.length === 1 ? '' : 's'}`}
            </Badge>
            <Button asChild size="sm" className="bg-[#1a237e] text-white hover:bg-[#10164f]">
              <Link href="/admin/courses">Add course</Link>
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {coursesLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-4">
                  <Skeleton className="mb-2 h-5 w-1/3" />
                  <Skeleton className="mb-2 h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <AdminEmptyState
              icon={GraduationCap}
              title="No upcoming courses yet"
              description="Add a course manually or import from a schedule poster."
              action={
                <Button asChild className="bg-[#1a237e] text-white hover:bg-[#10164f]">
                  <Link href="/admin/courses">Add upcoming course</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-xl border border-gray-200/80 bg-white p-4 transition-colors hover:border-[#1a237e]/20 hover:bg-[#fafbff]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[#1a237e]">{course.courseName}</h3>
                        {course.section && course.section !== 'REGULAR' ? (
                          <Badge className="bg-[#eef2ff] text-[#1a237e] hover:bg-[#eef2ff]">
                            {getCourseSectionLabel(course.section)}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="line-clamp-2 text-sm text-gray-600">{course.description}</p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        {course.courseDate ? (
                          <span>Starts {format(new Date(course.courseDate), 'PPP')}</span>
                        ) : null}
                        {(course.courseTime || course.courseDayLabel) && (
                          <span>
                            {[course.courseTime, course.courseDayLabel].filter(Boolean).join(' · ')}
                          </span>
                        )}
                        {course.sourceMonthLabel ? (
                          <span className="text-gray-400">Source: {course.sourceMonthLabel}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(course)}
                        className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#eef2ff]"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCourse(course._id, course.courseName)}
                        disabled={deletingId === course._id}
                      >
                        {deletingId === course._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        {deletingId === course._id ? 'Deleting…' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {editingCourse ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseEdit();
          }}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-course-title"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <h2 id="edit-course-title" className="text-lg font-bold text-[#1a237e]">
                  Edit course
                </h2>
                <p className="text-xs text-gray-500">Changes appear on the public site immediately.</p>
              </div>
              <button
                type="button"
                onClick={handleCloseEdit}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5 px-6 py-5">
              {editError ? (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{editError}</p>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label htmlFor="edit-courseName" className="text-sm font-medium text-gray-700">
                  Course name <span className="text-red-500">*</span>
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

              <div className="space-y-1.5">
                <Label htmlFor="edit-outline" className="text-sm font-medium text-gray-700">
                  Course highlights <span className="text-red-500">*</span>
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

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Start date <span className="text-red-500">*</span>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-courseTime" className="text-sm font-medium text-gray-700">
                    Course time
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
                    Day label
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

              <div className="space-y-1.5">
                <Label htmlFor="edit-section" className="text-sm font-medium text-gray-700">
                  Section
                </Label>
                <select
                  id="edit-section"
                  value={editForm.section}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, section: e.target.value as CourseSection }))
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#1a237e] focus:outline-none focus:ring-1 focus:ring-[#1a237e]/20"
                >
                  {COURSE_SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {getCourseSectionLabel(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
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
                  className="bg-[#1a237e] text-white hover:bg-[#1a237e]/90"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
