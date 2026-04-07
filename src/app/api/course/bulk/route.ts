import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/lib/models/Course";
import { normalizeCoursePayload } from "@/lib/course-utils";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return auth.response;
    }

    const body = (await req.json().catch(() => ({}))) as {
      courses?: Record<string, unknown>[];
      sourceImageUrl?: string;
      sourceMonthLabel?: string;
    };

    const rawCourses = Array.isArray(body.courses) ? body.courses : [];
    if (rawCourses.length === 0) {
      return NextResponse.json(
        { error: "At least one course is required for bulk create." },
        { status: 400 }
      );
    }

    const normalizedCourses = rawCourses.map((course, index) => {
      const normalized = normalizeCoursePayload(course, {
        defaultCtaMode: "ENQUIRE",
        fallbackSourceImageUrl:
          typeof body.sourceImageUrl === "string" ? body.sourceImageUrl : undefined,
        fallbackSourceMonthLabel:
          typeof body.sourceMonthLabel === "string" ? body.sourceMonthLabel : undefined,
      });

      return {
        index,
        ...normalized,
      };
    });

    const invalidRows = normalizedCourses
      .filter((entry) => !entry.value)
      .map((entry) => ({
        index: entry.index,
        errors: entry.errors,
      }));

    if (invalidRows.length > 0) {
      return NextResponse.json(
        {
          error: "One or more rows are invalid.",
          rowErrors: invalidRows,
        },
        { status: 400 }
      );
    }

    await connectDB();
    const createdCourses = await Course.insertMany(
      normalizedCourses.map((entry) => entry.value)
    );

    return NextResponse.json(
      {
        message: "Courses created successfully.",
        courses: createdCourses,
        createdCount: createdCourses.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating courses in bulk:", error);
    return NextResponse.json(
      { error: "Failed to create courses in bulk." },
      { status: 500 }
    );
  }
}
