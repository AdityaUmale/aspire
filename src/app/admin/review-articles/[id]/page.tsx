'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, XCircle, ArrowLeft, FileText } from 'lucide-react';
import { sanitizeRichTextHtml } from '@/lib/sanitize';

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
  reviewedAt?: string | null;
  isPublished: boolean;
}

export default function ArticleReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // Get the article ID from the URL

  const [article, setArticle] = useState<StudentArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const response = await fetch(`/api/student-article?id=${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Student article not found');
          } else {
            throw new Error('Failed to fetch student article');
          }
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
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
    setActionSuccess(null);
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
      setActionSuccess('Article published successfully!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during publishing';
      setActionError(errorMessage);
      console.error('Error publishing article:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!article) return;
    if (!window.confirm('Are you sure you want to reject this article? The writer will still be able to see its rejected status.')) {
      return;
    }

    setIsProcessing(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const response = await fetch(`/api/student-article/${article._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewStatus: 'REJECTED' }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to reject article');
      }

      setArticle({
        ...article,
        isPublished: false,
        reviewStatus: 'REJECTED',
        reviewedAt: new Date().toISOString(),
      });
      setActionSuccess('Article marked as rejected successfully.');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during rejection';
      setActionError(errorMessage);
      console.error('Error rejecting student article:', err);
    } finally {
      setIsProcessing(false);
    }
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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
          Loading Article
        </div>
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/60 mb-6">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl text-center">
        <Alert variant="destructive" className="bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Article</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push('/admin/review-articles')}
          className="mt-4 bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Articles
        </Button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl text-center">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/60 mb-6">
          <FileText className="h-12 w-12 text-[#1a237e]/40 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Article data could not be loaded.</p>
        </div>
        <Button
          onClick={() => router.push('/admin/review-articles')}
          className="mt-4 bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6 cursor-pointer" onClick={() => router.push('/admin/review-articles')}>
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Articles
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-[#1a237e]">{article.title}</h1>
        <Badge
          variant={article.reviewStatus === 'PUBLISHED' ? "default" : "secondary"}
          className={getStatusClassName(article.reviewStatus)}
        >
          {article.reviewStatus}
        </Badge>
      </div>

      <div className="text-sm text-gray-500 mb-6 space-y-1">
        <p>By {article.writerName || 'Anonymous Student'}</p>
        {article.submitterEmail && <p>Verified email: {article.submitterEmail}</p>}
        {article.reviewedAt && <p>Reviewed on {new Date(article.reviewedAt).toLocaleString('en-US')}</p>}
      </div>

      <div className="prose lg:prose-xl max-w-none border-t border-b py-6 my-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/60 break-words overflow-hidden">
        {/* Replace the <p> tag with this div to render HTML */}
        <div dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(article.content) }} />
      </div>

      {actionError && (
        <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Action Error</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      {actionSuccess && (
        <Alert variant="default" className="mb-6 bg-green-100/50 border-green-300/50 text-green-800 rounded-lg shadow-sm">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{actionSuccess}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons - Disable if an action was successful and redirecting */}
      <div className="flex space-x-4">
        {article.reviewStatus !== 'PUBLISHED' && (
          <Button
            onClick={handlePublish}
            disabled={isProcessing || !!actionSuccess} // Disable if processing or success
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> {isProcessing ? 'Publishing...' : 'Publish'}
          </Button>
        )}
        <Button
          onClick={handleReject}
          disabled={isProcessing || !!actionSuccess} // Disable if processing or success
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <XCircle className="mr-2 h-4 w-4" /> {isProcessing ? 'Updating...' : 'Reject'}
        </Button>
      </div>
    </div>
  );
}
