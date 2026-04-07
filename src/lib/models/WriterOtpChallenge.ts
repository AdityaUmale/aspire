import mongoose from "mongoose";

const WriterOtpChallengeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
    invalidatedAt: {
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
    resendEmailId: {
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

WriterOtpChallengeSchema.index({ email: 1, createdAt: -1 });
WriterOtpChallengeSchema.index({ ip: 1, createdAt: -1 });

if (mongoose.models.WriterOtpChallenge) {
  delete mongoose.models.WriterOtpChallenge;
}

const WriterOtpChallenge = mongoose.model(
  "WriterOtpChallenge",
  WriterOtpChallengeSchema
);
export default WriterOtpChallenge;
