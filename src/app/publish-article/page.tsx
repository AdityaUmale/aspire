'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FloatingToast } from '@/components/ui/floating-toast';
import {
  Clock,
  Feather,
  LoaderCircle,
  LogOut,
  Mail,
  Newspaper,
  Send,
  ShieldCheck,
  Terminal,
  User,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import CoverImageField from '@/components/CoverImageField';
import type { RichTextEditorHandle } from '@/components/RichTextEditor';
import { MAX_LENGTHS } from '@/lib/validation';
import { extractPlainText } from '@/lib/article-utils';
import {
  migrateAnonymousDraftToWriter,
  readArticleDraft,
  ANON_DRAFT_KEY,
  useArticleDraft,
} from '@/hooks/useArticleDraft';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] rounded-2xl border-2 border-gray-200 bg-white animate-pulse" />
  ),
});

type WriterSessionResponse = {
  writer: {
    id: string;
    email: string;
  } | null;
  sessionExpiresAt: string | null;
};

const createDraftToken = () =>
  globalThis.crypto?.randomUUID?.() ??
  `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function PublishArticlePage() {
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RichTextEditorHandle | null>(null);
  const autosaveGenRef = useRef(0);
  const autosaveInFlightRef = useRef<Promise<void> | null>(null);
  const serverDraftIdRef = useRef<string | null>(null);
  const submitLockRef = useRef(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [writerId, setWriterId] = useState<string | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [writerName, setWriterName] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [draftToken, setDraftToken] = useState('');
  const [serverDraftId, setServerDraftId] = useState<string | null>(null);
  const [serverDraftStatus, setServerDraftStatus] = useState<
    'DRAFT' | 'PENDING' | 'REJECTED' | null
  >(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [serverDraftSaving, setServerDraftSaving] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { clearDraft } = useArticleDraft({
    writerId,
    title,
    writerName,
    content,
    coverImage,
    draftToken,
    enabled: !isSubmitting && !isCheckingSession && Boolean(draftToken),
  });

  const applyDraft = (draft: {
    title: string;
    writerName?: string;
    content: string;
    coverImage?: string | null;
    draftToken?: string | null;
  } | null) => {
    if (!draft) {
      return;
    }

    const hasContent =
      draft.title ||
      draft.writerName ||
      draft.content.replace(/<[^>]*>/g, '').trim() ||
      /<img\b/i.test(draft.content) ||
      draft.coverImage;

    if (!hasContent) {
      return;
    }

    setTitle(draft.title);
    setWriterName(draft.writerName || '');
    setContent(draft.content);
    setCoverImage(draft.coverImage ?? null);
    if (draft.draftToken) {
      setDraftToken(draft.draftToken);
    }
    setDraftRestored(true);
  };

  const loadServerDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/student-article/draft?id=${id}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      const article = data.article;
      if (!article) {
        return false;
      }

      serverDraftIdRef.current = article.id;
      setServerDraftId(article.id);
      setServerDraftStatus(article.reviewStatus || 'DRAFT');
      applyDraft({
        title: article.title,
        writerName: article.writerName || '',
        content: article.content || '',
        coverImage: article.coverImage ?? null,
        draftToken: article.draftToken ?? null,
      });
      return true;
    } catch {
      return false;
    }
  };

  const loadWriterSession = async () => {
    setIsCheckingSession(true);
    try {
      const draftParam =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('draft')
          : null;

      const response = await fetch('/api/writer-auth/session', {
        cache: 'no-store',
      });

      const data = await response.json() as WriterSessionResponse;

      if (data.writer?.email) {
        setEmail(data.writer.email);
        setVerifiedEmail(data.writer.email);
        setWriterId(data.writer.id);
        setSessionExpiresAt(data.sessionExpiresAt);
        setVerificationMessage('This browser is already verified for article submissions.');

        if (draftParam) {
          const loaded = await loadServerDraft(draftParam);
          if (!loaded) {
            applyDraft(migrateAnonymousDraftToWriter(data.writer.id));
          }
        } else {
          applyDraft(migrateAnonymousDraftToWriter(data.writer.id));
        }
      } else {
        setVerifiedEmail(null);
        setWriterId(null);
        setSessionExpiresAt(null);
        applyDraft(readArticleDraft(ANON_DRAFT_KEY));
      }
    } catch (sessionError) {
      console.error('Failed to load writer session', sessionError);
      applyDraft(readArticleDraft(ANON_DRAFT_KEY));
    } finally {
      setDraftToken((current) => current || createDraftToken());
      setIsCheckingSession(false);
    }
  };

  useEffect(() => {
    void loadWriterSession();
    // Initial session + draft restore only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Server-side draft autosave once the writer is verified
  useEffect(() => {
    if (!verifiedEmail || !draftToken || isSubmitting || isCheckingSession) {
      return;
    }

    const latestContent = editorRef.current?.getHTML() ?? content;
    const hasContent =
      title.trim() ||
      latestContent.replace(/<[^>]*>/g, '').trim() ||
      coverImage;

    if (!hasContent) {
      return;
    }

    // Never invent titles on PENDING/REJECTED autosave
    if (
      serverDraftId &&
      (serverDraftStatus === 'PENDING' || serverDraftStatus === 'REJECTED') &&
      !title.trim()
    ) {
      return;
    }

    const gen = ++autosaveGenRef.current;

    const timer = window.setTimeout(() => {
      if (gen !== autosaveGenRef.current) {
        return;
      }

      setServerDraftSaving(true);
      const previousSave = autosaveInFlightRef.current;
      const saveTask = (async () => {
        if (previousSave) {
          await previousSave;
        }
        if (gen !== autosaveGenRef.current) {
          return;
        }

        const flushed = editorRef.current?.flush() ?? content;
        const activeDraftId = serverDraftIdRef.current || serverDraftId;

        try {
          if (
            activeDraftId &&
            (serverDraftStatus === 'PENDING' || serverDraftStatus === 'REJECTED')
          ) {
            await fetch(`/api/student-article/${activeDraftId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title,
                content: flushed,
                writerName,
                coverImage,
                saveOnly: true,
              }),
            });
          } else {
            const response = await fetch('/api/student-article/draft', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: activeDraftId,
                draftToken,
                title,
                content: flushed,
                writerName,
                coverImage,
              }),
            });
            if (response.ok) {
              const data = await response.json();
              if (data.article?.id) {
                serverDraftIdRef.current = data.article.id;
                setServerDraftId(data.article.id);
                setServerDraftStatus('DRAFT');
              }
            }
          }
        } catch (saveError) {
          console.error('Server draft save failed', saveError);
        }
      })();

      autosaveInFlightRef.current = saveTask;
      void saveTask.finally(() => {
        if (autosaveInFlightRef.current === saveTask) {
          autosaveInFlightRef.current = null;
          setServerDraftSaving(false);
        }
      });
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    verifiedEmail,
    title,
    content,
    coverImage,
    writerName,
    serverDraftId,
    serverDraftStatus,
    draftToken,
    isSubmitting,
    isCheckingSession,
  ]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const handleRequestOtp = async () => {
    setError(null);
    setSuccess(null);
    setVerificationMessage(null);

    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch('/api/writer-auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setOtpRequested(true);
      setVerificationMessage('A 6-digit code is on the way to your inbox.');
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to send verification code'
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setSuccess(null);
    setVerificationMessage(null);

    if (!otpCode.trim()) {
      setError('Enter the 6-digit code we emailed you.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await fetch('/api/writer-auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      setVerifiedEmail(data.writer.email);
      setEmail(data.writer.email);
      setWriterId(data.writer.id);
      setSessionExpiresAt(data.sessionExpiresAt);
      setOtpRequested(false);
      setOtpCode('');
      setVerificationMessage('Email verified. You can submit and track your article now.');
      applyDraft(migrateAnonymousDraftToWriter(data.writer.id));
    } catch (verifyError: unknown) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : 'Failed to verify code'
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleLogoutWriter = async () => {
    setError(null);
    setSuccess(null);
    setVerificationMessage(null);

    try {
      await fetch('/api/writer-auth/logout', {
        method: 'POST',
      });
    } catch (logoutError) {
      console.error('Failed to clear writer session', logoutError);
    }

    setVerifiedEmail(null);
    setWriterId(null);
    setSessionExpiresAt(null);
    setOtpRequested(false);
    setOtpCode('');
    setEmail('');
    setVerificationMessage('Verification cleared. Enter a different email to continue.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) {
      return;
    }
    // Cancel any in-flight / pending autosave so it cannot race create.
    autosaveGenRef.current += 1;
    setError(null);
    setSuccess(null);

    if (!verifiedEmail) {
      setError('Verify your email before submitting an article.');
      return;
    }

    // Flush debounced editor HTML before validation / network.
    const flushedContent = editorRef.current?.flush() ?? content;
    setContent(flushedContent);

    const plainText = extractPlainText(flushedContent);

    if (!title.trim() || title.trim().length > MAX_LENGTHS.title) {
      setError(`Title is required (max ${MAX_LENGTHS.title} characters).`);
      return;
    }

    if (!flushedContent.trim() || !plainText) {
      setError('Article content is required. Add text before submitting.');
      return;
    }

    if (flushedContent.length > MAX_LENGTHS.content) {
      setError(
        `Article content is too long (max ${MAX_LENGTHS.content.toLocaleString()} characters).`
      );
      return;
    }

    if (writerName && writerName.length > MAX_LENGTHS.writerName) {
      setError(
        `Writer name exceeds ${MAX_LENGTHS.writerName} characters.`
      );
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      if (autosaveInFlightRef.current) {
        await autosaveInFlightRef.current;
      }

      const payload = {
        title,
        content: flushedContent,
        writerName,
        coverImage,
        action: 'submit' as const,
      };

      const activeDraftId = serverDraftIdRef.current || serverDraftId;

      // Resubmit existing draft / pending / rejected via PATCH; otherwise create new
      const response = activeDraftId
        ? await fetch(`/api/student-article/${activeDraftId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/student-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setVerifiedEmail(null);
          setWriterId(null);
          setSessionExpiresAt(null);
          setOtpRequested(false);
        }
        throw new Error(data.error || 'Failed to submit article');
      }

      clearDraft();
      setTitle('');
      setWriterName('');
      setContent('');
      setCoverImage(null);
      serverDraftIdRef.current = null;
      setServerDraftId(null);
      setServerDraftStatus(null);
      setDraftRestored(false);
      setDraftToken(createDraftToken());
      setSuccess('Your story has been submitted. You can track its review status anytime.');
      setVerificationMessage('Your verified email is still active for future submissions.');
      router.replace('/publish-article');
    } catch (submitError: unknown) {
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : 'An error occurred while submitting the article';
      setError(errorMessage);
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  const isVerified = Boolean(verifiedEmail);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#1a237e] selection:text-white">
      <Navbar />
      <FloatingToast
        open={Boolean(success)}
        onClose={() => setSuccess(null)}
        variant="success"
        title="Story submitted for review"
        description={success || ''}
        actionLabel="View submission status"
        onAction={() => router.push('/my-articles')}
      />

      <div
        className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 mix-blend-multiply"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />

      <main className="flex-1 relative pt-32 pb-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[100px] opacity-60 pointer-events-none"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#3949ab]/5 to-transparent blur-[100px] opacity-40 pointer-events-none"></div>

        {/* Decorative ink & book background images */}
        <div className="absolute left-20 top-42 w-[480px] h-[480px] opacity-[0.3] pointer-events-none select-none">
          <NextImage src="/assets/student-journal/ink.png" alt="" fill className="object-contain" aria-hidden="true" />
        </div>
        <div className="absolute -right-24 top-40 w-[780px] h-[780px] opacity-[0.3] pointer-events-none select-none rotate-[-14deg]">
          <NextImage src="/assets/student-journal/book.png" alt="" fill className="object-contain" aria-hidden="true" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
          <div className="text-center mb-20 space-y-6 mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#1a237e]/10 bg-white shadow-[0_2px_12px_rgba(26,35,126,0.08)] mb-4 animate-in fade-in slide-in-from-bottom-3">
              <Feather className="h-5 w-5 text-[#1a237e]" />
              <span className="text-sm font-bold tracking-[0.2em] text-[#1a237e] uppercase">The Student Journal</span>
            </div>

            <h1 className="font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl text-[#1a237e] leading-[1.1] animate-in fade-in slide-in-from-bottom-5">
              Every leader starts with <br />
              <span className="text-[#3949ab]">a story to tell.</span>
            </h1>

            <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6">
              Verify your email once, submit with confidence, and keep track of where your article stands in the review process.
            </p>

            <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-7">
              <Button
                size="lg"
                onClick={() => document.getElementById('writing-canvas')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-2xl px-10 h-14 bg-[#1a237e] hover:bg-[#0d1642] text-white text-base font-semibold shadow-[0_10px_30px_rgba(26,35,126,0.25)]"
              >
                Start Writing
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/my-articles')}
                className="rounded-2xl px-10 h-14 border-[#1a237e]/30 text-[#1a237e] hover:bg-white hover:text-[#0d1642] hover:border-[#1a237e]/60 transition-all bg-white/60 backdrop-blur-sm text-base font-medium"
              >
                <Clock className="mr-2 h-4 w-4" />
                View My Article Status
              </Button>
            </div>
          </div>

          <div className="mb-24 relative">
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-[#1a237e]/20 to-transparent -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-16 relative z-10">
              {[
                {
                  image: "/assets/student-journal/verify.png",
                  title: "Verify",
                  desc: "Confirm your email with a one-time code so your submissions and statuses stay tied to you.",
                  glow: "shadow-[0_20px_50px_rgba(59,130,246,0.15)]",
                  border: "hover:border-blue-200/50"
                },
                {
                  image: "/assets/student-journal/review.png",
                  title: "Review",
                  desc: "Our editorial team checks every submission and updates it to pending, published, or rejected.",
                  glow: "shadow-[0_20px_50px_rgba(99,102,241,0.15)]",
                  border: "hover:border-indigo-200/50"
                },
                {
                  image: "/assets/student-journal/track.png",
                  title: "Track",
                  desc: "You can come back anytime from the same browser to see exactly where your article stands.",
                  glow: "shadow-[0_20px_50px_rgba(16,185,129,0.15)]",
                  border: "hover:border-emerald-200/50"
                }
              ].map((step, idx) => (
                <div key={idx} className={`group bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 ${step.glow} transition-all duration-500 relative overflow-hidden active:scale-95 ${step.border} flex items-center gap-5`}>
                  <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-10 blur-[80px] transition-all duration-700 group-hover:opacity-20 ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>

                  <div className="relative h-24 w-24 shrink-0 transition-all duration-700 ease-out group-hover:scale-110">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <NextImage
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority={idx === 0}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#3949ab] tracking-wider">{String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="font-bold text-xl text-[#1a237e] tracking-tight group-hover:text-blue-900 transition-colors">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-light mt-1 group-hover:text-gray-700 transition-colors">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-[1600px]">
          <div id="writing-canvas" className="w-full mx-auto">
            <div className="space-y-4 mb-8">
              {error && (
                <div ref={errorRef}>
                  <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 rounded-2xl shadow-sm animate-in zoom-in-95">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle className="font-bold">Something needs attention</AlertTitle>
                    <AlertDescription className="text-red-800/80">{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              {draftRestored && (
                <Alert className="bg-amber-50 border-amber-100 text-amber-900 rounded-2xl shadow-sm">
                  <Feather className="h-4 w-4" />
                  <AlertTitle className="font-bold">Draft restored</AlertTitle>
                  <AlertDescription className="text-amber-800/80">
                    We recovered your previous writing
                    {serverDraftId ? ' from your account' : ' from this browser'}.
                  </AlertDescription>
                </Alert>
              )}

              {verificationMessage && (
                <Alert className="bg-white border-[#1a237e]/10 text-[#1a237e] rounded-2xl shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle className="font-bold">Writer verification</AlertTitle>
                  <AlertDescription className="text-[#1a237e]/80">
                    {verificationMessage}
                    {sessionExpiresAt && isVerified ? ` Session active until ${new Date(sessionExpiresAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.` : ''}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="bg-transparent relative">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

                  {/* Left Column: Distraction-free Writing Canvas */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-8 shadow-sm">

                    {/* Document Title */}
                    <div className="space-y-1.5">
                      <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-500 mb-2">Craft a clear, engaging title that summarizes your article.</p>
                      <div className="flex items-start gap-3">
                        <div className="relative flex-1">
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a compelling title..."
                            maxLength={MAX_LENGTHS.title}
                            className="w-full h-11 rounded-lg border-gray-300 px-4 text-base shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all pr-16"
                            required
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium tabular-nums">
                            {title.length}/{MAX_LENGTHS.title}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <label className="block text-sm font-semibold text-gray-900">
                            Content <span className="text-red-500">*</span>
                          </label>
                          <p className="text-sm text-gray-500">Write your article content. Use headings, lists, and formatting to make it easy to read.</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-xs text-gray-500 font-medium tabular-nums hidden sm:block">
                            {content.trim().split(/\s+/).filter(Boolean).length} words · {content.replace(/<[^>]*>/g, '').length} characters
                          </div>
                        </div>
                      </div>

                      {/* RichTextEditor Wrapper */}
                      <div className="relative rounded-lg border border-gray-300 shadow-sm overflow-hidden bg-white flex flex-col">
                        <div className="flex-1 min-h-[400px]">
                          <RichTextEditor
                            ref={editorRef}
                            content={content}
                            onChange={setContent}
                            placeholder="Start writing your article here..."
                            stickyToolbar={false}
                            allowInlineImages={false}
                            borderless={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Publishing Controls Sidebar */}
                  <div className="space-y-5 lg:sticky lg:top-28">

                    {/* Card 01: Submission & Action Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                          <Newspaper className="h-4 w-4 text-[#1a237e]" />
                          Publish Article
                        </h3>
                        {/* Auto-save status */}
                        {isVerified && serverDraftId ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
                            {serverDraftSaving ? 'Saving...' : 'Saved'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                            Local Draft
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Button
                          type="submit"
                          className="w-full h-12 rounded-2xl bg-[#1a237e] hover:bg-[#0d1642] text-white text-sm font-bold shadow-[0_4px_16px_rgba(26,35,126,0.15)] hover:shadow-[0_8px_24px_rgba(26,35,126,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                          disabled={isSubmitting || isCheckingSession || !isVerified}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                              Submitting...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              {isVerified ? 'Submit for Review' : 'Verify Email to Publish'}
                              <Send className="h-4 w-4" />
                            </span>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push('/my-articles')}
                          className="w-full h-12 rounded-2xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#1a237e] transition-all text-xs font-semibold"
                        >
                          <Clock className="mr-2 h-3.5 w-3.5" />
                          View My Article Status
                        </Button>
                      </div>

                      <p className="text-[11px] text-gray-400 font-normal leading-relaxed">
                        Every article goes through an editorial check. You can track progress in real-time.
                      </p>
                    </div>

                    {/* Card 02: Verification & Writer Profile */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <User className="h-4 w-4 text-[#1a237e]" />
                        Author Profile
                      </h3>

                      {/* Author Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="writerName" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Author Name <span className="text-gray-300 font-normal lowercase">(optional)</span>
                        </label>
                        <Input
                          id="writerName"
                          value={writerName}
                          onChange={(e) => setWriterName(e.target.value)}
                          placeholder="e.g. Alex Johnson"
                          maxLength={MAX_LENGTHS.writerName}
                          className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-3 text-sm font-medium text-gray-800 focus:border-[#1a237e]/30 focus:bg-white focus:shadow-[0_0_0_2px_rgba(26,35,126,0.04)] transition-all shadow-none"
                        />
                        <div className="text-[9px] text-gray-400 text-right">
                          {writerName.length}/{MAX_LENGTHS.writerName}
                        </div>
                      </div>

                      <div className="h-px bg-gray-100 my-2"></div>

                      {/* Verification Status */}
                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Writer Verification
                        </label>

                        {isVerified ? (
                          <div className="space-y-3">
                            <div className="p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-2xl flex items-start gap-3">
                              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-emerald-950 truncate">Verified Account</p>
                                <p className="text-[10px] text-emerald-700/80 truncate mt-0.5">{verifiedEmail}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={handleLogoutWriter}
                              className="w-full h-9 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <LogOut className="h-3.5 w-3.5 mr-1.5" />
                              Use Different Email
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  id="email"
                                  type="email"
                                  inputMode="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="you@example.com"
                                  readOnly={isVerified || isCheckingSession}
                                  className="h-10 pl-9 rounded-xl border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:border-[#1a237e]/30 focus:shadow-[0_0_0_2px_rgba(26,35,126,0.04)] transition-all shadow-none"
                                  required
                                />
                              </div>

                              <Button
                                type="button"
                                onClick={handleRequestOtp}
                                disabled={isSendingOtp || isCheckingSession}
                                className="w-full h-9 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all"
                              >
                                {isSendingOtp ? (
                                  <LoaderCircle className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                ) : null}
                                {isSendingOtp ? 'Sending...' : 'Send Verification OTP'}
                              </Button>
                            </div>

                            {otpRequested && (
                              <div className="space-y-2 pt-1 animate-in slide-in-from-top-2 duration-300">
                                <Input
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  placeholder="Enter 6-digit OTP"
                                  inputMode="numeric"
                                  autoComplete="one-time-code"
                                  disabled={isVerifyingOtp}
                                  className="h-10 rounded-xl border-gray-200 text-center text-sm font-semibold tracking-[0.2em] placeholder:tracking-normal focus:border-[#1a237e]/30 focus:shadow-[0_0_0_2px_rgba(26,35,126,0.04)]"
                                />
                                <Button
                                  type="button"
                                  onClick={handleVerifyOtp}
                                  disabled={isVerifyingOtp}
                                  className="w-full h-9 rounded-xl bg-[#1a237e] hover:bg-[#0d1642] text-white text-xs font-bold transition-all"
                                >
                                  {isVerifyingOtp ? (
                                    <LoaderCircle className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                  ) : null}
                                  {isVerifyingOtp ? 'Verifying...' : 'Verify OTP Code'}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card 03: Cover Image */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 space-y-3">
                      <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                        Cover Image
                      </h3>
                      <p className="text-[10px] text-gray-400 leading-snug">
                        Used as a thumbnail in article lists and for social card sharing.
                      </p>
                      <div className="pt-1">
                        <CoverImageField
                          value={coverImage}
                          onChange={setCoverImage}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
