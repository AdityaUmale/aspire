'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Inbox, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

// Update the Enquiry interface
interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  enquiry: string;
  createdAt: string;
  reviewed?: boolean; // Add the reviewed field
}

export default function ReviewEnquiriesPage() {
  const router = useRouter(); // Initialize useRouter
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/submit-enquiry'); // Assuming this is the endpoint to GET enquiries
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch enquiries' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnquiries(data.data || []); // Corrected: Access data.data instead of data.enquiries
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching enquiries.');
        console.error('Error fetching enquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <Inbox className="h-4 w-4 mr-2" />
        Review Enquiries
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-[#1a237e] mb-6">Submitted Enquiries</h1>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2 border-b border-gray-200/60 last:border-b-0">
                <Skeleton className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gray-200/80" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-3 lg:h-4 w-3/4 bg-gray-200/80" />
                  <Skeleton className="h-3 lg:h-4 w-1/2 bg-gray-200/80" />
                </div>
              </div>
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <MessageSquare className="h-10 w-10 lg:h-12 lg:w-12 text-[#1a237e]/40 mx-auto mb-4" />
            <p className="text-gray-500 text-base lg:text-lg">No enquiries submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-[#1a237e]/20">
                  <TableHead className="text-[#1a237e] font-semibold text-xs lg:text-sm">Name</TableHead>
                  <TableHead className="text-[#1a237e] font-semibold text-xs lg:text-sm">Email</TableHead>
                  <TableHead className="text-[#1a237e] font-semibold text-xs lg:text-sm hidden sm:table-cell">Phone</TableHead>
                  <TableHead className="text-[#1a237e] font-semibold text-xs lg:text-sm">Enquiry</TableHead>
                  <TableHead className="text-[#1a237e] font-semibold text-xs lg:text-sm hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-[#1a237e] font-semibold text-xs lg:text-sm">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow 
                    key={enquiry._id} 
                    className="border-b-gray-200/60 hover:bg-[#e8eaf6]/30 cursor-pointer" 
                    onClick={() => router.push(`/admin/review-enquiries/${enquiry._id}`)}
                  >
                    <TableCell className="font-medium text-gray-700 py-2 lg:py-3 text-xs lg:text-sm">{enquiry.name}</TableCell>
                    <TableCell className="text-gray-600 py-2 lg:py-3 text-xs lg:text-sm">{enquiry.email}</TableCell>
                    <TableCell className="text-gray-600 py-2 lg:py-3 text-xs lg:text-sm hidden sm:table-cell">{enquiry.phone || '-'}</TableCell>
                    <TableCell className="text-gray-600 py-2 lg:py-3 text-xs lg:text-sm max-w-xs truncate" title={enquiry.enquiry}>{enquiry.enquiry}</TableCell>
                    <TableCell className="text-gray-500 py-2 lg:py-3 text-xs hidden md:table-cell">{new Date(enquiry.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="py-2 lg:py-3">
                      <div className="flex items-center">
                        {enquiry.reviewed ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            <span className="text-xs font-medium">Reviewed</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <XCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            <span className="text-xs font-medium">Pending</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}