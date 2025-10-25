'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileText } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import Navbar from '@/components/Navbar';

export default function PublishArticlePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [writerName, setWriterName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hardcodedAuthorId = '60d5ec49f5d7a438e8f8d6a5';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim() || !content.trim() || content === '<p></p>') { 
      setError('Title, Description, and Content are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        title,
        description,
        content,
        author: hardcodedAuthorId,
        writerName,
      };
      
      const response = await fetch('/api/student-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit article');
      }

      setTitle('');
      setDescription('');
      setWriterName('');
      setContent('');
      setSuccess('Article submitted successfully! It will be reviewed by our team.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while submitting the article';
      setError(errorMessage);
      console.error('Error submitting article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Share Your Story
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a237e] mb-6">
            Publish Your Article
          </h1>
          
          <p className="text-gray-600 mb-8 md:text-lg">
            Share your thoughts, experiences, and insights with our community. Your article will be reviewed and published by our editorial team.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 bg-green-100/50 border-green-300/50 text-green-800">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200/60">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="writerName" className="text-[#1a237e] font-medium">Your Name</Label>
                <Input
                  id="writerName"
                  value={writerName}
                  onChange={(e) => setWriterName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
                />
                <p className="mt-1 text-xs text-gray-500">This will be displayed as the author of the article.</p>
              </div>

              <div>
                <Label htmlFor="title" className="text-[#1a237e] font-medium">Article Title</Label>
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
                <Label htmlFor="description" className="text-[#1a237e] font-medium">Brief Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a brief description of your article"
                  className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content" className="text-[#1a237e] font-medium">Article Content</Label>
                <div className="mt-1">
                  <RichTextEditor 
                    content={content}
                    onChange={setContent}
                    placeholder="Write your full article content here..."
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Article...' : 'Submit Article for Review'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}