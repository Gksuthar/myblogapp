'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik'; // Import useFormik
import * as Yup from 'yup'; // Import Yup

type Industry = {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
};

// 1. Define the Validation Schema with Yup
const IndustrySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().optional(),
  tags: Yup.array().of(Yup.string()).optional(),
});

const initialFormValues: Industry = {
  title: '',
  description: '',
  image: '',
  tags: [],
};

export default function AdminIndustriesPage() {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const isEditing = useMemo(() => Boolean(editing?._id), [editing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: unknown) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // store the actual file
    setFieldValue('image', file);

    // store preview (optional)
    const reader = new FileReader();
    reader.onloadend = () => {
      setFieldValue('imagePreview', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/industries');
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      setItems(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load industries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. Setup useFormik hook
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: IndustrySchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('tags', JSON.stringify(values.tags || []));
        if (values.image) {
          formData.append('image', values.image);
        }

        if (isEditing && editing?._id) {
          formData.append('id', editing._id);
          await axios.put('/api/industries', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await axios.post('/api/industries', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }

        setIsOpen(false);
        setEditing(null);
        resetForm();
        await fetchItems();
      } catch (e: any) {
        alert(e?.response?.data?.error || 'Failed to save');
      }
    }
  });

  // 3. Update Modal open/close functions to use formik
  const openCreate = () => {
    setEditing(null);
    formik.resetForm({ values: initialFormValues });
    setIsOpen(true);
  };

  const openEdit = (item: Industry) => {
    setEditing(item);
    formik.resetForm({
      values: {
        title: item.title || '',
        description: item.description || '',
        image: item.image || '',
        tags: item.tags || [],
      },
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    formik.resetForm();
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this industry?')) return;
    try {
      await axios.delete('/api/industries', { data: { id } });
      await fetchItems();
    } catch (e: unknown) {
      const errorMessage =
        e && typeof e === 'object' && 'response' in e
          ? (e as { response?: { data?: { error?: string } } }).response?.data
            ?.error || 'Failed to delete'
          : 'Failed to delete';
      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Industries</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black"
        >
          Add Industry
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            {/* ... table head ... */}
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Title</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it._id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{idx + 1}</td>
                  <td className="px-4 py-2 border-b font-medium">{it.title}</td>
                  <td className="px-4 py-2 border-b text-gray-700 max-w-md truncate">
                    {it.description}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => openEdit(it)}
                        className="px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(it._id)}
                        className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No industries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Update Form JSX to use Formik props */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {isEditing ? 'Edit Industry' : 'Add Industry'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-600 text-sm mt-1">
                    {formik.errors.title}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                  rows={4}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {formik.errors.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image (URL or Base64)
                </label>
                <input
                  name="image"
                  value={formik.values.image || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2 mb-2"
                  placeholder="Paste Base64 or URL"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, formik.setFieldValue)}

                  className="w-full border rounded-md px-3 py-2"
                />
                {!!formik.values.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={formik.values.image}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => formik.setFieldValue('image', '')} // Use setFieldValue
                      className="px-3 py-1 rounded border"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  name="tags"
                  value={(formik.values.tags || []).join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean);
                    formik.setFieldValue('tags', tags); // Use setFieldValue
                  }}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting} // Disable button while submitting
                  className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-black disabled:bg-gray-400"
                >
                  {formik.isSubmitting
                    ? 'Saving...'
                    : isEditing
                      ? 'Update'
                      : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}