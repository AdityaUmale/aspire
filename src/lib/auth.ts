import { jwtVerify, type JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

export interface AdminSession {
  id: string;
  email?: string;
  name?: string;
}

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

const getTokenFromRequest = (request: NextRequest): string | null => {
  return request.cookies.get("token")?.value ?? null;
};

const verifyJwt = async (token: string): Promise<JWTPayload> => {
  const secretKey = getJwtSecretKey();
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
};

export const getAdminFromRequest = async (
  request: NextRequest
): Promise<AdminSession | null> => {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyJwt(token);
    const adminId = typeof payload.id === "string" ? payload.id : null;
    if (!adminId) {
      return null;
    }

    await connectDB();
    const admin = (await Admin.findById(adminId)
      .select("_id email name")
      .lean()) as { _id: unknown; email?: string; name?: string } | null;
    if (!admin) {
      return null;
    }

    return {
      id: String(admin._id),
      email: admin.email,
      name: admin.name,
    };
  } catch {
    return null;
  }
};

export const requireAdmin = async (
  request: NextRequest
): Promise<
  | {
      ok: true;
      admin: AdminSession;
    }
  | {
      ok: false;
      response: NextResponse;
    }
> => {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true, admin };
};
