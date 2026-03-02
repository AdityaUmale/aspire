'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ArrowRight,
  Feather,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 });

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/article?page=${page}&limit=${pagination.limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.articles);
      setPagination({ ...data.pagination, limit: pagination.limit });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchArticles(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 lg:pt-36 lg:pb-24">
        <div className="max-w-[680px] mx-auto px-5 md:px-6">

          {/* Clean Header */}
          <header className="mb-16">
            <div className="flex items-center gap-2 mb-5">
              <span className="h-px w-6 bg-gray-300"></span>
              <span className="text-[11px] font-semibold tracking-[0.15em] text-gray-400 uppercase">Perspectives</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.15] mb-4 tracking-tight">
              Founder&apos;s Insights
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed font-normal max-w-lg">
              In-depth perspectives on leadership, human development, and building a vision from the ground up.
            </p>
          </header>

          {/* Error State */}
          {error && (
            <div className="mb-10 p-5 bg-red-50 border border-red-100 text-red-800 rounded-xl text-sm">
              <p className="font-medium">Unable to load articles</p>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="space-y-10">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="py-8 border-b border-gray-100">
                  <Skeleton className="h-3 w-28 mb-5 bg-gray-100" />
                  <Skeleton className="h-7 w-full mb-3 bg-gray-100" />
                  <Skeleton className="h-7 w-4/5 mb-5 bg-gray-100" />
                  <Skeleton className="h-4 w-full mb-2 bg-gray-50" />
                  <Skeleton className="h-4 w-3/4 bg-gray-50" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 mb-5">
                <Feather className="h-6 w-6 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles yet</h3>
              <p className="text-gray-400">Stay tuned for upcoming insights.</p>
            </div>
          ) : (
            <>
              {/* Featured Article (First) */}
              {articles.length > 0 && (
                <div
                  className="pb-10 mb-2 cursor-pointer group"
                  onClick={() => router.push(`/articles/${articles[0]._id}`)}
                >
                  <div className="flex items-center gap-3 mb-4 text-[13px] text-gray-400">
                    {articles[0].createdAt && (
                      <time>{formatDate(articles[0].createdAt)}</time>
                    )}
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{getReadingTime(articles[0].content)} min read</span>
                  </div>

                  <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 leading-[1.2] mb-4 group-hover:text-[#1a237e] transition-colors duration-200">
                    {articles[0].title}
                  </h2>

                  <p className="text-[17px] text-gray-500 leading-[1.7] mb-5 line-clamp-3">
                    {articles[0].description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1a237e] group-hover:gap-3 transition-all duration-200">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              )}

              {/* Divider */}
              {articles.length > 1 && (
                <div className="border-t border-gray-100 mb-2"></div>
              )}

              {/* Remaining Articles — Clean Stacked List */}
              {articles.slice(1).map((article) => (
                <div
                  key={article._id}
                  className="py-8 border-b border-gray-100 last:border-b-0 cursor-pointer group"
                  onClick={() => router.push(`/articles/${article._id}`)}
                >
                  <div className="flex items-center gap-3 mb-3 text-[13px] text-gray-400">
                    {article.createdAt && (
                      <time>{formatDate(article.createdAt)}</time>
                    )}
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{getReadingTime(article.content)} min read</span>
                  </div>

                  <h3 className="text-xl md:text-[22px] font-bold text-gray-900 leading-[1.3] mb-3 group-hover:text-[#1a237e] transition-colors duration-200">
                    {article.title}
                  </h3>

                  <p className="text-[15px] text-gray-500 leading-[1.65] line-clamp-2">
                    {article.description}
                  </p>
                </div>
              ))}

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center mt-14 gap-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-30"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <span className="text-sm text-gray-400">
                    {pagination.page} / {pagination.pages}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-30"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}