import mongoose from "mongoose";

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
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  }
});

const StudentArticle = mongoose.models.StudentArticle || mongoose.model("StudentArticle", StudentArticleSchema);
export default StudentArticle;