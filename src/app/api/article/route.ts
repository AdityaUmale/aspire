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
import {
  buildArticleSlug,
  computeReadingTimeMinutes,
  resolveReadingTimeMinutes,
} from "@/lib/article-utils";
import {
  isAllowedCoverImageUrl,
  normalizeCoverImage,
} from "@/lib/cover-image";
import { revalidatePath } from "next/cache";

const getAuthorProjection = (isAdmin: boolean) =>
  isAdmin ? "name email" : "name";

const LIST_PROJECTION =
  "title description slug readingTimeMinutes coverImage author createdAt updatedAt content";

const revalidateFounderArticle = (id: string, slug?: string | null) => {
  revalidatePath("/articles");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/articles/${id}`);
  if (slug) {
    revalidatePath(`/articles/${slug}`);
  }
};

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
      return NextResponse.json(
        { error: "Invalid or missing required fields" },
        { status: 400 }
      );
    }

    let coverImage: string | null = null;
    if (body?.coverImage !== undefined && body?.coverImage !== null && body?.coverImage !== "") {
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

    const newArticle = new Article({
      title,
      description,
      content: sanitizedContent,
      author: auth.admin.id,
      readingTimeMinutes,
      coverImage,
    });

    newArticle.slug = buildArticleSlug(title, String(newArticle._id));
    const savedArticle = await newArticle.save();

    revalidateFounderArticle(
      String(savedArticle._id),
      savedArticle.slug as string | undefined
    );

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
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
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
        return NextResponse.json(
          { error: "Invalid article ID format" },
          { status: 400 }
        );
      }

      const article = (await Article.findById(id)
        .populate("author", getAuthorProjection(Boolean(admin)))
        .lean()) as Record<string, unknown> | null;

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      const content =
        typeof article.content === "string" ? article.content : "";
      const articleResponse = {
        ...article,
        content: sanitizeRichTextHtml(content),
        readingTimeMinutes: resolveReadingTimeMinutes({
          readingTimeMinutes:
            typeof article.readingTimeMinutes === "number"
              ? article.readingTimeMinutes
              : null,
          content,
        }),
      };
      return NextResponse.json({ article: articleResponse }, { status: 200 });
    }

    const { page, limit, skip } = clampPagination({
      pageInput: searchParams.get("page"),
      limitInput: searchParams.get("limit"),
      defaultLimit: 10,
      maxLimit: 20,
    });

    const [articles, total] = await Promise.all([
      Article.find({})
        .select(LIST_PROJECTION)
        .populate("author", getAuthorProjection(Boolean(admin)))
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as Promise<Array<Record<string, unknown>>>,
      Article.countDocuments({}),
    ]);

    const articlesForClient = articles.map((article) => {
      const content =
        typeof article.content === "string" ? article.content : "";
      const readingTimeMinutes = resolveReadingTimeMinutes({
        readingTimeMinutes:
          typeof article.readingTimeMinutes === "number"
            ? article.readingTimeMinutes
            : null,
        content,
      });

      const id = article._id ? String(article._id) : "";
      const title =
        typeof article.title === "string" ? article.title : "article";
      let slug =
        typeof article.slug === "string" && article.slug
          ? article.slug
          : null;

      // Fire-and-forget backfill for legacy docs missing reading time / slug.
      if (id && (typeof article.readingTimeMinutes !== "number" || !slug)) {
        const updates: Record<string, unknown> = {};
        if (typeof article.readingTimeMinutes !== "number") {
          updates.readingTimeMinutes = readingTimeMinutes;
        }
        if (!slug) {
          slug = buildArticleSlug(title, id);
          updates.slug = slug;
        }
        void Article.updateOne({ _id: id }, { $set: updates }).catch(
          () => undefined
        );
      }

      const rest = { ...article };
      delete rest.content;
      return {
        ...rest,
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
      },
      { status: 200 }
    );
  } catch {
    console.error("Error fetching articles");
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a specific article (admin only)
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid article ID format" },
        { status: 400 }
      );
    }

    const deletedArticle = (await Article.findByIdAndDelete(id).lean()) as {
      slug?: string | null;
    } | null;

    if (!deletedArticle) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    revalidateFounderArticle(id, deletedArticle.slug);

    return NextResponse.json(
      { message: "Article deleted successfully", article: deletedArticle },
      { status: 200 }
    );
  } catch {
    console.error("Error deleting article");
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
