'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowLeft, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { sanitizeRichTextHtml } from '@/lib/sanitize';
import { Textarea } from '@/components/ui/textarea';
import { ARTICLE_PROSE_CLASSES } from '@/lib/article-prose';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';
import { cn } from '@/lib/utils';

interface StudentArticle {
  _id: string;
  title: string;
  description: string;
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
  isPublished: boolean;
}

function statusBadgeClass(reviewStatus: StudentArticle['reviewStatus']) {
  if (reviewStatus === 'PUBLISHED') return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0';
  if (reviewStatus === 'REJECTED') return 'bg-red-100 text-red-800 hover:bg-red-100 border-0';
  if (reviewStatus === 'DRAFT') return 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0';
  return 'bg-amber-100 text-amber-900 hover:bg-amber-100 border-0';
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
      <div className="mx-auto max-w-3xl space-y-4 py-4">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => router.push('/admin/review-articles')}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#1a237e]/15 bg-white px-3 py-1.5 text-sm font-medium text-[#1a237e] shadow-sm transition-colors hover:bg-[#eef2ff]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to articles
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a237e] sm:text-3xl">
          {article.title}
        </h1>
        <Badge
          variant="secondary"
          className={cn(
            'shrink-0 self-start text-[10px] font-semibold uppercase tracking-wide',
            statusBadgeClass(article.reviewStatus)
          )}
        >
          {article.reviewStatus}
        </Badge>
      </div>

      <div className="space-y-1 text-sm text-gray-500">
        <p>By {article.writerName || 'Anonymous Student'}</p>
        {article.submitterEmail ? <p>Verified email: {article.submitterEmail}</p> : null}
        {article.reviewedAt ? (
          <p>Reviewed on {new Date(article.reviewedAt).toLocaleString('en-US')}</p>
        ) : null}
      </div>

      {article.coverImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt="Cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">
          No cover image on this submission
        </div>
      )}

      <p className="text-base leading-relaxed text-gray-600">{article.description}</p>

      <div
        className={`${ARTICLE_PROSE_CLASSES} overflow-hidden break-words rounded-2xl border border-gray-200/70 bg-white/90 p-6 shadow-sm backdrop-blur-md`}
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(article.content) }} />
      </div>

      {actionError ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{actionError}</p>
        </div>
      ) : null}

      {article.rejectionReason ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="mb-1 font-semibold">Current rejection feedback</p>
          <p>{article.rejectionReason}</p>
        </div>
      ) : null}

      {article.reviewStatus !== 'PUBLISHED' ? (
        <div className="space-y-2">
          <label htmlFor="rejectionReason" className="text-sm font-medium text-gray-700">
            Rejection reason <span className="font-normal text-gray-400">(required to reject)</span>
          </label>
          <Textarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Explain what the writer should improve…"
            className="min-h-[90px] rounded-xl"
            maxLength={2000}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {article.reviewStatus !== 'PUBLISHED' ? (
          <Button
            onClick={handlePublish}
            disabled={isProcessing}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {isProcessing ? 'Publishing…' : 'Publish'}
          </Button>
        ) : null}
        <Button
          onClick={handleReject}
          disabled={isProcessing}
          variant="destructive"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {isProcessing ? 'Updating…' : 'Reject'}
        </Button>
      </div>
    </div>
  );
}
