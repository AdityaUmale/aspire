import mongoose from "mongoose";

const WriterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    strict: true,
    versionKey: false,
    timestamps: true,
  }
);

if (mongoose.models.Writer) {
  delete mongoose.models.Writer;
}

const Writer = mongoose.model("Writer", WriterSchema);
export default Writer;
