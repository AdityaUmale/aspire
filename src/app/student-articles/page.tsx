'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from '@/components/Navbar';
import { 
  GraduationCap,
  ArrowRight,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  PenTool
} from 'lucide-react';

interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  author: {
    name: string;
  };
  writerName: string;
  isPublished: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function StudentArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<StudentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 9, pages: 0 }); 

  const fetchPublishedStudentArticles = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/student-article?published=true&page=${page}&limit=${pagination.limit}`); 
      
      if (!response.ok) {
        throw new Error('Failed to fetch published student articles');
      }
      
      const data = await response.json();
      setArticles(data.articles);
      setPagination({ ...data.pagination, limit: pagination.limit }); 
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching articles');
      console.error('Error fetching published student articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedStudentArticles(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPublishedStudentArticles(newPage);
  };

  const handleReadMore = (id: string) => {
    router.push(`/student-articles/${id}`);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#1a237e] selection:text-white`}>
      <Navbar />

      {/* Global Grain Texture */}
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none z-50 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <main className="flex-1 relative pt-32 pb-20 lg:pt-40 lg:pb-24">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#1a237e]/5 to-transparent blur-[100px] opacity-60 pointer-events-none"></div>
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#3949ab]/5 to-transparent blur-[100px] opacity-40 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center mb-20 max-w-4xl mx-auto">
             <div className="inline-flex items-center gap-2 mb-6 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                <span className="h-px w-8 bg-[#1a237e]/30"></span>
                <span className="text-xs font-bold tracking-[0.2em] text-[#1a237e] uppercase">The Student Journal</span>
                <span className="h-px w-8 bg-[#1a237e]/30"></span>
             </div>

<h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-[#1a237e] mb-8 tracking-tight leading-[1.1] animate-in slide-in-from-bottom-6 duration-700 delay-100 fade-in">
                Voices of the <br/>
                <span className="italic text-[#3949ab]">Future Leaders.</span>
              </h1>
             
             <p className="text-xl text-gray-600 leading-relaxed font-light animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in max-w-2xl mx-auto">
               Exploring ideas, sharing knowledge, and shaping perspectives through the written word.
             </p>
          </div>
          
          {/* Error State */}
          {error && (
            <div className="mb-12 p-6 bg-red-50 border border-red-100 text-red-900 rounded-2xl shadow-sm text-center max-w-2xl mx-auto animate-in zoom-in-95">
              <p className="font-bold text-lg">Unable to load articles</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          )}
          
          {/* Content Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(pagination.limit)].map((_, index) => (
                <div key={index} className="bg-white p-8 rounded-[1.5rem] border border-gray-100 h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-4 w-20 bg-gray-100" />
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-100" />
                  </div>
                  <Skeleton className="h-8 w-3/4 mb-4 bg-gray-100" />
                  <Skeleton className="h-8 w-1/2 mb-8 bg-gray-100" />
                  <div className="space-y-3 mt-auto">
                    <Skeleton className="h-4 w-full bg-gray-100" />
                    <Skeleton className="h-4 w-full bg-gray-100" />
                    <Skeleton className="h-4 w-2/3 bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-center">
              <div className="p-6 bg-[#f8f9fa] rounded-full mb-6">
                <PenTool className="h-8 w-8 text-[#1a237e] opacity-50" />
              </div>
              <h3 className="font-bold text-2xl text-[#1a237e] mb-2">No Articles Yet</h3>
              <p className="text-gray-500 font-light">Be the first to share your insights with the community.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {articles.map((article, idx) => (
                  <div 
                    key={article._id} 
                    className="group flex flex-col bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(26,35,126,0.15)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Top Accent - Reveals on Hover */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a237e] to-[#3949ab] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Metadata Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f9fa] text-[#1a237e] text-[10px] font-bold tracking-widest uppercase">
                        <BookOpen className="h-3 w-3" />
                        Article
                      </div>
                      <div className="text-gray-300 group-hover:text-[#1a237e] transition-colors duration-300">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-2xl font-medium text-[#1a237e] mb-3 leading-tight group-hover:text-[#3949ab] transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Author Byline */}
                    <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 font-medium border-b border-gray-50 pb-4">
                      <div className="p-1 bg-[#f0f1fa] rounded-full">
                        <User className="h-3 w-3 text-[#1a237e]" />
                      </div>
                      <span>By <span className="text-[#1a237e]">{article.writerName || 'Student Contributor'}</span></span>
                    </div>

                    {/* Abstract / Description */}
                    <p className="text-gray-600 font-light text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">
                      {article.description}
                    </p>

                    {/* Footer Action */}
                    <div className="mt-auto">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between hover:bg-[#f8f9fa] text-[#1a237e] hover:text-[#0d1642] group/btn p-0 h-auto font-medium"
                        onClick={() => handleReadMore(article._id)}
                      >
                        <span className="text-sm">Read Full Article</span>
                        <div className="h-8 w-8 rounded-full bg-[#f8f9fa] flex items-center justify-center group-hover/btn:bg-[#1a237e] group-hover/btn:text-white transition-all duration-300">
                           <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Refined Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center mt-20 gap-6">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-full border-gray-200 text-[#1a237e] hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] transition-all disabled:opacity-30"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-[#1a237e]">Page {pagination.page}</span>
                    <span className="text-xs text-gray-400">of {pagination.pages}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-full border-gray-200 text-[#1a237e] hover:bg-[#1a237e] hover:text-white hover:border-[#1a237e] transition-all disabled:opacity-30"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}