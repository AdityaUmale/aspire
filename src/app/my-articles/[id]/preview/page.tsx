"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleReader from "@/components/ArticleReader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Eye,
  Pencil,
  Terminal,
} from "lucide-react";
import { sanitizeRichTextHtml } from "@/lib/sanitize";

type PreviewArticle = {
  _id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  writerName?: string | null;
  readingTimeMinutes?: number | null;
  reviewStatus?: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
  createdAt?: string;
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft — only you can see this preview",
  PENDING: "Submitted for review — not public yet",
  REJECTED: "Rejected — preview of your last submission",
  PUBLISHED: "Published — this is also live publicly",
};

export default function WriterArticlePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [article, setArticle] = useState<PreviewArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/student-article/${id}`, {
          cache: "no-store",
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401 || response.status === 404) {
            throw new Error(
              "Preview not available. Verify your email and open previews only for your own submissions."
            );
          }
          throw new Error(data.error || "Failed to load preview");
        }

        if (!data.article) {
          throw new Error("Article not found");
        }

        setArticle(data.article as PreviewArticle);
      } catch (loadError: unknown) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load preview"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1 pt-28 pb-20">
          <div className="max-w-[680px] mx-auto px-5 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1 pt-32 pb-20">
          <div className="max-w-lg mx-auto px-5">
            <Alert
              variant="destructive"
              className="bg-red-50 border-red-100 text-red-900 rounded-xl"
            >
              <Terminal className="h-4 w-4" />
              <AlertTitle>Preview unavailable</AlertTitle>
              <AlertDescription>
                {error || "This article could not be loaded."}
              </AlertDescription>
            </Alert>
            <Button
              className="mt-6 rounded-full"
              variant="outline"
              onClick={() => router.push("/my-articles")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to my articles
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = article.reviewStatus || "PENDING";
  const canEdit =
    status === "DRAFT" || status === "PENDING" || status === "REJECTED";

  return (
    <ArticleReader
      title={article.title}
      contentHtml={sanitizeRichTextHtml(article.content)}
      coverImage={article.coverImage}
      createdAt={article.createdAt}
      readingTimeMinutes={article.readingTimeMinutes}
      backHref="/my-articles"
      backLabel="My articles"
      showAuthorBar
      authorName={article.writerName || "You"}
      authorSubtitle="Writer preview"
      banner={
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-950">
                  Private preview
                </p>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  {STATUS_LABEL[status] ||
                    "This is how your article will look when published."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canEdit ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
                  onClick={() =>
                    router.push(`/publish-article?draft=${article._id}`)
                  }
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
                onClick={() => router.push("/my-articles")}
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
}
