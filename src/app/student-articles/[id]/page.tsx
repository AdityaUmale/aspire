import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleReader from "@/components/ArticleReader";
import { getPublishedStudentArticleByParam } from "@/lib/article-queries";
import { getArticlePath } from "@/lib/article-utils";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getPublishedStudentArticleByParam(id);

  if (!article) {
    return { title: "Article not found" };
  }

  const canonicalPath = getArticlePath(
    "student",
    article.slug || String(article._id)
  );
  const description = article.description.slice(0, 160);
  const image = article.coverImage || `${SITE_URL}/logo1.png`;

  return {
    title: article.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [image],
    },
  };
}

export default async function StudentArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getPublishedStudentArticleByParam(id);

  if (!article) {
    notFound();
  }

  return (
    <ArticleReader
      title={article.title}
      description={article.description}
      contentHtml={article.content}
      coverImage={article.coverImage}
      createdAt={article.createdAt}
      readingTimeMinutes={article.readingTimeMinutes}
      backHref="/student-articles"
      backLabel="All authentic articles"
      showAuthorBar
      authorName={article.writerName || "Anonymous Student"}
      authorSubtitle="Student Contributor"
    />
  );
}
