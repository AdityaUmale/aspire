'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, PenLine } from 'lucide-react';
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
          author: '64f5f1c1b7c5d9e8a3b2a1d0' // Replace with a valid MongoDB ObjectId for testing
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
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the article');
      console.error('Error creating article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
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
            <Label htmlFor="title" className="text-[#1a237e] font-medium">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-[#1a237e] font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-[#1a237e] font-medium">Content</Label>
            <div className="mt-1">
              <RichTextEditor 
                content={content}
                onChange={setContent}
                placeholder="Start writing your article content here..."
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Use the toolbar above to format your content.</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <PenLine className="h-4 w-4" />
            {isSubmitting ? 'Creating Article...' : 'Create Article'}
          </Button>
        </form>
      </div>
    </div>
  );
}