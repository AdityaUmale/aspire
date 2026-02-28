import connectDB from "@/lib/db";
import Article from "@/lib/models/Article";
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

// POST: Create a new article (admin only)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    await connectDB();

    const body = await req.json();
    const title = normalizeString(body?.title);
    const description = normalizeString(body?.description);
    const content = normalizeString(body?.content);

    if (
      !isValidLength(title, MAX_LENGTHS.title) ||
      !isValidLength(description, MAX_LENGTHS.description) ||
      !isValidLength(content, MAX_LENGTHS.content)
    ) {
      return NextResponse.json({ error: "Invalid or missing required fields" }, { status: 400 });
    }

    const sanitizedContent = sanitizeRichTextHtml(content);
    const newArticle = new Article({
      title,
      description,
      content: sanitizedContent,
      author: auth.admin.id,
    });

    const savedArticle = await newArticle.save();

    const articleResponse = {
      ...savedArticle.toObject(),
      content: sanitizeRichTextHtml(savedArticle.content ?? ""),
    };
    return NextResponse.json(
      { message: "Article created successfully", article: articleResponse },
      { status: 201 }
    );
  } catch {
    console.error("Error creating article");
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

// GET: Retrieve all articles or a specific article by ID
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const admin = await getAdminFromRequest(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 });
      }

      const article = (await Article.findById(id)
        .populate("author", getAuthorProjection(Boolean(admin)))
        .lean()) as Record<string, unknown> | null;

      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      const articleResponse = {
        ...article,
        content: sanitizeRichTextHtml(
          typeof article.content === "string" ? article.content : ""
        ),
      };
      return NextResponse.json({ article: articleResponse }, { status: 200 });
    }

    const { page, limit, skip } = clampPagination({
      pageInput: searchParams.get("page"),
      limitInput: searchParams.get("limit"),
      defaultLimit: 10,
      maxLimit: 20,
    });

    const articles = (await Article.find({})
      .populate("author", getAuthorProjection(Boolean(admin)))
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean()) as Array<Record<string, unknown>>;

    const total = await Article.countDocuments({});

    return NextResponse.json(
      {
        articles: articles.map((article) => ({
          ...article,
          content: sanitizeRichTextHtml(
            typeof article.content === "string" ? article.content : ""
          ),
        })),
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
    console.error("Error fetching articles");
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
