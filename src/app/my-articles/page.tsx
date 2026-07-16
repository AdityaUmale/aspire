'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  Clock3,
  Eye,
  FileText,
  Pencil,
  Plus,
  Terminal,
  Trash2,
  XCircle,
} from 'lucide-react';
import { formatArticleDate } from '@/lib/article-utils';

type WriterSession = {
  writer: {
    id: string;
    email: string;
  } | null;
  sessionExpiresAt: string | null;
};

type WriterArticle = {
  id: string;
  title: string;
  description: string;
  slug?: string | null;
  coverImage?: string | null;
  reviewStatus: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  isPublished: boolean;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const STATUS_STYLES: Record<WriterArticle['reviewStatus'], string> = {
  DRAFT: 'border-slate-200 bg-slate-50 text-slate-600',
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  PUBLISHED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-red-200 bg-red-50 text-red-700',
};

const STATUS_LABELS: Record<WriterArticle['reviewStatus'], string> = {
  DRAFT: 'Draft',
  PENDING: 'In review',
  PUBLISHED: 'Published',
  REJECTED: 'Needs changes',
};

const STATUS_COPY: Record<WriterArticle['reviewStatus'], string> = {
  DRAFT: 'Private to you until submitted.',
  PENDING: 'Waiting for the editorial team.',
  PUBLISHED: 'Your story is live.',
  REJECTED: 'Review the editor feedback and resubmit.',
};

export default function MyArticlesPage() {
  const router = useRouter();
  const [session, setSession] = useState<WriterSession | null>(null);
  const [articles, setArticles] = useState<WriterArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadPage = async () => {
    setLoading(true);
    setError(null);

    try {
      const sessionResponse = await fetch('/api/writer-auth/session', {
        cache: 'no-store',
      });
      const sessionData = (await sessionResponse.json()) as WriterSession;
      setSession(sessionData);

      if (!sessionData.writer) {
        setArticles([]);
        return;
      }

      const articlesResponse = await fetch('/api/writer-articles', {
        cache: 'no-store',
      });
      const articlesData = await articlesResponse.json();

      if (!articlesResponse.ok) {
        throw new Error(articlesData.error || 'Failed to load your articles');
      }

      setArticles(articlesData.articles || []);
    } catch (loadError: unknown) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load your article status'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPage();
  }, []);

  const handleWithdraw = async (article: WriterArticle) => {
    if (
      !window.confirm(
        `Withdraw "${article.title}"? This permanently removes the submission.`
      )
    ) {
      return;
    }

    setActionId(article.id);
    setError(null);
    try {
      const response = await fetch(`/api/student-article/${article.id}`, {
        method: 'DELETE',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to withdraw');
      }
      setArticles((current) => current.filter((item) => item.id !== article.id));
    } catch (withdrawError: unknown) {
      setError(
        withdrawError instanceof Error
          ? withdrawError.message
          : 'Failed to withdraw article'
      );
    } finally {
      setActionId(null);
    }
  };

  const openArticle = (article: WriterArticle) => {
    router.push(
      article.isPublished
        ? `/student-articles/${article.slug || article.id}`
        : `/my-articles/${article.id}/preview`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfa] font-sans text-slate-950 selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 pt-32 lg:pt-36">
        <div className="mx-auto w-full max-w-[920px] px-5 md:px-8">
          <header className="flex flex-col gap-7 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Your writing
              </p>
              <h1 className="text-[38px] font-semibold leading-none tracking-[-0.045em] text-slate-950 md:text-[44px]">
                My articles
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-6 text-slate-500">
                Draft, submit, and follow each story from one quiet workspace.
              </p>
            </div>
            <Button
              onClick={() => router.push('/publish-article')}
              className="h-11 w-fit rounded-xl bg-[#1a237e] px-5 text-sm font-semibold text-white shadow-none transition hover:-translate-y-0.5 hover:bg-[#11194f] active:translate-y-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              New article
            </Button>
          </header>

          {error ? (
            <Alert
              variant="destructive"
              className="mt-7 rounded-xl border-red-200 bg-red-50 text-red-900"
            >
              <Terminal className="h-4 w-4" />
              <AlertTitle>Could not load your writing</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {loading ? (
            <div className="divide-y divide-slate-200">
              {[0, 1, 2].map((item) => (
                <div key={item} className="grid grid-cols-[1fr_112px] gap-5 py-8 md:grid-cols-[1fr_190px] md:gap-10">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-36 rounded-full" />
                    <Skeleton className="h-7 w-4/5 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-9 w-64 rounded-full" />
                  </div>
                  <Skeleton className="h-[88px] w-28 rounded-lg md:h-[126px] md:w-[190px]" />
                </div>
              ))}
            </div>
          ) : !session?.writer ? (
            <section className="border-b border-slate-200 py-16 text-center">
              <FileText className="mx-auto mb-5 h-9 w-9 text-slate-300" />
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Verify your email to see your writing
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Drafts and review updates are private to your verified writer session.
              </p>
              <Button
                onClick={() => router.push('/publish-article')}
                className="mt-6 h-11 rounded-xl bg-[#1a237e] px-6 text-white hover:bg-[#11194f]"
              >
                Verify and write <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </section>
          ) : articles.length === 0 ? (
            <section className="border-b border-slate-200 py-16 text-center">
              <FileText className="mx-auto mb-5 h-9 w-9 text-slate-300" />
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Your first story starts here
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Start a draft and it will be saved here automatically.
              </p>
              <Button
                onClick={() => router.push('/publish-article')}
                className="mt-6 h-11 rounded-xl bg-[#1a237e] px-6 text-white hover:bg-[#11194f]"
              >
                Write an article <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </section>
          ) : (
            <section className="divide-y divide-slate-200 border-b border-slate-200">
              {articles.map((article) => (
                <article key={article.id} className="group py-8 md:py-9">
                  <div className={article.coverImage ? 'grid grid-cols-[minmax(0,1fr)_112px] gap-5 md:grid-cols-[minmax(0,1fr)_190px] md:gap-10' : ''}>
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                        <span className={`rounded-full border px-2.5 py-1 font-semibold ${STATUS_STYLES[article.reviewStatus]}`}>
                          {STATUS_LABELS[article.reviewStatus]}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          {article.reviewStatus === 'DRAFT' ? 'Saved' : 'Updated'}{' '}
                          {formatArticleDate(article.updatedAt || article.createdAt, 'recently')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openArticle(article)}
                        className="block max-w-2xl text-left"
                      >
                        <h2 className="line-clamp-2 text-[21px] font-semibold leading-[1.25] tracking-[-0.025em] text-slate-950 transition-colors group-hover:text-[#1a237e] md:text-[24px]">
                          {article.title || 'Untitled draft'}
                        </h2>
                        {article.description ? (
                          <p className="mt-2 line-clamp-2 max-w-[62ch] text-sm leading-6 text-slate-500 md:text-[15px]">
                            {article.description}
                          </p>
                        ) : null}
                      </button>

                      {article.reviewStatus === 'REJECTED' && article.rejectionReason ? (
                        <div className="mt-4 flex max-w-2xl items-start gap-2.5 border-l-2 border-red-300 pl-3 text-sm leading-5 text-red-700">
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <p><span className="font-semibold">Editor note:</span> {article.rejectionReason}</p>
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openArticle(article)}
                          className="h-9 rounded-full border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:border-slate-300 hover:bg-slate-50"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          {article.isPublished ? 'View story' : 'Preview'}
                        </Button>

                        {!article.isPublished ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/publish-article?draft=${article.id}`)}
                            className="h-9 rounded-full border-[#1a237e]/20 bg-[#1a237e]/[0.04] px-4 font-semibold text-[#1a237e] shadow-none hover:bg-[#1a237e]/[0.08]"
                          >
                            <Pencil className="mr-1.5 h-3.5 w-3.5" />
                            {article.reviewStatus === 'REJECTED' ? 'Edit and resubmit' : 'Edit'}
                          </Button>
                        ) : null}

                        {!article.isPublished ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionId === article.id}
                            onClick={() => void handleWithdraw(article)}
                            aria-label={`Withdraw ${article.title}`}
                            className="h-9 rounded-full px-3 text-slate-400 shadow-none hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            {actionId === article.id ? 'Removing…' : 'Remove'}
                          </Button>
                        ) : null}

                        <span className="ml-1 hidden text-xs text-slate-400 md:inline">
                          {STATUS_COPY[article.reviewStatus]}
                        </span>
                      </div>
                    </div>

                    {article.coverImage ? (
                      <button
                        type="button"
                        onClick={() => openArticle(article)}
                        className="relative h-[88px] w-28 overflow-hidden rounded-lg bg-slate-100 md:h-[126px] md:w-[190px]"
                        aria-label={`Preview ${article.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.coverImage}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
