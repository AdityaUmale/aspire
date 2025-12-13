'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Terminal, ChevronLeft, Share2, Feather, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';

// Font Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });

interface Article {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt?: string; // Optional: handy if your API returns a date
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/article?id=${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found');
          } else {
            throw new Error('Failed to fetch article');
          }
        }
        
        const data = await response.json();
        setArticle(data.article);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Loading State - Editorial Wireframe
  if (loading) {
    return (
      <div className={`flex flex-col min-h-screen bg-[#FAFAFA] ${playfair.variable} ${jakarta.variable} font-sans`}>
        <Navbar />
        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
             <Skeleton className="h-4 w-32 mb-8 bg-gray-200" /> {/* Breadcrumb/Tag */}
             <Skeleton className="h-16 w-full mb-4 bg-gray-200" /> {/* Title Line 1 */}
             <Skeleton className="h-16 w-3/4 mb-8 bg-gray-200" /> {/* Title Line 2 */}
             
             {/* Author Block Skeleton */}
             <div className="flex items-center gap-4 mb-12 border-y border-gray-100 py-6">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="space-y-2">
                   <Skeleton className="h-3 w-40 bg-gray-200" />
                   <Skeleton className="h-3 w-24 bg-gray-200" />
                </div>
             </div>
             
             {/* Content Skeleton */}
             <div className="space-y-4">
               <Skeleton className="h-4 w-full bg-gray-200" />
               <Skeleton className="h-4 w-full bg-gray-200" />
               <Skeleton className="h-4 w-5/6 bg-gray-200" />
               <Skeleton className="h-4 w-full bg-gray-200 mt-8" />
               <Skeleton className="h-4 w-full bg-gray-200" />
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
             <h3 className="font-serif text-xl text-red-900 mb-2">System Error</h3>
             <p className="text-red-700/80 mb-6">{error}</p>
             <Button onClick={() => router.back()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                Return Previous Page
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

      <main className="flex-1 relative pt-32 pb-24">
         {/* Background Ambience */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[100px] opacity-60 pointer-events-none"></div>

         <article className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">
            
            {/* Navigation */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="group pl-0 text-gray-500 hover:text-[#1a237e] hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Back to Perspectives
              </Button>
            </div>

            {/* Article Header */}
            <header className="mb-12">
               {/* Tag */}
               <div className="mb-6 inline-flex items-center gap-2">
                 <span className="h-px w-8 bg-[#1a237e]/30"></span>
                 <span className="text-xs font-bold tracking-[0.2em] text-[#1a237e] uppercase">
                   Founder's Insight
                 </span>
               </div>

               {/* Title */}
               <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-[#1a237e] leading-[1.1] mb-8">
                 {article.title}
               </h1>

               {/* Lead / Description */}
               <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed italic mb-10 border-l-4 border-[#1a237e]/20 pl-6">
                 {article.description}
               </p>

               {/* Author Bar */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-gray-200 gap-6">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-[#1a237e] flex items-center justify-center text-white shadow-lg shadow-[#1a237e]/20">
                        <Feather className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-[#1a237e] tracking-wide">
                           {article.author?.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                           <span>Author & Founder</span>
                        </div>
                     </div>
                  </div>
                  
                  
               </div>
            </header>

            {/* Content Body - Themed Typography */}
            <div className="prose prose-lg md:prose-xl max-w-none 
              prose-headings:font-serif prose-headings:font-medium prose-headings:text-[#1a237e] 
              prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:font-light
              prose-a:text-[#1a237e] prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-[#1a237e]/30 hover:prose-a:border-[#1a237e]
              prose-blockquote:border-l-[#1a237e] prose-blockquote:bg-[#f8f9fa] prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:font-serif prose-blockquote:text-gray-700
              prose-strong:font-bold prose-strong:text-[#1a237e]
              prose-li:text-gray-700 prose-li:marker:text-[#1a237e]
              prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-gray-100
            ">
               <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Article Footer */}
            <div className="mt-24 pt-10 border-t border-gray-200 text-center">
               <div className="inline-flex items-center justify-center p-3 bg-[#f8f9fa] rounded-full mb-6">
                  <Feather className="h-6 w-6 text-[#1a237e] opacity-50" />
               </div>
               <h4 className="font-serif text-2xl text-[#1a237e] mb-2">Thank you for reading</h4>
               <p className="text-gray-500 font-light mb-8">Continue exploring more insights from the institute.</p>
               
               <Button onClick={() => router.push('/articles')} variant="outline" className="border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e] hover:text-white rounded-full px-8 h-12">
                  Browse All Perspectives
               </Button>
            </div>

         </article>
      </main>
    </div>
  );
}