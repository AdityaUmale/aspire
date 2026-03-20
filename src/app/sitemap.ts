import type { MetadataRoute } from "next";

const siteUrl = "https://www.aspireinstitutein.com";

const publicRoutes = [
  "",
  "/about-us",
  "/articles",
  "/careers",
  "/courses/arise-camp",
  "/courses/childrens-learning-program",
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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
