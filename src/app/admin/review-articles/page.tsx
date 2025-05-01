'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"; // Import Badge

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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Review Student Articles</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No student articles submitted for review yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{article.title}</CardTitle>
                    <Badge variant={article.isPublished ? "default" : "secondary"} className={article.isPublished ? "bg-green-500" : ""}>
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
                  {/* Link to a specific review page (we'll create this next) */}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => router.push(`/admin/review-articles/${article._id}`)}
                  >
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
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
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