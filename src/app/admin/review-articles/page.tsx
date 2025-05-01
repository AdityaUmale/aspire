'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileText, BookOpen } from 'lucide-react';

// Interface matching the StudentArticle model
interface StudentArticle {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  isPublished: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ReviewArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<StudentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 });

  // Fetch articles from the student-article API endpoint
  const fetchStudentArticles = async (page = 1) => {
    setLoading(true);
    try {
      // Fetching ALL articles (published and unpublished) for review
      const response = await fetch(`/api/student-article?page=${page}&limit=10`); 
      
      if (!response.ok) {
        throw new Error('Failed to fetch student articles');
      }
      
      const data = await response.json();
      setArticles(data.articles);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching articles');
      console.error('Error fetching student articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentArticles();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchStudentArticles(newPage);
  };

  return (
    <div>
      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        Student Submissions
      </div>
      
      <h1 className="text-3xl font-bold text-[#1a237e] mb-6">Review Student Articles</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-md">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-md">
          <FileText className="h-12 w-12 text-[#1a237e]/40 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No student articles submitted for review yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-[#1a237e]">{article.title}</CardTitle>
                    <Badge 
                      variant={article.isPublished ? "default" : "secondary"} 
                      className={article.isPublished ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" : "bg-gradient-to-r from-[#1a237e]/70 to-[#3949ab]/70 hover:from-[#1a237e] hover:to-[#3949ab]"}
                    >
                      {article.isPublished ? 'Published' : 'Pending'}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    By {article.author?.name || 'Unknown Author'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e] transition-all duration-300 flex items-center justify-center gap-2" 
                    onClick={() => router.push(`/admin/review-articles/${article._id}`)}
                  >
                    <BookOpen className="h-4 w-4" />
                    Review Article
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button 
                variant="outline" 
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"
              >
                Previous
              </Button>
              {[...Array(pagination.pages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={pagination.page === pageNumber ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNumber)}
                    className={pagination.page === pageNumber ? 
                      "bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white" : 
                      "border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="border-[#1a237e]/20 text-[#1a237e] hover:bg-[#1a237e]/10 hover:text-[#1a237e]"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}