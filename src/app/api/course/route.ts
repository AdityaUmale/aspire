import connectDB from "@/lib/db";
import Course from "@/lib/models/Course";
import { NextResponse } from "next/server";



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