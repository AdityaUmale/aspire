"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, User } from "lucide-react";
import {
  formatArticleDate,
  resolveReadingTimeMinutes,
} from "@/lib/article-utils";
import { ARTICLE_PROSE_CLASSES } from "@/lib/article-prose";
import ReadingProgress from "@/components/ReadingProgress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export { ARTICLE_PROSE_CLASSES };

type ArticleReaderProps = {
  title: string;
  description: string;
  contentHtml: string;
  coverImage?: string | null;
  createdAt?: string | Date | null;
  readingTimeMinutes?: number | null;
  backHref: string;
  backLabel: string;
  authorName?: string | null;
  authorSubtitle?: string | null;
  showAuthorBar?: boolean;
  /** Optional banner (e.g. writer preview of a pending submission). */
  banner?: ReactNode;
};

export default function ArticleReader({
  title,
  description,
  contentHtml,
  coverImage,
  createdAt,
  readingTimeMinutes,
  backHref,
  backLabel,
  authorName,
  authorSubtitle,
  showAuthorBar = false,
  banner,
}: ArticleReaderProps) {
  const minutes = resolveReadingTimeMinutes({
    readingTimeMinutes,
    content: contentHtml,
  });
  const dateLabel = formatArticleDate(createdAt);
  const isExternalCover =
    typeof coverImage === "string" && /^https?:\/\//i.test(coverImage);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e]/10 selection:text-[#1a237e]">
      <ReadingProgress />
      <Navbar />

      <main className="flex-1 pt-28 pb-20 lg:pt-36">
        <article className="max-w-[680px] mx-auto px-5 md:px-6">
          {banner ? <div className="mb-8">{banner}</div> : null}

          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors mb-10 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            {backLabel}
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5 text-[13px] text-gray-400">
              {dateLabel ? <time>{dateLabel}</time> : null}
              {dateLabel ? (
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
              ) : null}
              <span>{minutes} min read</span>
            </div>

            <h1 className="text-[32px] md:text-[40px] lg:text-[44px] font-bold text-gray-900 leading-[1.15] tracking-tight mb-6">
              {title}
            </h1>

            <p
              className={`text-xl text-gray-500 leading-[1.6] font-normal ${
                showAuthorBar || coverImage ? "mb-8" : ""
              }`}
            >
              {description}
            </p>

            {coverImage ? (
              <div className="relative w-full aspect-[16/9] mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                {isExternalCover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <Image
                    src={coverImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 680px) 100vw, 680px"
                    priority
                  />
                )}
              </div>
            ) : null}

            {showAuthorBar ? (
              <div className="flex items-center gap-3 py-5 border-y border-gray-100">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {authorName || "Anonymous"}
                  </p>
                  {authorSubtitle ? (
                    <p className="text-xs text-gray-400">{authorSubtitle}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </header>

          {!showAuthorBar && !coverImage ? (
            <hr className="border-gray-100 mb-10" />
          ) : null}
          {!showAuthorBar && coverImage ? (
            <hr className="border-gray-100 mb-10" />
          ) : null}

          <div className={ARTICLE_PROSE_CLASSES}>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              {backLabel.startsWith("All")
                ? backLabel.replace("All", "Back to all")
                : `Back to ${backLabel.toLowerCase()}`}
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
