'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FloatingToast } from '@/components/ui/floating-toast';
import { Terminal, PenLine, LoaderCircle } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

export default function AddArticlesPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Validate form fields
    if (!title.trim() || !description.trim() || !content.trim()) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create article');
      }

      // Clear form and show success message
      setTitle('');
      setDescription('');
      setContent('');
      setSuccess('Article created successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the article';
      setError(errorMessage);
      console.error('Error creating article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <FloatingToast
        open={Boolean(success)}
        onClose={() => setSuccess(null)}
        variant="success"
        title="Founder article created"
        description={success || ''}
        durationMs={4500}
        className="top-6 md:top-6"
      />

      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        Create New Article
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-[#1a237e] mb-6">Add an Article</h1>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-transparent relative max-w-5xl mx-auto mt-12 pb-32">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 01: Title */}
          <div className="space-y-3 group/section transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                01
              </span>
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-800">
                  Article Title <span className="text-red-400 text-xs">*</span>
                </label>
                <p className="text-xs text-gray-400 mt-0.5">A clear, compelling headline for your article</p>
              </div>
            </div>
            <div className="relative group/input bg-white rounded-2xl border border-gray-200 group-focus-within/section:border-[#1a237e]/40 transition-all duration-300 shadow-sm focus-within:shadow-md px-5 pt-5 pb-4">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is the name of your story?"
                className="border-0 bg-transparent p-0 pb-1 h-auto text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 placeholder:text-gray-300 focus-visible:ring-0 shadow-none -ml-[2px] transition-all"
                required
              />
              <div className="absolute bottom-0 left-5 right-5 h-0.5 w-0 bg-[#1a237e] transition-all duration-700 group-focus-within/input:w-[calc(100%-40px)] opacity-40 rounded-full"></div>
            </div>
          </div>

          {/* Section 02: Description */}
          <div className="space-y-3 group/section transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                02
              </span>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
                  Short Description <span className="text-red-400 text-xs">*</span>
                </label>
                <p className="text-xs text-gray-400 mt-0.5">A compelling summary that makes readers want to dive in</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 group-focus-within/section:border-[#1a237e]/40 transition-all duration-300 shadow-sm focus-within:shadow-md">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a compelling summary that makes readers want to dive in..."
                className="border-0 bg-transparent p-5 min-h-[100px] text-lg font-light text-gray-700 placeholder:text-gray-300 focus-visible:ring-0 shadow-none resize-none leading-relaxed rounded-2xl"
                required
              />
            </div>
          </div>

          {/* Section 03: Content */}
          <div className="space-y-3 group/section transition-all duration-500 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                  03
                </span>
                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Article Content <span className="text-red-400 text-xs">*</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-0.5">Write the full article here — use formatting, headings, and images</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                Rich Text Editor
              </div>
            </div>
            <div className="relative group/editor">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Share the full depth of your perspective here..."
                stickyToolbar
                toolbarOffsetPx={16}
              />
            </div>
          </div>

          <div className="pt-12 flex items-center justify-end">
            <Button
              type="submit"
              className="group h-16 px-12 bg-[#1a237e] hover:bg-[#0d1642] text-white rounded-full transition-all shadow-[0_10px_30px_rgba(26,35,126,0.3)] hover:shadow-[0_20px_40px_rgba(26,35,126,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Article
                  <PenLine className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
