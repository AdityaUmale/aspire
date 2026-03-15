'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  CheckCircle2,
  Globe
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
                  icon: Sparkles,
                  title: "The Spark",
                  desc: "You draft an article about self-improvement, growth, or leadership.",
                  color: "bg-blue-50 text-blue-700"
                },
                {
                  icon: CheckCircle2,
                  title: "The Polish",
                  desc: "Our editorial team reviews your work to ensure it meets our standards.",
                  color: "bg-indigo-50 text-indigo-700"
                },
                {
                  icon: Globe,
                  title: "The Stage",
                  desc: "Your story goes live on the Student Articles page for the world to read.",
                  color: "bg-emerald-50 text-emerald-700"
                }
              ].map((step, idx) => (
                <div key={idx} className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center relative">
                  <div className={`h-14 w-14 mx-auto rounded-full flex items-center justify-center mb-6 ${step.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl font-medium text-[#1a237e] mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
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

            {/* The Form Canvas */}
            <div className="bg-transparent relative">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Writer Name */}
                <div className="flex items-center gap-3 text-lg font-medium text-gray-700 pb-8 border-b border-gray-100/50 mb-8">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="writerName"
                    value={writerName}
                    onChange={(e) => setWriterName(e.target.value)}
                    placeholder="Author Name"
                    className="border-0 bg-transparent p-0 h-auto text-lg font-medium text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 shadow-none w-full max-w-sm"
                  />
                </div>

                {/* Title */}
                <div>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="border-0 bg-transparent p-0 h-auto text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 placeholder:text-gray-200 focus-visible:ring-0 shadow-none -ml-[2px] transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell your story's hook..."
                    className="border-0 bg-transparent p-0 min-h-[60px] text-xl lg:text-2xl font-light text-gray-500 placeholder:text-gray-300 focus-visible:ring-0 shadow-none resize-none leading-relaxed"
                    required
                  />
                </div>

                {/* Editor */}
                <div className="pt-6 relative z-10">
                  <div className="prose prose-lg max-w-none text-gray-800">
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Share your wisdom..."
                      stickyToolbar
                      toolbarOffsetPx={100}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400 font-light max-w-xs">
                    By clicking submit, you agree to allow Aspire Institute to review and publish this content.
                  </p>
                  <Button
                    type="submit"
                    className="h-14 px-10 rounded-full bg-[#1a237e] hover:bg-[#0d1642] text-white text-lg font-medium shadow-lg shadow-[#1a237e]/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Article
                        <Send className="h-4 w-4" />
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
