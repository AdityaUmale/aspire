import mongoose from "mongoose";
import { COURSE_CTA_MODES, COURSE_SECTIONS } from "@/lib/course-config";

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  courseOutline: {
    type: [String], // Changed from String to [String]
    required: true,
  },
  courseDate: {
    type: Date,
    required: true,
  },
  courseTime: {
    type: String,
  },
  courseDayLabel: {
    type: String,
  },
  section: {
    type: String,
    enum: COURSE_SECTIONS,
  },
  ctaMode: {
    type: String,
    enum: COURSE_CTA_MODES,
  },
  sourceImageUrl: {
    type: String,
  },
  sourceMonthLabel: {
    type: String,
  },
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export default Course;
