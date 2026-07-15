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
  getReviewStatusUpdate,
  isStudentArticlePublished,
  type StudentArticleReviewStatus,
} from "@/lib/student-article-status";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  getOrRefreshWriterSession,
  setWriterSessionCookie,
} from "@/lib/writer-auth";
import {
  buildArticleSlug,
  computeReadingTimeMinutes,
  extractPlainText,
} from "@/lib/article-utils";
import {
  MAX_LENGTHS,
  isValidLength,
  normalizeString,
} from "@/lib/validation";
import { isWriterArticleMutation } from "@/lib/student-article-request";

const getAuthorProjection = (isAdmin: boolean) =>
  isAdmin ? "name email" : "name";

const sanitizeArticleForResponse = <T extends Record<string, unknown>>(
  article: T | null
) => {
  if (!article) {
    return article;
  }

  const reviewStatus = deriveStudentArticleReviewStatus(article);

  return {
    ...article,
    reviewStatus,
    isPublished: reviewStatus === "PUBLISHED",
    content: sanitizeRichTextHtml(
      typeof article.content === "string" ? article.content : ""
    ),
  };
};

const resolveReviewStatus = (
  input: unknown,
  isPublished: unknown
): StudentArticleReviewStatus | null => {
  if (
    input === "PENDING" ||
    input === "PUBLISHED" ||
    input === "REJECTED" ||
    input === "DRAFT"
  ) {
    return input;
  }

  if (typeof isPublished === "boolean") {
    return isPublished ? "PUBLISHED" : "PENDING";
  }

  return null;
};

const writerOwnsArticle = (
  article: {
    writer?: unknown;
    submitterEmail?: unknown;
  },
  writer: { id: string; email: string }
) => {
  const writerId =
    article.writer != null ? String(article.writer) : null;
  if (writerId && writerId === writer.id) {
    return true;
  }
  return (
    typeof article.submitterEmail === "string" &&
    article.submitterEmail.toLowerCase() === writer.email.toLowerCase()
  );
};

