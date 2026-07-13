'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Trash2, AlertCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminEmptyState } from '@/components/admin/empty-state';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';
import { cn } from '@/lib/utils';

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
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function statusBadgeClass(reviewStatus: StudentArticle['reviewStatus']) {
  if (reviewStatus === 'PUBLISHED') {
    return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0';
  }
  if (reviewStatus === 'REJECTED') {
    return 'bg-red-100 text-red-800 hover:bg-red-100 border-0';
  }
  if (reviewStatus === 'DRAFT') {
    return 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0';
  }
  return 'bg-amber-100 text-amber-900 hover:bg-amber-100 border-0';
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden border border-gray-200/60 bg-white/90 py-0 shadow-sm backdrop-blur-sm"
            >
              <Skeleton className="h-36 w-full rounded-none" />
              <CardHeader className="p-4 pb-2">
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-14 w-full" />
              </CardContent>
              <CardFooter className="p-4">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {articles.map((article) => (
              <Card
                key={article._id}
                className="flex flex-col overflow-hidden border border-gray-200/60 bg-white/90 py-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {article.coverImage ? (
                  <div className="relative aspect-[16/10] w-full bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-[#e8eaf6] to-[#f5f5f5]">
                    <FileText className="h-8 w-8 text-[#1a237e]/30" />
                  </div>
                )}
                <CardHeader className="p-4 pb-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <CardTitle className="line-clamp-2 text-base font-semibold text-[#1a237e] lg:text-lg">
                      {article.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className={cn('shrink-0 self-start text-[10px] font-semibold uppercase tracking-wide', statusBadgeClass(article.reviewStatus))}
                    >
                      {article.reviewStatus}
                    </Badge>
                  </div>
                  <CardDescription className="space-y-1 text-xs">
                    <span className="block">
                      By {article.writerName || article.author?.name || 'Anonymous Student'}
                    </span>
                    {article.submitterEmail ? (
                      <span className="block text-[11px] text-gray-500">{article.submitterEmail}</span>
                    ) : null}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-4 pt-0">
                  <p className="line-clamp-3 text-sm text-gray-600">{article.description}</p>
                </CardContent>
                <CardFooter className="grid grid-cols-1 gap-2 p-4 pt-0 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"
                    onClick={() => router.push(`/admin/review-articles/${article._id}`)}
                  >
                    <BookOpen className="h-4 w-4" />
                    {article.isPublished ? 'View' : 'Review'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteArticle(article)}
                    disabled={isDeletingId === article._id}
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeletingId === article._id ? 'Deleting…' : 'Delete'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
