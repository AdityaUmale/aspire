'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the available programs from "Our Programs" section
const AVAILABLE_PROGRAMS = [
  { 
    title: "Leadership Development", 
    description: "Develop essential leadership skills for the modern workplace and learn to inspire teams.", 
    features: ["Strategic thinking", "Team management", "Decision making", "Conflict resolution"],
    slug: "/courses/leadership-development"
  },
  { 
    title: "Personality Development", 
    description: "Build confidence and enhance your personal growth through comprehensive self-improvement.", 
    features: ["Self-confidence", "Communication skills", "Emotional intelligence", "Personal branding"],
    slug: "/courses/personality-development"
  },
  { 
    title: "Public Speaking", 
    description: "Master the art of effective communication and captivate any audience with your words.", 
    features: ["Speech preparation", "Delivery techniques", "Audience engagement", "Overcoming anxiety"],
    slug: "/courses/public-speaking"
  },
  { 
    title: "English Language Training", 
    description: "Enhance your English skills for better communication.", 
    features: ["Grammar", "Vocabulary", "Pronunciation", "Fluency"],
    slug: "/courses/english-language-training"
  },
  { 
    title: "Childrens Learning Program", 
    description: "Fun and educational programs for kids.", 
    features: ["Creativity", "Learning skills", "Teamwork", "Confidence"],
    slug: "/courses/childrens-learning-program"
  },
  { 
    title: "Voice & Accent", 
    description: "Improve your voice modulation and accent.", 
    features: ["Clarity", "Tone", "Accent training", "Expression"],
    slug: "/courses/voice-and-accent"
  },
  { 
    title: "Entrepreneurship Development", 
    description: "Build skills to start and grow your business.", 
    features: ["Innovation", "Business planning", "Leadership", "Risk management"],
    slug: "/courses/entrepreneurship-development"
  },
  { 
    title: "Teachers Training Program", 
    description: "Empower educators with modern teaching methods.", 
    features: ["Pedagogy", "Classroom management", "Engagement", "Assessment"],
    slug: "/courses/teachers-training-program"
  },
  { 
    title: "ARISE - LANGUAGE AND THOUGHTS ENRICHMENT CAMP", 
    description: "A unique camp for personal growth.", 
    features: ["Mindset", "Language skills", "Critical thinking", "Self-expression"],
    slug: "/courses/arise-camp"
  },
  { 
    title: "International Workshop", 
    description: "Global learning experiences.", 
    features: ["Cross-cultural skills", "Global trends", "Networking", "Innovation"],
    slug: "/courses/international-workshop"
  },
];

export default function AddCoursesPage() {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [courseOutlineStr, setCourseOutlineStr] = useState('');
  const [courseDate, setCourseDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Handle program selection and auto-fill fields
  const handleProgramSelect = (programTitle: string) => {
    const program = AVAILABLE_PROGRAMS.find(p => p.title === programTitle);
    if (program) {
      setCourseName(program.title);
      setDescription(program.description);
      setCourseOutlineStr(program.features.join(', '));
      setSelectedProgram(programTitle);
    }
  };

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
      setSelectedProgram('');
      setCourseName('');
      setDescription('');
      setCourseOutlineStr('');
      setCourseDate(undefined);

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
      
      <h1 className="text-2xl lg:text-3xl font-bold text-[#1a237e] mb-6">Add Upcoming Course</h1>
      
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
      
      <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60">
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
          <div>
            <Label htmlFor="programSelect" className="text-[#1a237e] font-medium">Select from Our Programs (Optional)</Label>
            <p className="text-xs text-gray-500 mb-2">Choose a program to auto-fill the details below</p>
            <select
              id="programSelect"
              value={selectedProgram}
              onChange={(e) => handleProgramSelect(e.target.value)}
              className="w-full px-3 py-2 border border-[#1a237e]/20 rounded-lg focus:border-[#1a237e] focus:ring-[#1a237e]/20 text-sm"
            >
              <option value="">-- Select a program --</option>
              {AVAILABLE_PROGRAMS.map((program, index) => (
                <option key={index} value={program.title}>{program.title}</option>
              ))}
            </select>
          </div>

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