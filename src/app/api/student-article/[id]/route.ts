import connectDB from "@/lib/db";
import StudentArticle from "@/lib/models/StudentArticle";
import "@/lib/models/Admin"; // Ensure Admin model is registered for potential use
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET handler for a single article
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    // Await params before destructuring
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid student article ID format" }, { status: 400 });
    }

    try {
        await connectDB();
        const article = await StudentArticle.findById(id).populate("author", "name email");

        if (!article) {
            return NextResponse.json({ error: "Student article not found" }, { status: 404 });
        }

        return NextResponse.json({ article }, { status: 200 });
    } catch (error) {
        console.error("Error fetching student article:", error);
        return NextResponse.json({ error: "Failed to fetch student article" }, { status: 500 });
    }
}

// PATCH: Update a specific student article (e.g., publish it)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Await params before destructuring
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 });
  }

  try {
    await connectDB();
    
    const body = await req.json();
    const { isPublished } = body;

    // Validate the input - we only expect isPublished for this action
    if (typeof isPublished !== 'boolean') {
        return NextResponse.json({ error: "Invalid input: 'isPublished' must be a boolean" }, { status: 400 });
    }

    const updatedArticle = await StudentArticle.findByIdAndUpdate(
      id,
      { $set: { isPublished: isPublished } },
      { new: true } // Return the updated document
    );

    if (!updatedArticle) {
      return NextResponse.json({ error: "Student article not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Student article updated successfully", article: updatedArticle },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating student article:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update student article" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a specific student article
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Await params before destructuring
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 });
  }

  try {
    await connectDB();

    const deletedArticle = await StudentArticle.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json({ error: "Student article not found" }, { status: 404 });
    }

    // Use 200 OK with a message body
    return NextResponse.json(
      { message: "Student article deleted successfully" },
      { status: 200 }
    );
    // Or use 204 No Content (cannot have a message body)
    // return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Error deleting student article:", error);
    return NextResponse.json(
      { error: "Failed to delete student article" },
      { status: 500 }
    );
  }
}