import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enquiry from '@/lib/models/Enquiry';
import StudentArticle from '@/lib/models/StudentArticle';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get total enquiries count
    const totalEnquiries = await Enquiry.countDocuments({});
    
    // Get pending enquiries (assuming all are pending for now)
    // Note: You'll need to add a 'reviewed' field to your Enquiry model
    // and update your submit-enquiry API to support marking enquiries as reviewed
    const pendingEnquiries = await Enquiry.countDocuments({ reviewed: { $ne: true } });
    
    // Get pending articles (unpublished)
    const pendingArticles = await StudentArticle.countDocuments({ isPublished: false });
    
    // Get total published articles
    const publishedArticles = await StudentArticle.countDocuments({ isPublished: true });

    // Return all stats in a single response
    return NextResponse.json({
      success: true,
      data: {
        totalEnquiries,
        pendingEnquiries,
        pendingArticles,
        publishedArticles
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch dashboard statistics' 
    }, { status: 500 });
  }
}