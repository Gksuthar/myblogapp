"use client"

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
        showToast('Testimonial updated');
      } else {
        const res = await fetch('/api/testimonial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Create failed');
        showToast('Testimonial added');
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
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/testimonial', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      showToast('Deleted');
      fetchItems();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    quote: Yup.string().required('Quote is required'),
    // image optional
  });

  const initialValues: FormValues = {
    name: editing?.name || '',
    title: editing?.title || '',
    quote: editing?.quote || '',
    image: editing?.image || null,
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-6">Manage Reviews / Testimonials</h1>

      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, resetForm }) => (
          <Form className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Name</label>
                <Field name="name" className="w-full border p-2 rounded" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Title</label>
                <Field name="title" className="w-full border p-2 rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2">Quote</label>
                <Field as="textarea" name="quote" rows={4} className="w-full border p-2 rounded" />
                <ErrorMessage name="quote" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const f = e.currentTarget.files?.[0];
                    if (f) {
                      setFieldValue('image', f);
                      setPreview(URL.createObjectURL(f));
                    }
                  }}
                  className="w-full"
                />
                {preview && (
                  <div className="mt-3">
                    <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editing ? 'Save Changes' : 'Add Review'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    resetForm();
                    setPreview(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <h2 className="text-2xl font-semibold mb-4">Existing Reviews ({items.length})</h2>
      <div className="bg-white rounded shadow p-4">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600 border-b">
              <th className="py-2">Name</th>
              <th>Title</th>
              <th>Quote</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">No reviews yet</td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{it.name}</td>
                  <td>{it.title}</td>
                  <td className="max-w-xs truncate">{it.quote}</td>
                  <td>
                    {it.image ? <img src={it.image} className="w-20 h-16 object-cover rounded" alt={it.name} /> : <span className="text-gray-400">—</span>}
                  </td>
                  <td>
                    <div className="flex space-x-3">
                      <button onClick={() => handleEdit(it)} className="text-blue-600">Edit</button>
                      <button onClick={() => handleDelete(it._id)} className="text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
