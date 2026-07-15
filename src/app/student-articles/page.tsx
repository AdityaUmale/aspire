'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  EditorialArticleRow,
  EditorialArticleRowSkeleton,
} from '@/components/EditorialArticleRow';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  formatArticleDate,
  resolveReadingTimeMinutes,
} from '@/lib/article-utils';

interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  slug?: string | null;
  readingTimeMinutes?: number | null;
  coverImage?: string | null;
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
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  const fetchPublishedStudentArticles = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/student-article?published=true&page=${page}&limit=${pagination.limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data.articles);
      setPagination({ ...data.pagination, limit: pagination.limit });
    } catch (fetchError: unknown) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'An error occurred while fetching articles'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPublishedStudentArticles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    void fetchPublishedStudentArticles(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfa] font-sans text-slate-950 selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 pt-32 lg:pt-36">
        <div className="mx-auto w-full max-w-[920px] px-5 md:px-8">
          <header className="flex flex-col gap-7 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Learner perspectives
              </p>
              <h1 className="text-[38px] font-semibold leading-none tracking-[-0.045em] text-slate-950 md:text-[44px]">
                Authentic articles
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-6 text-slate-500">
                Real journeys and breakthroughs, written by learners of Aspire Institute.
              </p>
            </div>
            <Button
              onClick={() => router.push('/publish-article')}
              className="h-11 w-fit rounded-full bg-[#1a237e] px-5 text-sm font-semibold text-white shadow-none transition hover:-translate-y-0.5 hover:bg-[#11194f] active:translate-y-0"
            >
              Write your story
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </header>

          {error ? (
            <div className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-semibold">Unable to load articles</p>
              <p className="mt-1 text-red-700">{error}</p>
            </div>
          ) : null}

          {loading ? (
            <div className="divide-y divide-slate-200">
              {[0, 1, 2].map((item) => (
                <EditorialArticleRowSkeleton key={item} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <section className="border-b border-slate-200 py-16 text-center">
              <BookOpen className="mx-auto mb-5 h-9 w-9 text-slate-300" />
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Be the first to share your story
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Learner articles will appear here after editorial review.
              </p>
              <Button
                onClick={() => router.push('/publish-article')}
                className="mt-6 h-11 rounded-full bg-[#1a237e] px-6 text-white hover:bg-[#11194f]"
              >
                Write your story
              </Button>
            </section>
          ) : (
            <>
              <section className="divide-y divide-slate-200 border-b border-slate-200">
                {articles.map((article) => {
                  const authorName = article.writerName || 'Anonymous learner';
                  return (
                    <EditorialArticleRow
                      key={article._id}
                      title={article.title}
                      description={article.description}
                      coverImage={article.coverImage}
                      href={`/student-articles/${article.slug || article._id}`}
                      metadata={
                        <>
                          <span className="font-semibold text-slate-700">{authorName}</span>
                          {article.createdAt ? (
                            <>
                              <span className="h-1 w-1 rounded-full bg-slate-300" />
                              <time>{formatArticleDate(article.createdAt)}</time>
                            </>
                          ) : null}
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="inline-flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            {resolveReadingTimeMinutes({
                              readingTimeMinutes: article.readingTimeMinutes,
                            })}{' '}
                            min read
                          </span>
                        </>
                      }
                    />
                  );
                })}
              </section>

              {pagination.pages > 1 ? (
                <div className="mt-12 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-none hover:border-[#1a237e]/30 hover:text-[#1a237e]"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-500">
                    Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
                    {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-none hover:border-[#1a237e]/30 hover:text-[#1a237e]"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
