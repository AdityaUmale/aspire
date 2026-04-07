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

    const articles = await StudentArticle.find({
      $or: [
        { writer: session.writer.id },
        { writer: null, submitterEmail: session.writer.email },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const response = NextResponse.json(
      {
        articles: articles.map((article) => {
          const reviewStatus = deriveStudentArticleReviewStatus(article);

          return {
            id: String(article._id),
            title: article.title,
            description: article.description,
            reviewStatus,
            isPublished: reviewStatus === "PUBLISHED",
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
