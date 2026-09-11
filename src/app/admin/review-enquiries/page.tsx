'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Inbox,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminEmptyState } from '@/components/admin/empty-state';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';
import { getEnquirySourceLabel, UNTRACKED_SOURCE_LABEL } from '@/lib/enquiry-source';
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
  sourceKey?: string;
  sourceLabel?: string;
  sourceDetail?: string;
  sourcePath?: string;
}

const ALL_SOURCES = '__all__';

export default function ReviewEnquiriesPage() {
  const router = useRouter();
  const toast = useAdminToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>(ALL_SOURCES);

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/submit-enquiry');
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: 'Failed to fetch enquiries' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnquiries(data.data || []);
      } catch (err: unknown) {
        const errorMessage = getFriendlyError(err, 'Could not load enquiries.');
        setError(errorMessage);
        toast.error('Load failed', errorMessage);
        console.error('Error fetching enquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every source present in the data, most used first, for the filter dropdown.
  const sourceOptions = useMemo(() => {
    const counts = new Map<string, number>();
    enquiries.forEach((enquiry) => {
      const label = getEnquirySourceLabel(enquiry);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [enquiries]);

  const visibleEnquiries = useMemo(
    () =>
      sourceFilter === ALL_SOURCES
        ? enquiries
        : enquiries.filter((enquiry) => getEnquirySourceLabel(enquiry) === sourceFilter),
    [enquiries, sourceFilter]
  );

  const pendingCount = enquiries.filter((e) => !e.reviewed).length;
  const topSource = sourceOptions.find(([label]) => label !== UNTRACKED_SOURCE_LABEL);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        badge="Inbox"
        title="Submitted enquiries"
        description="Open a row to read the full message and mark it as reviewed when you’ve handled it. Each row shows the page the visitor was on when they clicked Enquire."
      />

      {!loading && enquiries.length > 0 ? (
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 shadow-sm">
            <Inbox className="h-3.5 w-3.5" />
            {enquiries.length} total
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 shadow-sm',
              pendingCount > 0
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {pendingCount} pending
          </span>
          {topSource ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 shadow-sm">
              <MapPin className="h-3.5 w-3.5" />
              Top source: {topSource[0]} ({topSource[1]})
            </span>
          ) : null}

          <label className="ml-auto inline-flex items-center gap-2 text-gray-600">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Source
            </span>
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm outline-none focus:border-[#1a237e]/40 focus:ring-2 focus:ring-[#1a237e]/10"
            >
              <option value={ALL_SOURCES}>All sources ({enquiries.length})</option>
              {sourceOptions.map(([label, count]) => (
                <option key={label} value={label}>
                  {label} ({count})
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-4 p-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleEnquiries.length === 0 ? (
          <div className="p-4">
            <AdminEmptyState
              icon={MessageSquare}
              title={enquiries.length === 0 ? 'No enquiries yet' : 'No enquiries from this source'}
              description={
                enquiries.length === 0
                  ? 'Contact form submissions will show up here.'
                  : 'Pick a different source to see more enquiries.'
              }
              className="border-0 bg-transparent shadow-none"
            />
          </div>
        ) : (
          <>
            <div className="space-y-2 p-3 md:hidden">
              {visibleEnquiries.map((enquiry) => (
                <button
                  key={enquiry._id}
                  type="button"
                  onClick={() => router.push(`/admin/review-enquiries/${enquiry._id}`)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:border-[#1a237e]/20 hover:bg-[#f8f9ff]"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{enquiry.name}</h3>
                    <StatusPill reviewed={!!enquiry.reviewed} />
                  </div>
                  <p className="text-xs text-gray-600">{enquiry.email}</p>
                  {enquiry.phone ? <p className="text-xs text-gray-600">{enquiry.phone}</p> : null}
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                    {getEnquirySourceLabel(enquiry)}
                    {enquiry.sourceDetail ? ` · ${enquiry.sourceDetail}` : ''}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </p>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                </button>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-[#1a237e]/10 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-[#1a237e] lg:text-sm">
                      Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#1a237e] lg:text-sm">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#1a237e] lg:text-sm">
                      Phone
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#1a237e] lg:text-sm">
                      Age
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#1a237e] lg:text-sm">
                      Clicked from
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#1a237e] lg:text-sm">
                      Date
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#1a237e] lg:text-sm">
                      Status
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleEnquiries.map((enquiry) => (
                    <TableRow
                      key={enquiry._id}
                      className="cursor-pointer border-b-gray-100 transition-colors hover:bg-[#eef2ff]/50"
                      onClick={() => router.push(`/admin/review-enquiries/${enquiry._id}`)}
                    >
                      <TableCell className="whitespace-nowrap py-3 text-sm font-medium text-gray-800">
                        {enquiry.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-3 text-sm text-gray-600">
                        {enquiry.email}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-3 text-sm text-gray-600">
                        {enquiry.phone || '—'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-3 text-sm text-gray-600">
                        {typeof enquiry.age !== 'undefined' ? enquiry.age : '—'}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-600">
                        <span className="block max-w-[220px] truncate" title={getEnquirySourceLabel(enquiry)}>
                          {getEnquirySourceLabel(enquiry)}
                        </span>
                        {enquiry.sourceDetail ? (
                          <span
                            className="block max-w-[220px] truncate text-xs text-gray-400"
                            title={enquiry.sourceDetail}
                          >
                            {enquiry.sourceDetail}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-3 text-xs text-gray-500">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-3">
                        <StatusPill reviewed={!!enquiry.reviewed} />
                      </TableCell>
                      <TableCell className="py-3">
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusPill({ reviewed }: { reviewed: boolean }) {
  if (reviewed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        Reviewed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      <Clock className="h-3 w-3" />
      Pending
    </span>
  );
}
