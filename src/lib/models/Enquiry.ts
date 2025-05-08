import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  enquiry: string;
  createdAt: Date;
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
});

const Enquiry = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;