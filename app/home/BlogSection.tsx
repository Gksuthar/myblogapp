'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '@/components/BlogCard';

interface Blog {
  _id?: string;
  title: string;
  image: string;
  disc: string;
}

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/BlogSection');
        setBlogs(res.data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
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
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            title={blog.title}
            imageUrl={blog.image}
          />
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
