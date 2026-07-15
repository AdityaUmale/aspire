'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  EditorialArticleRow,
  EditorialArticleRowSkeleton,
} from '@/components/EditorialArticleRow';
import { BookOpen, ChevronLeft, ChevronRight, Feather } from 'lucide-react';
import {
  formatArticleDate,
  resolveReadingTimeMinutes,
} from '@/lib/article-utils';

interface Article {
  _id: string;
  title: string;
  description: string;
  slug?: string | null;
  readingTimeMinutes?: number | null;
  coverImage?: string | null;
  author?: {
    name?: string;
  } | null;
  createdAt?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/article?page=${page}&limit=${pagination.limit}`
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
      console.error('Error fetching articles:', fetchError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchArticles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    void fetchArticles(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfa] font-sans text-slate-950 selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 pt-32 lg:pt-36">
        <div className="mx-auto w-full max-w-[920px] px-5 md:px-8">
          <header className="border-b border-slate-200 pb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Founder perspectives
            </p>
            <h1 className="text-[38px] font-semibold leading-none tracking-[-0.045em] text-slate-950 md:text-[44px]">
              Founder&apos;s insights
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-6 text-slate-500">
              Perspectives on leadership, human development, and building a vision from the ground up.
            </p>
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
              <Feather className="mx-auto mb-5 h-9 w-9 text-slate-300" />
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                No founder articles yet
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                New perspectives will appear here when published.
              </p>
            </section>
          ) : (
            <>
              <section className="divide-y divide-slate-200 border-b border-slate-200">
                {articles.map((article) => (
                  <EditorialArticleRow
                    key={article._id}
                    title={article.title}
                    description={article.description}
                    coverImage={article.coverImage}
                    href={`/articles/${article.slug || article._id}`}
                    metadata={
                      <>
                        <span className="font-semibold text-slate-700">
                          {article.author?.name || 'Aspire Institute Founder'}
                        </span>
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
                ))}
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
