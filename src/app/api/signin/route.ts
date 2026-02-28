import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { MAX_LENGTHS, normalizeString } from "@/lib/validation";

export async function POST(request: NextRequest) {
    try {
        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

        const reqBody = await request.json();
        const email = normalizeString(reqBody?.email).toLowerCase();
        const password = normalizeString(reqBody?.password);

        // Basic validation
        if (!email || !password || email.length > MAX_LENGTHS.email || password.length > 256) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const rateLimit = checkRateLimit({
            key: `signin:${ip}:${email}`,
            limit: 10,
            windowMs: 10 * 60 * 1000,
        });
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "Too many login attempts. Please try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(rateLimit.retryAfterSeconds),
                    },
                }
            );
        }

        await connectDB();

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        // Check if password is correct
        const validPassword = await bcryptjs.compare(password, admin.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        // Create token data
        const tokenData = {
            id: admin._id,
            email: admin.email,
            name: admin.name, // Include other relevant data if needed
        };

        // Create token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET environment variable is not set");
        }
        const token = jwt.sign(tokenData, jwtSecret, {
            expiresIn: "1d", // Token expires in 1 day
        });

        // Create response
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 60 * 60 * 24, // 1 day in seconds
            path: '/', // Cookie is valid for the entire site
        });

        return response;

    } catch {
        console.error("Sign-in error");
        return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
    }
}
