'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, isValid, parseISO } from 'date-fns';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  ImageUp,
  Loader2,
  PenLine,
  RotateCcw,
  ScanText,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { AdminPageHeader } from '@/components/admin/page-header';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';
import { MAX_UPLOAD_IMAGE_MB, resizeImageFileIfNeeded } from '@/lib/client-image-resize';
import { cn } from '@/lib/utils';
import {
  AVAILABLE_PROGRAMS,
  COURSE_SECTIONS,
  getCourseSectionLabel,
  type CourseSection,
} from '@/lib/course-config';
import { type DraftImportItem } from '@/lib/course-utils';

interface ParsePosterResponse {
  imageUrl: string;
  sourceMonthLabel?: string;
  model?: string;
  items: DraftImportItem[];
}

// Highlights are edited as free text so commas can be typed; they are split on save.
type DraftRow = DraftImportItem & { outlineText: string };

type Mode = 'import' | 'manual';
type ImportStatus = 'idle' | 'parsing' | 'error' | 'review' | 'done';

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const emptyImportMeta = {
  imageUrl: '',
  sourceMonthLabel: '',
  model: '',
};

const labelClass = 'text-sm font-medium text-gray-700';
const fieldClass = 'border-gray-300 focus-visible:border-[#1a237e] focus-visible:ring-[#1a237e]/20';
const selectClass =
  'h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-[#1a237e] focus-visible:ring-[3px] focus-visible:ring-[#1a237e]/20';

const splitHighlights = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const weekdayFromIso = (iso: string) => {
  const date = parseISO(iso);
  return isValid(date) ? format(date, 'EEEE') : '';
};

const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const getRowProblems = (row: DraftRow) => {
  const problems: string[] = [];
  if (!row.courseName.trim()) problems.push('Add a course name.');
  if (!isValid(parseISO(row.courseDateIso))) problems.push('Add a valid start date.');
  return problems;
};

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      {' '}
      *
    </span>
  );
}

function ErrorNotice({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p>{message}</p>
        {action ? <div className="mt-2 flex flex-wrap gap-2">{action}</div> : null}
      </div>
    </div>
  );
}

function SectionPicker({
  value,
  onChange,
  name,
}: {
  value: CourseSection;
  onChange: (section: CourseSection) => void;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label="Section" className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
      {COURSE_SECTIONS.map((option) => {
        const checked = option === value;
        return (
          <label
            key={option}
            className={cn(
              'flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-[#1a237e]/25',
              checked ? 'bg-white text-[#1a237e] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {getCourseSectionLabel(option)}
          </label>
        );
      })}
    </div>
  );
}

function ConfidencePill({ confidence }: { confidence: number }) {
  const percent = Math.round(confidence * 100);
  const tone =
    confidence >= 0.8
      ? { label: 'Clear read', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' }
      : confidence >= 0.5
        ? { label: 'Double-check', className: 'bg-amber-50 text-amber-800 ring-amber-200' }
        : { label: 'Unsure', className: 'bg-red-50 text-red-700 ring-red-200' };

  return (
    <span
      title={`Extraction confidence ${percent}%`}
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        tone.className
      )}
    >
      {tone.label}
    </span>
  );
}

function PosterDropzone({
  onFile,
  disabled,
  compact,
}: {
  onFile: (file: File) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file && !disabled) onFile(file);
      }}
      className={cn(
        'group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors',
        'has-[:focus-visible]:border-[#1a237e] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-[#1a237e]/20',
        compact ? 'px-4 py-6' : 'px-6 py-14',
        dragging
          ? 'border-[#1a237e] bg-[#eef2ff]'
          : 'border-[#1a237e]/20 bg-[#f8faff] hover:border-[#1a237e]/40 hover:bg-[#f3f5ff]',
        disabled && 'pointer-events-none opacity-60'
      )}
    >
      <input
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onFile(file);
        }}
      />
      <span
        className={cn(
          'flex items-center justify-center rounded-2xl bg-white text-[#1a237e] shadow-sm ring-1 ring-[#1a237e]/10 transition-transform group-hover:-translate-y-0.5',
          compact ? 'h-10 w-10' : 'h-14 w-14'
        )}
      >
        <ImageUp className={compact ? 'h-5 w-5' : 'h-6 w-6'} />
      </span>
      <span className={cn('font-semibold text-[#1a237e]', compact ? 'mt-3 text-sm' : 'mt-4 text-base')}>
        {dragging ? 'Drop to upload' : 'Drop a schedule poster here, or click to browse'}
      </span>
      <span className="mt-1 text-xs text-gray-500">
        JPG, PNG, WEBP or GIF. Photos over {MAX_UPLOAD_IMAGE_MB} MB are shrunk automatically.
      </span>
    </label>
  );
}

