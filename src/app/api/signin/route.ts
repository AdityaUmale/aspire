import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

// Ensure database connection is established
connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Basic validation
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

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
        // IMPORTANT: Store your JWT_SECRET in environment variables for security
        const jwtSecret = process.env.JWT_SECRET || "YOUR_DEFAULT_SECRET_KEY"; // Replace with your actual secret or env variable
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

    } catch (error: Error | unknown) {
        console.error("Sign-in error:", error);
        return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
    }
}