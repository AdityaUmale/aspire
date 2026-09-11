import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  age: number;
  enquiry: string;
  createdAt: Date;
  reviewed: boolean;
  sourceKey?: string;
  sourceLabel?: string;
  sourceDetail?: string;
  sourcePath?: string;
}

const EnquirySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [5, 'Age must be at least 5'],
    max: [120, 'Age must be below 120'],
  },
  enquiry: {
    type: String,
    required: [true, 'Enquiry message is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add this to your EnquirySchema
  reviewed: {
    type: Boolean,
    default: false,
  },
  // Where the visitor clicked the enquiry CTA from.
  sourceKey: {
    type: String,
    trim: true,
    index: true,
  },
  sourceLabel: {
    type: String,
    trim: true,
  },
  // Extra context for the CTA, e.g. the upcoming batch name.
  sourceDetail: {
    type: String,
    trim: true,
  },
  sourcePath: {
    type: String,
    trim: true,
  },
});

const Enquiry = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;