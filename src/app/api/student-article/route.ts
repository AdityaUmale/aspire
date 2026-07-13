import connectDB from "@/lib/db";
import StudentArticle from "@/lib/models/StudentArticle";
import "@/lib/models/Admin";
import "@/lib/models/Writer";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAdminFromRequest, requireAdmin } from "@/lib/auth";
import { sanitizeRichTextHtml } from "@/lib/sanitize";
import {
  deriveStudentArticleReviewStatus,
  getAdminStudentArticleFilter,
  getPendingStudentArticleFilter,
  getPublishedStudentArticleFilter,
  isStudentArticlePublished,
} from "@/lib/student-article-status";
import {
  MAX_LENGTHS,
  clampPagination,
  isValidLength,
  normalizeString,
} from "@/lib/validation";
import {
  getOrRefreshWriterSession,
  setWriterSessionCookie,
} from "@/lib/writer-auth";
import {
  buildArticleSlug,
  computeReadingTimeMinutes,
  resolveReadingTimeMinutes,
} from "@/lib/article-utils";
import {
  isAllowedCoverImageUrl,
  normalizeCoverImage,
} from "@/lib/cover-image";

const getAuthorProjection = (isAdmin: boolean) =>
  isAdmin ? "name email" : "name";

const LIST_PROJECTION =
  "title description slug readingTimeMinutes coverImage author writerName reviewStatus isPublished createdAt updatedAt reviewedBy content";

const sanitizeStudentArticleForResponse = <
  T extends {
    content?: string;
    reviewStatus?: unknown;
    isPublished?: boolean;
    readingTimeMinutes?: number | null;
  },
>(
  article: T | null,
  options: { includeContent?: boolean } = {}
) => {
  if (!article) {
    return article;
  }

  const includeContent = options.includeContent !== false;
  const reviewStatus = deriveStudentArticleReviewStatus(article);
  const content = article.content ?? "";

  return {
    ...article,
    reviewStatus,
    isPublished: reviewStatus === "PUBLISHED",
    readingTimeMinutes: resolveReadingTimeMinutes({
      readingTimeMinutes: article.readingTimeMinutes,
      content: includeContent ? content : "",
    }),
    ...(includeContent
      ? { content: sanitizeRichTextHtml(content) }
      : { content: undefined }),
  };
};

/**
 * One-shot (per process) backfill for legacy docs missing reviewStatus.
 * Avoids two collection-wide writes on every public list request.
 */
let reviewStatusBackfillPromise: Promise<void> | null = null;

