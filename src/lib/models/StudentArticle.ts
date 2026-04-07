import mongoose from "mongoose";
import { STUDENT_ARTICLE_REVIEW_STATUSES } from "@/lib/student-article-status";

const StudentArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
    default: function defaultReviewStatus(this: { isPublished?: boolean }) {
      return this.isPublished ? "PUBLISHED" : "PENDING";
    },
  },
  isPublished: {
    type: Boolean,
    default: false,
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
}, {
  strict: true,
  versionKey: false,
  timestamps: true,
});

// Delete the model if it exists to force re-compilation
if (mongoose.models.StudentArticle) {
  delete mongoose.models.StudentArticle;
}

const StudentArticle = mongoose.model("StudentArticle", StudentArticleSchema);
export default StudentArticle;
