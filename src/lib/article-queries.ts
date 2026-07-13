import { cache } from "react";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Article from "@/lib/models/Article";
import StudentArticle from "@/lib/models/StudentArticle";
import {
  buildArticleSlug,
  computeReadingTimeMinutes,
  extractFirstImageSrc,
  resolveReadingTimeMinutes,
} from "@/lib/article-utils";
import {
  getPublishedStudentArticleFilter,
  isStudentArticlePublished,
} from "@/lib/student-article-status";
import { sanitizeRichTextHtml } from "@/lib/sanitize";

export type FounderArticleRecord = {
  _id: string;
  title: string;
  description: string;
  content: string;
  slug?: string | null;
  readingTimeMinutes?: number | null;
  coverImage?: string | null;
  author?: { name?: string; email?: string } | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
};

export type StudentArticleRecord = {
  _id: string;
  title: string;
  description: string;
  content: string;
  slug?: string | null;
  readingTimeMinutes?: number | null;
  coverImage?: string | null;
  writerName?: string | null;
  author?: { name?: string; email?: string } | null;
  reviewStatus?: string;
  isPublished?: boolean;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
};

const isObjectId = (value: string) => mongoose.Types.ObjectId.isValid(value);

const ensureFounderDerivedFields = async (
  article: FounderArticleRecord
): Promise<FounderArticleRecord> => {
  const updates: Record<string, unknown> = {};
  let slug = article.slug;
  let readingTimeMinutes = article.readingTimeMinutes;
  let coverImage = article.coverImage ?? null;

  if (!slug) {
    slug = buildArticleSlug(article.title, article._id);
    updates.slug = slug;
  }

  if (
    typeof readingTimeMinutes !== "number" ||
    !Number.isFinite(readingTimeMinutes) ||
    readingTimeMinutes <= 0
  ) {
    readingTimeMinutes = computeReadingTimeMinutes(article.content);
    updates.readingTimeMinutes = readingTimeMinutes;
  }

  if (!coverImage) {
    const fromContent = extractFirstImageSrc(article.content);
    if (fromContent) {
      coverImage = fromContent;
      updates.coverImage = fromContent;
    }
  }

  if (Object.keys(updates).length > 0) {
    await Article.updateOne({ _id: article._id }, { $set: updates });
  }

  return {
    ...article,
    slug,
    readingTimeMinutes,
    coverImage,
    content: sanitizeRichTextHtml(article.content ?? ""),
  };
};

const ensureStudentDerivedFields = async (
  article: StudentArticleRecord
): Promise<StudentArticleRecord> => {
  const updates: Record<string, unknown> = {};
  let slug = article.slug;
  let readingTimeMinutes = article.readingTimeMinutes;
  let coverImage = article.coverImage ?? null;

  if (!slug) {
    slug = buildArticleSlug(article.title, article._id);
    updates.slug = slug;
  }

  if (
    typeof readingTimeMinutes !== "number" ||
    !Number.isFinite(readingTimeMinutes) ||
    readingTimeMinutes <= 0
  ) {
    readingTimeMinutes = computeReadingTimeMinutes(article.content);
    updates.readingTimeMinutes = readingTimeMinutes;
  }

  if (!coverImage) {
    const fromContent = extractFirstImageSrc(article.content);
    if (fromContent) {
      coverImage = fromContent;
      updates.coverImage = fromContent;
    }
  }

  if (Object.keys(updates).length > 0) {
    await StudentArticle.updateOne({ _id: article._id }, { $set: updates });
  }

  return {
    ...article,
    slug,
    readingTimeMinutes,
    coverImage,
    content: sanitizeRichTextHtml(article.content ?? ""),
  };
};

/** Dedupes generateMetadata + page render double-fetch within a request. */
export const getFounderArticleByParam = cache(
  async (param: string): Promise<FounderArticleRecord | null> => {
    await connectDB();

    const query = isObjectId(param)
      ? { $or: [{ slug: param }, { _id: param }] }
      : { slug: param };

    const article = (await Article.findOne(query)
      .populate("author", "name")
      .lean()) as unknown as FounderArticleRecord | null;

    if (!article) {
      return null;
    }

    return ensureFounderDerivedFields({
      ...article,
      _id: String(article._id),
    });
  }
);

export const getPublishedStudentArticleByParam = cache(
  async (param: string): Promise<StudentArticleRecord | null> => {
    await connectDB();

    const query = isObjectId(param)
      ? { $or: [{ slug: param }, { _id: param }] }
      : { slug: param };

    const article = (await StudentArticle.findOne(query)
      .populate("author", "name")
      .lean()) as unknown as StudentArticleRecord | null;

    if (!article || !isStudentArticlePublished(article)) {
      return null;
    }

    return ensureStudentDerivedFields({
      ...article,
      _id: String(article._id),
    });
  }
);

export const listPublishedFounderArticlesForSitemap = async () => {
  await connectDB();

  const articles = (await Article.find({})
    .select("title slug createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean()) as unknown as Array<{
    _id: unknown;
    title: string;
    slug?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }>;

  return Promise.all(
    articles.map(async (article) => {
      const id = String(article._id);
      let slug = article.slug || null;
      if (!slug) {
        slug = buildArticleSlug(article.title, id);
        await Article.updateOne({ _id: id }, { $set: { slug } }).catch(
          () => undefined
        );
      }
      return {
        id,
        slug,
        lastModified: article.updatedAt || article.createdAt || new Date(),
      };
    })
  );
};

export const listPublishedStudentArticlesForSitemap = async () => {
  await connectDB();

  const articles = (await StudentArticle.find(
    getPublishedStudentArticleFilter()
  )
    .select("title slug createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean()) as unknown as Array<{
    _id: unknown;
    title: string;
    slug?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }>;

  return Promise.all(
    articles.map(async (article) => {
      const id = String(article._id);
      let slug = article.slug || null;
      if (!slug) {
        slug = buildArticleSlug(article.title, id);
        await StudentArticle.updateOne({ _id: id }, { $set: { slug } }).catch(
          () => undefined
        );
      }
      return {
        id,
        slug,
        lastModified: article.updatedAt || article.createdAt || new Date(),
      };
    })
  );
};

export const withListReadingTime = <
  T extends {
    content?: string;
    readingTimeMinutes?: number | null;
  },
>(
  article: T
) => ({
  ...article,
  readingTimeMinutes: resolveReadingTimeMinutes({
    readingTimeMinutes: article.readingTimeMinutes,
    content: article.content,
  }),
});
