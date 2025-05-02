import mongoose from "mongoose";

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
  courseDate: { // Add this field
    type: Date,
    required: true,
  }
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export default Course;