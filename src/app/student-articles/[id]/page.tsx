'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Terminal, User, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';

// Font Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });

interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  writerName?: string;
  isPublished: boolean;
  createdAt?: string; // Assuming there might be a date, if not we can omit
}

export default function StudentArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [article, setArticle] = useState<StudentArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; 

    const fetchArticle = async () => {
      setLoading(true);
      setError(null); 
      try {
        const response = await fetch(`/api/student-article/${id}`); 
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found or not published.');
          } else {
            throw new Error('Failed to fetch student article');
          }
        }
        
        const data = await response.json();

        if (!data.article || !data.article.isPublished) {
             throw new Error('Article not found or not published.');
        }

        setArticle(data.article);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching student article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Loading State - Editorial Skeleton
  if (loading) {
    return (
      <div className={`flex flex-col min-h-screen bg-[#FAFAFA] ${playfair.variable} ${jakarta.variable} font-sans`}>
        <Navbar />
        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
             <Skeleton className="h-4 w-24 mb-6 bg-gray-200" />
             <Skeleton className="h-12 w-full mb-4 bg-gray-200" />
             <Skeleton className="h-12 w-3/4 mb-8 bg-gray-200" />
             <div className="flex items-center gap-4 mb-12 border-y border-gray-100 py-6">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2">
                   <Skeleton className="h-3 w-32 bg-gray-200" />
                   <Skeleton className="h-3 w-24 bg-gray-200" />
                </div>
             </div>
             <div className="space-y-4">
               <Skeleton className="h-4 w-full bg-gray-200" />
               <Skeleton className="h-4 w-full bg-gray-200" />
               <Skeleton className="h-4 w-5/6 bg-gray-200" />
               <Skeleton className="h-4 w-full bg-gray-200 mt-8" />
             </div>
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`flex flex-col min-h-screen bg-[#FAFAFA] ${playfair.variable} ${jakarta.variable} font-sans`}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center max-w-md mx-4">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Terminal className="h-6 w-6" />
             </div>
             <h3 className="font-serif text-xl text-red-900 mb-2">Error Loading Article</h3>
             <p className="text-red-700/80 mb-6">{error}</p>
             <Button onClick={() => router.back()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                Go Back
             </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className={`flex flex-col min-h-screen bg-[#FAFAFA] ${playfair.variable} ${jakarta.variable} font-sans selection:bg-[#1a237e] selection:text-white`}>
      <Navbar />
      
      {/* Global Grain Texture */}
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Progress Bar (Optional nice-to-have visual) */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#1a237e] to-[#3949ab] w-full z-50 origin-left scale-x-0 animate-progress"></div>

      <main className="flex-1 relative pt-32 pb-24">
         {/* Background Ambience */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[100px] opacity-60 pointer-events-none"></div>

         <article className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">
            
            {/* Back Navigation */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="group pl-0 text-gray-500 hover:text-[#1a237e] hover:bg-transparent"
              >
                <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Back to Articles
              </Button>
            </div>

            {/* Header Section */}
            <header className="mb-12">
               {/* Category Tag */}
               <div className="mb-6 inline-block">
                 <span className="px-3 py-1 rounded-full bg-[#e8eaf6] text-[#1a237e] text-xs font-bold tracking-widest uppercase">
                   Student Voice
                 </span>
               </div>

               {/* Title */}
               <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-[#1a237e] leading-[1.15] mb-6">
                 {article.title}
               </h1>

               {/* Subtitle / Description */}
               <p className="text-xl text-gray-500 font-light leading-relaxed mb-8">
                 {article.description}
               </p>

               {/* Author Meta Bar */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-gray-200 gap-6">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-[#f0f1fa] flex items-center justify-center border border-gray-200 text-[#1a237e]">
                        <User className="h-6 w-6" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-[#1a237e]">
                           {article.writerName || 'Anonymous Student'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                           <span>Student Contributor</span>
                           {/* Add date here if available in your schema */}
                           {/* <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                           <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Oct 24, 2023</span> */}
                        </div>
                     </div>
                  </div>
                  
                 
               </div>
            </header>

            {/* Content Body */}
            <div className="prose prose-lg md:prose-xl max-w-none 
              prose-headings:font-serif prose-headings:font-medium prose-headings:text-[#1a237e] 
              prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:font-light
              prose-a:text-[#1a237e] prose-a:no-underline prose-a:border-b prose-a:border-[#1a237e]/30 hover:prose-a:border-[#1a237e]
              prose-blockquote:border-l-[#1a237e] prose-blockquote:bg-[#f8f9fa] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-strong:font-bold prose-strong:text-gray-900
              prose-img:rounded-xl prose-img:shadow-lg
            ">
               <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Footer / End of Article */}
            <div className="mt-20 pt-10 border-t border-gray-200 text-center">
               <div className="inline-flex items-center gap-2 text-gray-400 mb-4">
                  <span className="h-px w-12 bg-gray-200"></span>
                  <span className="text-xs uppercase tracking-widest">End of Article</span>
                  <span className="h-px w-12 bg-gray-200"></span>
               </div>
               <h4 className="font-serif text-2xl text-[#1a237e] mb-6">Enjoyed this read?</h4>
               <Button onClick={() => router.push('/student-articles')} className="bg-[#1a237e] hover:bg-[#0d1642] text-white rounded-full px-8">
                  Read More Stories
               </Button>
            </div>

         </article>
      </main>
    </div>
  );
}