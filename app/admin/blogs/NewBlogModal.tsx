'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select, { SingleValue } from 'react-select';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import Image from 'next/image';
import ComponentLoader from '@/components/ComponentLoader';
import { RichTextEditor } from '@/components/RichTextEditor';

export type BlogDoc = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image?: string;
  tags?: string[];
  published: boolean;
};

export type NewBlogModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  editData?: BlogDoc; // if editing an existing blog
};

const BlogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  slug: Yup.string().required('Slug is required'),
  excerpt: Yup.string().required('Excerpt is required'),
  content: Yup.string().required('Content is required'),
  author: Yup.string().required('Author is required'),
  tags: Yup.string().optional(),
  published: Yup.boolean().required(),
  image: Yup.mixed().nullable(),
});

const statusOptions = [
  { value: true, label: 'Published' },
  { value: false, label: 'Draft' },
];

export default function NewBlogModal({ open, onClose, onCreated, editData }: NewBlogModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close modal with ESC key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.body.classList.add('overflow-hidden');
      window.addEventListener('keydown', onKeyDown);
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFieldValue('image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Create or Update
  type BlogFormValues = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    image?: string;
    tags?: string;
    published: boolean;
  };

  const handleSubmit = async (values: BlogFormValues) => {
    setLoading(true);
    setError('');

    try {
      const tagsArray = values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [];
      const payload = { ...values, tags: tagsArray };

      if (editData?._id) {
        await axios.put('/api/blogs', { id: editData._id, ...payload });
      } else {
        await axios.post('/api/blogs', payload);
      }

      onCreated?.();
      router.refresh();
      onClose();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(message || 'An error occurred while saving the blog');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const handleDelete = async () => {
    if (!editData?._id) return;
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      setLoading(true);
      await axios.delete('/api/blogs', { data: { id: editData._id } });
      onCreated?.();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to delete blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />

          <div className="relative z-[55] flex min-h-full items-center justify-center p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-blog-title"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.9 }}
            >
              {/* Header */}
              <div className="shrink-0 flex items-center justify-between border-b px-6 py-4">
                <h2 id="new-blog-title" className="text-xl font-semibold">
                  {editData ? 'Edit Blog' : 'Create New Blog'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {error && (
                  <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    {error}
                  </div>
                )}

                <Formik
                  initialValues={{
                    title: editData?.title || '',
                    slug: editData?.slug || '',
                    excerpt: editData?.excerpt || '',
                    content: editData?.content || '',
                    author: editData?.author || '',
                    image: editData?.image || '',
                    tags: editData?.tags?.join(', ') || '',
                    published: editData?.published ?? true,
                  }}
                  validationSchema={BlogSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values, setFieldValue }) => (
                    <Form id="blog-form" className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="mb-1 block font-medium text-gray-700">Title</label>
                        <Field
                          name="title"
                          type="text"
                          onBlur={() => {
                            if (!values.slug)
                              setFieldValue('slug', generateSlug(values.title));
                          }}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200"
                        />
                        <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Slug */}
                      <div>
                        <label className="mb-1 block font-medium text-gray-700">Slug</label>
                        <div className="flex gap-2">
                          <Field
                            name="slug"
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFieldValue('slug', generateSlug(values.title))
                            }
                            className="rounded-md bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300"
                          >
                            Generate
                          </button>
                        </div>
                        <ErrorMessage name="slug" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="mb-1 block font-medium text-gray-700">Excerpt</label>
                        <Field
                          as="textarea"
                          name="excerpt"
                          rows={2}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200"
                        />
                        <ErrorMessage name="excerpt" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Content */}
                      <div>
                        <label className="mb-1 block font-medium text-gray-700">Content</label>
                        <div className="rounded-md border border-gray-300">
                          <RichTextEditor
                            value={values.content}
                            onChange={(html: string) => setFieldValue('content', html)}
                            placeholder="Write your post..."
                          />
                        </div>
                        <ErrorMessage name="content" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Author */}
                      <div>
                        <label className="mb-1 block font-medium text-gray-700">Author</label>
                        <Field
                          name="author"
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200"
                        />
                        <ErrorMessage name="author" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Image */}
                      <div>
                        <label className="mb-1 block font-medium text-gray-700">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                          className="w-full text-sm"
                        />
                        {values.image && (
                          <div className="mt-2">
                            <Image src={values.image} alt="preview" width={192} height={128} className="rounded object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="mb-1 block font-medium text-gray-700">
                          Tags (comma separated)
                        </label>
                        <Field
                          name="tags"
                          type="text"
                          placeholder="tag1, tag2, tag3"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className="mb-1 block font-medium text-gray-700">Status</label>
                        <Select
                          options={statusOptions}
                          value={statusOptions.find((o) => o.value === values.published)}
                          onChange={(option: SingleValue<{ value: boolean; label: string }>) => option && setFieldValue('published', option.value)}
                          menuPortalTarget={mounted ? document.body : undefined}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 70 }),
                            menu: (base) => ({ ...base, zIndex: 70 }),
                          }}
                        />
                        <ErrorMessage name="published" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t px-6 py-4 flex justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <div className="flex gap-2">
                  {editData && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={loading}
                      className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  )}

                  <button
                    type="submit"
                    form="blog-form"
                    disabled={loading}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? (
                      <ComponentLoader height="h-5" message={editData ? 'Updating...' : 'Creating...'} />
                    ) : editData ? (
                      'Update Blog'
                    ) : (
                      'Create Blog'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
