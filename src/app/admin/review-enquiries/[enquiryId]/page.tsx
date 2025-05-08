'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, User, Mail, Phone, MessageSquareText, CalendarDays, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  enquiry: string;
  createdAt: string;
}

export default function EnquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const enquiryId = params.enquiryId as string;

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enquiryId) return;

    const fetchEnquiryDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/submit-enquiry?id=${enquiryId}`); // Pass ID as a query parameter
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch enquiry details' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnquiry(data.data); // Assuming the API returns the enquiry object in data.data
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching enquiry details.');
        console.error('Error fetching enquiry details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiryDetails();
  }, [enquiryId]);

  if (loading) {
    return (
      <div className="space-y-4 p-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-1/4 bg-gray-200/80" />
        <Skeleton className="h-6 w-full bg-gray-200/80" />
        <Skeleton className="h-6 w-3/4 bg-gray-200/80" />
        <Skeleton className="h-20 w-full bg-gray-200/80" />
        <Skeleton className="h-6 w-1/2 bg-gray-200/80" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Alert variant="destructive" className="bg-red-100/50 border-red-300/50 text-red-800">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="p-6 text-center max-w-2xl mx-auto">
        <p className="text-gray-500">Enquiry not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-6 text-[#1a237e] border-[#1a237e]/30 hover:bg-[#e8eaf6]">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Enquiries
      </Button>
      
      <h1 className="text-3xl font-bold text-[#1a237e] mb-4">Enquiry Details</h1>
      
      <div className="space-y-4">
        <div className="flex items-center p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
          <User className="h-5 w-5 mr-3 text-[#1a237e]/70" />
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="text-gray-800 font-medium">{enquiry.name}</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
          <Mail className="h-5 w-5 mr-3 text-[#1a237e]/70" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-gray-800 font-medium">{enquiry.email}</p>
          </div>
        </div>

        {enquiry.phone && (
          <div className="flex items-center p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
            <Phone className="h-5 w-5 mr-3 text-[#1a237e]/70" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-gray-800 font-medium">{enquiry.phone}</p>
            </div>
          </div>
        )}

        <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
          <div className="flex items-center mb-1">
            <MessageSquareText className="h-5 w-5 mr-3 text-[#1a237e]/70" />
            <p className="text-xs text-gray-500">Enquiry Message</p>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap break-words">{enquiry.enquiry}</p>
        </div>

        <div className="flex items-center p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
          <CalendarDays className="h-5 w-5 mr-3 text-[#1a237e]/70" />
          <div>
            <p className="text-xs text-gray-500">Submitted On</p>
            <p className="text-gray-800 font-medium">{new Date(enquiry.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}