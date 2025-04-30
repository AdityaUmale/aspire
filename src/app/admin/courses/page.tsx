'use client'; // Mark as client component for state and event handling

import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { Input } from '@/components/ui/input';   // Assuming shadcn/ui Input
import { Label } from '@/components/ui/label';   // Assuming shadcn/ui Label
import { Textarea } from '@/components/ui/textarea'; // Assuming shadcn/ui Textarea
import { useRouter } from 'next/navigation';

export default function AddCoursesPage() {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [courseOutlineStr, setCourseOutlineStr] = useState(''); // Input as comma-separated string
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Split the comma-separated string into an array, trimming whitespace
    const courseOutline = courseOutlineStr.split(',').map(item => item.trim()).filter(item => item !== '');

    if (!courseName || !description || courseOutline.length === 0) {
        setError('Please fill in all fields.');
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header if your API requires it (e.g., Bearer token)
          // We rely on the httpOnly cookie being sent automatically by the browser
        },
        body: JSON.stringify({ courseName, description, courseOutline }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setSuccess('Course added successfully!');
      // Optionally clear the form
      setCourseName('');
      setDescription('');
      setCourseOutlineStr('');
      // Optionally redirect or refresh data
      // router.push('/admin/courses'); // Or wherever you list courses
      // router.refresh();

    } catch (err: any) {
      console.error('Failed to add course:', err);
      setError(err.message || 'Failed to add course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Upcoming Course</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="courseOutline">Course Outline (comma-separated)</Label>
            <Textarea
              id="courseOutline"
              value={courseOutlineStr}
              onChange={(e) => setCourseOutlineStr(e.target.value)}
              required
              className="mt-1"
              rows={6}
              placeholder="e.g., Module 1: Intro, Module 2: Basics, Module 3: Advanced"
            />
          </div>

          {error && <p className="text-sm text-red-600">Error: {error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Adding Course...' : 'Add Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}