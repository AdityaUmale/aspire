import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Writer from "@/lib/models/Writer";
import WriterSession from "@/lib/models/WriterSession";

export type WriterSessionUser = {
  id: string;
  email: string;
};

type WriterSessionState = {
  writer: WriterSessionUser;
  sessionId: string;
  token: string;
  expiresAt: Date;
  needsRefresh: boolean;
  wasRefreshed: boolean;
};

export const WRITER_SESSION_COOKIE_NAME = "writer_session";
export const WRITER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
export const WRITER_SESSION_TTL_MS =
  WRITER_SESSION_MAX_AGE_SECONDS * 1000;
const WRITER_SESSION_REFRESH_WINDOW_MS = 24 * 60 * 60 * 1000;
export const WRITER_OTP_EXPIRY_MS = 10 * 60 * 1000;
export const WRITER_OTP_MAX_ATTEMPTS = 5;

const getWriterOtpSecret = () => {
  const secret = process.env.WRITER_OTP_SECRET;

  if (!secret) {
    throw new Error("WRITER_OTP_SECRET environment variable is not set");
  }

  return secret;
};

const hashValue = (value: string) => {
  return crypto
    .createHash("sha256")
    .update(`${getWriterOtpSecret()}:${value}`)
    .digest("hex");
};

export const hashWriterOtpCode = ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => hashValue(`otp:${email}:${code}`);

export const hashWriterSessionToken = (token: string) =>
  hashValue(`session:${token}`);

export const generateWriterOtpCode = () => {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
};

export const generateWriterSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const getRequestIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
};

export const getRequestUserAgent = (request: NextRequest) => {
  return request.headers.get("user-agent") || "unknown";
};

const getWriterSessionTokenFromRequest = (request: NextRequest) => {
  return request.cookies.get(WRITER_SESSION_COOKIE_NAME)?.value ?? null;
};

export const setWriterSessionCookie = (
  response: NextResponse,
  token: string
) => {
  response.cookies.set(WRITER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: WRITER_SESSION_MAX_AGE_SECONDS,
  });
};

export const clearWriterSessionCookie = (response: NextResponse) => {
  response.cookies.set(WRITER_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
};

export const getWriterSessionFromRequest = async (
  request: NextRequest
): Promise<WriterSessionState | null> => {
  const token = getWriterSessionTokenFromRequest(request);

  if (!token) {
    return null;
  }

  await connectDB();

  const now = new Date();
  const tokenHash = hashWriterSessionToken(token);

  const session = (await WriterSession.findOne({
    sessionTokenHash: tokenHash,
    revokedAt: null,
  })
    .populate("writerId", "email")
    .lean()) as
    | {
        _id: unknown;
        writerId?: { _id: unknown; email?: string } | null;
        expiresAt: Date;
        lastSeenAt?: Date;
      }
    | null;

  if (!session?.writerId?.email) {
    return null;
  }

  const expiresAt = new Date(session.expiresAt);
  if (expiresAt <= now) {
    return null;
  }

  const lastSeenAt = session.lastSeenAt ? new Date(session.lastSeenAt) : null;
  const needsRefresh =
    !lastSeenAt ||
    now.getTime() - lastSeenAt.getTime() >= WRITER_SESSION_REFRESH_WINDOW_MS;

  return {
    writer: {
      id: String(session.writerId._id),
      email: session.writerId.email,
    },
    sessionId: String(session._id),
    token,
    expiresAt,
    needsRefresh,
    wasRefreshed: false,
  };
};

export const refreshWriterSession = async (session: WriterSessionState) => {
  const expiresAt = new Date(Date.now() + WRITER_SESSION_TTL_MS);
  const lastSeenAt = new Date();

  await WriterSession.findByIdAndUpdate(session.sessionId, {
    $set: {
      expiresAt,
      lastSeenAt,
    },
  });

  return {
    ...session,
    expiresAt,
    needsRefresh: false,
    wasRefreshed: true,
  };
};

export const getOrRefreshWriterSession = async (request: NextRequest) => {
  const session = await getWriterSessionFromRequest(request);

  if (!session) {
    return null;
  }

  if (!session.needsRefresh) {
    return session;
  }

  return refreshWriterSession(session);
};

export const createWriterSession = async ({
  writerId,
  ip,
  userAgent,
}: {
  writerId: string;
  ip: string;
  userAgent: string;
}) => {
  const token = generateWriterSessionToken();
  const expiresAt = new Date(Date.now() + WRITER_SESSION_TTL_MS);

  await WriterSession.create({
    writerId,
    sessionTokenHash: hashWriterSessionToken(token),
    expiresAt,
    lastSeenAt: new Date(),
    ip,
    userAgent,
  });

  return { token, expiresAt };
};

export const revokeWriterSession = async (token: string) => {
  await connectDB();

  await WriterSession.findOneAndUpdate(
    { sessionTokenHash: hashWriterSessionToken(token), revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
};

export const touchWriterLastLogin = async (writerId: string) => {
  await Writer.findByIdAndUpdate(writerId, {
    $set: {
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
    },
  });
};
