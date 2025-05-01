import connectDB from "@/lib/db";
import Article from "@/lib/models/Article";
import "@/lib/models/Admin"; // Import for side effects only
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// POST: Create a new article
export async function POST(req: Request) {
  try {
try {
  await connectDB();
} catch (error) {
  console.error("Database connection error:", error);
  return NextResponse.json(
    { error: "Failed to connect to database" },
    { status: 500 }
  );
}
    
    const { title, description, content, author } = await req.json();
    
    // Validate required fields
    if (!title || !description || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
    
    const newArticle = new Article({
      title,
      description,
      content,
      author
    });
    
    const savedArticle = await newArticle.save();
    
    return NextResponse.json(
      { message: "Article created successfully", article: savedArticle },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

// GET: Retrieve all articles or a specific article by ID
export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    // If ID is provided, return a specific article
    if (id) {
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid article ID format" },
          { status: 400 }
        );
      }
      
      const article = await Article.findById(id).populate("author", "name email");
      
      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ article }, { status: 200 });
    }
    
    // Otherwise, return all articles (with pagination)
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    const articles = await Article.find({})
      .populate("author", "name email")
      .sort({ _id: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
    
    const total = await Article.countDocuments({});
    
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
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}