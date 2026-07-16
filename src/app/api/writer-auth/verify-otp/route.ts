import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Writer from "@/lib/models/Writer";
import WriterOtpChallenge from "@/lib/models/WriterOtpChallenge";
import {
  createWriterSession,
  getRequestIp,
  getRequestUserAgent,
  hashWriterOtpCode,
  setWriterSessionCookie,
} from "@/lib/writer-auth";
import {
  isValidEmail,
  normalizeEmail,
  normalizeString,
} from "@/lib/validation";

const OTP_REGEX = /^\d{6}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email);
    const code = normalizeString(body?.code);

    if (!isValidEmail(email) || !OTP_REGEX.test(code)) {
      return NextResponse.json(
        { error: "Valid email and 6-digit code are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const now = new Date();
    const challenge = await WriterOtpChallenge.findOne({
      email,
      consumedAt: null,
      invalidatedAt: null,
    }).sort({ createdAt: -1 });

    if (!challenge) {
      return NextResponse.json(
        { error: "Verification code is invalid or expired" },
        { status: 400 }
      );
    }

    if (challenge.expiresAt <= now) {
      await WriterOtpChallenge.findByIdAndUpdate(challenge._id, {
        $set: { invalidatedAt: now },
      });

      return NextResponse.json(
        { error: "Verification code is invalid or expired" },
        { status: 400 }
      );
    }

    if (challenge.attemptCount >= challenge.maxAttempts) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Request a new code." },
        { status: 429 }
      );
    }

    const expectedCodeHash = hashWriterOtpCode({ email, code });

    const activeChallengeFilter = {
      _id: challenge._id,
      consumedAt: null,
      invalidatedAt: null,
      expiresAt: { $gt: now },
      $expr: { $lt: ["$attemptCount", "$maxAttempts"] },
    };

    const claimedChallenge = await WriterOtpChallenge.findOneAndUpdate(
      {
        ...activeChallengeFilter,
        codeHash: expectedCodeHash,
      },
      {
        $set: { consumedAt: now },
        $inc: { attemptCount: 1 },
      },
      { new: true }
    );

    if (!claimedChallenge) {
      const failedChallenge = await WriterOtpChallenge.findOneAndUpdate(
        {
          ...activeChallengeFilter,
          codeHash: { $ne: expectedCodeHash },
        },
        { $inc: { attemptCount: 1 } },
        { new: true }
      );

      if (
        failedChallenge &&
        failedChallenge.attemptCount >= failedChallenge.maxAttempts
      ) {
        await WriterOtpChallenge.updateOne(
          {
            _id: failedChallenge._id,
            consumedAt: null,
            invalidatedAt: null,
            attemptCount: { $gte: failedChallenge.maxAttempts },
          },
          { $set: { invalidatedAt: new Date() } }
        );
      }

      const attemptsExhausted =
        !failedChallenge ||
        failedChallenge.attemptCount >= failedChallenge.maxAttempts;

      return NextResponse.json(
        {
          error:
            attemptsExhausted
              ? "Too many incorrect attempts. Request a new code."
              : "Verification code is invalid or expired",
        },
        { status: attemptsExhausted ? 429 : 400 }
      );
    }

    const writer = await Writer.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          emailVerifiedAt: now,
          lastLoginAt: now,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const { token, expiresAt } = await createWriterSession({
      writerId: String(writer._id),
      ip: getRequestIp(request),
      userAgent: getRequestUserAgent(request),
    });

    const response = NextResponse.json(
      {
        writer: {
          id: String(writer._id),
          email: writer.email,
        },
        sessionExpiresAt: expiresAt.toISOString(),
      },
      { status: 200 }
    );

    setWriterSessionCookie(response, token);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Error verifying writer OTP", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
