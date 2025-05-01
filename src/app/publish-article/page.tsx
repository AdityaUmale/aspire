'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react'; // Assuming you use lucide-react for icons

export default function PublishArticlePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- IMPORTANT: Replace with your actual author ID logic ---
  // This is a placeholder. In a real app, you'd get this from 
  // the logged-in user's session or context.
  const hardcodedAuthorId = '60d5ec49f5d7a438e8f8d6a5'; // Replace with a valid ObjectId
  // -----------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!title.trim() || !description.trim() || !content.trim()) {
      setError('Title, Description, and Content are required.');
      setIsSubmitting(false);
      return;
    }

    if (!hardcodedAuthorId) {
        setError('Author ID is missing. Cannot submit article.');
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch('/api/student-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
          author: hardcodedAuthorId, // Sending the author ID
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit article');
      }

      // Clear form and show success message
      setTitle('');
      setDescription('');
      setContent('');
      setSuccess('Article submitted successfully for review!');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the article');
      console.error('Error submitting article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Submit Your Article</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="default" className="mb-6 bg-green-100 border-green-400 text-green-700">
           <Terminal className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description (1-2 sentences)"
              className="mt-1"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your full article content here..."
              className="mt-1"
              rows={15}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Article'}
          </Button>
        </form>
      </div>
    </div>
  );
}