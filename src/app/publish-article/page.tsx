'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FloatingToast } from '@/components/ui/floating-toast';
import {
  Terminal,
  PenTool,
  User,
  Sparkles,
  Send,
  Feather,
  ArrowRight,
  LoaderCircle
} from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import Navbar from '@/components/Navbar';

export default function PublishArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [writerName, setWriterName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim() || !content.trim() || content.replace(/<[^>]*>/g, '').trim().length === 0) {
      setError('Title, Description, and Content are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        title,
        description,
        content,
        writerName,
      };

      const response = await fetch('/api/student-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit article');
      }

      setTitle('');
      setDescription('');
      setWriterName('');
      setContent('');
      setSuccess('Your story has been submitted for review. The next chapter begins!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while submitting the article';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#1a237e] selection:text-white`}>
      <Navbar />
      <FloatingToast
        open={Boolean(success)}
        onClose={() => setSuccess(null)}
        variant="success"
        title="Story submitted for review"
        description={success || ''}
        actionLabel="Explore student stories"
        onAction={() => router.push('/student-articles')}
      />

      {/* Global Grain Texture */}
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <main className="flex-1 relative pt-32 pb-20">
        {/* Ambient Backdrops */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[100px] opacity-60 pointer-events-none"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#3949ab]/5 to-transparent blur-[100px] opacity-40 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">

          {/* ACT I: THE INVITATION (Hero) */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a237e]/10 bg-white shadow-sm mb-4 animate-in fade-in slide-in-from-bottom-3">
              <Feather className="h-3.5 w-3.5 text-[#1a237e]" />
              <span className="text-xs font-bold tracking-widest text-[#1a237e] uppercase">The Student Journal</span>
            </div>

            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-[#1a237e] leading-[1.1] animate-in fade-in slide-in-from-bottom-5">
              Every leader starts with <br />
              <span className="text-[#3949ab]">a story to tell.</span>
            </h1>

            <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6">
              This is your platform to inspire. Whether it&apos;s a lesson on self-growth, a breakthrough in your career, or a perspective that needs to be heard, your words have the power to shape the Aspire community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8">
              <Button
                onClick={() => document.getElementById('writing-canvas')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-12 px-8 rounded-full bg-[#1a237e] text-white hover:bg-[#0d1642] shadow-lg hover:shadow-xl transition-all"
              >
                Start Writing
                <PenTool className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/student-articles')}
                className="h-12 px-8 rounded-full border-gray-200 text-[#1a237e] hover:bg-white hover:text-[#0d1642] hover:border-[#1a237e] transition-all bg-white/50 backdrop-blur-sm"
              >
                Explore Student Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ACT II: THE JOURNEY (Visual Process) */}
          <div className="mb-24 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[#1a237e]/20 to-transparent -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  image: "/assets/3d-icons/spark-3d-v2-transparent.png",
                  title: "The Spark",
                  desc: "You draft an article about self-improvement, growth, or leadership.",
                  glow: "shadow-[0_20px_50px_rgba(59,130,246,0.15)]",
                  border: "hover:border-blue-200/50"
                },
                {
                  image: "/assets/3d-icons/polish-3d-v2-transparent.png",
                  title: "The Polish",
                  desc: "Our editorial team reviews your work to ensure it meets our standards.",
                  glow: "shadow-[0_20px_50px_rgba(99,102,241,0.15)]",
                  border: "hover:border-indigo-200/50"
                },
                {
                  image: "/assets/3d-icons/stage-3d-v2-transparent.png",
                  title: "The Stage",
                  desc: "Your story goes live on the Student Articles page for the world to read.",
                  glow: "shadow-[0_20px_50px_rgba(16,185,129,0.15)]",
                  border: "hover:border-emerald-200/50"
                }
              ].map((step, idx) => (
                <div key={idx} className={`group bg-white/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/60 ${step.glow} transition-all duration-500 text-center relative overflow-hidden active:scale-95 ${step.border}`}>
                  {/* Subtle Background Glow */}
                  <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-10 blur-[80px] transition-all duration-700 group-hover:opacity-20 ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>

                  <div className="relative h-32 w-32 mx-auto mb-8 transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <NextImage
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority={idx === 0}
                    />
                  </div>
                  <h3 className="font-bold text-2xl text-[#1a237e] mb-4 tracking-tight group-hover:text-blue-900 transition-colors uppercase text-[15px] tracking-[0.2em]">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light px-2 group-hover:text-gray-700 transition-colors">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ACT III: THE CANVAS (The Form) */}
          <div id="writing-canvas" className="max-w-4xl mx-auto">
            {/* Notifications */}
            <div className="space-y-4 mb-8">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 rounded-xl shadow-sm animate-in zoom-in-95">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle className="font-bold">Submission Error</AlertTitle>
                  <AlertDescription className="text-red-800/80">{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="bg-transparent relative">
              <form onSubmit={handleSubmit} className="space-y-12">

                {/* SECTION 01: THE AUTHOR */}
                <div className="space-y-3 group/section transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                      01
                    </span>
                    <div>
                      <label htmlFor="writerName" className="block text-sm font-semibold text-gray-800">
                        Author Name <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <p className="text-xs text-gray-400 mt-0.5">How you want to be credited on your published article</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 group-focus-within/section:border-[#1a237e]/40 transition-all duration-300 shadow-sm focus-within:shadow-md">
                    <div className="w-10 h-10 rounded-full bg-[#1a237e]/8 flex items-center justify-center text-[#1a237e] shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <Input
                        id="writerName"
                        value={writerName}
                        onChange={(e) => setWriterName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="border-0 bg-transparent p-0 h-auto text-lg font-medium text-gray-800 placeholder:text-gray-300 focus-visible:ring-0 shadow-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 02: THE TITLE */}
                <div className="space-y-3 group/section transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                      02
                    </span>
                    <div>
                      <label htmlFor="title" className="block text-sm font-semibold text-gray-800">
                        Article Title <span className="text-red-400 text-xs">*</span>
                      </label>
                      <p className="text-xs text-gray-400 mt-0.5">A clear, compelling headline for your story</p>
                    </div>
                  </div>
                  <div className="relative group/input bg-white rounded-2xl border border-gray-200 group-focus-within/section:border-[#1a237e]/40 transition-all duration-300 shadow-sm focus-within:shadow-md px-5 pt-5 pb-4">
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your story a powerful name..."
                      className="border-0 bg-transparent p-0 pb-1 h-auto text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 placeholder:text-gray-300 focus-visible:ring-0 shadow-none -ml-[2px] transition-all"
                      required
                    />
                    <div className="absolute bottom-0 left-5 right-5 h-0.5 w-0 bg-[#1a237e] transition-all duration-700 group-focus-within/input:w-[calc(100%-40px)] opacity-40 rounded-full"></div>
                  </div>
                </div>

                {/* SECTION 03: THE HOOK */}
                <div className="space-y-3 group/section transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                      03
                    </span>
                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
                        Short Description <span className="text-red-400 text-xs">*</span>
                      </label>
                      <p className="text-xs text-gray-400 mt-0.5">1–2 sentences that hook your readers and summarise what your article is about</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 group-focus-within/section:border-[#1a237e]/40 transition-all duration-300 shadow-sm focus-within:shadow-md">
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="One or two sentences to hook your readers..."
                      className="border-0 bg-transparent p-5 min-h-[100px] text-lg font-light text-gray-700 placeholder:text-gray-300 focus-visible:ring-0 shadow-none resize-none leading-relaxed rounded-2xl"
                      required
                    />
                  </div>
                </div>

                {/* SECTION 04: THE CONTENT */}
                <div className="space-y-3 group/section transition-all duration-500 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a237e] text-white text-[11px] font-bold shrink-0">
                        04
                      </span>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800">
                          Article Content <span className="text-red-400 text-xs">*</span>
                        </label>
                        <p className="text-xs text-gray-400 mt-0.5">Write your full article here — use formatting, headings, and images to bring it to life</p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      Rich Text Editor
                    </div>
                  </div>
                  <div className="relative group/editor">
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Let your words flow here..."
                      stickyToolbar
                      toolbarOffsetPx={100}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-4 max-w-sm">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      Your story will be reviewed by our editorial team. Once approved, it will be published to the community.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="h-16 px-12 rounded-full bg-[#1a237e] hover:bg-[#0d1642] text-white text-lg font-bold shadow-[0_10px_30px_rgba(26,35,126,0.3)] hover:shadow-[0_20px_40px_rgba(26,35,126,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        Submit for Review
                        <Send className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