const revalidateStudentArticle = (id: string, slug?: string | null) => {
  revalidatePath("/student-articles");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/student-articles/${id}`);
  if (slug) {
    revalidatePath(`/student-articles/${slug}`);
  }
  revalidateTag("student-articles");
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid student article ID format" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const admin = await getAdminFromRequest(req);
    const writerSession = admin ? null : await getOrRefreshWriterSession(req);

    const article = (await StudentArticle.findById(id)
      .populate("author", getAuthorProjection(Boolean(admin)))
      .populate("reviewedBy", "name email")
      .lean()) as Record<string, unknown> | null;

    if (!article) {
      return NextResponse.json(
        { error: "Student article not found" },
        { status: 404 }
      );
    }

    const isOwner =
      writerSession &&
      writerOwnsArticle(article, writerSession.writer);

    if (!admin && !isStudentArticlePublished(article) && !isOwner) {
      return NextResponse.json(
        { error: "Student article not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      { article: sanitizeArticleForResponse(article) },
      { status: 200 }
    );

    if (writerSession?.wasRefreshed) {
      setWriterSessionCookie(response, writerSession.token);
    }

    return response;
  } catch (error) {
    console.error("Error fetching student article", error);
    return NextResponse.json(
      { error: "Failed to fetch student article" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid article ID format" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const body = await req.json();

    // Admin review path
    const adminAuth = isWriterArticleMutation(body)
      ? null
      : await requireAdmin(req);
    if (adminAuth?.ok) {
      const reviewStatus = resolveReviewStatus(
        body?.reviewStatus,
        body?.isPublished
      );

      if (!reviewStatus || reviewStatus === "DRAFT") {
        return NextResponse.json(
          {
            error:
              "Invalid input: 'reviewStatus' must be PENDING, PUBLISHED, or REJECTED",
          },
          { status: 400 }
        );
      }

      const rejectionReason =
        typeof body?.rejectionReason === "string"
          ? body.rejectionReason.trim().slice(0, 2000)
          : null;

      if (reviewStatus === "REJECTED" && !rejectionReason) {
        return NextResponse.json(
          { error: "A rejection reason is required" },
          { status: 400 }
        );
      }

      const updatedArticle = (await StudentArticle.findByIdAndUpdate(
        id,
        {
          $set: getReviewStatusUpdate(
            reviewStatus,
            adminAuth.admin.id,
            rejectionReason
          ),
        },
        { new: true }
      )
        .populate("author", getAuthorProjection(true))
        .populate("reviewedBy", "name email")
        .lean()) as Record<string, unknown> | null;

      if (!updatedArticle) {
        return NextResponse.json(
          { error: "Student article not found" },
          { status: 404 }
        );
      }

      const slug =
        typeof updatedArticle.slug === "string" ? updatedArticle.slug : null;
      revalidateStudentArticle(id, slug);

      return NextResponse.json(
        {
          message: "Student article updated successfully",
          article: sanitizeArticleForResponse(updatedArticle),
        },
        { status: 200 }
      );
    }

    // Writer edit / resubmit path
    const writerSession = await getOrRefreshWriterSession(req);
    if (!writerSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = (await StudentArticle.findById(id).lean()) as {
      _id: unknown;
      writer?: unknown;
      submitterEmail?: unknown;
      reviewStatus?: unknown;
      isPublished?: boolean;
      slug?: string | null;
    } | null;

    if (!existing || !writerOwnsArticle(existing, writerSession.writer)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const currentStatus = deriveStudentArticleReviewStatus(existing);
    if (
      currentStatus !== "DRAFT" &&
      currentStatus !== "PENDING" &&
      currentStatus !== "REJECTED"
    ) {
      return NextResponse.json(
        { error: "Published articles cannot be edited by writers" },
        { status: 403 }
      );
    }

    const action = body?.action as string | undefined;
    // action: 'withdraw' | 'resubmit' | undefined (save content)

    if (action === "withdraw") {
      await StudentArticle.findByIdAndDelete(id);
      revalidateStudentArticle(id, existing.slug);
      const response = NextResponse.json({
        message: "Submission withdrawn",
      });
      if (writerSession.wasRefreshed) {
        setWriterSessionCookie(response, writerSession.token);
      }
      return response;
    }

    const title = normalizeString(body?.title);
    const content = normalizeString(body?.content);
    const writerName = normalizeString(body?.writerName);

    if (
      !isValidLength(title, MAX_LENGTHS.title) ||
      !isValidLength(content, MAX_LENGTHS.content)
    ) {
      return NextResponse.json(
        { error: "Missing or invalid title or content" },
        { status: 400 }
      );
    }

    if (writerName && writerName.length > MAX_LENGTHS.writerName) {
      return NextResponse.json(
        { error: "Writer name exceeds allowed length" },
        { status: 400 }
      );
    }

    const sanitizedContent = sanitizeRichTextHtml(content);
    const description = extractPlainText(sanitizedContent).slice(0, 260);
    const readingTimeMinutes = computeReadingTimeMinutes(sanitizedContent);

    // Resubmit → PENDING. Autosave (saveOnly) never changes status (esp. REJECTED).
    let nextStatus: StudentArticleReviewStatus = currentStatus;
    if (action === "resubmit" || action === "submit") {
      nextStatus = "PENDING";
    }

    const coverImageRaw = body?.coverImage;
    const coverImage =
      coverImageRaw === null || coverImageRaw === ""
        ? null
        : typeof coverImageRaw === "string"
          ? coverImageRaw.trim()
          : undefined;

    const updates: Record<string, unknown> = {
      title,
      description,
      content: sanitizedContent,
      writerName: writerName || null,
      readingTimeMinutes,
      reviewStatus: nextStatus,
      isPublished: false,
      writer: writerSession.writer.id,
      submitterEmail: writerSession.writer.email,
      slug: existing.slug || buildArticleSlug(title, id),
    };

    if (coverImage !== undefined) {
      const { normalizeCoverImage, isAllowedCoverImageUrl } = await import(
        "@/lib/cover-image"
      );
      if (coverImage === null) {
        updates.coverImage = null;
      } else if (isAllowedCoverImageUrl(coverImage)) {
        updates.coverImage = normalizeCoverImage(coverImage);
      } else {
        return NextResponse.json(
          { error: "Invalid cover image URL" },
          { status: 400 }
        );
      }
    }

    // Only clear rejection metadata when explicitly re-submitting for review.
    if (action === "resubmit" || action === "submit") {
      updates.rejectionReason = null;
      updates.reviewedAt = null;
      updates.reviewedBy = null;
    }

    const updatedArticle = (await StudentArticle.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).lean()) as Record<string, unknown> | null;

    const response = NextResponse.json({
      message:
        nextStatus === "PENDING"
          ? "Article submitted for review"
          : "Article updated",
      article: sanitizeArticleForResponse(updatedArticle),
    });

    if (writerSession.wasRefreshed) {
      setWriterSessionCookie(response, writerSession.token);
    }

    return response;
  } catch (error) {
    console.error("Error updating student article", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update student article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid article ID format" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const adminAuth = await requireAdmin(req);
    if (adminAuth.ok) {
      const deletedArticle = (await StudentArticle.findByIdAndDelete(
        id
      ).lean()) as { slug?: string | null } | null;

      if (!deletedArticle) {
        return NextResponse.json(
          { error: "Student article not found" },
          { status: 404 }
        );
      }

      revalidateStudentArticle(id, deletedArticle.slug);
      return NextResponse.json(
        { message: "Student article deleted successfully" },
        { status: 200 }
      );
    }

    const writerSession = await getOrRefreshWriterSession(req);
    if (!writerSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = (await StudentArticle.findById(id).lean()) as {
      writer?: unknown;
      submitterEmail?: unknown;
      reviewStatus?: unknown;
      isPublished?: boolean;
      slug?: string | null;
    } | null;

    if (!existing || !writerOwnsArticle(existing, writerSession.writer)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const status = deriveStudentArticleReviewStatus(existing);
    if (status === "PUBLISHED") {
      return NextResponse.json(
        { error: "Published articles cannot be withdrawn" },
        { status: 403 }
      );
    }

    await StudentArticle.findByIdAndDelete(id);
    revalidateStudentArticle(id, existing.slug);

    const response = NextResponse.json({
      message: "Submission withdrawn",
    });
    if (writerSession.wasRefreshed) {
      setWriterSessionCookie(response, writerSession.token);
    }
    return response;
  } catch (error) {
    console.error("Error deleting student article", error);
    return NextResponse.json(
      { error: "Failed to delete student article" },
      { status: 500 }
    );
  }
}
