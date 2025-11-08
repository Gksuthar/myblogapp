'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ComponentLoader from '@/components/ComponentLoader';

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  image: string;
  tags: string[];
  slug: string;
  published: boolean;
  createdAt: string;
}

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        // First try the main blogs API
        const res = await fetch(`/api/blogs?slug=${slug}`);
        
        if (!res.ok) {
          throw new Error('Blog not found');
        }
        
        const data: Blog = await res.json();
        setBlog(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <ComponentLoader height="h-64" message="Loading blog..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
        <p className="mb-6 text-gray-600">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4">{blog?.title}</h1>
        <p className="text-gray-600 mb-6">{blog?.excerpt}</p>
        {blog?.image && (
          <div className="w-full h-64 md:h-96 relative mb-6 rounded-xl overflow-hidden">
            <Image src={blog?.image} alt={blog?.title} fill className="object-cover" />
          </div>
        )}
        <div
          className="prose prose-lg max-w-none ck-content"
          dangerouslySetInnerHTML={{ __html: blog?.content || '' }}
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {blog?.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/blogs"
            className=" !bg-[var(--primary-color)] inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    </main>
  );
}
