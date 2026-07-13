export const STUDENT_ARTICLE_REVIEW_STATUSES = [
  "DRAFT",
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

/**
 * After legacy docs are backfilled with reviewStatus, this can simplify to
 * `{ reviewStatus: "PUBLISHED" }` so the compound index is fully used.
 * Until then we keep a legacy branch for safety.
 */
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

/** Admin review list excludes writer-only drafts. */
export const getAdminStudentArticleFilter = () => ({
  reviewStatus: { $in: ["PENDING", "PUBLISHED", "REJECTED"] },
});

export const getReviewStatusUpdate = (
  reviewStatus: StudentArticleReviewStatus,
  reviewedBy?: string | null,
  rejectionReason?: string | null
) => {
  const base = {
    reviewStatus,
    isPublished: reviewStatus === "PUBLISHED",
    reviewedAt: new Date(),
    reviewedBy: reviewedBy ?? null,
  };

  if (reviewStatus === "REJECTED") {
    return {
      ...base,
      rejectionReason: rejectionReason?.trim() || null,
    };
  }

  // Clear rejection notes when publishing or returning to pending.
  return {
    ...base,
    rejectionReason: null,
  };
};
