import mongoose from "mongoose";

// Single-document settings pattern: we always upsert the same document by a fixed key
const SocialPostSchema = new mongoose.Schema({
  key: {
    type: String,
    default: "social_posts_config",
    unique: true,
  },
  linkedin: { type: String, default: "" },
  instagram: { type: String, default: "" },
  facebook: { type: String, default: "" },
  twitter: { type: String, default: "" },
}, {
  timestamps: true,
});

if (mongoose.models.SocialPost) {
  delete mongoose.models.SocialPost;
}

const SocialPost = mongoose.model("SocialPost", SocialPostSchema);
export default SocialPost;
