'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Eye, Loader2, Search, Tag, UserRound } from 'lucide-react';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMediaUrl } from '@/lib/media';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchBlogDetail, fetchBlogs } from '@/redux/thunks/blogThunks';

const fallbackImages = {
  hero: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80',
  blog: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80',
  cta: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80',
};

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const dispatch = useAppDispatch();
  const { blogs, selectedBlog, loading, error } = useAppSelector((state) => state.blog);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchBlogDetail(slug));
    dispatch(fetchBlogs({ limit: 4 }));
  }, [dispatch, slug]);

  const recentBlogs = useMemo(
    () => blogs.filter((blog) => (blog.slug || blog.id) !== slug).slice(0, 3),
    [blogs, slug],
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';

    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!mounted) return null;

  if (loading && !selectedBlog) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-[#ff4b42]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !selectedBlog) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
          <h1 className="text-4xl font-extrabold">Blog not found</h1>
          <p className="max-w-xl text-muted-foreground">{error || 'This blog post is not available right now.'}</p>
          <Button asChild>
            <Link href="/blogs">Back To Blogs</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const publishedDate = selectedBlog.published_at || selectedBlog.createdAt || selectedBlog.created_at;
  const articleImage = getMediaUrl(selectedBlog.featured_image) || fallbackImages.blog;
  const tags = selectedBlog.tags?.length ? selectedBlog.tags : ['Charity', 'Children', 'Education'];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[#161616] px-5 text-center text-white">
        <img src={fallbackImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight">Blog Details</h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-lg font-bold">
            <Link href="/" className="hover:text-[#ff4b42]">Home</Link>
            <span>//</span>
            <Link href="/blogs" className="hover:text-[#ff4b42]">Blog</Link>
            <span>//</span>
            <span>Blog Details</span>
          </div>
        </div>
      </section>

      <main className="flex-1 px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article>
            <img src={articleImage} alt={selectedBlog.title} className="h-[430px] w-full rounded object-cover" />

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#ff4b42]" />
                  {formatDate(publishedDate)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-[#ff4b42]" />
                  {selectedBlog.author || 'Bal Sewa Team'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#ff4b42]" />
                  {selectedBlog.views_count || 0} views
                </span>
              </div>

              <h2 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">{selectedBlog.title}</h2>

              {selectedBlog.excerpt && (
                <p className="mt-6 border-l-4 border-[#ff4b42] pl-5 text-xl font-semibold leading-8 text-muted-foreground">
                  {selectedBlog.excerpt}
                </p>
              )}

              <div className="mt-8 whitespace-pre-line text-lg leading-9 text-muted-foreground">
                {selectedBlog.content}
              </div>
            </div>

            {selectedBlog.extra_images && selectedBlog.extra_images.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {selectedBlog.extra_images.slice(0, 2).map((image) => (
                  <img key={image} src={getMediaUrl(image)} alt="" className="h-56 w-full rounded object-cover" />
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-2 rounded border border-border bg-card px-4 py-2 text-sm font-bold text-muted-foreground">
                  <Tag className="h-3.5 w-3.5 text-[#ff4b42]" />
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <aside className="space-y-9">
            <div>
              <h3 className="border-l-4 border-[#ff4b42] pl-4 text-lg font-extrabold">Search Blogs</h3>
              <div className="mt-6 flex">
                <Input className="h-13 rounded-r-none border-border bg-card" placeholder="Search key word" />
                <button className="grid h-13 w-14 place-items-center rounded-r bg-[#ff4b42] text-white" aria-label="Search blogs">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="border-l-4 border-[#ff4b42] pl-4 text-lg font-extrabold">Recent Stories</h3>
              <div className="mt-6 space-y-4">
                {recentBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug || blog.id}`}
                    className="flex gap-4 rounded border border-border bg-card p-3 transition hover:border-[#ff4b42]/40"
                  >
                    <img src={getMediaUrl(blog.featured_image) || fallbackImages.blog} alt={blog.title} className="h-20 w-20 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-extrabold">{blog.title}</p>
                      <p className="mt-2 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Calendar className="h-3 w-3 text-[#ff4b42]" />
                        {formatDate(blog.published_at || blog.createdAt || blog.created_at)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded bg-[#161616] p-8 text-center text-white">
              <img src={fallbackImages.cta} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
              <div className="relative z-10">
                <p className="text-xl font-extrabold">Help us keep children connected to care and education</p>
                <Button asChild className="mt-6">
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
