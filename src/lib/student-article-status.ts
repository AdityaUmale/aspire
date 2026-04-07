export const STUDENT_ARTICLE_REVIEW_STATUSES = [
  "PENDING",
  "PUBLISHED",
  "REJECTED",
] as const;

export type StudentArticleReviewStatus =
  (typeof STUDENT_ARTICLE_REVIEW_STATUSES)[number];

type ArticleStatusLike = {
  reviewStatus?: unknown;
  isPublished?: boolean;
};

export const deriveStudentArticleReviewStatus = (
  article: ArticleStatusLike
): StudentArticleReviewStatus => {
  if (
    typeof article.reviewStatus === "string" &&
    STUDENT_ARTICLE_REVIEW_STATUSES.includes(
      article.reviewStatus as StudentArticleReviewStatus
    )
  ) {
    return article.reviewStatus as StudentArticleReviewStatus;
  }

  return article.isPublished ? "PUBLISHED" : "PENDING";
};

export const isStudentArticlePublished = (article: ArticleStatusLike) => {
  return deriveStudentArticleReviewStatus(article) === "PUBLISHED";
};

export const getPublishedStudentArticleFilter = () => ({
  $or: [
    { reviewStatus: "PUBLISHED" },
    { reviewStatus: { $exists: false }, isPublished: true },
  ],
});

export const getPendingStudentArticleFilter = () => ({
  $or: [
    { reviewStatus: "PENDING" },
    { reviewStatus: { $exists: false }, isPublished: false },
  ],
});

export const getReviewStatusUpdate = (
  reviewStatus: StudentArticleReviewStatus,
  reviewedBy?: string | null
) => ({
  reviewStatus,
  isPublished: reviewStatus === "PUBLISHED",
  reviewedAt: new Date(),
  reviewedBy: reviewedBy ?? null,
});
