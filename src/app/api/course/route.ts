import connectDB from "@/lib/db";
import Course from "@/lib/models/Course";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import mongoose from "mongoose";
import { normalizeCoursePayload, sortCoursesForDisplay } from "@/lib/course-utils";

export async function GET() {
    try {
        await connectDB();
        const courses = await Course.find({}).lean();
        const sortedCourses = sortCoursesForDisplay(
            courses.map((course) => ({
                ...course,
                _id: String(course._id),
            }))
        );
        return NextResponse.json({ courses: sortedCourses }, { status: 200 });
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
        const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
        const normalized = normalizeCoursePayload(body, {
            requireDescriptionAndOutline: true,
            defaultCtaMode: "ENQUIRE",
        });

        if (!normalized.value) {
            return NextResponse.json(
                { error: normalized.errors.join(" ") || "Invalid course payload." },
                { status: 400 }
            );
        }

        const newCourse = new Course(normalized.value);
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
