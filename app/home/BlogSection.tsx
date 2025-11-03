'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';

interface BlogApiBlog {
  _id: string;
  title: string;
  image?: string;
  excerpt?: string;
  slug: string;
  createdAt?: string;
}

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogApiBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/blogs');
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.blogs) ? res.data.blogs : [];
        setBlogs(data as BlogApiBlog[]);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-12 text-center text-gray-500 bg-gray-100">
        Loading blogs...
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
          Our Latest Accounting and Bookkeeping Blogs
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(blogs || []).slice(0, 6).map((blog) => (
          <BlogCard
            key={blog._id}
            title={blog.title}
            imageUrl={blog.image || '/vercel.svg'}
            slug={blog.slug}
            date={blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined}
          />
        ))}
      </div>

      {/* More Blogs button */}
      {blogs.length > 6 && (
        <div className="flex justify-center mt-10">
          <Link
            href="/blogs"
            className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition shadow-sm"
          >
            More Blogs
          </Link>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
