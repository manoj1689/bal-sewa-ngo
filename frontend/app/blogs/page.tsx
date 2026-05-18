'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchBlogs } from '@/redux/thunks/blogThunks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, ArrowRight, Calendar } from 'lucide-react';

export default function BlogsPage() {
  const dispatch = useAppDispatch();
  const { blogs, loading } = useAppSelector((state) => state.blog);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (!mounted) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Latest Stories</h1>
            <p className="text-lg text-muted-foreground">
              Read inspiring stories and updates from our organization
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No blog posts available at the moment</p>
            </div>
          ) : (
            <div className="space-y-6">
              {blogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {blog.featured_image && (
                      <div className="h-48 md:h-auto bg-muted rounded-lg overflow-hidden">
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={blog.featured_image ? 'md:col-span-2' : 'col-span-full'}>
                      <CardHeader className="p-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {blog.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(blog.published_at || blog.created_at)}
                          </div>
                        </div>
                        <CardTitle className="text-xl line-clamp-2">{blog.title}</CardTitle>
                        <CardDescription className="text-sm">By {blog.author}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 mt-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">{blog.content}</p>
                        <Link href={`/blogs/${blog.id}`}>
                          <Button variant="ghost" className="mt-4 gap-2 px-0">
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
