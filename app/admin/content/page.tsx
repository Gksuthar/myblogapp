'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import ComponentLoader from '@/components/ComponentLoader';
import { motion } from 'framer-motion';

interface ContentType {
  _id?: string;
  title: string;
  disc: string;
  image: string; // stored as base64
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  disc: Yup.string().required('Description is required'),
  image: Yup.string().required('Image is required'),
});

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fetch existing single content
  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/content');
      const data = res.data;
      setContent(data[0] || null); // single record mode
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // ✅ Handle submit (POST or PATCH)
  const handleSubmit = async (values: ContentType) => {
    setSubmitting(true);
    try {
      if (content?._id) {
        await axios.patch('/api/content', { ...values, id: content._id });
        alert('Content updated successfully');
      } else {
        await axios.post('/api/content', values);
        alert('Content added successfully');
      }
      fetchContent();
    } catch (err) {
      console.error('Submit Error:', err);
      alert('Failed to save content');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle delete
  const handleDelete = async () => {
    if (!content?._id) return alert('No content to delete');
    if (!confirm('Are you sure you want to delete this content?')) return;
    try {
      await axios.delete('/api/content', { data: { id: content._id } });
      setContent(null);
      alert('Content deleted successfully');
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete content');
    }
  };

  // ✅ Convert image file to Base64
  const convertToBase64 = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result as string);
    reader.onerror = (error) => console.error('Base64 conversion error:', error);
  };

  if (loading) return <ComponentLoader height="h-64" message="Loading content..." />;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Content Management</h1>

      <Formik
        enableReinitialize
        initialValues={{
          title: content?.title || '',
          disc: content?.disc || '',
          image: content?.image || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="bg-white shadow-md rounded-xl p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Field
                name="title"
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <ErrorMessage name="title" component="p" className="text-red-500 text-sm" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Field
                as="textarea"
                name="disc"
                placeholder="Enter description"
                className="w-full border border-gray-300 rounded-lg p-2 h-28"
              />
              <ErrorMessage name="disc" component="p" className="text-red-500 text-sm" />
            </div>

            {/* Image Upload (Base64) */}
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    convertToBase64(file, (base64) => {
                      setFieldValue('image', base64);
                    });
                  }
                }}
                className="w-full border border-gray-300 rounded-lg p-2"
              />

              {/* Base64 Preview */}
              {values.image && (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={values.image}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md object-cover"
                  />
                </div>
              )}
              <ErrorMessage name="image" component="p" className="text-red-500 text-sm" />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {content?._id ? 'Update Content' : 'Add Content'}
              </button>

              {content?._id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      {/* Preview Section */}
      {content && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10 bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-3">Preview</h2>
          <Image
            src={content.image || '/fallback-image.jpg'}
            alt={content.title}
            width={300}
            height={200}
            className="rounded-md mb-4 object-cover"
          />
          <h3 className="text-xl font-semibold">{content.title}</h3>
          <p className="text-gray-600 mt-2">{content.disc}</p>
        </motion.div>
      )}
    </div>
  );
}
