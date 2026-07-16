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
  extractPlainText,
} from "@/lib/article-utils";
import {
  isAllowedCoverImageUrl,
  normalizeCoverImage,
} from "@/lib/cover-image";

/**
 * Upsert a server-side DRAFT for the authenticated writer.
 * Body: { id?, title, content, writerName?, coverImage? }
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
    const content = typeof body?.content === "string" ? body.content : "";
    const writerName = normalizeString(body?.writerName);
    const draftToken = normalizeString(body?.draftToken);

    if (titleRaw.length > MAX_LENGTHS.title) {
      return NextResponse.json(
        { error: `Title exceeds ${MAX_LENGTHS.title} characters` },
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

    if (draftToken && draftToken.length > 100) {
      return NextResponse.json(
        { error: "Invalid draft token" },
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
    const description = extractPlainText(sanitizedContent).slice(0, 260);
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
        description,
        readingTimeMinutes,
        writer: session.writer.id,
        submitterEmail: session.writer.email,
        reviewStatus: "DRAFT",
        isPublished: false,
      };

      if (titleRaw) {
        $set.title = titleRaw;
      }
      if (writerName || body?.writerName === "") {
        $set.writerName = writerName || null;
      }
      if (coverImage !== undefined) {
        $set.coverImage = coverImage;
      }
      if (draftToken) {
        $set.draftToken = draftToken;
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
        sanitizedContent.replace(/<[^>]*>/g, "").trim() ||
        /<img\b/i.test(sanitizedContent) ||
        coverImage;

      if (!hasSignal) {
        return NextResponse.json(
          { message: "Nothing to save", article: null },
          { status: 200 }
        );
      }

      if (!draftToken) {
        return NextResponse.json(
          { error: "Draft token is required" },
          { status: 400 }
        );
      }

      // The client keeps this token with its local draft. A unique partial
      // index makes repeated or overlapping autosaves update one document.
      const draftId = new mongoose.Types.ObjectId();
      const filter = {
        draftToken,
        writer: session.writer.id,
        reviewStatus: "DRAFT",
      };
      const update = {
        $set: {
          title: titleRaw || "Untitled draft",
          description,
          content: sanitizedContent,
          writerName: writerName || null,
          readingTimeMinutes,
          coverImage: coverImage ?? null,
          isPublished: false,
          submitterEmail: session.writer.email,
        },
        $setOnInsert: {
          _id: draftId,
          draftToken,
          writer: session.writer.id,
          reviewStatus: "DRAFT",
          slug: buildArticleSlug(
            titleRaw || "untitled-draft",
            String(draftId)
          ),
        },
      };

      try {
        article = await StudentArticle.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true,
          // All draft defaults are explicit above. Avoid evaluating document
          // default functions without a document during an upsert.
          setDefaultsOnInsert: false,
        }).lean();
      } catch (error) {
        // A simultaneous first autosave can lose the unique-index race.
        // Retrying without upsert updates the document created by the winner.
        if (
          !(error instanceof mongoose.mongo.MongoServerError) ||
          error.code !== 11000
        ) {
          throw error;
        }
        article = await StudentArticle.findOneAndUpdate(filter, update, {
          new: true,
        }).lean();
      }

      if (!article) {
        throw new Error("Draft upsert did not return an article");
      }
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
          draftToken: article.draftToken,
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
      draftToken?: string | null;
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
        draftToken: article.draftToken ?? null,
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
