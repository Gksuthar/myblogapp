'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Blog {
  _id?: string;
  title: string;
  image: string;
  disc: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState<Blog>({ title: '', image: '', disc: '' });
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    const res = await axios.get('/api/BlogSection');
    setBlogs(res.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Handle Base64 image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  // ✅ Add Blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image || !form.disc)
      return alert('All fields required!');
    setLoading(true);
    try {
      await axios.post('/api/BlogSection', form);
      setForm({ title: '', image: '', disc: '' });
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert('Error adding blog!');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Blog
  const handleDelete = async (id: string) => {
    await axios.delete('/api/BlogSection', { data: { id } });
    fetchBlogs();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Blogs</h1>

      {/* Add Blog Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-10 space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-3 w-full rounded"
        />
        <textarea
          placeholder="Blog Description"
          value={form.disc}
          onChange={(e) => setForm({ ...form, disc: e.target.value })}
          className="border p-3 w-full rounded"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {form.image && (
          <img src={form.image} alt="Preview" className="w-32 h-32 object-cover border rounded" />
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Add Blog'}
        </button>
      </form>

      {/* Blog Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white shadow-lg rounded-xl overflow-hidden">
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-600">{blog.disc}</p>
              <button
                onClick={() => handleDelete(blog._id!)}
                className="block mt-3 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
