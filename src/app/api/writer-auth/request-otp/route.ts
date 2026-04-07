import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WriterOtpChallenge from "@/lib/models/WriterOtpChallenge";
import { sendWriterOtpEmail } from "@/lib/resend";
import {
  WRITER_OTP_EXPIRY_MS,
  WRITER_OTP_MAX_ATTEMPTS,
  generateWriterOtpCode,
  getRequestIp,
  getRequestUserAgent,
  hashWriterOtpCode,
} from "@/lib/writer-auth";
import {
  isValidEmail,
  normalizeEmail,
} from "@/lib/validation";

const EMAIL_REQUEST_LIMIT = 3;
const IP_REQUEST_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const now = new Date();
    const rateLimitSince = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);
    const ip = getRequestIp(request);
    const userAgent = getRequestUserAgent(request);

    const [emailRequestCount, ipRequestCount] = await Promise.all([
      WriterOtpChallenge.countDocuments({
        email,
        createdAt: { $gte: rateLimitSince },
      }),
      WriterOtpChallenge.countDocuments({
        ip,
        createdAt: { $gte: rateLimitSince },
      }),
    ]);

    if (
      emailRequestCount >= EMAIL_REQUEST_LIMIT ||
      ipRequestCount >= IP_REQUEST_LIMIT
    ) {
      return NextResponse.json(
        {
          error:
            "Too many verification requests. Please wait a few minutes and try again.",
        },
        { status: 429 }
      );
    }

    const code = generateWriterOtpCode();
    const challenge = await WriterOtpChallenge.create({
      email,
      codeHash: hashWriterOtpCode({ email, code }),
      expiresAt: new Date(now.getTime() + WRITER_OTP_EXPIRY_MS),
      attemptCount: 0,
      maxAttempts: WRITER_OTP_MAX_ATTEMPTS,
      ip,
      userAgent,
    });

    try {
      const sendResult = await sendWriterOtpEmail({ email, code });

      await Promise.all([
        WriterOtpChallenge.findByIdAndUpdate(challenge._id, {
          $set: {
            resendEmailId: sendResult?.id ?? null,
          },
        }),
        WriterOtpChallenge.updateMany(
          {
            email,
            _id: { $ne: challenge._id },
            consumedAt: null,
            invalidatedAt: null,
            expiresAt: { $gt: now },
          },
          {
            $set: { invalidatedAt: new Date() },
          }
        ),
      ]);
    } catch (error) {
      await WriterOtpChallenge.findByIdAndUpdate(challenge._id, {
        $set: { invalidatedAt: new Date() },
      });
      throw error;
    }

    return NextResponse.json(
      {
        message:
          "If the email is valid, a verification code has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error requesting writer OTP", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
