import connectDB from "@/lib/db";
import Course from "@/lib/models/Course";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { MAX_LENGTHS, normalizeString } from "@/lib/validation";
import mongoose from "mongoose";

// Add this GET handler to fetch courses
export async function GET() {
    try {
        await connectDB();
        const courses = await Course.find({}).sort({ _id: -1 }); // Get all courses, newest first
        return NextResponse.json({ courses }, { status: 200 });
    } catch {
        console.error("Error fetching courses");
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}

export async function POST(req: NextRequest){
    try {
        const auth = await requireAdmin(req);
        if (!auth.ok) {
            return auth.response;
        }

        await connectDB();
        const body = await req.json();
        const courseName = normalizeString(body?.courseName);
        const description = normalizeString(body?.description);
        const courseOutlineRaw = Array.isArray(body?.courseOutline) ? body.courseOutline : [];
        const courseDate = body?.courseDate;
        const courseOutline = courseOutlineRaw
            .map((item: unknown) => normalizeString(item))
            .filter((item: string) => item.length > 0);
        
        // Basic check if date is received (optional, Mongoose validation handles it)
        if (
            !courseName ||
            !description ||
            courseOutline.length === 0 ||
            !courseDate
        ) {
          return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        if (
            courseName.length > MAX_LENGTHS.courseName ||
            description.length > MAX_LENGTHS.description ||
            courseOutline.some((item: string) => item.length > MAX_LENGTHS.courseOutlineItem)
        ) {
            return NextResponse.json({ error: "Input exceeds allowed length limits." }, { status: 400 });
        }

        const newCourse = new Course({
            courseName,
            description,
            courseOutline,
            courseDate // Add courseDate
        });
        const savedCourse = await newCourse.save();
        return NextResponse.json({ message: "Course created successfully", course: savedCourse }, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating course");

        // Check if it's a Mongoose validation error
        if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
            // Extract specific validation messages
            const errors: { [key: string]: string } = {};
            const validationError = error as { errors: { [key: string]: { message: string } } };
            for (const field in validationError.errors) {
                errors[field] = validationError.errors[field].message;
            }
            return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const auth = await requireAdmin(req);
        if (!auth.ok) {
            return auth.response;
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('id');

        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json({ error: "Invalid course ID format" }, { status: 400 });
        }

        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course deleted successfully", course: deletedCourse }, { status: 200 });
    } catch {
        console.error("Error deleting course");
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}
