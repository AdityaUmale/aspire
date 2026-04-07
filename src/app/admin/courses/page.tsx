'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CheckCircle,
  FileImage,
  GraduationCap,
  Loader2,
  Sparkles,
  Terminal,
  Trash2,
  Upload,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const [manualSuccess, setManualSuccess] = useState<string | null>(null);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [parseLoading, setParseLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccess, setParseSuccess] = useState<string | null>(null);
  const [draftRows, setDraftRows] = useState<DraftImportItem[]>([]);
  const [importMeta, setImportMeta] = useState(emptyImportState);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkSaveError, setBulkSaveError] = useState<string | null>(null);
  const [bulkSaveSuccess, setBulkSaveSuccess] = useState<string | null>(null);

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
    setManualSuccess(null);

    const courseOutline = courseOutlineStr
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!courseName || !description || courseOutline.length === 0 || !courseDate) {
      setManualError('Please fill in all required fields, including the start date.');
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

      setManualSuccess('Course added successfully.');
      resetManualForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add course. Please try again.';
      setManualError(message);
    } finally {
      setManualLoading(false);
    }
  };

  const handlePosterParse = async () => {
    if (!posterFile) {
      setParseError('Choose a poster image before starting extraction.');
      return;
    }

    setParseLoading(true);
    setParseError(null);
    setParseSuccess(null);
    setBulkSaveError(null);
    setBulkSaveSuccess(null);

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

      setDraftRows(payload.items ?? []);
      setImportMeta({
        imageUrl: payload.imageUrl ?? '',
        sourceMonthLabel: payload.sourceMonthLabel ?? '',
        model: payload.model ?? '',
      });
      setParseSuccess(`Extracted ${payload.items?.length ?? 0} draft rows. Review and save the ones you want to publish.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to parse poster.';
      setParseError(message);
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
      setBulkSaveError('Select at least one draft row to save.');
      return;
    }

    setBulkSaving(true);
    setBulkSaveError(null);
    setBulkSaveSuccess(null);

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

      setBulkSaveSuccess(`Saved ${payload.createdCount ?? selectedRows.length} upcoming course cards.`);
      setDraftRows((currentRows) => currentRows.filter((row) => !row.selected));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save selected rows.';
      setBulkSaveError(message);
    } finally {
      setBulkSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
          Upcoming Course Manager
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-[#1a237e] mb-2">Import Or Add Upcoming Courses</h1>
        <p className="text-sm lg:text-base text-gray-600">
          Upload a schedule poster to extract draft cards, review them, and publish only the rows you trust.
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60 space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1a237e]">
              <Sparkles className="h-3.5 w-3.5" />
              OpenAI Vision Import
            </div>
            <h2 className="mt-3 text-xl font-bold text-[#1a237e]">Import From Schedule Image</h2>
            <p className="mt-1 text-sm text-gray-600">
              The image is parsed into editable draft rows. Nothing is published until you save the selected items.
            </p>
          </div>
          {selectedDraftCount > 0 && (
            <Badge className="bg-[#1a237e] text-white hover:bg-[#1a237e]">
              {selectedDraftCount} selected
            </Badge>
          )}
        </div>

        {parseError && (
          <Alert variant="destructive" className="bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Extraction Failed</AlertTitle>
            <AlertDescription>{parseError}</AlertDescription>
          </Alert>
        )}

        {parseSuccess && (
          <Alert className="bg-green-100/50 border-green-300/50 text-green-800 rounded-lg shadow-sm">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Draft Ready</AlertTitle>
            <AlertDescription>{parseSuccess}</AlertDescription>
          </Alert>
        )}

        {bulkSaveError && (
          <Alert variant="destructive" className="bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Save Failed</AlertTitle>
            <AlertDescription>{bulkSaveError}</AlertDescription>
          </Alert>
        )}

        {bulkSaveSuccess && (
          <Alert className="bg-green-100/50 border-green-300/50 text-green-800 rounded-lg shadow-sm">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>{bulkSaveSuccess}</AlertDescription>
          </Alert>
        )}

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

      <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1a237e]">
            <GraduationCap className="h-3.5 w-3.5" />
            Manual Fallback
          </div>
          <h2 className="mt-3 text-xl font-bold text-[#1a237e]">Add One Upcoming Course</h2>
          <p className="mt-1 text-sm text-gray-600">
            Use this form for one-off updates or if a poster row needs to be entered manually.
          </p>
        </div>

        {manualError && (
          <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{manualError}</AlertDescription>
          </Alert>
        )}

        {manualSuccess && (
          <Alert className="mb-6 bg-green-100/50 border-green-300/50 text-green-800 rounded-lg shadow-sm">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{manualSuccess}</AlertDescription>
          </Alert>
        )}

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