function DraftCard({
  row,
  onChange,
  onRemove,
}: {
  row: DraftRow;
  onChange: (updater: (row: DraftRow) => DraftRow) => void;
  onRemove: () => void;
}) {
  const problems = getRowProblems(row);
  const fieldId = (field: string) => `draft-${row.id}-${field}`;
  const highlightCount = splitHighlights(row.outlineText).length;

  return (
    <article
      className={cn(
        'rounded-xl border bg-white transition-colors',
        row.selected ? 'border-gray-200 shadow-sm' : 'border-dashed border-gray-200 bg-gray-50/70',
        row.selected && problems.length > 0 && 'border-red-200'
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={row.selected}
            onChange={(event) => onChange((current) => ({ ...current, selected: event.target.checked }))}
            aria-label={`Publish ${row.courseName || 'this course'}`}
            className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-[#1a237e]"
          />
          <Input
            id={fieldId('name')}
            aria-label="Course name"
            value={row.courseName}
            onChange={(event) => onChange((current) => ({ ...current, courseName: event.target.value }))}
            placeholder="Course name"
            aria-invalid={!row.courseName.trim() || undefined}
            className={cn(fieldClass, 'h-10 min-w-0 flex-1 text-base font-semibold text-[#1a237e]', !row.selected && 'opacity-60')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label={`Remove ${row.courseName || 'this row'}`}
            title="Remove row"
            className="-mr-1 shrink-0 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className={cn('mt-3 space-y-3 sm:pl-7', !row.selected && 'opacity-60')}>
          <div className="flex flex-wrap items-start gap-x-3 gap-y-1.5">
            <ConfidencePill confidence={row.confidence} />
            {row.notes ? (
              <p className="flex min-w-0 flex-1 basis-60 items-start gap-1.5 text-xs leading-relaxed text-amber-800">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {row.notes}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 2xl:grid-cols-[10rem_minmax(0,1.5fr)_minmax(0,1fr)_9rem]">
            <div className="space-y-1">
              <Label htmlFor={fieldId('date')} className="text-xs font-medium text-gray-600">
                Start date
              </Label>
              <Input
                id={fieldId('date')}
                type="date"
                value={row.courseDateIso}
                aria-invalid={!isValid(parseISO(row.courseDateIso)) || undefined}
                onChange={(event) => {
                  const nextIso = event.target.value;
                  onChange((current) => {
                    const previousWeekday = weekdayFromIso(current.courseDateIso);
                    const dayWasDerived = !current.courseDayLabel || current.courseDayLabel === previousWeekday;
                    return {
                      ...current,
                      courseDateIso: nextIso,
                      courseDateLabel: nextIso,
                      courseDayLabel: dayWasDerived ? weekdayFromIso(nextIso) : current.courseDayLabel,
                    };
                  });
                }}
                className={cn(fieldClass, 'tabular-nums')}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={fieldId('time')} className="text-xs font-medium text-gray-600">
                Time
              </Label>
              <Input
                id={fieldId('time')}
                value={row.courseTime}
                onChange={(event) => onChange((current) => ({ ...current, courseTime: event.target.value }))}
                placeholder="10:15 AM"
                className={fieldClass}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={fieldId('day')} className="text-xs font-medium text-gray-600">
                Day
              </Label>
              <Input
                id={fieldId('day')}
                value={row.courseDayLabel}
                onChange={(event) => onChange((current) => ({ ...current, courseDayLabel: event.target.value }))}
                placeholder="Monday"
                className={fieldClass}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={fieldId('section')} className="text-xs font-medium text-gray-600">
                Section
              </Label>
              <select
                id={fieldId('section')}
                value={row.section}
                onChange={(event) =>
                  onChange((current) => ({ ...current, section: event.target.value as CourseSection }))
                }
                className={selectClass}
              >
                {COURSE_SECTIONS.map((option) => (
                  <option key={option} value={option}>
                    {getCourseSectionLabel(option)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {row.selected && problems.length > 0 ? (
            <p className="text-xs font-medium text-red-700">{problems.join(' ')}</p>
          ) : null}

          <details className="group/details rounded-lg border border-gray-100 bg-gray-50/60 open:bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#1a237e]/20 [&::-webkit-details-marker]:hidden">
              <span>
                Description and highlights
                <span className="ml-2 text-xs text-gray-400">
                  {highlightCount} highlight{highlightCount === 1 ? '' : 's'}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 transition-transform group-open/details:rotate-180" />
            </summary>
            <div className="space-y-3 px-3 pb-3 pt-1">
              <div className="space-y-1">
                <Label htmlFor={fieldId('description')} className="text-xs font-medium text-gray-600">
                  Description
                </Label>
                <Textarea
                  id={fieldId('description')}
                  value={row.description}
                  onChange={(event) => onChange((current) => ({ ...current, description: event.target.value }))}
                  rows={3}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={fieldId('highlights')} className="text-xs font-medium text-gray-600">
                  Highlights
                </Label>
                <Textarea
                  id={fieldId('highlights')}
                  value={row.outlineText}
                  onChange={(event) => onChange((current) => ({ ...current, outlineText: event.target.value }))}
                  rows={2}
                  className={fieldClass}
                />
                <p className="text-xs text-gray-500">Separate highlights with commas.</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}

function ReviewSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="rounded-xl border border-gray-100 bg-white p-4">
          <Skeleton className="h-10 w-2/3" />
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((cell) => (
              <Skeleton key={cell} className="h-9" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PosterImport() {
  const toast = useAdminToast();
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [importMeta, setImportMeta] = useState(emptyImportMeta);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishedCount, setPublishedCount] = useState(0);
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const selectedRows = useMemo(() => rows.filter((row) => row.selected), [rows]);
  const selectedWithProblems = selectedRows.filter((row) => getRowProblems(row).length > 0);
  const allSelected = rows.length > 0 && selectedRows.length === rows.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedRows.length > 0 && !allSelected;
    }
  }, [selectedRows.length, allSelected]);

  const resetImport = () => {
    setStatus('idle');
    setPosterFile(null);
    setPreviewUrl('');
    setParseError(null);
    setRows([]);
    setImportMeta(emptyImportMeta);
    setSaveError(null);
    setPublishedCount(0);
  };

  const extract = async (file: File) => {
    setStatus('parsing');
    setParseError(null);
    setSaveError(null);
    setRows([]);
    setImportMeta(emptyImportMeta);

    try {
      const upload = await resizeImageFileIfNeeded(file);
      const formData = new FormData();
      formData.append('file', upload);

      const response = await fetch('/api/course/import/parse', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json().catch(() => ({}))) as Partial<ParsePosterResponse> & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to read the poster.');
      }

      const items = payload.items ?? [];
      setRows(items.map((item) => ({ ...item, outlineText: item.courseOutline.join(', ') })));
      setImportMeta({
        imageUrl: payload.imageUrl ?? '',
        sourceMonthLabel: payload.sourceMonthLabel ?? '',
        model: payload.model ?? '',
      });
      setStatus('review');
      toast.success(
        'Poster read',
        `Found ${items.length} course${items.length === 1 ? '' : 's'}. Check them before publishing.`
      );
    } catch (error) {
      const message = getFriendlyError(
        error,
        'Could not read this poster. Try a sharper image, or add the courses manually.'
      );
      setParseError(message);
      setStatus('error');
      toast.error('Could not read poster', message);
    }
  };

  const handleFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      const message = 'That file type is not supported. Use a JPG, PNG, WEBP or GIF image.';
      toast.error('Unsupported file', message);
      return;
    }

    setPosterFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPublishedCount(0);
    void extract(file);
  };

  const updateRow = (id: string, updater: (row: DraftRow) => DraftRow) => {
    setRows((current) => current.map((row) => (row.id === id ? updater(row) : row)));
  };

  const handlePublish = async () => {
    if (selectedRows.length === 0) {
      setSaveError('Select at least one course to publish.');
      return;
    }
    if (selectedWithProblems.length > 0) {
      setSaveError(
        `${selectedWithProblems.length} selected course${
          selectedWithProblems.length === 1 ? ' is' : 's are'
        } missing a name or start date. Fix or untick ${selectedWithProblems.length === 1 ? 'it' : 'them'} first.`
      );
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/course/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceImageUrl: importMeta.imageUrl,
          sourceMonthLabel: importMeta.sourceMonthLabel,
          courses: selectedRows.map((row) => ({
            courseName: row.courseName,
            description: row.description,
            courseOutline: splitHighlights(row.outlineText),
            courseDate: row.courseDateIso,
            courseTime: row.courseTime,
            courseDayLabel: row.courseDayLabel,
            section: row.section,
            sourceImageUrl: row.sourceImageUrl,
            sourceMonthLabel: row.sourceMonthLabel,
          })),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        createdCount?: number;
        rowErrors?: Array<{ index: number; errors: string[] }>;
      };

      if (!response.ok) {
        const rowErrorText = Array.isArray(payload.rowErrors)
          ? payload.rowErrors
              .map((rowError) => {
                const name = selectedRows[rowError.index]?.courseName || `Row ${rowError.index + 1}`;
                return `${name}: ${rowError.errors.join(', ')}`;
              })
              .join(' · ')
          : '';
        throw new Error([payload.error, rowErrorText].filter(Boolean).join(' '));
      }

      const saved = payload.createdCount ?? selectedRows.length;
      const remaining = rows.filter((row) => !row.selected);
      setPublishedCount((count) => count + saved);
      setRows(remaining);
      if (remaining.length === 0) setStatus('done');
      toast.success('Courses published', `${saved} course${saved === 1 ? ' is' : 's are'} now live on the website.`);
    } catch (error) {
      const message = getFriendlyError(error, 'Could not publish the selected courses.');
      setSaveError(message);
      toast.error('Publish failed', message);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'idle') {
    return (
      <div className="space-y-5">
        <PosterDropzone onFile={handleFile} />
        <ol className="grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
          {[
            ['Upload', 'Drop in the monthly schedule poster.'],
            ['Review', 'Check the courses read from the poster and fix anything off.'],
            ['Publish', 'Only the courses you tick go live.'],
          ].map(([title, body], index) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold tabular-nums text-[#1a237e]">
                {index + 1}
              </span>
              <span>
                <span className="font-medium text-gray-900">{title}.</span> {body}
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const posterSrc = previewUrl || importMeta.imageUrl;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          {posterSrc ? (
            <Image
              src={posterSrc}
              alt="Uploaded schedule poster"
              width={760}
              height={1000}
              unoptimized
              className="max-h-[28rem] w-full object-contain lg:max-h-[calc(100vh-14rem)]"
            />
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <span className="min-w-0 truncate">
            {importMeta.sourceMonthLabel ? (
              <span className="font-medium text-gray-700">{importMeta.sourceMonthLabel}</span>
            ) : (
              posterFile?.name
            )}
            {posterFile ? ` · ${formatFileSize(posterFile.size)}` : null}
          </span>
          {importMeta.imageUrl ? (
            <a
              href={importMeta.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#1a237e] hover:underline"
            >
              Full size <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={resetImport}
          disabled={status === 'parsing' || saving}
          className="w-full border-gray-300 text-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
          Use a different poster
        </Button>
      </aside>

      <div className="min-w-0 space-y-4">
        {status === 'parsing' ? (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-[#f8faff] px-4 py-3 text-sm text-[#1a237e]" role="status">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                <span className="font-semibold">Reading the poster…</span>{' '}
                <span className="text-[#1a237e]/70">This usually takes a few seconds.</span>
              </span>
            </div>
            <ReviewSkeleton />
          </>
        ) : null}

        {status === 'error' && parseError ? (
          <ErrorNotice
            message={parseError}
            action={
              <>
                {posterFile ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void extract(posterFile)}
                    className="bg-[#1a237e] text-white hover:bg-[#10164f]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try again
                  </Button>
                ) : null}
                <Button type="button" size="sm" variant="outline" onClick={resetImport}>
                  Choose another image
                </Button>
              </>
            }
          />
        ) : null}

        {status === 'done' ? (
          <div className="flex flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50/60 px-6 py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <p className="mt-3 text-lg font-semibold text-gray-900">
              {publishedCount} course{publishedCount === 1 ? '' : 's'} published
            </p>
            <p className="mt-1 text-sm text-gray-600">They are live in the upcoming courses list on the website.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button asChild className="bg-[#1a237e] text-white hover:bg-[#10164f]">
                <Link href="/admin">
                  Manage upcoming courses <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button type="button" variant="outline" onClick={resetImport}>
                Import another poster
              </Button>
            </div>
          </div>
        ) : null}

        {status === 'review' ? (
          rows.length === 0 ? (
            <ErrorNotice
              message="No courses were found on this poster. Try a sharper image, or add the courses manually."
              action={
                <Button type="button" size="sm" variant="outline" onClick={resetImport}>
                  Choose another image
                </Button>
              }
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-gray-700">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) =>
                      setRows((current) => current.map((row) => ({ ...row, selected: event.target.checked })))
                    }
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#1a237e]"
                  />
                  Select all
                </label>
                <p className="text-sm text-gray-500">
                  {publishedCount > 0 ? `${publishedCount} already published · ` : null}
                  {rows.length} course{rows.length === 1 ? '' : 's'} to review
                </p>
              </div>

              <div className="space-y-3">
                {rows.map((row) => (
                  <DraftCard
                    key={row.id}
                    row={row}
                    onChange={(updater) => updateRow(row.id, updater)}
                    onRemove={() => setRows((current) => current.filter((entry) => entry.id !== row.id))}
                  />
                ))}
              </div>

              <div className="sticky bottom-4 z-10 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-lg shadow-[#1a237e]/10 backdrop-blur supports-[backdrop-filter]:bg-white/85">
                {saveError ? <p className="mb-2 px-1 text-sm text-red-700" role="alert">{saveError}</p> : null}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="px-1 text-sm text-gray-600">
                    <span className="font-semibold tabular-nums text-gray-900">{selectedRows.length}</span> of{' '}
                    <span className="tabular-nums">{rows.length}</span> selected
                  </p>
                  <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={saving || selectedRows.length === 0}
                    className="bg-[#1a237e] text-white hover:bg-[#10164f]"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Publish {selectedRows.length} course{selectedRows.length === 1 ? '' : 's'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )
        ) : null}
      </div>
    </div>
  );
}

function ManualCourseForm() {
  const toast = useAdminToast();
  const [selectedProgram, setSelectedProgram] = useState('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [courseOutlineStr, setCourseOutlineStr] = useState('');
  const [courseDate, setCourseDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [courseTime, setCourseTime] = useState('');
  const [courseDayLabel, setCourseDayLabel] = useState('');
  const [section, setSection] = useState<CourseSection>('REGULAR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const highlights = splitHighlights(courseOutlineStr);

  const handleProgramSelect = (programTitle: string) => {
    setSelectedProgram(programTitle);
    const program = AVAILABLE_PROGRAMS.find((entry) => entry.title === programTitle);
    if (!program) return;

    setCourseName(program.title);
    setDescription(program.description);
    setCourseOutlineStr(program.features.join(', '));
  };

  const handleDateSelect = (date: Date | undefined) => {
    const previousWeekday = courseDate ? format(courseDate, 'EEEE') : '';
    if (!courseDayLabel || courseDayLabel === previousWeekday) {
      setCourseDayLabel(date ? format(date, 'EEEE') : '');
    }
    setCourseDate(date);
    setCalendarOpen(false);
  };

  const resetForm = () => {
    setSelectedProgram('');
    setCourseName('');
    setDescription('');
    setCourseOutlineStr('');
    setCourseDate(undefined);
    setCourseTime('');
    setCourseDayLabel('');
    setSection('REGULAR');
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!courseName.trim() || !description.trim() || highlights.length === 0 || !courseDate) {
      setError('Fill in the course name, description, at least one highlight, and the start date.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName,
          description,
          courseOutline: highlights,
          courseDate,
          courseTime,
          courseDayLabel,
          section,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      toast.success('Course added', `“${courseName}” is now listed as an upcoming course.`);
      resetForm();
    } catch (submitError) {
      const message = getFriendlyError(submitError, 'Failed to add course. Please try again.');
      setError(message);
      toast.error('Could not add course', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {error ? <ErrorNotice message={error} /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="programSelect" className={labelClass}>
              Start from a program
            </Label>
            <select
              id="programSelect"
              value={selectedProgram}
              onChange={(event) => handleProgramSelect(event.target.value)}
              className={selectClass}
            >
              <option value="">Blank course</option>
              {AVAILABLE_PROGRAMS.map((program) => (
                <option key={program.title} value={program.title}>
                  {program.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">Fills in the name, description and highlights. You can edit them after.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="courseName" className={labelClass}>
              Course name
              <RequiredMark />
            </Label>
            <Input
              id="courseName"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              placeholder="e.g. Leadership Development Program"
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className={labelClass}>
              Description
              <RequiredMark />
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="One or two sentences about the course"
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="courseOutline" className={labelClass}>
              Highlights
              <RequiredMark />
            </Label>
            <Textarea
              id="courseOutline"
              value={courseOutlineStr}
              onChange={(event) => setCourseOutlineStr(event.target.value)}
              rows={2}
              placeholder="e.g. Vocabulary, Pronunciation, Fluency"
              className={fieldClass}
            />
            {highlights.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Highlights preview">
                {highlights.map((highlight, index) => (
                  <li
                    key={`${highlight}-${index}`}
                    className="rounded-full bg-[#eef2ff] px-2.5 py-0.5 text-xs font-medium text-[#1a237e]"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500">Separate highlights with commas.</p>
            )}
          </div>
        </div>

        <fieldset className="space-y-5 rounded-xl border border-gray-200 bg-[#f8faff] p-4 lg:self-start">
          <legend className="sr-only">Schedule</legend>
          <p className="text-sm font-semibold text-[#1a237e]" aria-hidden="true">
            Schedule
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="courseDate" className={labelClass}>
              Start date
              <RequiredMark />
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="courseDate"
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start border-gray-300 bg-white text-left font-normal',
                    !courseDate && 'text-gray-500'
                  )}
                >
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  {courseDate ? format(courseDate, 'EEE, d MMM yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={courseDate} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="courseTime" className={labelClass}>
                Time
              </Label>
              <Input
                id="courseTime"
                value={courseTime}
                onChange={(event) => setCourseTime(event.target.value)}
                placeholder="10:15 AM"
                className={cn(fieldClass, 'bg-white')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="courseDayLabel" className={labelClass}>
                Day
              </Label>
              <Input
                id="courseDayLabel"
                value={courseDayLabel}
                onChange={(event) => setCourseDayLabel(event.target.value)}
                placeholder="Monday"
                className={cn(fieldClass, 'bg-white')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className={labelClass}>Section</span>
            <SectionPicker value={section} onChange={setSection} name="manual-section" />
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={resetForm} disabled={loading} className="text-gray-600">
          Clear form
        </Button>
        <Button type="submit" disabled={loading} className="bg-[#1a237e] text-white hover:bg-[#10164f]">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding course…
            </>
          ) : (
            'Add course'
          )}
        </Button>
      </div>
    </form>
  );
}

const MODES: Array<{ id: Mode; label: string; hint: string; icon: React.ElementType }> = [
  { id: 'import', label: 'Import from poster', hint: 'Read several courses from a schedule image', icon: ScanText },
  { id: 'manual', label: 'Add manually', hint: 'Type in a single course', icon: PenLine },
];

export default function AddCoursesPage() {
  const [mode, setMode] = useState<Mode>('import');

  return (
    <div className="space-y-6">
      <AdminPageHeader
        badge="Upcoming courses"
        title="Add upcoming courses"
        description="Import a month of courses from the schedule poster, or add a single course by hand."
        className="mb-2"
        actions={
          <Button asChild variant="outline" className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#eef2ff]">
            <Link href="/admin">
              Manage published courses <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div role="tablist" aria-label="How to add courses" className="grid gap-2 sm:inline-grid sm:grid-cols-2">
        {MODES.map(({ id, label, hint, icon: Icon }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={active}
              aria-controls={`panel-${id}`}
              onClick={() => setMode(id)}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#1a237e]/25',
                active
                  ? 'border-[#1a237e] bg-white shadow-sm'
                  : 'border-gray-200 bg-white/60 text-gray-600 hover:border-[#1a237e]/30 hover:bg-white'
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                  active ? 'bg-[#1a237e] text-white' : 'bg-[#eef2ff] text-[#1a237e]'
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className={cn('block text-sm font-semibold', active ? 'text-[#1a237e]' : 'text-gray-800')}>
                  {label}
                </span>
                <span className="block text-xs text-gray-500">{hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Both panels stay mounted so switching tabs never discards a half-reviewed import. */}
      <section
        role="tabpanel"
        id="panel-import"
        aria-labelledby="tab-import"
        hidden={mode !== 'import'}
        className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-6"
      >
        <PosterImport />
      </section>
      <section
        role="tabpanel"
        id="panel-manual"
        aria-labelledby="tab-manual"
        hidden={mode !== 'manual'}
        className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm sm:p-6"
      >
        <ManualCourseForm />
      </section>
    </div>
  );
}
