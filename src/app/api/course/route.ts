import connectDB from "@/lib/db";
import Course from "@/lib/models/Course";
import { NextResponse } from "next/server";

// Add this GET handler to fetch courses
export async function GET() {
    try {
        await connectDB();
        const courses = await Course.find({}).sort({ _id: -1 }); // Get all courses, newest first
        return NextResponse.json({ courses }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}

export async function POST(req: Request){
    try {
        await connectDB();
        const { courseName, description, courseOutline } = await req.json();
        const newCourse = new Course({
            courseName,
            description,
            courseOutline
        });
        const savedCourse = await newCourse.save();
        return NextResponse.json({ message: "Course created successfully", course: savedCourse }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}