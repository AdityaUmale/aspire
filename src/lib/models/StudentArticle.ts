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
  writerName: {
    type: String,
    default: null,
  },
  isPublished: {
    type: Boolean,
    default: false,
  }
}, { 
  strict: true,
  versionKey: false 
});

// Delete the model if it exists to force re-compilation
if (mongoose.models.StudentArticle) {
  delete mongoose.models.StudentArticle;
}

const StudentArticle = mongoose.model("StudentArticle", StudentArticleSchema);
export default StudentArticle;