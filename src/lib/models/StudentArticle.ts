import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { STUDENT_ARTICLE_REVIEW_STATUSES } from "@/lib/student-article-status";

const StudentArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
      default: null,
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Writer",
      required: false,
      default: null,
    },
    submitterEmail: {
      type: String,
      default: null,
    },
    writerName: {
      type: String,
      default: null,
    },
    reviewStatus: {
      type: String,
      enum: STUDENT_ARTICLE_REVIEW_STATUSES,
      default: function defaultReviewStatus(
        this: { isPublished?: boolean } | null
      ) {
        return this?.isPublished ? "PUBLISHED" : "PENDING";
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    readingTimeMinutes: {
      type: Number,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    draftToken: {
      type: String,
      default: undefined,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
      default: null,
    },
  },
  {
    strict: true,
    versionKey: false,
    timestamps: true,
  }
);

StudentArticleSchema.index({ reviewStatus: 1, createdAt: -1 });
StudentArticleSchema.index({ writer: 1, createdAt: -1 });
StudentArticleSchema.index({ submitterEmail: 1 });
StudentArticleSchema.index({ isPublished: 1, createdAt: -1 });
StudentArticleSchema.index(
  { draftToken: 1 },
  {
    unique: true,
    partialFilterExpression: { draftToken: { $type: "string" } },
  }
);

export type StudentArticleDocument = InferSchemaType<
  typeof StudentArticleSchema
> & {
  _id: mongoose.Types.ObjectId;
};

const StudentArticle =
  (mongoose.models.StudentArticle as
    | Model<StudentArticleDocument>
    | undefined) ||
  mongoose.model<StudentArticleDocument>(
    "StudentArticle",
    StudentArticleSchema
  );

export default StudentArticle;
