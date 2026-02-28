import connectDB from "@/lib/db";
import StudentArticle from "@/lib/models/StudentArticle";
import "@/lib/models/Admin";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAdminFromRequest, requireAdmin } from "@/lib/auth";
import { sanitizeRichTextHtml } from "@/lib/sanitize";

const getAuthorProjection = (isAdmin: boolean) => (isAdmin ? "name email" : "name");

// GET handler for a single article
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid student article ID format" }, { status: 400 });
  }

  try {
    await connectDB();
    const admin = await getAdminFromRequest(req);
    const article = await StudentArticle.findById(id)
      .populate("author", getAuthorProjection(Boolean(admin)))
      .lean();

    if (!article) {
      return NextResponse.json({ error: "Student article not found" }, { status: 404 });
    }

    if (!admin && !article.isPublished) {
      return NextResponse.json({ error: "Student article not found" }, { status: 404 });
    }

    return NextResponse.json(
      { article: { ...article, content: sanitizeRichTextHtml(article.content ?? "") } },
      { status: 200 }
    );
  } catch {
    console.error("Error fetching student article");
    return NextResponse.json({ error: "Failed to fetch student article" }, { status: 500 });
  }
}

// PATCH: Update a specific student article (e.g., publish it)
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
    return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 });
  }

  try {
    await connectDB();

    const body = await req.json();
    const { isPublished } = body;

    if (typeof isPublished !== "boolean") {
      return NextResponse.json(
        { error: "Invalid input: 'isPublished' must be a boolean" },
        { status: 400 }
      );
    }

    const updatedArticle = await StudentArticle.findByIdAndUpdate(
      id,
      { $set: { isPublished } },
      { new: true }
    ).lean();

    if (!updatedArticle) {
      return NextResponse.json({ error: "Student article not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Student article updated successfully",
        article: { ...updatedArticle, content: sanitizeRichTextHtml(updatedArticle.content ?? "") },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student article");
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update student article" }, { status: 500 });
  }
}

// DELETE: Remove a specific student article
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
    return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 });
  }

  try {
    await connectDB();
    const deletedArticle = await StudentArticle.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json({ error: "Student article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student article deleted successfully" }, { status: 200 });
  } catch {
    console.error("Error deleting student article");
    return NextResponse.json({ error: "Failed to delete student article" }, { status: 500 });
  }
}
