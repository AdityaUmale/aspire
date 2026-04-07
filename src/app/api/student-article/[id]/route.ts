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
    input === "REJECTED"
  ) {
    return input;
  }

  if (typeof isPublished === "boolean") {
    return isPublished ? "PUBLISHED" : "PENDING";
  }

  return null;
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
    const article = await StudentArticle.findById(id)
      .populate("author", getAuthorProjection(Boolean(admin)))
      .populate("reviewedBy", "name email")
      .lean();

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
      { article: sanitizeArticleForResponse(article) },
      { status: 200 }
    );
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
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return auth.response;
  }

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
    const reviewStatus = resolveReviewStatus(body?.reviewStatus, body?.isPublished);

    if (!reviewStatus) {
      return NextResponse.json(
        {
          error:
            "Invalid input: 'reviewStatus' must be PENDING, PUBLISHED, or REJECTED",
        },
        { status: 400 }
      );
    }

    const updatedArticle = await StudentArticle.findByIdAndUpdate(
      id,
      {
        $set: getReviewStatusUpdate(reviewStatus, auth.admin.id),
      },
      { new: true }
    )
      .populate("author", getAuthorProjection(true))
      .populate("reviewedBy", "name email")
      .lean();

    if (!updatedArticle) {
      return NextResponse.json(
        { error: "Student article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Student article updated successfully",
        article: sanitizeArticleForResponse(updatedArticle),
      },
      { status: 200 }
    );
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
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return auth.response;
  }

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
    const deletedArticle = await StudentArticle.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json(
        { error: "Student article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student article", error);
    return NextResponse.json(
      { error: "Failed to delete student article" },
      { status: 500 }
    );
  }
}
