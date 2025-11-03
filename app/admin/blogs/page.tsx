'use client';

import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
import axios from 'axios';
// import { useRouter } from 'next/navigation';
import NewBlogModal from './NewBlogModal';

interface Blog {
  _id: string;
  title: string;
  author: string;
  published: boolean;
  createdAt: string;
  content?: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  // const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/blogs');
      setBlogs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: unknown) {
      // Treat 404 as empty list for a nicer UX
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setBlogs([]);
        setError('');
      } else {
        console.error(err);
        setError('Error fetching blogs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

const handleDelete = async (items: string) => {
  if (!confirm("Are you sure you want to delete this case study?")) return;

  try {
    const response = await axios.delete('/api/blogs', {
      data: { id: items },
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      alert("Deleted successfully");
    }
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete case study");
  }
};

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setOpen(true);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <button
          onClick={() => {
            setEditingBlog(null);
            setOpen(true);
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No blogs found. Create your first blog post!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{blog.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{blog.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        blog.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewBlogModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={fetchBlogs}
        editData={editingBlog}
      />
    </div>
  );
}
