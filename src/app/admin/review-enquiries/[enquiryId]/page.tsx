'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  Phone,
  MessageSquareText,
  CalendarDays,
  ArrowLeft,
  CheckCircle,
  Users,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';
import { cn } from '@/lib/utils';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  enquiry: string;
  createdAt: string;
  reviewed?: boolean;
}

function DetailRow({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4',
        className
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-[#1a237e]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-gray-800">{children}</div>
      </div>
    </div>
  );
}

export default function EnquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useAdminToast();
  const enquiryId = params.enquiryId as string;

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!enquiryId) return;

    const fetchEnquiryDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/submit-enquiry?id=${enquiryId}`);
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: 'Failed to fetch enquiry details' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnquiry(data.data);
      } catch (err: unknown) {
        const errorMessage = getFriendlyError(err, 'Could not load enquiry details.');
        setError(errorMessage);
        console.error('Error fetching enquiry details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiryDetails();
  }, [enquiryId]);

  const markAsReviewed = async () => {
    if (!enquiry) return;

    setUpdating(true);

    try {
      const response = await fetch(`/api/submit-enquiry?id=${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewed: true }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Failed to update enquiry' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEnquiry(data.data);
      toast.success('Marked as reviewed', 'This enquiry is now in your completed inbox.');
    } catch (err: unknown) {
      const errorMessage = getFriendlyError(err, 'Could not mark this enquiry as reviewed.');
      toast.error('Update failed', errorMessage);
      console.error('Error marking enquiry as reviewed:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 py-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-6">
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Could not load enquiry</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/review-enquiries')}
          className="border-[#1a237e]/30 text-[#1a237e] hover:bg-[#eef2ff]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to enquiries
        </Button>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="mx-auto max-w-2xl py-8 text-center">
        <p className="mb-4 text-gray-500">Enquiry not found.</p>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/review-enquiries')}
          className="border-[#1a237e]/30 text-[#1a237e] hover:bg-[#eef2ff]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to enquiries
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button
        variant="outline"
        onClick={() => router.push('/admin/review-enquiries')}
        className="border-[#1a237e]/30 text-[#1a237e] hover:bg-[#eef2ff]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to enquiries
      </Button>

      <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Enquiry</p>
              <h1 className="mt-1 text-2xl font-bold text-[#1a237e]">{enquiry.name}</h1>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-semibold',
                enquiry.reviewed
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-800'
              )}
            >
              {enquiry.reviewed ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" /> Reviewed
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" /> Pending review
                </>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          <DetailRow icon={User} label="Name">
            {enquiry.name}
          </DetailRow>
          <DetailRow icon={Mail} label="Email">
            <a href={`mailto:${enquiry.email}`} className="text-[#1a237e] hover:underline">
              {enquiry.email}
            </a>
          </DetailRow>
          {enquiry.phone ? (
            <DetailRow icon={Phone} label="Phone">
              <a href={`tel:${enquiry.phone}`} className="text-[#1a237e] hover:underline">
                {enquiry.phone}
              </a>
            </DetailRow>
          ) : null}
          {typeof enquiry.age !== 'undefined' ? (
            <DetailRow icon={Users} label="Age">
              {enquiry.age}
            </DetailRow>
          ) : null}
          <DetailRow icon={MessageSquareText} label="Message">
            <p className="whitespace-pre-wrap break-words font-normal leading-relaxed text-gray-700">
              {enquiry.enquiry}
            </p>
          </DetailRow>
          <DetailRow icon={CalendarDays} label="Submitted on">
            {new Date(enquiry.createdAt).toLocaleString()}
          </DetailRow>

          {!enquiry.reviewed ? (
            <Button
              onClick={markAsReviewed}
              disabled={updating}
              className="mt-2 w-full bg-[#1a237e] py-5 text-white hover:bg-[#0d1642]"
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Mark as reviewed
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
