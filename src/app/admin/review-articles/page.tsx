'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileText, BookOpen, Trash2 } from 'lucide-react';

// Interface matching the StudentArticle model
interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  content: string;
  author?: {
    name: string;
    email: string;
  } | null;
  writerName?: string;
  submitterEmail?: string | null;
  reviewStatus: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  isPublished: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ReviewArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<StudentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 });
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Fetch articles from the student-article API endpoint
  const fetchStudentArticles = async (page = 1) => {
    setLoading(true);
    try {
      // Fetching ALL articles (published and unpublished) for review
      const response = await fetch(`/api/student-article?page=${page}&limit=10`);

      if (!response.ok) {
        throw new Error('Failed to fetch student articles');
      }

      const data = await response.json();
      setArticles(data.articles);
      setPagination(data.pagination);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching articles';
      setError(errorMessage);
      console.error('Error fetching student articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentArticles();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchStudentArticles(newPage);
  };

  const getStatusClassName = (reviewStatus: StudentArticle['reviewStatus']) => {
    if (reviewStatus === 'PUBLISHED') {
      return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
    }

    if (reviewStatus === 'REJECTED') {
      return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
    }

    return 'bg-gradient-to-r from-[#1a237e]/70 to-[#3949ab]/70 hover:from-[#1a237e] hover:to-[#3949ab]';
  };

  const handleDeleteArticle = async (article: StudentArticle) => {
    const actionLabel = article.isPublished ? 'delete this published article' : 'reject and delete this article';
    if (!window.confirm(`Are you sure you want to ${actionLabel}? This action cannot be undone.`)) {
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

      setArticles((currentArticles) => currentArticles.filter((currentArticle) => currentArticle._id !== article._id));
      setPagination((currentPagination) => ({
        ...currentPagination,
        total: Math.max(0, currentPagination.total - 1),
      }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the article';
      setError(errorMessage);
      console.error('Error deleting student article:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div>
      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        Student Submissions
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-[#1a237e] mb-6">Review Student Articles</h1>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-md">
              <CardHeader className="pb-2 p-4">
                <Skeleton className="h-5 lg:h-6 w-3/4 mb-2" />
                <Skeleton className="h-3 lg:h-4 w-1/2" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-12 lg:h-16 w-full" />
              </CardContent>
              <CardFooter className="p-4">
                <Skeleton className="h-8 lg:h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 lg:py-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-md">
          <FileText className="h-10 w-10 lg:h-12 lg:w-12 text-[#1a237e]/40 mx-auto mb-4" />
          <p className="text-gray-500 text-base lg:text-lg">No student articles submitted for review yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {articles.map((article) => (
              <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-md">
                <CardHeader className="pb-2 p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <CardTitle className="text-base lg:text-lg font-semibold text-[#1a237e]">{article.title}</CardTitle>
                    <Badge
                      variant={article.reviewStatus === 'PUBLISHED' ? "default" : "secondary"}
                      className={`text-xs ${getStatusClassName(article.reviewStatus)} self-start`}
                    >
                      {article.reviewStatus}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs space-y-1">
                    <span className="block">
                      By {article.writerName || article.author?.name || 'Anonymous Student'}
                    </span>
                    {article.submitterEmail && (
                      <span className="block text-[11px] text-gray-500">
                        {article.submitterEmail}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
                </CardContent>
                <CardFooter className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e] transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    onClick={() => router.push(`/admin/review-articles/${article._id}`)}
                  >
                    <BookOpen className="h-4 w-4" />
                    {article.isPublished ? 'View Article' : 'Review Article'}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center justify-center gap-2 text-sm"
                    onClick={() => handleDeleteArticle(article)}
                    disabled={isDeletingId === article._id}
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeletingId === article._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex flex-wrap justify-center mt-6 lg:mt-8 gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e] text-sm"
              >
                Previous
              </Button>
              {[...Array(pagination.pages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={pagination.page === pageNumber ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`text-sm ${pagination.page === pageNumber ?
                      "bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white" :
                      "border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"}`}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e] text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
