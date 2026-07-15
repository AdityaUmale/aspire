'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Trash2, AlertCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminEmptyState } from '@/components/admin/empty-state';
import { useAdminToast } from '@/components/admin/admin-toast';
import {
  EditorialArticleRow,
  EditorialArticleRowSkeleton,
} from '@/components/EditorialArticleRow';
import { getFriendlyError } from '@/lib/admin-messages';
import { formatArticleDate } from '@/lib/article-utils';

interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  coverImage?: string | null;
  author?: {
    name: string;
    email: string;
  } | null;
  writerName?: string;
  submitterEmail?: string | null;
  reviewStatus: 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'DRAFT';
  isPublished: boolean;
  createdAt?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
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

export default function ReviewArticlesPage() {
  const router = useRouter();
  const toast = useAdminToast();
  const [articles, setArticles] = useState<StudentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const fetchStudentArticles = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/student-article?page=${page}&limit=10`);

      if (!response.ok) {
        throw new Error('Failed to fetch student articles');
      }

      const data = await response.json();
      setArticles(data.articles);
      setPagination(data.pagination);
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not load student articles.');
      setError(errorMessage);
      toast.error('Load failed', errorMessage);
      console.error('Error fetching student articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchStudentArticles(newPage);
  };

  const handleDeleteArticle = async (article: StudentArticle) => {
    const actionLabel = article.isPublished
      ? 'delete this published article'
      : 'reject and delete this article';
    if (!window.confirm(`Are you sure you want to ${actionLabel}? This cannot be undone.`)) {
      return;
    }

    setIsDeletingId(article._id);
    setError(null);

    try {
      const response = await fetch(`/api/student-article/${article._id}`, {
        method: 'DELETE',
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student article');
      }

      setArticles((currentArticles) =>
        currentArticles.filter((currentArticle) => currentArticle._id !== article._id)
      );
      setPagination((currentPagination) => ({
        ...currentPagination,
        total: Math.max(0, currentPagination.total - 1),
      }));
      toast.success('Article removed', `“${article.title}” has been deleted.`);
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not delete this article.');
      setError(errorMessage);
      toast.error('Delete failed', errorMessage);
      console.error('Error deleting student article:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        badge="Student submissions"
        title="Review student articles"
        description="Read submissions, publish strong work, or send feedback by rejecting with a reason."
      />

      {error ? (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {[...Array(4)].map((_, index) => (
            <EditorialArticleRowSkeleton key={index} dense />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <AdminEmptyState
          icon={FileText}
          title="No student articles yet"
          description="When writers submit articles for review, they will appear here."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            Showing {articles.length} of {pagination.total} submission
            {pagination.total === 1 ? '' : 's'}
          </p>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {articles.map((article) => {
              const writer = article.writerName || article.author?.name || 'Anonymous Student';

              return (
                <EditorialArticleRow
                  key={article._id}
                  dense
                  href={`/admin/review-articles/${article._id}`}
                  title={article.title}
                  description={article.description}
                  coverImage={article.coverImage}
                  metadata={
                    <>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${statusBadgeClass(article.reviewStatus)}`}
                      >
                        {article.reviewStatus}
                      </span>
                      <span>By {writer}</span>
                      {article.createdAt ? <span>{formatArticleDate(article.createdAt)}</span> : null}
                      {article.submitterEmail ? <span>{article.submitterEmail}</span> : null}
                    </>
                  }
                  actions={
                    <>
                  <Button
                    variant="outline"
                    className="h-9 rounded-full border-[#1a237e]/20 px-4 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"
                    onClick={() => router.push(`/admin/review-articles/${article._id}`)}
                  >
                    <BookOpen className="h-4 w-4" />
                    {article.isPublished ? 'View' : 'Review'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteArticle(article)}
                    disabled={isDeletingId === article._id}
                    className="h-9 rounded-full px-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeletingId === article._id ? 'Deleting…' : 'Delete'}
                  </Button>
                    </>
                  }
                />
              );
            })}
          </div>

          {pagination.pages > 1 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10"
              >
                Previous
              </Button>
              {[...Array(pagination.pages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={pagination.page === pageNumber ? 'default' : 'outline'}
                    onClick={() => handlePageChange(pageNumber)}
                    className={
                      pagination.page === pageNumber
                        ? 'bg-[#1a237e] text-white hover:bg-[#10164f]'
                        : 'border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10'
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10"
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
