'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  FileImage,
  GraduationCap,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { AdminPageHeader } from '@/components/admin/page-header';
import { useAdminToast } from '@/components/admin/admin-toast';
import { getFriendlyError } from '@/lib/admin-messages';

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

const emptyImportState = {
  imageUrl: '',
  sourceMonthLabel: '',
  model: '',
};

export default function AddCoursesPage() {
  const toast = useAdminToast();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [courseOutlineStr, setCourseOutlineStr] = useState('');
  const [courseDate, setCourseDate] = useState<Date | undefined>(undefined);
  const [courseTime, setCourseTime] = useState('');
  const [courseDayLabel, setCourseDayLabel] = useState('');
  const [section, setSection] = useState<CourseSection>('REGULAR');

  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [parseLoading, setParseLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [draftRows, setDraftRows] = useState<DraftImportItem[]>([]);
  const [importMeta, setImportMeta] = useState(emptyImportState);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkSaveError, setBulkSaveError] = useState<string | null>(null);

  const selectedDraftCount = useMemo(
    () => draftRows.filter((row) => row.selected).length,
    [draftRows]
  );

  const handleProgramSelect = (programTitle: string) => {
    const program = AVAILABLE_PROGRAMS.find((entry) => entry.title === programTitle);
    if (!program) {
      return;
    }

    setSelectedProgram(programTitle);
    setCourseName(program.title);
    setDescription(program.description);
    setCourseOutlineStr(program.features.join(', '));
  };

  const resetManualForm = () => {
    setSelectedProgram('');
    setCourseName('');
    setDescription('');
    setCourseOutlineStr('');
    setCourseDate(undefined);
    setCourseTime('');
    setCourseDayLabel('');
    setSection('REGULAR');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setManualLoading(true);
    setManualError(null);

    const courseOutline = courseOutlineStr
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!courseName || !description || courseOutline.length === 0 || !courseDate) {
      const message = 'Please fill in all required fields, including the start date and at least one highlight.';
      setManualError(message);
      toast.error('Missing information', message);
      setManualLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          description,
          courseOutline,
          courseDate,
          courseTime,
          courseDayLabel,
          section,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      toast.success('Course added', `“${courseName}” is now listed as an upcoming course.`);
      resetManualForm();
    } catch (error) {
      const message = getFriendlyError(error, 'Failed to add course. Please try again.');
      setManualError(message);
      toast.error('Could not add course', message);
    } finally {
      setManualLoading(false);
    }
  };

  const handlePosterParse = async () => {
    if (!posterFile) {
      const message = 'Choose a poster image before starting extraction.';
      setParseError(message);
      toast.error('No poster selected', message);
      return;
    }

    setParseLoading(true);
    setParseError(null);
    setBulkSaveError(null);

    try {
      const formData = new FormData();
      formData.append('file', posterFile);

      const response = await fetch('/api/course/import/parse', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json()) as ParsePosterResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to parse poster.');
      }

      const count = payload.items?.length ?? 0;
      setDraftRows(payload.items ?? []);
      setImportMeta({
        imageUrl: payload.imageUrl ?? '',
        sourceMonthLabel: payload.sourceMonthLabel ?? '',
        model: payload.model ?? '',
      });
      toast.success(
        'Poster parsed',
        count === 0
          ? 'No course rows were found. Try a clearer image or add a course manually.'
          : `Extracted ${count} draft row${count === 1 ? '' : 's'}. Review and save the ones you want.`
      );
    } catch (error) {
      const message = getFriendlyError(error, 'Failed to parse poster. Try another image or add courses manually.');
      setParseError(message);
      toast.error('Extraction failed', message);
      setDraftRows([]);
      setImportMeta(emptyImportState);
    } finally {
      setParseLoading(false);
    }
  };

  const updateDraftRow = (
    id: string,
    updater: (row: DraftImportItem) => DraftImportItem
  ) => {
    setDraftRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? updater(row) : row))
    );
  };

  const handleBulkSave = async () => {
    const selectedRows = draftRows.filter((row) => row.selected);
    if (selectedRows.length === 0) {
      const message = 'Select at least one draft row to save.';
      setBulkSaveError(message);
      toast.error('Nothing selected', message);
      return;
    }

    setBulkSaving(true);
    setBulkSaveError(null);

    try {
      const response = await fetch('/api/course/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceImageUrl: importMeta.imageUrl,
          sourceMonthLabel: importMeta.sourceMonthLabel,
          courses: selectedRows.map((row) => ({
            courseName: row.courseName,
            description: row.description,
            courseOutline: row.courseOutline,
            courseDate: row.courseDateIso,
            courseTime: row.courseTime,
            courseDayLabel: row.courseDayLabel,
            section: row.section,
            sourceImageUrl: row.sourceImageUrl,
            sourceMonthLabel: row.sourceMonthLabel,
          })),
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        createdCount?: number;
        rowErrors?: Array<{ index: number; errors: string[] }>;
      };

      if (!response.ok) {
        const rowErrorText = Array.isArray(payload.rowErrors)
          ? payload.rowErrors
              .map((row) => `Row ${row.index + 1}: ${row.errors.join(', ')}`)
              .join(' | ')
          : '';
        throw new Error([payload.error, rowErrorText].filter(Boolean).join(' '));
      }

      const saved = payload.createdCount ?? selectedRows.length;
      toast.success(
        'Courses published',
        `Saved ${saved} upcoming course card${saved === 1 ? '' : 's'}.`
      );
      setDraftRows((currentRows) => currentRows.filter((row) => !row.selected));
    } catch (error) {
      const message = getFriendlyError(error, 'Failed to save selected rows.');
      setBulkSaveError(message);
      toast.error('Save failed', message);
    } finally {
      setBulkSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Upcoming courses"
        title="Import or add courses"
        description="Upload a schedule poster to extract draft cards, review them carefully, and publish only the rows you trust."
      />

      <div className="space-y-5 rounded-2xl border border-gray-200/70 bg-white/90 p-4 shadow-sm backdrop-blur-md lg:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1a237e]">
              <Sparkles className="h-3.5 w-3.5" />
              Vision import
            </div>
            <h2 className="mt-3 text-xl font-bold text-[#1a237e]">Import from schedule image</h2>
            <p className="mt-1 text-sm text-gray-600">
              The image is parsed into editable draft rows. Nothing is published until you save selected items.
            </p>
          </div>
          {selectedDraftCount > 0 && (
            <Badge className="bg-[#1a237e] text-white hover:bg-[#1a237e]">
              {selectedDraftCount} selected
            </Badge>
          )}
        </div>

        {parseError ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{parseError}</p>
          </div>
        ) : null}

        {bulkSaveError ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{bulkSaveError}</p>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <Label htmlFor="posterUpload" className="text-[#1a237e] font-medium">Schedule Poster</Label>
            <Input
              id="posterUpload"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setPosterFile(file);
              }}
              className="border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
            />
            <p className="text-xs text-gray-500">
              Supported: JPG, PNG, WEBP, GIF. The uploaded image is stored so the team can trace imported rows later.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-[#1a237e]/20 bg-[#f8faff] p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FileImage className="h-5 w-5 text-[#1a237e]" />
              <div>
                <p className="font-medium text-[#1a237e]">{posterFile?.name || 'No file selected yet'}</p>
                <p>{posterFile ? `${Math.round(posterFile.size / 1024)} KB ready for extraction` : 'Choose a schedule poster to begin.'}</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={handlePosterParse}
              disabled={!posterFile || parseLoading}
              className="mt-4 w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white hover:from-[#0d1642] hover:to-[#1a237e]"
            >
              {parseLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting Rows...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Parse Poster With OpenAI
                </>
              )}
            </Button>
          </div>
        </div>

        {(importMeta.imageUrl || draftRows.length > 0) && (
          <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[#1a237e]">Poster Preview</h3>
                  {importMeta.sourceMonthLabel && (
                    <Badge variant="outline" className="border-[#1a237e]/30 text-[#1a237e]">
                      {importMeta.sourceMonthLabel}
                    </Badge>
                  )}
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-[#f8fafc]">
                  {importMeta.imageUrl ? (
                    <Image
                      src={importMeta.imageUrl}
                      alt="Uploaded schedule poster"
                      width={800}
                      height={1200}
                      className="h-auto w-full object-contain"
                    />
                  ) : (
                    <div className="flex min-h-72 items-center justify-center text-sm text-gray-500">
                      Upload a poster to preview it here.
                    </div>
                  )}
                </div>
                {importMeta.model && (
                  <p className="mt-3 text-xs text-gray-500">Parsed with `{importMeta.model}`</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a237e]">Review Draft Rows</h3>
                    <p className="text-sm text-gray-600">
                      Edit any field, uncheck rows you do not want, or remove bad rows before publishing.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setDraftRows((rows) => rows.map((row) => ({ ...row, selected: true })))
                      }
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setDraftRows((rows) => rows.map((row) => ({ ...row, selected: false })))
                      }
                    >
                      Clear Selection
                    </Button>
                    <Button
                      type="button"
                      onClick={handleBulkSave}
                      disabled={bulkSaving || selectedDraftCount === 0}
                      className="bg-[#1a237e] text-white hover:bg-[#10164f]"
                    >
                      {bulkSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Save Selected Rows
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {draftRows.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-[#fafafa] px-6 py-10 text-center text-sm text-gray-500">
                    Upload and parse a schedule poster to generate editable draft cards here.
                  </div>
                ) : (
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Keep</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Day</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Highlights</TableHead>
                          <TableHead>Signal</TableHead>
                          <TableHead className="w-16">Remove</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {draftRows.map((row) => (
                          <TableRow key={row.id} className="align-top">
                            <TableCell className="align-top">
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={(event) =>
                                  updateDraftRow(row.id, (currentRow) => ({
                                    ...currentRow,
                                    selected: event.target.checked,
                                  }))
                                }
                                className="mt-2 h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]"
                              />
                            </TableCell>
                            <TableCell className="min-w-[230px]">
                              <Input
                                value={row.courseName}
                                onChange={(event) =>
                                  updateDraftRow(row.id, (currentRow) => ({
                                    ...currentRow,
                                    courseName: event.target.value,
                                  }))
                                }
                                className="min-w-[220px]"
                              />
                            </TableCell>
                            <TableCell className="min-w-[170px]">
                              <Input
                                type="date"
                                value={row.courseDateIso}
                                onChange={(event) =>
                                  updateDraftRow(row.id, (currentRow) => ({
                                    ...currentRow,
                                    courseDateIso: event.target.value,
                                    courseDateLabel: event.target.value,
                                  }))
                                }
                              />
                            </TableCell>
                            <TableCell className="min-w-[140px]">
                              <Input
                                value={row.courseTime}
                                onChange={(event) =>
                                  updateDraftRow(row.id, (currentRow) => ({
                                    ...currentRow,
                                    courseTime: event.target.value,
                                  }))
                                }
                                placeholder="10:15AM"
                              />
                            </TableCell>
                            <TableCell className="min-w-[140px]">
                              <Input
                                value={row.courseDayLabel}
                                onChange={(event) =>
                                  updateDraftRow(row.id, (currentRow) => ({
                                    ...currentRow,
                                    courseDayLabel: event.target.value,
                                  }))
                                }
                                placeholder="Monday"
                              />
                            </TableCell>
                            <TableCell className="min-w-[150px]">
                              <select
                                value={row.section}
                                onChange={(event) =>
                                  updateDraftRow(row.id, (currentRow) => ({
                                    ...currentRow,
                                    section: event.target.value as CourseSection,
                                  }))
                                }
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                              >
                                {COURSE_SECTIONS.map((sectionOption) => (
                                  <option key={sectionOption} value={sectionOption}>
                                    {getCourseSectionLabel(sectionOption)}
                                  </option>
                                ))}
                              </select>
                            </TableCell>
                            <TableCell className="min-w-[260px]">
                              <Textarea
                                value={row.description}
                                onChange={(event) =>
                                  updateDraftRow(row.id, (currentRow) => ({
                                    ...currentRow,
                                    description: event.target.value,
                                  }))
                                }
                                rows={4}
                                className="min-w-[240px]"
                              />
                            </TableCell>
                            <TableCell className="min-w-[260px]">
                              <Textarea
                                value={row.courseOutline.join(', ')}
                                onChange={(event) =>
                                  updateDraftRow(row.id, (currentRow) => ({
                                    ...currentRow,
                                    courseOutline: event.target.value
                                      .split(',')
                                      .map((item) => item.trim())
                                      .filter(Boolean),
                                  }))
                                }
                                rows={4}
                                className="min-w-[240px]"
                              />
                            </TableCell>
                            <TableCell className="min-w-[180px]">
                              <div className="space-y-2">
                                <Badge
                                  className={cn(
                                    row.confidence >= 0.8
                                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                      : row.confidence >= 0.5
                                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                                  )}
                                >
                                  Confidence {Math.round(row.confidence * 100)}%
                                </Badge>
                                {row.notes ? (
                                  <p className="whitespace-normal text-xs leading-relaxed text-gray-500">
                                    {row.notes}
                                  </p>
                                ) : (
                                  <p className="whitespace-normal text-xs leading-relaxed text-gray-400">
                                    No parser notes
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setDraftRows((rows) => rows.filter((currentRow) => currentRow.id !== row.id))
                                }
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200/70 bg-white/90 p-4 shadow-sm backdrop-blur-md lg:p-6">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1a237e]">
            <GraduationCap className="h-3.5 w-3.5" />
            Manual entry
          </div>
          <h2 className="mt-3 text-xl font-bold text-[#1a237e]">Add one upcoming course</h2>
          <p className="mt-1 text-sm text-gray-600">
            Use this form for one-off updates or when a poster row needs to be entered by hand.
          </p>
        </div>

        {manualError ? (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{manualError}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
          <div>
            <Label htmlFor="programSelect" className="text-[#1a237e] font-medium">Select from Our Programs (Optional)</Label>
            <p className="text-xs text-gray-500 mb-2">Choose a program to auto-fill the details below</p>
            <select
              id="programSelect"
              value={selectedProgram}
              onChange={(event) => handleProgramSelect(event.target.value)}
              className="w-full px-3 py-2 border border-[#1a237e]/20 rounded-lg focus:border-[#1a237e] focus:ring-[#1a237e]/20 text-sm"
            >
              <option value="">-- Select a program --</option>
              {AVAILABLE_PROGRAMS.map((program) => (
                <option key={program.title} value={program.title}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="courseName" className="text-[#1a237e] font-medium">Course Name</Label>
            <Input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              required
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              placeholder="Enter course name"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#1a237e] font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              rows={4}
              placeholder="Enter course description"
            />
          </div>

          <div>
            <Label htmlFor="courseOutline" className="text-[#1a237e] font-medium">Course Highlights (comma-separated)</Label>
            <Textarea
              id="courseOutline"
              value={courseOutlineStr}
              onChange={(event) => setCourseOutlineStr(event.target.value)}
              required
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              rows={5}
              placeholder="e.g., Vocabulary, Pronunciation, Fluency"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="courseDate" className="text-[#1a237e] font-medium">Course Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mt-1 w-full justify-start text-left font-normal border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20",
                      !courseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {courseDate ? format(courseDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={courseDate}
                    onSelect={setCourseDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="courseTime" className="text-[#1a237e] font-medium">Course Time</Label>
              <Input
                id="courseTime"
                type="text"
                value={courseTime}
                onChange={(event) => setCourseTime(event.target.value)}
                className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
                placeholder="10:15AM"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="courseDayLabel" className="text-[#1a237e] font-medium">Day Label</Label>
              <Input
                id="courseDayLabel"
                type="text"
                value={courseDayLabel}
                onChange={(event) => setCourseDayLabel(event.target.value)}
                className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
                placeholder="Monday"
              />
            </div>

            <div>
              <Label htmlFor="section" className="text-[#1a237e] font-medium">Section</Label>
              <select
                id="section"
                value={section}
                onChange={(event) => setSection(event.target.value as CourseSection)}
                className="mt-1 w-full px-3 py-2 border border-[#1a237e]/20 rounded-lg focus:border-[#1a237e] focus:ring-[#1a237e]/20 text-sm"
              >
                {COURSE_SECTIONS.map((sectionOption) => (
                  <option key={sectionOption} value={sectionOption}>
                    {getCourseSectionLabel(sectionOption)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={manualLoading}
            className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {manualLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding Course...
              </>
            ) : (
              <>
                <GraduationCap className="h-4 w-4" />
                Add Course
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
