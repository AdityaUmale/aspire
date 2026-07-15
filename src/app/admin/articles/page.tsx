'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenLine, LoaderCircle, Trash2, FileText, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import { MAX_LENGTHS } from '@/lib/validation';
import { extractPlainText, formatArticleDate } from '@/lib/article-utils';
import CoverImageField from '@/components/CoverImageField';
import {
  EditorialArticleRow,
  EditorialArticleRowSkeleton,
} from '@/components/EditorialArticleRow';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminEmptyState } from '@/components/admin/empty-state';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';
import { cn } from '@/lib/utils';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] rounded-2xl border-2 border-gray-200 bg-white animate-pulse" />
  ),
});

interface Article {
  _id: string;
  title: string;
  description: string;
  slug?: string | null;
  coverImage?: string | null;
  content?: string;
  createdAt?: string;
}

export default function AddArticlesPage() {
  const toast = useAdminToast();
  const errorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const fetchArticles = async () => {
    setIsLoadingArticles(true);
    setArticlesError(null);

    try {
      const response = await fetch('/api/article?page=1&limit=20');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch articles');
      }

      setArticles(data.articles || []);
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not load founder articles.');
      setArticlesError(errorMessage);
      toast.error('Failed to load articles', errorMessage);
      console.error('Error fetching founder articles:', err);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const plainText = extractPlainText(content);
    const hasImages = /<img\b/i.test(content);

    if (!title.trim() || title.length > MAX_LENGTHS.title) {
      const message = `Title is required (max ${MAX_LENGTHS.title} characters).`;
      setError(message);
      toast.error('Check the title', message);
      setIsSubmitting(false);
      return;
    }

    if (!content.trim() || (!plainText && !hasImages)) {
      const message = 'Article content is required. Add text or images before publishing.';
      setError(message);
      toast.error('Content required', message);
      setIsSubmitting(false);
      return;
    }

    if (content.length > MAX_LENGTHS.content) {
      const message = `Article content is too long (max ${MAX_LENGTHS.content.toLocaleString()} characters).`;
      setError(message);
      toast.error('Content too long', message);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          coverImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create article');
      }

      setTitle('');
      setContent('');
      setCoverImage(null);
      toast.success('Article published', `“${data.article?.title || title}” is now live.`);
      setArticles((currentArticles) => [data.article, ...currentArticles]);
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not create the article. Please try again.');
      setError(errorMessage);
      toast.error('Publish failed', errorMessage);
      console.error('Error creating article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, articleTitle: string) => {
    if (!window.confirm(`Delete “${articleTitle}”? This cannot be undone.`)) {
      return;
    }

    setArticlesError(null);
    setError(null);
    setIsDeletingId(articleId);

    try {
      const response = await fetch(`/api/article?id=${articleId}`, {
        method: 'DELETE',
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete article');
      }

      setArticles((currentArticles) => currentArticles.filter((article) => article._id !== articleId));
      toast.success('Article deleted', `“${articleTitle}” has been removed.`);
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not delete this article. Please try again.');
      setArticlesError(errorMessage);
      toast.error('Delete failed', errorMessage);
      console.error('Error deleting founder article:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        badge="Founder articles"
        title="Create and manage founder articles"
        description="Write and publish founder pieces, then manage existing published articles below."
      />

      {error ? (
        <div ref={errorRef} className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="relative mx-auto max-w-5xl pb-24">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 01: Title */}
          <div className="space-y-3 group/section transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                01
              </span>
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-800">
                  Article Title <span className="text-red-400 text-xs">*</span>
                </label>
                <p className="text-xs text-gray-400 mt-0.5">A clear, compelling headline for your article</p>
              </div>
            </div>
            <div className="relative group/input bg-white rounded-2xl border border-gray-200 group-focus-within/section:border-[#1a237e]/40 transition-all duration-300 shadow-sm focus-within:shadow-md px-5 pt-5 pb-4">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is the name of your story?"
                maxLength={MAX_LENGTHS.title}
                className="border-0 bg-transparent p-0 pb-1 h-auto text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 placeholder:text-gray-300 focus-visible:ring-0 shadow-none -ml-[2px] transition-all"
                required
              />
              <div className="absolute bottom-0 left-5 right-5 h-0.5 w-0 bg-[#1a237e] transition-all duration-700 group-focus-within/input:w-[calc(100%-40px)] opacity-40 rounded-full"></div>
              <p className="text-[11px] text-gray-400 mt-3 text-right">
                {title.length}/{MAX_LENGTHS.title}
              </p>
            </div>
          </div>

          {/* Section 02: Cover */}
          <div className="space-y-3 group/section transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                02
              </span>
              <div>
                <p className="block text-sm font-semibold text-gray-800">
                  Cover image <span className="text-gray-400 text-xs font-normal">(optional)</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Card thumbnail and social share image
                </p>
              </div>
            </div>
            <CoverImageField
              value={coverImage}
              onChange={setCoverImage}
              disabled={isSubmitting}
            />
          </div>

          {/* Section 03: Content */}
          <div className="space-y-3 group/section transition-all duration-500 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                  03
                </span>
                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Article Content <span className="text-red-400 text-xs">*</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Write the full article — headings, quotes, links (cover is separate above)
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                Rich Text Editor
              </div>
            </div>
            <div className="relative group/editor">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Share the full depth of your perspective here..."
                stickyToolbar
                toolbarOffsetPx={16}
                allowInlineImages={false}
              />
            </div>
          </div>

          <div className="pt-12 flex items-center justify-end">
            <Button
              type="submit"
              className="group h-16 px-12 bg-[#1a237e] hover:bg-[#0d1642] text-white rounded-full transition-all shadow-[0_10px_30px_rgba(26,35,126,0.3)] hover:shadow-[0_20px_40px_rgba(26,35,126,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Article
                  <PenLine className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </>
              )}
            </Button>
          </div>
        </form>

        <section className="mt-16 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1a237e] sm:text-2xl">Published founder articles</h2>
              <p className="mt-1 text-sm text-gray-500">Remove published founder articles from the site here.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fetchArticles()}
              disabled={isLoadingArticles}
              className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"
            >
              <RefreshCw className={cn('h-4 w-4', isLoadingArticles && 'animate-spin')} />
              {isLoadingArticles ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>

          {articlesError ? (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{articlesError}</p>
            </div>
          ) : null}

          {isLoadingArticles ? (
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {[...Array(3)].map((_, index) => (
                <EditorialArticleRowSkeleton key={index} dense />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <AdminEmptyState
              icon={FileText}
              title="No founder articles yet"
              description="Publish your first founder article using the form above."
            />
          ) : (
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {articles.map((article) => (
                <EditorialArticleRow
                  key={article._id}
                  dense
                  href={`/articles/${article.slug || article._id}`}
                  title={article.title}
                  description={article.description}
                  coverImage={article.coverImage}
                  metadata={
                    <>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                        Published
                      </span>
                      {article.createdAt ? <span>{formatArticleDate(article.createdAt)}</span> : null}
                    </>
                  }
                  actions={
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        asChild
                        className="h-9 rounded-full border-[#1a237e]/20 px-4 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"
                      >
                        <Link href={`/articles/${article.slug || article._id}`}>
                          <BookOpen className="h-4 w-4" />
                          View live
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleDeleteArticle(article._id, article.title)}
                        disabled={isDeletingId === article._id}
                        className="h-9 shrink-0 rounded-full px-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        {isDeletingId === article._id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
