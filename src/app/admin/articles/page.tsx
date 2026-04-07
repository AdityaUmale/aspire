'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FloatingToast } from '@/components/ui/floating-toast';
import { Terminal, PenLine, LoaderCircle, Trash2, FileText } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import { format } from 'date-fns';

interface Article {
  _id: string;
  title: string;
  description: string;
  content: string;
  createdAt?: string;
}

export default function AddArticlesPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

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
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching articles';
      setArticlesError(errorMessage);
      console.error('Error fetching founder articles:', err);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Validate form fields
    if (!title.trim() || !description.trim() || !content.trim()) {
      setError('All fields are required');
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
          description,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create article');
      }

      // Clear form and show success message
      setTitle('');
      setDescription('');
      setContent('');
      setSuccess('Article created successfully!');
      setArticles((currentArticles) => [data.article, ...currentArticles]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the article';
      setError(errorMessage);
      console.error('Error creating article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, articleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)) {
      return;
    }

    setArticlesError(null);
    setSuccess(null);
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
      setSuccess('Article deleted successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the article';
      setArticlesError(errorMessage);
      console.error('Error deleting founder article:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div>
      <FloatingToast
        open={Boolean(success)}
        onClose={() => setSuccess(null)}
        variant="success"
        title={success?.includes('deleted') ? 'Founder article deleted' : 'Founder article created'}
        description={success || ''}
        durationMs={4500}
        className="top-6 md:top-6"
      />

      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        Founder Articles
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-[#1a237e] mb-6">Create and Manage Founder Articles</h1>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-transparent relative max-w-5xl mx-auto mt-12 pb-32">
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
                className="border-0 bg-transparent p-0 pb-1 h-auto text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 placeholder:text-gray-300 focus-visible:ring-0 shadow-none -ml-[2px] transition-all"
                required
              />
              <div className="absolute bottom-0 left-5 right-5 h-0.5 w-0 bg-[#1a237e] transition-all duration-700 group-focus-within/input:w-[calc(100%-40px)] opacity-40 rounded-full"></div>
            </div>
          </div>

          {/* Section 02: Description */}
          <div className="space-y-3 group/section transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                02
              </span>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
                  Short Description <span className="text-red-400 text-xs">*</span>
                </label>
                <p className="text-xs text-gray-400 mt-0.5">A compelling summary that makes readers want to dive in</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 group-focus-within/section:border-[#1a237e]/40 transition-all duration-300 shadow-sm focus-within:shadow-md">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a compelling summary that makes readers want to dive in..."
                className="border-0 bg-transparent p-5 min-h-[100px] text-lg font-light text-gray-700 placeholder:text-gray-300 focus-visible:ring-0 shadow-none resize-none leading-relaxed rounded-2xl"
                required
              />
            </div>
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
                  <p className="text-xs text-gray-400 mt-0.5">Write the full article here — use formatting, headings, and images</p>
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

        <section className="mt-20 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1a237e]">Published Founder Articles</h2>
              <p className="text-sm text-gray-500 mt-1">Admins can remove existing published founder articles from here.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fetchArticles()}
              disabled={isLoadingArticles}
              className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"
            >
              {isLoadingArticles ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {articlesError && (
            <Alert variant="destructive" className="bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{articlesError}</AlertDescription>
            </Alert>
          )}

          {isLoadingArticles ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
              Loading founder articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <FileText className="mx-auto mb-4 h-10 w-10 text-[#1a237e]/35" />
              <p className="text-gray-600">No founder articles have been published yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1a237e]">{article.title}</h3>
                      {article.createdAt && (
                        <p className="mt-1 text-xs text-gray-500">
                          Published on {format(new Date(article.createdAt), 'PPP')}
                        </p>
                      )}
                      <p className="mt-3 text-sm leading-6 text-gray-600">{article.description}</p>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteArticle(article._id, article.title)}
                      disabled={isDeletingId === article._id}
                      className="shrink-0"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeletingId === article._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
