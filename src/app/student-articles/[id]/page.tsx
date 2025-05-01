'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

// Interface matching the StudentArticle model, including content
interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  content: string; // Need full content here
  author: {
    name: string;
    email: string; // Include email if desired
  };
  isPublished: boolean;
}

export default function StudentArticleDetailPage() {
  const params = useParams();
  const id = params.id as string; // Get the article ID from the URL

  const [article, setArticle] = useState<StudentArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; 

    const fetchArticle = async () => {
      setLoading(true);
      setError(null); 
      try {
        // Fetch using the specific ID. 
        // Using the [id] route is generally preferred for fetching single items.
        const response = await fetch(`/api/student-article/${id}`); 
        // Or if you kept single fetch in the collection route: 
        // const response = await fetch(`/api/student-article?id=${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found or not published.');
          } else {
            throw new Error('Failed to fetch student article');
          }
        }
        
        const data = await response.json();

        // Ensure the fetched article is published before displaying
        if (!data.article || !data.article.isPublished) {
             throw new Error('Article not found or not published.');
        }

        setArticle(data.article);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching student article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl text-center">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!article) {
    // This case might occur briefly or if fetch fails silently after loading
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl text-center">
        <p>Article data is not available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By {article.author?.name || 'Unknown Author'} ({article.author?.email || 'No Email'})
      </p>
      
      {/* Render the article content. Adjust based on format (HTML/Markdown) */}
      <div className="prose lg:prose-xl max-w-none border-t pt-6 mt-6">
        {/* If content is plain text: */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p> 
        
        {/* If content is Markdown, use a library like react-markdown: */}
        {/* <ReactMarkdown>{article.content}</ReactMarkdown> */}
        
        {/* If content is HTML (use with caution): */}
        {/* <div dangerouslySetInnerHTML={{ __html: article.content }} /> */}
      </div>
    </div>
  );
}