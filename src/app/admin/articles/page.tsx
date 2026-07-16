'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  BookOpen,
  FileText,
  LoaderCircle,
  Newspaper,
  PenLine,
  RefreshCw,
  Send,
  Terminal,
  Trash2,
} from 'lucide-react';
import { MAX_LENGTHS } from '@/lib/validation';
import { extractPlainText, formatArticleDate } from '@/lib/article-utils';
import CoverImageField from '@/components/CoverImageField';
import type { RichTextEditorHandle } from '@/components/RichTextEditor';
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
    <div className="min-h-[400px] rounded-lg border border-gray-200 bg-white animate-pulse" />
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
  const editorRef = useRef<RichTextEditorHandle | null>(null);
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

    const flushedContent = editorRef.current?.flush() ?? content;
    setContent(flushedContent);

    const plainText = extractPlainText(flushedContent);
    const hasImages = /<img\b/i.test(flushedContent);

    if (!title.trim() || title.length > MAX_LENGTHS.title) {
      const message = `Title is required (max ${MAX_LENGTHS.title} characters).`;
      setError(message);
      toast.error('Check the title', message);
      setIsSubmitting(false);
      return;
    }

    if (!flushedContent.trim() || (!plainText && !hasImages)) {
      const message = 'Article content is required. Add text or images before publishing.';
      setError(message);
      toast.error('Content required', message);
      setIsSubmitting(false);
      return;
    }

    if (flushedContent.length > MAX_LENGTHS.content) {
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
          content: flushedContent,
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

      setArticles((currentArticles) =>
        currentArticles.filter((article) => article._id !== articleId)
      );
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

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = content.replace(/<[^>]*>/g, '').length;

  return (
    <div>
      <AdminPageHeader
        badge="Founder articles"
        title="Create and manage founder articles"
        description="Write and publish founder pieces with the same writing canvas used across the site, then manage published articles below."
      />

      <div className="space-y-4 mb-8">
        {error ? (
          <div ref={errorRef}>
            <Alert
              variant="destructive"
              className="rounded-2xl border-red-100 bg-red-50 text-red-900 shadow-sm animate-in zoom-in-95"
            >
              <Terminal className="h-4 w-4" />
              <AlertTitle className="font-bold">Something needs attention</AlertTitle>
              <AlertDescription className="text-red-800/80">{error}</AlertDescription>
            </Alert>
          </div>
        ) : null}
      </div>

      <div className="relative pb-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 items-start xl:grid-cols-[1fr_320px]">
            {/* Left: Writing canvas */}
            <div className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="space-y-1.5">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                  Title <span className="text-red-500">*</span>
                </label>
                <p className="mb-2 text-sm text-gray-500">
                  Craft a clear, engaging title that summarizes your article.
                </p>
                <div className="relative">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a compelling title..."
                    maxLength={MAX_LENGTHS.title}
                    className="h-11 w-full rounded-lg border-gray-300 px-4 pr-16 text-base shadow-sm transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums text-gray-400">
                    {title.length}/{MAX_LENGTHS.title}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="block text-sm font-semibold text-gray-900">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">
                      Write the full article. Use headings, lists, and formatting to keep it readable.
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-xs font-medium tabular-nums text-gray-500 sm:block">
                    {wordCount} words · {characterCount} characters
                  </div>
                </div>

                <div className="relative flex min-h-[400px] flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
                  <div className="min-h-[400px] flex-1">
                    <RichTextEditor
                      ref={editorRef}
                      content={content}
                      onChange={setContent}
                      placeholder="Start writing your article here..."
                      stickyToolbar={false}
                      allowInlineImages={false}
                      borderless
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Publishing sidebar */}
            <div className="space-y-5 xl:sticky xl:top-6">
              <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-gray-900">
                    <Newspaper className="h-4 w-4 text-[#1a237e]" />
                    Publish Article
                  </h3>
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                    Live on site
                  </span>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl bg-[#1a237e] text-sm font-bold text-white shadow-[0_4px_16px_rgba(26,35,126,0.15)] transition-all duration-300 hover:scale-[1.01] hover:bg-[#0d1642] hover:shadow-[0_8px_24px_rgba(26,35,126,0.25)] active:scale-[0.99]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Publishing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Publish Article
                        <Send className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById('published-founder-articles')?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }
                    className="h-12 w-full rounded-2xl border-gray-200 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-[#1a237e]"
                  >
                    <BookOpen className="mr-2 h-3.5 w-3.5" />
                    View published list
                  </Button>
                </div>

                <p className="text-[11px] font-normal leading-relaxed text-gray-400">
                  Founder articles publish immediately and appear on the public Articles page.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-gray-900">
                  <PenLine className="h-4 w-4 text-[#1a237e]" />
                  Cover Image
                </h3>
                <p className="text-[10px] leading-snug text-gray-400">
                  Used as a thumbnail in article lists and for social card sharing.
                </p>
                <div className="pt-1">
                  <CoverImageField
                    value={coverImage}
                    onChange={setCoverImage}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <section id="published-founder-articles" className="mt-16 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1a237e] sm:text-2xl">
                Published founder articles
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Remove published founder articles from the site here.
              </p>
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
              <Terminal className="mt-0.5 h-4 w-4 shrink-0" />
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
                      {article.createdAt ? (
                        <span>{formatArticleDate(article.createdAt)}</span>
                      ) : null}
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
