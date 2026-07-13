import connectDB from "@/lib/db";
import StudentArticle from "@/lib/models/StudentArticle";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { sanitizeRichTextHtml } from "@/lib/sanitize";
import { MAX_LENGTHS, normalizeString } from "@/lib/validation";
import {
  getOrRefreshWriterSession,
  setWriterSessionCookie,
} from "@/lib/writer-auth";
import {
  buildArticleSlug,
  computeReadingTimeMinutes,
} from "@/lib/article-utils";
import {
  isAllowedCoverImageUrl,
  normalizeCoverImage,
} from "@/lib/cover-image";

/**
 * Upsert a server-side DRAFT for the authenticated writer.
 * Body: { id?, title, description, content, writerName?, coverImage? }
 *
 * Does not invent placeholder titles on update — empty title on create only
 * becomes "Untitled draft". Never touches PENDING/REJECTED/PUBLISHED docs.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getOrRefreshWriterSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const titleRaw = normalizeString(body?.title);
    const descriptionRaw = normalizeString(body?.description);
    const content = typeof body?.content === "string" ? body.content : "";
    const writerName = normalizeString(body?.writerName);

    if (titleRaw.length > MAX_LENGTHS.title) {
      return NextResponse.json(
        { error: `Title exceeds ${MAX_LENGTHS.title} characters` },
        { status: 400 }
      );
    }

    if (descriptionRaw.length > MAX_LENGTHS.description) {
      return NextResponse.json(
        { error: `Description exceeds ${MAX_LENGTHS.description} characters` },
        { status: 400 }
      );
    }

    if (content.length > MAX_LENGTHS.content) {
      return NextResponse.json(
        { error: `Content exceeds ${MAX_LENGTHS.content} characters` },
        { status: 400 }
      );
    }

    if (writerName && writerName.length > MAX_LENGTHS.writerName) {
      return NextResponse.json(
        { error: "Writer name exceeds allowed length" },
        { status: 400 }
      );
    }

    let coverImage: string | null | undefined = undefined;
    if ("coverImage" in (body ?? {})) {
      if (body.coverImage === null || body.coverImage === "") {
        coverImage = null;
      } else if (isAllowedCoverImageUrl(body.coverImage)) {
        coverImage = normalizeCoverImage(body.coverImage);
      } else {
        return NextResponse.json(
          { error: "Invalid cover image URL" },
          { status: 400 }
        );
      }
    }

    const sanitizedContent = sanitizeRichTextHtml(content);
    const readingTimeMinutes = computeReadingTimeMinutes(sanitizedContent);

    let article;

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid draft ID" },
          { status: 400 }
        );
      }

      // Only update fields that have meaningful values — never clobber with placeholders.
      const $set: Record<string, unknown> = {
        content: sanitizedContent,
        readingTimeMinutes,
        writer: session.writer.id,
        submitterEmail: session.writer.email,
        reviewStatus: "DRAFT",
        isPublished: false,
      };

      if (titleRaw) {
        $set.title = titleRaw;
      }
      if (descriptionRaw) {
        $set.description = descriptionRaw;
      }
      if (writerName || body?.writerName === "") {
        $set.writerName = writerName || null;
      }
      if (coverImage !== undefined) {
        $set.coverImage = coverImage;
      }

      article = await StudentArticle.findOneAndUpdate(
        {
          _id: id,
          reviewStatus: "DRAFT",
          $or: [
            { writer: session.writer.id },
            { writer: null, submitterEmail: session.writer.email },
          ],
        },
        { $set },
        { new: true }
      ).lean();

      if (!article) {
        return NextResponse.json(
          { error: "Draft not found or not editable" },
          { status: 404 }
        );
      }
    } else {
      // Skip creating empty shells (race with submit / idle page)
      const hasSignal =
        titleRaw ||
        descriptionRaw ||
        sanitizedContent.replace(/<[^>]*>/g, "").trim() ||
        /<img\b/i.test(sanitizedContent) ||
        coverImage;

      if (!hasSignal) {
        return NextResponse.json(
          { message: "Nothing to save", article: null },
          { status: 200 }
        );
      }

      const created = new StudentArticle({
        title: titleRaw || "Untitled draft",
        description: descriptionRaw || "Draft in progress",
        content: sanitizedContent,
        writerName: writerName || null,
        readingTimeMinutes,
        coverImage: coverImage ?? null,
        reviewStatus: "DRAFT",
        isPublished: false,
        writer: session.writer.id,
        submitterEmail: session.writer.email,
      });
      created.slug = buildArticleSlug(
        titleRaw || "untitled-draft",
        String(created._id)
      );
      article = (await created.save()).toObject();
    }

    const response = NextResponse.json(
      {
        message: "Draft saved",
        article: {
          id: String(article._id),
          title: article.title,
          description: article.description,
          content: article.content,
          writerName: article.writerName,
          coverImage: article.coverImage ?? null,
          reviewStatus: "DRAFT",
          slug: article.slug,
          updatedAt: article.updatedAt,
        },
      },
      { status: 200 }
    );

    if (session.wasRefreshed) {
      setWriterSessionCookie(response, session.token);
    }

    return response;
  } catch (error) {
    console.error("Error saving draft", error);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 }
    );
  }
}

/** Load a single draft / editable submission owned by the writer. */
export async function GET(req: NextRequest) {
  try {
    const session = await getOrRefreshWriterSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = new URL(req.url).searchParams.get("id");
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid draft ID" }, { status: 400 });
    }

    await connectDB();

    const article = (await StudentArticle.findOne({
      _id: id,
      reviewStatus: { $in: ["DRAFT", "PENDING", "REJECTED"] },
      $or: [
        { writer: session.writer.id },
        { writer: null, submitterEmail: session.writer.email },
      ],
    }).lean()) as {
      _id: unknown;
      title: string;
      description: string;
      content: string;
      writerName?: string | null;
      coverImage?: string | null;
      reviewStatus?: string;
      rejectionReason?: string | null;
      slug?: string | null;
    } | null;

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const response = NextResponse.json({
      article: {
        id: String(article._id),
        title: article.title,
        description: article.description,
        content: article.content,
        writerName: article.writerName,
        coverImage: article.coverImage ?? null,
        reviewStatus: article.reviewStatus,
        rejectionReason: article.rejectionReason ?? null,
        slug: article.slug ?? null,
      },
    });

    if (session.wasRefreshed) {
      setWriterSessionCookie(response, session.token);
    }

    return response;
  } catch (error) {
    console.error("Error loading draft", error);
    return NextResponse.json(
      { error: "Failed to load draft" },
      { status: 500 }
    );
  }
}
