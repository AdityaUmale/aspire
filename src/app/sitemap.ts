import type { MetadataRoute } from "next";
import {
  listPublishedFounderArticlesForSitemap,
  listPublishedStudentArticlesForSitemap,
} from "@/lib/article-queries";
import { SITE_URL } from "@/lib/site";

const publicRoutes = [
  "",
  "/about-us",
  "/articles",
  "/careers",
  "/courses/arise-camp",
  "/courses/childrens-learning-program",
  "/courses/corporate-training",
  "/courses/english-language-training",
  "/courses/entrepreneurship-development",
  "/courses/interview-skills-techniques",
  "/courses/international-workshop",
  "/courses/leadership-development",
  "/courses/personality-development",
  "/courses/public-speaking",
  "/courses/teachers-training-program",
  "/courses/voice-and-accent",
  "/founder",
  "/publish-article",
  "/salute-learning-spirit",
  "/student-articles",
  "/success-stories",
  "/team",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  try {
    const [founderArticles, studentArticles] = await Promise.all([
      listPublishedFounderArticlesForSitemap(),
      listPublishedStudentArticlesForSitemap(),
    ]);

    const articleEntries: MetadataRoute.Sitemap = [
      ...founderArticles.map((article) => ({
        url: `${SITE_URL}/articles/${article.slug}`,
        lastModified: article.lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...studentArticles.map((article) => ({
        url: `${SITE_URL}/student-articles/${article.slug}`,
        lastModified: article.lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];

    return [...staticEntries, ...articleEntries];
  } catch (error) {
    console.error("Failed to build article sitemap entries", error);
    return staticEntries;
  }
}
