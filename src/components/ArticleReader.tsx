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

export type ArticleReaderContentProps = {
  title: string;
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
  /** Optional controls or context shown after the article body. */
  afterContent?: ReactNode;
};

export function ArticleReaderContent({
  title,
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
  afterContent,
}: ArticleReaderContentProps) {
  const minutes = resolveReadingTimeMinutes({
    readingTimeMinutes,
    content: contentHtml,
  });
  const dateLabel = formatArticleDate(createdAt);
  const isExternalCover =
    typeof coverImage === "string" && /^https?:\/\//i.test(coverImage);

  return (
    <article className="mx-auto max-w-[680px] px-5 md:px-6">
      {banner ? <div className="mb-8">{banner}</div> : null}

      <Link
        href={backHref}
        className="group mb-10 inline-flex items-center gap-1.5 text-[13px] text-gray-400 transition-colors hover:text-gray-600"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        {backLabel}
      </Link>

      <header className="mb-10">
        {showAuthorBar ? (
          <div className="mb-8 flex items-center gap-3 border-y border-gray-100 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
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

        <div className="mb-5 flex items-center gap-3 text-[13px] text-gray-400">
          {dateLabel ? <time>{dateLabel}</time> : null}
          {dateLabel ? <span className="h-1 w-1 rounded-full bg-gray-300" /> : null}
          <span>{minutes} min read</span>
        </div>

        <h1 className="mb-6 text-[32px] font-bold leading-[1.15] tracking-tight text-gray-900 md:text-[40px] lg:text-[44px]">
          {title}
        </h1>

        {coverImage ? (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
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
      </header>

      {!showAuthorBar ? <hr className="mb-10 border-gray-100" /> : null}

      <div className={ARTICLE_PROSE_CLASSES}>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>

      {afterContent}

      <div className="mt-16 border-t border-gray-100 pt-8">
        <Link
          href={backHref}
          className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {backLabel.startsWith("All")
            ? backLabel.replace("All", "Back to all")
            : `Back to ${backLabel.toLowerCase()}`}
        </Link>
      </div>
    </article>
  );
}

export default function ArticleReader(props: ArticleReaderContentProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#1a237e]/10 selection:text-[#1a237e]">
      <ReadingProgress />
      <Navbar />

      <main className="flex-1 pt-28 pb-20 lg:pt-36">
        <ArticleReaderContent {...props} />
      </main>

      <Footer />
    </div>
  );
}
