'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  content: string;
  author?: {
    name: string;
  } | null;
  writerName?: string;
  isPublished: boolean;
  createdAt?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function StudentArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<StudentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 });

  const fetchPublishedStudentArticles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student-article?published=true&page=${page}&limit=${pagination.limit}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data.articles);
      setPagination({ ...data.pagination, limit: pagination.limit });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedStudentArticles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPublishedStudentArticles(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAuthorName = (article: StudentArticle) => {
    return article.writerName || 'Anonymous';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 lg:pt-36 lg:pb-24 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-5 md:px-8">

          {/* Clean Header */}
          <header className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8eaf6] text-[#1a237e] text-[11px] font-bold uppercase tracking-wider">
                <BookOpen className="h-3.5 w-3.5" />
                Learners Article
              </div>
              <button
                onClick={() => router.push('/publish-article')}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1a237e]/10 bg-white hover:bg-[#1a237e]/5 text-[#1a237e] text-xs font-semibold transition-all group shadow-sm"
              >
                Publish your article
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5 tracking-tight">
              Authentic Articles by learners of Aspire
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed">
              Real journey, Real breakthroughs written by students who walked into Aspire Institute and walked out Transformed
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
                  <Skeleton className="h-3 w-32 mb-5 bg-gray-100" />
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
                <BookOpen className="h-6 w-6 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No stories yet</h3>
              <p className="text-gray-400 mb-6">Be the first to share your experience.</p>
              <Button
                onClick={() => router.push('/publish-article')}
                className="bg-[#1a237e] hover:bg-[#0d1642] text-white rounded-full px-6"
              >
                Write your story
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {articles.map((article) => (
                  <div
                    key={article._id}
                    className="flex flex-col bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(`/student-articles/${article._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-5 text-[12px] font-medium text-gray-500">
                      {article.createdAt && (
                        <time className="bg-gray-50 px-2.5 py-1 rounded-md text-gray-600">
                          {formatDate(article.createdAt)}
                        </time>
                      )}
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        {getReadingTime(article.content)} min
                      </span>
                    </div>

                    <h2 className="text-[20px] font-bold text-gray-900 leading-[1.4] mb-3 group-hover:text-[#1a237e] transition-colors duration-200 line-clamp-3">
                      {article.title}
                    </h2>

                    <p className="text-[15px] text-gray-500 leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {article.description}
                    </p>

                    <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                          {getAuthorName(article).charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[120px]">
                          {getAuthorName(article)}
                        </span>
                      </div>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center mt-16 gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full border-gray-200 text-gray-600 hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200 shadow-sm"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    Page <span className="text-gray-900 font-bold">{pagination.page}</span> of {pagination.pages}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full border-gray-200 text-gray-600 hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200 shadow-sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <ChevronRight className="h-5 w-5" />
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