import { NextRequest, NextResponse } from "next/server";
import {
  WRITER_SESSION_COOKIE_NAME,
  clearWriterSessionCookie,
  getOrRefreshWriterSession,
  setWriterSessionCookie,
} from "@/lib/writer-auth";

const setNoStoreHeaders = (response: NextResponse) => {
  response.headers.set("Cache-Control", "no-store");
  return response;
};

export async function GET(request: NextRequest) {
  try {
    const session = await getOrRefreshWriterSession(request);

    if (!session) {
      const response = NextResponse.json(
        {
          writer: null,
          sessionExpiresAt: null,
        },
        { status: 200 }
      );

      if (request.cookies.has(WRITER_SESSION_COOKIE_NAME)) {
        clearWriterSessionCookie(response);
      }

      return setNoStoreHeaders(response);
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

    return setNoStoreHeaders(response);
  } catch (error) {
    console.error("Error fetching writer session", error);
    return NextResponse.json(
      { error: "Failed to load writer session" },
      { status: 500 }
    );
  }
}
