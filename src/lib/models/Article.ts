import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});

// Force re-compilation when schema changes
if (mongoose.models.Article) {
  delete mongoose.models.Article;
}

const Article = mongoose.model("Article", ArticleSchema);
export default Article;