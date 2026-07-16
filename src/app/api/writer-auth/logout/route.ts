import { NextRequest, NextResponse } from "next/server";
import {
  WRITER_SESSION_COOKIE_NAME,
  clearWriterSessionCookie,
  revokeWriterSession,
} from "@/lib/writer-auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  clearWriterSessionCookie(response);

  try {
    const token = request.cookies.get(WRITER_SESSION_COOKIE_NAME)?.value;

    if (token) {
      await revokeWriterSession(token);
    }

    return response;
  } catch (error) {
    console.error("Error logging out writer session", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to log out" },
      { status: 500 }
    );
    clearWriterSessionCookie(errorResponse);
    return errorResponse;
  }
}
