'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Terminal, ArrowLeft, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { sanitizeRichTextHtml } from '@/lib/sanitize';

interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  content: string;
  author?: {
    name: string;
    email: string;
  } | null;
  writerName?: string;
  isPublished: boolean;
  createdAt?: string;
}

export default function StudentArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [article, setArticle] = useState<StudentArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/student-article/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found or not published.');
          } else {
            throw new Error('Failed to fetch student article');
          }
        }

        const data = await response.json();

        if (!data.article || !data.article.isPublished) {
          throw new Error('Article not found or not published.');
        }

        setArticle(data.article);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Reading progress bar
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      setProgress(Math.min((scrollTop / docHeight) * 100, 100));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Navbar />
        <main className="flex-1 pt-28 pb-20">
          <div className="max-w-[680px] mx-auto px-5 md:px-6">
            <Skeleton className="h-3 w-24 mb-8 bg-gray-100" />
            <Skeleton className="h-10 w-full mb-3 bg-gray-100" />
            <Skeleton className="h-10 w-3/4 mb-8 bg-gray-100" />
            <Skeleton className="h-5 w-full mb-2 bg-gray-50" />
            <Skeleton className="h-5 w-5/6 mb-10 bg-gray-50" />
            <div className="flex items-center gap-3 py-5 border-y border-gray-100 mb-10">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-100" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 bg-gray-100" />
                <Skeleton className="h-3 w-20 bg-gray-50" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full bg-gray-50" />
              <Skeleton className="h-4 w-full bg-gray-50" />
              <Skeleton className="h-4 w-5/6 bg-gray-50" />
              <Skeleton className="h-4 w-full bg-gray-50" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="bg-red-50 border border-red-100 p-8 rounded-xl text-center max-w-md mx-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg text-red-900 mb-2">Something went wrong</h3>
            <p className="text-red-700/80 text-sm mb-6">{error}</p>
            <Button onClick={() => router.back()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100 rounded-lg">
              Go back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!article) return null;

  const authorName = article.writerName || 'Anonymous Student';

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e]/10 selection:text-[#1a237e]">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-[#1a237e] z-[60] transition-none"
        style={{ width: `${progress}%` }}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 lg:pt-36">
        <article className="max-w-[680px] mx-auto px-5 md:px-6">

          {/* Back Button */}
          <button
            onClick={() => router.push('/student-articles')}
            className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors mb-10 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            All authentic articles
          </button>

          {/* Article Header */}
          <header className="mb-10">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-5 text-[13px] text-gray-400">
              {article.createdAt && (
                <time>{formatDate(article.createdAt)}</time>
              )}
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{getReadingTime(article.content)} min read</span>
            </div>

            {/* Title */}
            <h1 className="text-[32px] md:text-[40px] lg:text-[44px] font-bold text-gray-900 leading-[1.15] tracking-tight mb-6">
              {article.title}
            </h1>

            {/* Lead / Description */}
            <p className="text-xl text-gray-500 leading-[1.6] font-normal mb-8">
              {article.description}
            </p>

            {/* Author Bar */}
            <div className="flex items-center gap-3 py-5 border-y border-gray-100">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500">
                <User className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{authorName}</p>
                <p className="text-xs text-gray-400">Student Contributor</p>
              </div>
            </div>
          </header>

          {/* Content Body — Optimized for Reading */}
          <div className="
            prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
            prose-h1:text-[28px] prose-h1:mt-12 prose-h1:mb-4
            prose-h2:text-[24px] prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-[20px] prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[18px] prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:mb-6
            prose-a:text-[#1a237e] prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-[#1a237e]/25 hover:prose-a:border-[#1a237e]/60
            prose-blockquote:border-l-2 prose-blockquote:border-gray-200 prose-blockquote:pl-5 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-gray-600
            prose-strong:font-semibold prose-strong:text-gray-900
            prose-code:text-[15px] prose-code:bg-gray-50 prose-code:text-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-100 prose-pre:rounded-lg
            prose-li:text-[18px] prose-li:text-gray-700 prose-li:leading-[1.7] prose-li:marker:text-gray-300
            prose-img:rounded-lg prose-img:shadow-sm prose-img:border prose-img:border-gray-100
            prose-ul:my-4 prose-ol:my-4
          ">
            <div dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(article.content) }} />
          </div>

          {/* Article End */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/student-articles')}
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to all stories
              </button>
            </div>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}
