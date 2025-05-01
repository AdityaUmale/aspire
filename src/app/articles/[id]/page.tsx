'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
}

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params.id as string; // Get the article ID from the URL

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Don't fetch if ID is not available yet

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/article?id=${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found');
          } else {
            throw new Error('Failed to fetch article');
          }
        }
        
        const data = await response.json();
        setArticle(data.article);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // Re-run effect when ID changes

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!article) {
    // This case might occur briefly or if fetch fails silently
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl text-center">
        <p>Article data is not available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">By {article.author?.name || 'Unknown Author'}</p>
      
      <div className="prose lg:prose-xl max-w-none">
        {/* Render HTML content safely */}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  );
}