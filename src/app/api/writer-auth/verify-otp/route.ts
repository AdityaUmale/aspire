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

    if (challenge.codeHash !== expectedCodeHash) {
      const nextAttemptCount = challenge.attemptCount + 1;
      await WriterOtpChallenge.findByIdAndUpdate(challenge._id, {
        $set: {
          attemptCount: nextAttemptCount,
          invalidatedAt:
            nextAttemptCount >= challenge.maxAttempts ? new Date() : null,
        },
      });

      return NextResponse.json(
        {
          error:
            nextAttemptCount >= challenge.maxAttempts
              ? "Too many incorrect attempts. Request a new code."
              : "Verification code is invalid or expired",
        },
        { status: nextAttemptCount >= challenge.maxAttempts ? 429 : 400 }
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

    await WriterOtpChallenge.findByIdAndUpdate(challenge._id, {
      $set: { consumedAt: now, attemptCount: challenge.attemptCount + 1 },
    });

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
    return response;
  } catch (error) {
    console.error("Error verifying writer OTP", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
