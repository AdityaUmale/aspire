import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enquiry from '@/lib/models/Enquiry';

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Moved inside the try block

    const body = await req.json();
    const { name, email, phone, enquiry } = body;

    if (!name || !email || !phone || !enquiry) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      enquiry,
    });

    await newEnquiry.save();

    return NextResponse.json({ message: 'Enquiry submitted successfully', data: newEnquiry }, { status: 201 });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    // Check if the error is a Mongoose validation error
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', errors: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const enquiryId = searchParams.get('id');

    if (enquiryId) {
      // Fetch a single enquiry by ID
      const enquiry = await Enquiry.findById(enquiryId);
      if (!enquiry) {
        return NextResponse.json({ message: 'Enquiry not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Enquiry fetched successfully', data: enquiry }, { status: 200 });
    } else {
      // Fetch all enquiries
      const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ message: 'Enquiries fetched successfully', data: enquiries }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error fetching enquiry/enquiries:', error);
    if (error.name === 'CastError') { // Handle invalid MongoDB ObjectId format
        return NextResponse.json({ message: 'Invalid enquiry ID format' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error while fetching data' }, { status: 500 });
  }
}

// Add this new PATCH endpoint
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const enquiryId = searchParams.get('id');
    
    if (!enquiryId) {
      return NextResponse.json({ message: 'Enquiry ID is required' }, { status: 400 });
    }
    
    const body = await req.json();
    const { reviewed } = body;
    
    if (typeof reviewed !== 'boolean') {
      return NextResponse.json({ message: 'Reviewed status must be a boolean' }, { status: 400 });
    }
    
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      enquiryId,
      { reviewed },
      { new: true } // Return the updated document
    );
    
    if (!updatedEnquiry) {
      return NextResponse.json({ message: 'Enquiry not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'Enquiry updated successfully',
      data: updatedEnquiry
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating enquiry:', error);
    if (error.name === 'CastError') {
      return NextResponse.json({ message: 'Invalid enquiry ID format' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}