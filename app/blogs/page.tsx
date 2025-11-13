'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, Suspense, lazy } from 'react';
import ComponentLoader from '@/components/ComponentLoader';

// Lazy load components
const BlogCard = lazy(() => import('@/components/BlogCard'));
const HeroSection = lazy(() => import('@/components/HeroSection/HeroSection'));

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  image?: string;
  category?: string;
  readTime?: string;
  published: boolean;
  createdAt: string;
}

interface HeroData {
  title?: string;
  disc?: string;
  image?: string;
}

const Page = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Fetch hero section data
  const fetchHeroes = async () => {
    try {
      const res = await fetch('/api/heroblog');
      const data = await res.json();
      if (Array.isArray(data)) setHeroData(data[0]);
      else setHeroData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();

      if (Array.isArray(data)) setBlogs(data);
      else if (Array.isArray(data?.blogs)) setBlogs(data?.blogs);
      else setBlogs([]);
    } catch (err) {
      console.error('Fetch error:', err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
    fetchBlogs();
  }, []);

  // When loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ComponentLoader height="h-64" message="Loading content..." />
      </div>
    );
  }

  // Modal open is currently not wired to BlogCard clicks. Keep state for future expansion.

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* === Hero Section === */}
      <Suspense fallback={<ComponentLoader height="h-64" message="Loading hero section..." />}>
        {heroData ? (
          <HeroSection
            title={heroData.title || 'Blogs'}
            disc={heroData.disc || 'Hello'}
            image={heroData.image || '/vercel.svg'}
            showCtas={false}
          />
        ) : (
          <ComponentLoader height="h-64" message="Loading hero section..." />
        )}
      </Suspense>

      {/* === Blog Section === */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
          {blogs.length > 0 ? (
            blogs?.map((blog) => (
              <BlogCard
                key={blog?._id}
                slug={blog?.slug}
                title={blog?.title}
                imageUrl={blog?.image || '/vercel.svg'}
                category={blog?.category}
                date={new Date(blog?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                readingTime={blog?.readTime || '5 min read'}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">No blogs found</p>
          )}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition duration-300 shadow-sm">
            Load More Articles
          </button>
        </div>
      </section>

      {/* === Blog Modal (optional display) === */}
      {selectedBlog && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">{selectedBlog?.title}</h2>
            <img
              src={selectedBlog?.image}
              alt={selectedBlog?.title}
              className="rounded-lg mb-4 w-full object-cover h-60"
            />
            <div
              className="prose prose-slate max-w-none ck-content"
              dangerouslySetInnerHTML={{ __html: selectedBlog?.content || '' }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
