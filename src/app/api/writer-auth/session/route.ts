import { NextRequest, NextResponse } from "next/server";
import {
  getOrRefreshWriterSession,
  setWriterSessionCookie,
} from "@/lib/writer-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getOrRefreshWriterSession(request);

    if (!session) {
      return NextResponse.json(
        { writer: null, sessionExpiresAt: null },
        { status: 200 }
      );
    }

    const response = NextResponse.json(
      {
        writer: session.writer,
        sessionExpiresAt: session.expiresAt.toISOString(),
      },
      { status: 200 }
    );

    if (session.wasRefreshed) {
      setWriterSessionCookie(response, session.token);
    }

    return response;
  } catch (error) {
    console.error("Error fetching writer session", error);
    return NextResponse.json(
      { error: "Failed to load writer session" },
      { status: 500 }
    );
  }
}
