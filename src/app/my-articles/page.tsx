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
  FileText,
  ShieldCheck,
  Terminal,
  XCircle,
} from 'lucide-react';

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
  reviewStatus: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const STATUS_STYLES: Record<WriterArticle['reviewStatus'], string> = {
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

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      setError(null);

      try {
        const sessionResponse = await fetch('/api/writer-auth/session', {
          cache: 'no-store',
        });
        const sessionData = await sessionResponse.json() as WriterSession;
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

    void loadPage();
  }, []);

  const formatDate = (value?: string) => {
    if (!value) return 'Unknown';

    return new Date(value).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusCopy = (status: WriterArticle['reviewStatus']) => {
    if (status === 'PUBLISHED') {
      return 'Live on the Student Articles page.';
    }

    if (status === 'REJECTED') {
      return 'This submission was reviewed but not approved for publishing.';
    }

    return 'Your article is waiting for editorial review.';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#1a237e] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1a237e]/10 bg-white px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#1a237e] uppercase shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Writer Dashboard
            </div>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold text-[#1a237e] tracking-tight">
              Your article statuses
            </h1>
            <p className="mt-4 max-w-2xl text-gray-500 text-lg leading-relaxed">
              Keep an eye on every submission from the same verified browser session.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-8 bg-red-50 border-red-100 text-red-900 rounded-2xl shadow-sm">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Unable to load your dashboard</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="grid gap-5">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="rounded-[2rem] border-gray-200/80 bg-white/90 shadow-sm">
                  <CardHeader>
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-5 w-full mb-3" />
                    <Skeleton className="h-5 w-4/5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !session?.writer ? (
            <Card className="rounded-[2rem] border-[#1a237e]/10 bg-white/90 shadow-sm">
              <CardContent className="py-10 px-8 text-center">
                <Clock3 className="h-12 w-12 text-[#1a237e]/40 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#1a237e] mb-3">No verified writer session yet</h2>
                <p className="text-gray-500 max-w-xl mx-auto leading-relaxed mb-6">
                  Verify your email from the publish page first. Once you do, this dashboard will show every submission and whether it is pending, published, or rejected.
                </p>
                <Button
                  onClick={() => router.push('/publish-article')}
                  className="rounded-full h-12 px-7 bg-[#1a237e] hover:bg-[#0d1642] text-white"
                >
                  Verify Email and Submit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              

              {articles.length === 0 ? (
                <Card className="rounded-[2rem] border-gray-200/80 bg-white/90 shadow-sm">
                  <CardContent className="py-10 px-8 text-center">
                    <FileText className="h-12 w-12 text-[#1a237e]/40 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#1a237e] mb-3">No submissions yet</h2>
                    <p className="text-gray-500 max-w-xl mx-auto leading-relaxed mb-6">
                      Your verified session is ready. Submit your first article and it will appear here right away.
                    </p>
                    <Button
                      onClick={() => router.push('/publish-article')}
                      className="rounded-full h-12 px-7 bg-[#1a237e] hover:bg-[#0d1642] text-white"
                    >
                      Submit an Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-5">
                  {articles.map((article) => (
                    <Card key={article.id} className="rounded-[2rem] border-gray-200/80 bg-white/90 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <CardTitle className="text-2xl text-[#1a237e]">{article.title}</CardTitle>
                            <p className="text-sm text-gray-500 mt-2">
                              Submitted on {formatDate(article.createdAt)}
                            </p>
                          </div>
                          <Badge className={`border ${STATUS_STYLES[article.reviewStatus]}`}>
                            {article.reviewStatus}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed mb-4">{article.description}</p>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <p className="text-sm text-gray-500">{getStatusCopy(article.reviewStatus)}</p>
                          {article.isPublished ? (
                            <Button
                              variant="outline"
                              onClick={() => router.push('/student-articles')}
                              className="rounded-full border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/5"
                            >
                              Browse Published Stories
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          ) : article.reviewStatus === 'REJECTED' ? (
                            <span className="inline-flex items-center gap-2 text-sm text-red-600">
                              <XCircle className="h-4 w-4" />
                              Editorial review complete
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-sm text-amber-600">
                              <Clock3 className="h-4 w-4" />
                              Still pending review
                            </span>
                          )}
                        </div>
                      </CardContent>
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
