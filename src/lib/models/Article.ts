import mongoose, { type InferSchemaType, type Model } from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
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
      required: true,
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
  },
  {
    timestamps: true,
  }
);

ArticleSchema.index({ createdAt: -1 });

export type ArticleDocument = InferSchemaType<typeof ArticleSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Article =
  (mongoose.models.Article as Model<ArticleDocument> | undefined) ||
  mongoose.model<ArticleDocument>("Article", ArticleSchema);

export default Article;
