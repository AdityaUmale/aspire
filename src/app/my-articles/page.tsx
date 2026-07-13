'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  Clock3,
  Eye,
  FileText,
  Pencil,
  ShieldCheck,
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
  DRAFT: 'bg-slate-50 text-slate-700 border-slate-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
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

  const getStatusCopy = (status: WriterArticle['reviewStatus']) => {
    if (status === 'PUBLISHED') {
      return 'Live on the Student Articles page.';
    }

    if (status === 'REJECTED') {
      return 'This submission was not approved. You can edit and resubmit.';
    }

    if (status === 'DRAFT') {
      return 'Saved as a draft — only you can see it.';
    }

    return 'Your article is waiting for editorial review.';
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8eaf6] text-[#1a237e] text-[11px] font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                Writer dashboard
              </div>
              <h1 className="text-4xl font-bold text-[#1a237e]">My Articles</h1>
              <p className="text-gray-500 mt-2 max-w-xl">
                Track drafts, review status, and live stories tied to your verified email.
              </p>
            </div>
            <Button
              onClick={() => router.push('/publish-article')}
              className="rounded-2xl h-12 px-7 bg-[#1a237e] hover:bg-[#0d1642] text-white"
            >
              Write an article
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-red-50 border-red-100 text-red-900 rounded-xl"
            >
              <Terminal className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-40 w-full rounded-[2rem]" />
              ))}
            </div>
          ) : !session?.writer ? (
            <Card className="rounded-[2rem] border-gray-200/80 bg-white/90 shadow-sm">
              <CardContent className="py-10 px-8 text-center">
                <FileText className="h-12 w-12 text-[#1a237e]/40 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#1a237e] mb-3">
                  Verify your email to continue
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto leading-relaxed mb-6">
                  Article statuses are private to your verified writer session.
                </p>
                <Button
                  onClick={() => router.push('/publish-article')}
                  className="rounded-2xl h-12 px-7 bg-[#1a237e] hover:bg-[#0d1642] text-white"
                >
                  Verify & write
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              {articles.length === 0 ? (
                <Card className="rounded-[2rem] border-gray-200/80 bg-white/90 shadow-sm">
                  <CardContent className="py-10 px-8 text-center">
                    <FileText className="h-12 w-12 text-[#1a237e]/40 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#1a237e] mb-3">
                      No submissions yet
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto leading-relaxed mb-6">
                      Your verified session is ready. Submit your first article and it will
                      appear here right away.
                    </p>
                    <Button
                      onClick={() => router.push('/publish-article')}
                      className="rounded-2xl h-12 px-7 bg-[#1a237e] hover:bg-[#0d1642] text-white"
                    >
                      Submit an Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-5">
                  {articles.map((article) => (
                    <Card
                      key={article.id}
                      className="group rounded-[1.5rem] md:rounded-[2rem] border border-gray-200/60 bg-white shadow-sm hover:shadow-md hover:border-[#1a237e]/20 transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row h-full">
                        {article.coverImage ? (
                          <div className="relative sm:w-44 md:w-56 shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-full bg-gray-50/50 border-b sm:border-b-0 sm:border-r border-gray-100 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={article.coverImage}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              loading="lazy"
                            />
                          </div>
                        ) : null}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <CardHeader className="pb-3 pt-5 px-6 md:px-8 border-b border-gray-50">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="space-y-1.5">
                                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-[#1a237e] transition-colors line-clamp-1">
                                  {article.title || 'Untitled draft'}
                                </CardTitle>
                                <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {article.reviewStatus === 'DRAFT' ? 'Last saved' : 'Submitted'}{' '}
                                  on {formatArticleDate(article.updatedAt || article.createdAt, 'Unknown')}
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`border px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm whitespace-nowrap ${STATUS_STYLES[article.reviewStatus]}`}
                              >
                                {article.reviewStatus}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="pt-5 px-6 md:px-8 pb-5 md:pb-6 flex-1 flex flex-col">
                            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-2 flex-1">
                              {article.description || 'No description provided.'}
                            </p>

                            {article.reviewStatus === 'REJECTED' && article.rejectionReason && (
                              <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-900 shadow-sm flex items-start gap-3">
                                 <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                 <div>
                                   <p className="font-semibold mb-1">Editor feedback</p>
                                   <p className="text-red-700/90 leading-relaxed">{article.rejectionReason}</p>
                                 </div>
                              </div>
                            )}

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-5 border-t border-gray-100">
                              <p className="text-sm font-medium text-gray-500">
                                {getStatusCopy(article.reviewStatus)}
                              </p>

                              <div className="flex flex-wrap items-center gap-2.5">
                                {article.isPublished ? (
                                  <Button
                                    variant="outline"
                                    onClick={() => router.push(`/student-articles/${article.slug || article.id}`)}
                                    className="rounded-xl h-10 border-gray-200 text-gray-700 hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] transition-all shadow-sm"
                                  >
                                    View live article
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    onClick={() => router.push(`/my-articles/${article.id}/preview`)}
                                    className="rounded-xl h-10 border-gray-200 text-gray-700 hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] transition-all shadow-sm"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                  </Button>
                                )}

                                {(article.reviewStatus === 'DRAFT' || article.reviewStatus === 'PENDING' || article.reviewStatus === 'REJECTED') && (
                                  <>
                                    <Button
                                      variant="outline"
                                      onClick={() => router.push(`/publish-article?draft=${article.id}`)}
                                      className="rounded-xl h-10 border-[#1a237e]/20 text-[#1a237e] bg-[#1a237e]/5 hover:bg-[#1a237e] hover:text-white transition-all shadow-sm font-semibold"
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      {article.reviewStatus === 'REJECTED' ? 'Edit & resubmit' : 'Continue editing'}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      disabled={actionId === article.id}
                                      onClick={() => void handleWithdraw(article)}
                                      className="rounded-xl h-10 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      {actionId === article.id ? 'Withdrawing…' : 'Withdraw'}
                                    </Button>
                                  </>
                                )}

                                {article.reviewStatus === 'PENDING' && (
                                  <span className="inline-flex items-center gap-2 text-sm text-amber-600 font-medium ml-1">
                                    <Clock3 className="h-4 w-4" />
                                    Pending review
                                  </span>
                                )}

                                {article.reviewStatus === 'REJECTED' && !article.rejectionReason && (
                                  <span className="inline-flex items-center gap-2 text-sm text-red-600 font-medium ml-1">
                                    <XCircle className="h-4 w-4" />
                                    Not approved
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
