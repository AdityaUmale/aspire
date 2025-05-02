'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react'; // Import CalendarIcon
import { format } from 'date-fns'; // Import date-fns for formatting
import { cn } from '@/lib/utils'; // Assuming you have a cn utility
import { Calendar } from '@/components/ui/calendar'; // Import Calendar component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Popover components

export default function AddCoursesPage() {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [courseOutlineStr, setCourseOutlineStr] = useState('');
  const [courseDate, setCourseDate] = useState<Date | undefined>(undefined); // Add state for date
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

    if (!courseName || !description || courseOutline.length === 0 || !courseDate) { // Check for courseDate
        setError('Please fill in all fields, including the course date.');
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseName, description, courseOutline, courseDate }), // Include courseDate
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setSuccess('Course added successfully!');
      // Clear the form
      setCourseName('');
      setDescription('');
      setCourseOutlineStr('');
      setCourseDate(undefined); // Clear date

    } catch (err: any) {
      console.error('Failed to add course:', err);
      setError(err.message || 'Failed to add course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        Create New Course
      </div>
      
      <h1 className="text-3xl font-bold text-[#1a237e] mb-6">Add Upcoming Course</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-100/50 border-green-300/50 text-green-800 rounded-lg shadow-sm">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/60">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="courseName" className="text-[#1a237e] font-medium">Course Name</Label>
            <Input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              placeholder="Enter course name"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-[#1a237e] font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              rows={4}
              placeholder="Enter course description"
            />
          </div>
          <div>
            <Label htmlFor="courseOutline" className="text-[#1a237e] font-medium">Course Outline (comma-separated)</Label>
            <Textarea
              id="courseOutline"
              value={courseOutlineStr}
              onChange={(e) => setCourseOutlineStr(e.target.value)}
              required
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              rows={6}
              placeholder="e.g., Module 1: Intro, Module 2: Basics, Module 3: Advanced"
            />
          </div>

          {/* Add Date Picker */}
          <div>
            <Label htmlFor="courseDate" className="text-[#1a237e] font-medium">Course Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20",
                    !courseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {courseDate ? format(courseDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={courseDate}
                  onSelect={setCourseDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            {isLoading ? 'Adding Course...' : 'Add Course'}
          </Button>
        </form>
      </div>
    </div>
  );
}