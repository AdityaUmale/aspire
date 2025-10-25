'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import Navbar from '@/components/Navbar';

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
  const id = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

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
  }, [id]);

  // Themed Loading State
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
        <Navbar />
        <main className="flex-1 py-16 md:py-20 lg:py-24 pt-24 sm:pt-28 md:pt-32">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-gray-200/50">
              <Skeleton className="h-10 w-3/4 mb-4 bg-gray-300/60 rounded" />
              <Skeleton className="h-4 w-1/3 mb-8 bg-gray-300/60 rounded" />
              <Skeleton className="h-6 w-full mb-3 bg-gray-300/60 rounded" />
              <Skeleton className="h-6 w-full mb-3 bg-gray-300/60 rounded" />
              <Skeleton className="h-6 w-5/6 mb-3 bg-gray-300/60 rounded" />
              <Skeleton className="h-6 w-full mt-6 mb-3 bg-gray-300/60 rounded" />
              <Skeleton className="h-6 w-full mb-3 bg-gray-300/60 rounded" />
            </div>
          </div>
        </main>
      </div>

  
    );
  }

  // Themed Error State
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
        <Navbar />
        <main className="flex-1 py-16 md:py-20 lg:py-24 pt-24 sm:pt-28 md:pt-32">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <Alert variant="destructive" className="bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }

  // Themed No Article State
  if (!article) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
        <Navbar />
        <main className="flex-1 py-16 md:py-20 lg:py-24 pt-24 sm:pt-28 md:pt-32">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <p className="text-gray-600 text-lg">Article data is not available.</p>
          </div>
        </main>
      </div>
    );
  }

  // Themed Content Display
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
      <Navbar />
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] mix-blend-soft-light -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-radial from-[#1a237e]/10 to-transparent blur-3xl -z-10"></div>

      <main className="flex-1 py-16 md:py-20 lg:py-24 pt-24 sm:pt-28 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          {/* Themed Content Card */}
          <div className="bg-white/90 backdrop-blur-md p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl border border-gray-200/60">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-[#1a237e] break-words leading-tight">{article.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 text-sm text-gray-500 mb-6 sm:mb-8 border-b pb-4 border-gray-200/70">
              
              {article.author?.email && <span className="hidden sm:inline mx-2">|</span>}
              {article.author?.email && <span className="break-words">{article.author.email}</span>}
            </div>
            
            {/* Render the HTML article content with themed prose */}
            <div 
              className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-[#1a237e] prose-a:text-[#3949ab] hover:prose-a:text-[#0d1642] prose-strong:text-gray-800 prose-p:text-gray-700 prose-p:leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}