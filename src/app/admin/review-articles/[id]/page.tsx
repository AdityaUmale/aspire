'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileText,
  Loader2,
  XCircle,
} from 'lucide-react';
import { sanitizeRichTextHtml } from '@/lib/sanitize';
import { Textarea } from '@/components/ui/textarea';
import { ArticleReaderContent } from '@/components/ArticleReader';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';

interface StudentArticle {
  _id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  author?: {
    name: string;
    email: string;
  } | null;
  writerName?: string;
  submitterEmail?: string | null;
  reviewStatus: 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'DRAFT';
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  createdAt?: string | null;
  readingTimeMinutes?: number | null;
  isPublished: boolean;
}

function statusBadgeClass(reviewStatus: StudentArticle['reviewStatus']) {
  if (reviewStatus === 'PUBLISHED') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (reviewStatus === 'REJECTED') {
    return 'border-red-200 bg-red-50 text-red-700';
  }
  if (reviewStatus === 'DRAFT') {
    return 'border-slate-200 bg-slate-50 text-slate-600';
  }
  return 'border-amber-200 bg-amber-50 text-amber-800';
}

export default function ArticleReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useAdminToast();
  const id = params.id as string;

  const [article, setArticle] = useState<StudentArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/student-article?id=${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Student article not found');
          }
          throw new Error('Failed to fetch student article');
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err: unknown) {
        const errorMessage = getFriendlyError(err, 'Could not load this article.');
        setError(errorMessage);
        console.error('Error fetching student article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handlePublish = async () => {
    if (!article) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      const response = await fetch(`/api/student-article/${article._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewStatus: 'PUBLISHED' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish article');
      }

      setArticle({
        ...article,
        isPublished: true,
        reviewStatus: 'PUBLISHED',
        reviewedAt: new Date().toISOString(),
      });
      toast.success('Article published', `“${article.title}” is now live for readers.`);
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not publish this article.');
      setActionError(errorMessage);
      toast.error('Publish failed', errorMessage);
      console.error('Error publishing article:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!article) return;

    const reason = rejectionReason.trim();
    if (!reason) {
      const message = 'Please provide a rejection reason so the writer knows what to improve.';
      setActionError(message);
      toast.error('Reason required', message);
      return;
    }

    if (!window.confirm('Reject this article? The writer will see your feedback.')) {
      return;
    }

    setIsProcessing(true);
    setActionError(null);
    try {
      const response = await fetch(`/api/student-article/${article._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewStatus: 'REJECTED',
          rejectionReason: reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to reject article');
      }

      setArticle({
        ...article,
        isPublished: false,
        reviewStatus: 'REJECTED',
        rejectionReason: reason,
        reviewedAt: new Date().toISOString(),
      });
      toast.success('Article rejected', 'The writer can view your feedback.');
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not reject this article.');
      setActionError(errorMessage);
      toast.error('Reject failed', errorMessage);
      console.error('Error rejecting student article:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[680px] space-y-6 px-5 py-4 md:px-6">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-4 w-44 rounded-full" />
        <Skeleton className="h-12 w-5/6 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <div className="space-y-3 pt-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-center">
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Could not load article</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
        <Button
          onClick={() => router.push('/admin/review-articles')}
          className="bg-[#1a237e] text-white hover:bg-[#10164f]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to articles
        </Button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-center">
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <FileText className="mx-auto mb-4 h-12 w-12 text-[#1a237e]/40" />
          <p className="text-lg text-gray-500">Article data could not be loaded.</p>
        </div>
        <Button
          onClick={() => router.push('/admin/review-articles')}
          className="bg-[#1a237e] text-white hover:bg-[#10164f]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to articles
        </Button>
      </div>
    );
  }

  const moderationPanel = (
    <section
      className="mt-16 border-t border-slate-200 pt-8"
      aria-labelledby="moderation-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Editorial decision
      </p>
      <h2
        id="moderation-heading"
        className="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
      >
        Review this submission
      </h2>

      {actionError ? (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{actionError}</p>
        </div>
      ) : null}

      {article.rejectionReason ? (
        <div className="mt-5 border-l-2 border-red-300 bg-red-50/70 px-4 py-3 text-sm text-red-800">
          <p className="mb-1 font-semibold">Current rejection feedback</p>
          <p>{article.rejectionReason}</p>
        </div>
      ) : null}

      {article.reviewStatus !== 'PUBLISHED' ? (
        <>
          <div className="mt-6 space-y-2">
            <label
              htmlFor="rejectionReason"
              className="text-sm font-medium text-slate-700"
            >
              Feedback for the writer
            </label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Explain what should be improved if you reject this submission…"
              className="min-h-[110px] rounded-xl border-slate-200 bg-white"
              maxLength={2000}
            />
            <p className="text-xs text-slate-400">Feedback is required when rejecting.</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={handlePublish}
              disabled={isProcessing}
              className="h-11 rounded-full bg-emerald-700 px-5 text-white hover:bg-emerald-800 active:scale-[0.98]"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isProcessing ? 'Publishing…' : 'Publish article'}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              variant="outline"
              className="h-11 rounded-full border-red-200 px-5 text-red-700 hover:bg-red-50 hover:text-red-800 active:scale-[0.98]"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {isProcessing ? 'Updating…' : 'Reject with feedback'}
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-5 text-sm text-emerald-700">
          This article is published and visible to readers.
        </p>
      )}
    </section>
  );

  return (
    <div className="-m-4 min-h-full bg-white py-8 sm:-m-6 sm:py-10 lg:-m-8 lg:py-12">
      <ArticleReaderContent
        title={article.title}
        contentHtml={sanitizeRichTextHtml(article.content)}
        coverImage={article.coverImage}
        createdAt={article.createdAt}
        readingTimeMinutes={article.readingTimeMinutes}
        backHref="/admin/review-articles"
        backLabel="All article submissions"
        showAuthorBar
        authorName={article.writerName || 'Anonymous Student'}
        authorSubtitle={article.submitterEmail || 'Student Contributor'}
        banner={
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Admin preview
              </p>
              {article.reviewedAt ? (
                <p className="mt-1 text-xs text-slate-500">
                  Last reviewed {new Date(article.reviewedAt).toLocaleString('en-US')}
                </p>
              ) : null}
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusBadgeClass(article.reviewStatus)}`}
            >
              {article.reviewStatus}
            </span>
          </div>
        }
        afterContent={moderationPanel}
      />
    </div>
  );
}
