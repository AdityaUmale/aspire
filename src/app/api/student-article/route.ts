import connectDB from "@/lib/db";
import StudentArticle from "@/lib/models/StudentArticle";
import "@/lib/models/Admin";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAdminFromRequest, requireAdmin } from "@/lib/auth";
import { sanitizeRichTextHtml } from "@/lib/sanitize";
import {
  MAX_LENGTHS,
  clampPagination,
  isValidLength,
  normalizeString,
} from "@/lib/validation";

const getAuthorProjection = (isAdmin: boolean) => (isAdmin ? "name email" : "name");

const sanitizeStudentArticleForResponse = <T extends { content?: string }>(
  article: T | null
) => {
  if (!article) {
    return article;
  }
  return {
    ...article,
    content: sanitizeRichTextHtml(article.content ?? ""),
  };
};

// POST: Create a new student article (public submission)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const admin = await getAdminFromRequest(req);

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
        { error: "Missing or invalid required fields (title, description, content)" },
        { status: 400 }
      );
    }

    if (writerName && writerName.length > MAX_LENGTHS.writerName) {
      return NextResponse.json({ error: "Writer name exceeds allowed length" }, { status: 400 });
    }

    const newStudentArticle = new StudentArticle({
      title,
      description,
      content: sanitizeRichTextHtml(content),
      writerName: writerName || null,
      author: admin?.id ?? null,
    });

    const savedArticle = await newStudentArticle.save();

    return NextResponse.json(
      { message: "Student article created successfully", article: sanitizeStudentArticleForResponse(savedArticle.toObject()) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating student article");
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create student article" },
      { status: 500 }
    );
  }
}

// GET: Retrieve student articles.
// Public access requires published=true.
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

      const article = await StudentArticle.findById(id)
        .populate("author", getAuthorProjection(Boolean(admin)))
        .lean();

      if (!article) {
        return NextResponse.json(
          { error: "Student article not found" },
          { status: 404 }
        );
      }

      if (!admin && !article.isPublished) {
        return NextResponse.json({ error: "Student article not found" }, { status: 404 });
      }

      return NextResponse.json(
        { article: sanitizeStudentArticleForResponse(article) },
        { status: 200 }
      );
    }

    const { page, limit, skip } = clampPagination({
      pageInput: searchParams.get("page"),
      limitInput: searchParams.get("limit"),
      defaultLimit: 10,
      maxLimit: 20,
    });

    const filter: Record<string, boolean> = {};
    if (publishedOnly) {
      filter.isPublished = true;
    }

    const articles = await StudentArticle.find(filter)
      .populate("author", getAuthorProjection(Boolean(admin)))
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await StudentArticle.countDocuments(filter);

    return NextResponse.json(
      {
        articles: articles.map((article) => sanitizeStudentArticleForResponse(article)),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch {
    console.error("Error fetching student articles");
    return NextResponse.json(
      { error: "Failed to fetch student articles" },
      { status: 500 }
    );
  }
}
