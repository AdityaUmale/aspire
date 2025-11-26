'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, User, Mail, Phone, MessageSquareText, CalendarDays, ArrowLeft, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  enquiry: string;
  createdAt: string;
  reviewed?: boolean; // Add the reviewed field
}

export default function EnquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const enquiryId = params.enquiryId as string;

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false); // Add state for updating
  const [updateMessage, setUpdateMessage] = useState<string | null>(null); // Add state for update message

  useEffect(() => {
    if (!enquiryId) return;

    const fetchEnquiryDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/submit-enquiry?id=${enquiryId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch enquiry details' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnquiry(data.data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching enquiry details.';
        setError(errorMessage);
        console.error('Error fetching enquiry details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiryDetails();
  }, [enquiryId]);

  // Add function to mark enquiry as reviewed
  const markAsReviewed = async () => {
    if (!enquiry) return;
    
    setUpdating(true);
    setUpdateMessage(null);
    
    try {
      const response = await fetch(`/api/submit-enquiry?id=${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewed: true }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update enquiry' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEnquiry(data.data);
      setUpdateMessage('Enquiry marked as reviewed successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark enquiry as reviewed';
      setUpdateMessage(`Error: ${errorMessage}`);
      console.error('Error marking enquiry as reviewed:', err);
    } finally {
      setUpdating(false);
    }
  };

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
      
      {/* Add update message alert */}
      {updateMessage && (
        <Alert 
          variant={updateMessage.startsWith('Error') ? "destructive" : "default"}
          className={updateMessage.startsWith('Error') ? 
            "bg-red-100/50 border-red-300/50 text-red-800" : 
            "bg-green-100/50 border-green-300/50 text-green-800"}
        >
          {updateMessage.startsWith('Error') ? 
            <Terminal className="h-4 w-4" /> : 
            <CheckCircle className="h-4 w-4" />}
          <AlertTitle>{updateMessage.startsWith('Error') ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{updateMessage}</AlertDescription>
        </Alert>
      )}
      
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

        {typeof enquiry.age !== 'undefined' && (
          <div className="flex items-center p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
            <Users className="h-5 w-5 mr-3 text-[#1a237e]/70" />
            <div>
              <p className="text-xs text-gray-500">Age</p>
              <p className="text-gray-800 font-medium">{enquiry.age}</p>
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
        
        {/* Add reviewed status indicator */}
        <div className="flex items-center p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
          <CheckCircle className={`h-5 w-5 mr-3 ${enquiry.reviewed ? 'text-green-600' : 'text-gray-400'}`} />
          <div>
            <p className="text-xs text-gray-500">Review Status</p>
            <p className="text-gray-800 font-medium">
              {enquiry.reviewed ? 'Reviewed' : 'Pending Review'}
            </p>
          </div>
        </div>
        
        {/* Add Mark as Reviewed button */}
        {!enquiry.reviewed && (
          <Button 
            onClick={markAsReviewed}
            disabled={updating}
            className="w-full bg-[#1a237e] hover:bg-[#0d1642] text-white font-semibold py-3 px-4 rounded-md shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center disabled:opacity-70"
          >
            {updating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Mark as Reviewed
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}