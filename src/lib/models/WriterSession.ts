import mongoose from "mongoose";

const WriterSessionSchema = new mongoose.Schema(
  {
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Writer",
      required: true,
      index: true,
    },
    sessionTokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    strict: true,
    versionKey: false,
    timestamps: true,
  }
);

if (mongoose.models.WriterSession) {
  delete mongoose.models.WriterSession;
}

const WriterSession = mongoose.model("WriterSession", WriterSessionSchema);
export default WriterSession;
