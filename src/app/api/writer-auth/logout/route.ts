import { NextRequest, NextResponse } from "next/server";
import {
  WRITER_SESSION_COOKIE_NAME,
  clearWriterSessionCookie,
  revokeWriterSession,
} from "@/lib/writer-auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(WRITER_SESSION_COOKIE_NAME)?.value;
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    if (token) {
      await revokeWriterSession(token);
    }

    clearWriterSessionCookie(response);
    return response;
  } catch (error) {
    console.error("Error logging out writer session", error);
    return NextResponse.json(
      { error: "Failed to log out" },
      { status: 500 }
    );
  }
}