const ensureReviewStatusBackfillOnce = () => {
  if (!reviewStatusBackfillPromise) {
    reviewStatusBackfillPromise = (async () => {
      await Promise.all([
        StudentArticle.updateMany(
          { reviewStatus: { $exists: false }, isPublished: true },
          { $set: { reviewStatus: "PUBLISHED" } }
        ),
        StudentArticle.updateMany(
          { reviewStatus: { $exists: false }, isPublished: { $ne: true } },
          { $set: { reviewStatus: "PENDING" } }
        ),
      ]);
    })().catch((error) => {
      console.error("Failed to backfill student article reviewStatus", error);
      // Allow a later request to retry after a cold-start failure.
      reviewStatusBackfillPromise = null;
    });
  }
  return reviewStatusBackfillPromise;
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const writerSession = await getOrRefreshWriterSession(req);
    const admin = writerSession ? null : await getAdminFromRequest(req);

    if (!admin && !writerSession) {
      return NextResponse.json(
        { error: "Email verification is required before submitting an article" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const title = normalizeString(body?.title);
    const description = normalizeString(body?.description);
    const content = normalizeString(body?.content);
    const writerName = normalizeString(body?.writerName);

    if (
      !isValidLength(title, MAX_LENGTHS.title) ||
      !isValidLength(description, MAX_LENGTHS.description) ||
      !isValidLength(content, MAX_LENGTHS.content)
    ) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid required fields (title, description, content)",
        },
        { status: 400 }
      );
    }

    if (writerName && writerName.length > MAX_LENGTHS.writerName) {
      return NextResponse.json(
        { error: "Writer name exceeds allowed length" },
        { status: 400 }
      );
    }

    let coverImage: string | null = null;
    if (
      body?.coverImage !== undefined &&
      body?.coverImage !== null &&
      body?.coverImage !== ""
    ) {
      if (!isAllowedCoverImageUrl(body.coverImage)) {
        return NextResponse.json(
          { error: "Invalid cover image URL" },
          { status: 400 }
        );
      }
      coverImage = normalizeCoverImage(body.coverImage);
    }

    const sanitizedContent = sanitizeRichTextHtml(content);
    const readingTimeMinutes = computeReadingTimeMinutes(sanitizedContent);

    const newStudentArticle = new StudentArticle({
      title,
      description,
      content: sanitizedContent,
      writerName: writerName || null,
      author: admin?.id ?? null,
      writer: writerSession?.writer.id ?? null,
      submitterEmail: writerSession?.writer.email ?? admin?.email ?? null,
      reviewStatus: "PENDING",
      isPublished: false,
      readingTimeMinutes,
      coverImage,
    });

    newStudentArticle.slug = buildArticleSlug(
      title,
      String(newStudentArticle._id)
    );
    const savedArticle = await newStudentArticle.save();

    const response = NextResponse.json(
      {
        message: "Student article created successfully",
        article: sanitizeStudentArticleForResponse(savedArticle.toObject()),
      },
      { status: 201 }
    );

    if (writerSession?.wasRefreshed) {
      setWriterSessionCookie(response, writerSession.token);
    }

    return response;
  } catch (error) {
    console.error("Error creating student article", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create student article" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const publishedOnly = searchParams.get("published") === "true";

    let admin = null;
    if (!publishedOnly) {
      const auth = await requireAdmin(req);
      if (!auth.ok) {
        return auth.response;
      }
      admin = auth.admin;
    } else {
      admin = await getAdminFromRequest(req);
    }

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid student article ID format" },
          { status: 400 }
        );
      }

      const article = (await StudentArticle.findById(id)
        .populate("author", getAuthorProjection(Boolean(admin)))
        .populate("reviewedBy", "name email")
        .lean()) as {
        content?: string;
        reviewStatus?: unknown;
        isPublished?: boolean;
        readingTimeMinutes?: number | null;
      } | null;

      if (!article) {
        return NextResponse.json(
          { error: "Student article not found" },
          { status: 404 }
        );
      }

      if (!admin && !isStudentArticlePublished(article)) {
        return NextResponse.json(
          { error: "Student article not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { article: sanitizeStudentArticleForResponse(article) },
        { status: 200 }
      );
    }

    // One-shot per process — not on every public list hit forever.
    if (publishedOnly || admin) {
      void ensureReviewStatusBackfillOnce();
    }

    const { page, limit, skip } = clampPagination({
      pageInput: searchParams.get("page"),
      limitInput: searchParams.get("limit"),
      defaultLimit: 10,
      maxLimit: 20,
    });

    const filter = publishedOnly
      ? getPublishedStudentArticleFilter()
      : getAdminStudentArticleFilter();

    const listQuery = StudentArticle.find(filter)
      .select(LIST_PROJECTION)
      .populate("author", getAuthorProjection(Boolean(admin)))
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalQuery = publishedOnly
      ? StudentArticle.countDocuments(getPublishedStudentArticleFilter())
      : StudentArticle.countDocuments(getAdminStudentArticleFilter());

    const pendingQuery = admin
      ? StudentArticle.countDocuments(getPendingStudentArticleFilter())
      : Promise.resolve(undefined);

    const [articlesRaw, total, pending] = await Promise.all([
      listQuery,
      totalQuery,
      pendingQuery,
    ]);

    const articles = articlesRaw as Array<{
      _id?: unknown;
      content?: string;
      reviewStatus?: unknown;
      isPublished?: boolean;
      readingTimeMinutes?: number | null;
    }>;

    const articlesForClient = articles.map((article) => {
      const content =
        typeof article.content === "string" ? article.content : "";
      const mapped = sanitizeStudentArticleForResponse(article, {
        includeContent: false,
      });

      const readingTimeMinutes = resolveReadingTimeMinutes({
        readingTimeMinutes: article.readingTimeMinutes,
        content,
      });

      const id = article._id ? String(article._id) : "";
      const title =
        typeof (article as { title?: string }).title === "string"
          ? (article as { title: string }).title
          : "article";
      let slug =
        typeof (article as { slug?: string }).slug === "string"
          ? (article as { slug: string }).slug
          : null;

      const updates: Record<string, unknown> = {};
      if (
        typeof article.readingTimeMinutes !== "number" ||
        !Number.isFinite(article.readingTimeMinutes)
      ) {
        updates.readingTimeMinutes = readingTimeMinutes;
      }
      if (!slug && id) {
        slug = buildArticleSlug(title, id);
        updates.slug = slug;
      }
      if (id && Object.keys(updates).length > 0) {
        void StudentArticle.updateOne({ _id: id }, { $set: updates }).catch(
          () => undefined
        );
      }

      return {
        ...mapped,
        slug,
        readingTimeMinutes,
      };
    });

    return NextResponse.json(
      {
        articles: articlesForClient,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
        counts: {
          pending,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student articles", error);
    return NextResponse.json(
      { error: "Failed to fetch student articles" },
      { status: 500 }
    );
  }
}
