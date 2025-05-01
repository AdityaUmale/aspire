import connectDB from "@/lib/db";
import StudentArticle from "@/lib/models/StudentArticle";
import "@/lib/models/Admin"; // Import Admin model for side effects (schema registration)
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// POST: Create a new student article
export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Note: isPublished defaults to false per the schema
    const { title, description, content, author } = await req.json();
    
    // Validate required fields
    if (!title || !description || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields (title, description, content, author)" },
        { status: 400 }
      );
    }
    
    // Validate author ID format
    if (!mongoose.Types.ObjectId.isValid(author)) {
      return NextResponse.json(
        { error: "Invalid author ID format" },
        { status: 400 }
      );
    }
    
    const newStudentArticle = new StudentArticle({
      title,
      description,
      content,
      author
      // isPublished will default to false
    });
    
    const savedArticle = await newStudentArticle.save();
    
    return NextResponse.json(
      { message: "Student article created successfully", article: savedArticle },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating student article:", error);
    // Provide more specific error messages if possible
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create student article" },
      { status: 500 }
    );
  }
}

// GET: Retrieve all student articles or a specific one by ID
export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    // If ID is provided, return a specific article
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid student article ID format" },
          { status: 400 }
        );
      }
      
      const article = await StudentArticle.findById(id).populate("author", "name email");
      
      if (!article) {
        return NextResponse.json(
          { error: "Student article not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ article }, { status: 200 });
    }
    
    // Otherwise, return all articles (with pagination)
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Optionally filter by isPublished status if needed, e.g.:
    // const filter = { isPublished: true }; // or based on query param
    const filter = {}; // Currently fetches all

    const articles = await StudentArticle.find(filter)
      .populate("author", "name email")
      .sort({ _id: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
      
    const total = await StudentArticle.countDocuments(filter);
    
    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching student articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch student articles" },
      { status: 500 }
    );
  }
}