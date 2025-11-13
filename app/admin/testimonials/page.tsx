"use client"

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image'; // Use next/image for optimized images

// --- Icons ---
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);
const UploadIcon = () => (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
);
const SuccessIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const ErrorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
// ---

interface TestimonialItem {
  _id: string;
  name: string;
  title?: string;
  quote: string;
  image?: string;
}

interface FormValues {
  name: string;
  title: string;
  quote: string;
  image: File | string | null;
}

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function AdminTestimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/testimonial');
      const data = await res.json();
      if (res.ok) setItems(Array.isArray(data) ? data : []);
      else setItems([]);
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    try {
      let payload: any = { name: values.name, title: values.title, quote: values.quote };

      if (values.image instanceof File) {
        payload.image = await toBase64(values.image);
      } else {
        payload.image = values.image; // Keep existing image
      }

      if (editing) {
        payload.id = editing._id;
        const res = await fetch('/api/testimonial', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
        showToast('Testimonial updated successfully');
      } else {
        const res = await fetch('/api/testimonial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Create failed');
        showToast('Testimonial added successfully');
      }

      resetForm();
      setPreview(null);
      setEditing(null);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Something went wrong', 'error');
    }
  };

  const handleEdit = (it: TestimonialItem) => {
    setEditing(it);
    setPreview(it.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see form
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch('/api/testimonial', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      showToast('Deleted successfully');
      fetchItems();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    quote: Yup.string().min(10, 'Quote is too short').required('Quote is required'),
    title: Yup.string().optional(),
    image: Yup.mixed().optional(),
  });

  const initialValues: FormValues = {
    name: editing?.name || '',
    title: editing?.title || '',
    quote: editing?.quote || '',
    image: editing?.image || null,
  };
  
  const clearForm = (resetForm: () => void) => {
    setEditing(null);
    resetForm();
    setPreview(null);
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Manage Reviews / Testimonials</h1>

      {/* --- Improved Form --- */}
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, resetForm, isSubmitting }) => (
          <Form className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editing ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Field
                  id="name"
                  name="name"
                  className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title / Position (Optional)</label>
                <Field
                  id="title"
                  name="title"
                  placeholder="e.g. CEO, Example Inc."
                  className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                <Field
                  id="quote"
                  as="textarea"
                  name="quote"
                  rows={4}
                  className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <ErrorMessage name="quote" component="div" className="text-red-600 text-sm mt-1" />
              </div>
              
              {/* --- Improved File Upload --- */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
                <div className="flex items-center gap-6">
                  <div className="flex-1 mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-gray-50/50">
                    <div className="text-center">
                      <UploadIcon />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 px-2"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const f = e.currentTarget.files?.[0];
                              if (f) {
                                setFieldValue('image', f);
                                setPreview(URL.createObjectURL(f));
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  </div>
                  
                  {/* --- Preview --- */}
                  {preview && (
                    <div className="relative flex-shrink-0">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-full border-2 border-white shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setFieldValue('image', null);
                          (document.getElementById('file-upload') as HTMLInputElement).value = '';
                        }}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 leading-none shadow-md hover:bg-red-700"
                        title="Clear image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (editing ? 'Save Changes' : 'Add Review')}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => clearForm(resetForm)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-150"
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      {/* --- Improved Table --- */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200">
          Existing Reviews ({items.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Quote</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-500">
                    <h3 className="text-lg font-medium">No reviews yet</h3>
                    <p className="text-sm">Add one using the form above.</p>
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {it.image ? (
                            <Image
                              src={it.image}
                              width={48}
                              height={48}
                              className="h-12 w-12 object-cover rounded-full"
                              alt={it.name}
                            />
                          ) : (
                            <span className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg">
                              {it.name[0]}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{it.name}</div>
                          <div className="text-sm text-gray-500">{it.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-md truncate italic">"{it.quote}"</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(it)}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(it._id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Improved Toast --- */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3 z-50
            ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {toast.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
          <span className="font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}