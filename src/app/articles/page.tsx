'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from '@/components/Navbar';
import { BookText, ArrowRight } from 'lucide-react'; // Added ArrowRight icon

interface Article {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 9, pages: 0 }); // Changed limit to 9 for better grid layout

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      // Use the updated limit in the API call
      const response = await fetch(`/api/article?page=${page}&limit=${pagination.limit}`); 
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const data = await response.json();
      setArticles(data.articles);
      // Ensure pagination state reflects the limit used
      setPagination({ ...data.pagination, limit: pagination.limit }); 
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch articles using the initial limit
    fetchArticles(1); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependency array includes pagination.limit if it can change elsewhere

  const handlePageChange = (newPage: number) => {
    fetchArticles(newPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e8eaf6] to-[#c5cae9]">
      <Navbar />
      {/* Refined background elements */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] mix-blend-soft-light -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-gradient-radial from-[#1a237e]/10 to-transparent blur-3xl -z-10"></div>
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gradient-radial from-[#9fa8da]/15 to-transparent blur-3xl -z-10"></div>

      <main className="flex-1 pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24"> {/* Increased padding */} 
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12"> {/* Increased margin */} 
            <BookText className="h-8 w-8 text-[#1a237e]" />
            <h1 className="text-4xl md:text-5xl font-bold text-center text-[#1a237e]">Explore Articles</h1> {/* Slightly larger title */} 
          </div>
          
          {error && (
            <div className="mb-8 p-4 bg-red-100/50 border border-red-300/50 text-red-800 rounded-lg shadow-sm text-center"> {/* Adjusted error style */} 
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"> {/* Increased gap */} 
              {[...Array(pagination.limit)].map((_, index) => ( // Use limit for skeletons
                <Card key={index} className="overflow-hidden bg-white/70 backdrop-blur-sm border border-gray-200/40 rounded-xl shadow-md">
                  <CardHeader className="pb-4">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-gray-300/60 rounded" />
                    <Skeleton className="h-4 w-1/2 bg-gray-300/60 rounded" />
                  </CardHeader>
                  <CardContent className="pb-4">
                    <Skeleton className="h-4 w-full mb-2 bg-gray-300/60 rounded" />
                    <Skeleton className="h-4 w-full mb-2 bg-gray-300/60 rounded" />
                    <Skeleton className="h-4 w-5/6 bg-gray-300/60 rounded" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full bg-gray-300/60 rounded-lg" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No articles found.</p> {/* Slightly larger text */} 
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"> {/* Increased gap */} 
                {articles.map((article) => (
                  // Fancier Article Card
                  <Card 
                    key={article._id} 
                    className="group overflow-hidden bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                  >
                    <CardHeader className="pb-3 border-b border-gray-200/70">
                      <CardTitle className="text-[#1a237e] text-xl font-semibold group-hover:text-[#0d1642] transition-colors duration-300 line-clamp-2">{article.title}</CardTitle>
                      
                    </CardHeader>
                    <CardContent className="flex-grow pt-4 pb-4">
                      <p className="text-gray-700 line-clamp-4 text-sm leading-relaxed">{article.description}</p> {/* Increased line clamp */} 
                    </CardContent>
                    <CardFooter className="mt-auto pt-4">
                      {/* Fancier Button */}
                      <Button 
                        variant="default" // Changed to default for gradient
                        className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white transition-all duration-300 rounded-lg py-2.5 group-hover:shadow-lg flex items-center justify-center gap-2" // Added gradient and hover shadow
                        onClick={() => router.push(`/articles/${article._id}`)}
                      >
                        Read More <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Fancier Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-3"> {/* Increased margin, spacing */} 
                  <Button 
                    variant="outline" 
                    size="icon" // Icon button
                    className="border-[#1a237e]/60 text-[#1a237e] hover:bg-[#e8eaf6]/70 disabled:opacity-40 rounded-full h-9 w-9" // Rounded full
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <span className="sr-only">Previous</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  
                  <Button 
                    variant="outline" 
                    size="icon" // Icon button
                    className="border-[#1a237e]/60 text-[#1a237e] hover:bg-[#e8eaf6]/70 disabled:opacity-40 rounded-full h-9 w-9" // Rounded full
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <span className="sr-only">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
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