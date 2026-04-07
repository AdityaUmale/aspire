import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, getJwtSecretKey());
    return NextResponse.next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    const response = NextResponse.redirect(url);
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
