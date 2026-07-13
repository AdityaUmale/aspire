import { NextRequest, NextResponse } from "next/server";
import StudentArticle from "@/lib/models/StudentArticle";
import connectDB from "@/lib/db";
import {
  deriveStudentArticleReviewStatus,
} from "@/lib/student-article-status";
import {
  getOrRefreshWriterSession,
  setWriterSessionCookie,
} from "@/lib/writer-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getOrRefreshWriterSession(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const articles = (await StudentArticle.find({
      $or: [
        { writer: session.writer.id },
        { writer: null, submitterEmail: session.writer.email },
      ],
    })
      .sort({ createdAt: -1 })
      .lean()) as Array<{
      _id: unknown;
      title: string;
      description: string;
      slug?: string | null;
      coverImage?: string | null;
      reviewStatus?: unknown;
      isPublished?: boolean;
      rejectionReason?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    }>;

    const response = NextResponse.json(
      {
        articles: articles.map((article) => {
          const reviewStatus = deriveStudentArticleReviewStatus(article);

          return {
            id: String(article._id),
            title: article.title,
            description: article.description,
            slug: article.slug || null,
            coverImage:
              typeof article.coverImage === "string"
                ? article.coverImage
                : null,
            reviewStatus,
            isPublished: reviewStatus === "PUBLISHED",
            rejectionReason:
              typeof article.rejectionReason === "string"
                ? article.rejectionReason
                : null,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
          };
        }),
      },
      { status: 200 }
    );

    if (session.wasRefreshed) {
      setWriterSessionCookie(response, session.token);
    }

    return response;
  } catch (error) {
    console.error("Error fetching writer articles", error);
    return NextResponse.json(
      { error: "Failed to fetch writer articles" },
      { status: 500 }
    );
  }
}
