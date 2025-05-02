import connectDB from "@/lib/db";
import Course from "@/lib/models/Course";
import { NextResponse } from "next/server";

// Add this GET handler to fetch courses
export async function GET() {
    try {
        console.log("Attempting to connect to DB..."); // Added log
        await connectDB();
        console.log("DB connected. Fetching courses..."); // Added log
        const courses = await Course.find({}).sort({ _id: -1 }); // Get all courses, newest first
        console.log(`Found ${courses.length} courses.`); // Added log
        return NextResponse.json({ courses }, { status: 200 });
    } catch (error) {
        console.error("Error fetching courses:", error); // Changed to console.error for better visibility
        // Ensure the error object itself is serializable or extract message
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: "Failed to fetch courses", details: errorMessage }, { status: 500 });
    }
}

export async function POST(req: Request){
    try {
        await connectDB();
        const { courseName, description, courseOutline, courseDate } = await req.json(); // Add courseDate
        
        // Basic check if date is received (optional, Mongoose validation handles it)
        if (!courseDate) {
          return NextResponse.json({ error: "Course date is missing in the request body." }, { status: 400 });
        }

        const newCourse = new Course({
            courseName,
            description,
            courseOutline,
            courseDate // Add courseDate
        });
        const savedCourse = await newCourse.save();
        return NextResponse.json({ message: "Course created successfully", course: savedCourse }, { status: 201 });
    } catch (error: any) { // Catch any error
        console.error("Error creating course:", error); // Log the full error for debugging

        // Check if it's a Mongoose validation error
        if (error.name === 'ValidationError') {
            // Extract specific validation messages
            let errors: { [key: string]: string } = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
        }

        // Generic error for other issues
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json({ error: "Failed to create course", details: errorMessage }, { status: 500 });
    }
}