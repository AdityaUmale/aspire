'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FloatingToast } from '@/components/ui/floating-toast';
import { Terminal, PenLine } from 'lucide-react';
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

      <div className="bg-transparent relative max-w-4xl mx-auto mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border-0 bg-transparent p-0 h-auto text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 placeholder:text-gray-200 focus-visible:ring-0 shadow-none -ml-[2px] transition-all"
              required
            />
          </div>

          <div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your story's hook..."
              className="border-0 bg-transparent p-0 min-h-[60px] text-xl lg:text-2xl font-light text-gray-500 placeholder:text-gray-300 focus-visible:ring-0 shadow-none resize-none leading-relaxed"
              required
            />
          </div>

          <div className="pt-6 relative z-10">
            <div className="prose prose-lg max-w-none text-gray-800">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your article content here..."
                stickyToolbar
                toolbarOffsetPx={16}
              />
            </div>
          </div>

          <div className="pt-8">
            <Button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[200px] h-12 bg-[#1a237e] hover:bg-[#0d1642] text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 text-base font-medium"
              disabled={isSubmitting}
            >
              <PenLine className="h-4 w-4" />
              {isSubmitting ? 'Publishing...' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
