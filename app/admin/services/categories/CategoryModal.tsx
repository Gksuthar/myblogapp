'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// ✅ Validation Schema
const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Category name must be at least 3 characters')
    .max(50, 'Too long!')
    .required('Category name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
});

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingCategory?: { _id: string; name: string; description: string } | null;
}

export default function CategoryModal({ isOpen, onClose, onSuccess, editingCategory }: CategoryModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" // Darker overlay, blur effect, and padding for small screens
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close on backdrop click (optional but good UX)
        >
          <motion.div
            className="bg-white w-full max-w-lg rounded-3xl shadow-3xl p-8 relative mx-auto transform transition-all duration-300" // Larger padding, more rounded corners, and a stronger shadow
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6"> {/* Lighter separator */}
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center"> {/* Larger, bolder title */}
                {editingCategory ? '✏️ Edit Category' : '🗂️ Add New Category'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors duration-200 p-2 -mr-2 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" // Nicer close button style
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ✅ Formik Form */}
            <Formik
              initialValues={{ name: editingCategory?.name || '', description: editingCategory?.description || '' }}
              validationSchema={CategorySchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  setLoading(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                  let response;
                  if (editingCategory && editingCategory._id) {
                    // update
                    response = await axios.put('/api/service/categories', { id: editingCategory._id, ...values }, {
                      headers: { 'Content-Type': 'application/json' },
                    });
                  } else {
                    // create
                    response = await axios.post('/api/service/categories', values, {
                      headers: { 'Content-Type': 'application/json' },
                    });
                  }

                  if (response.status === 201 || response.status === 200) {
                    setSuccessMsg(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
                    resetForm();
                    if (onSuccess) onSuccess();
                    setTimeout(() => {
                      setSuccessMsg('');
                      onClose();
                      router.push('/admin/services');
                    }, 800);
                  }
                } catch (error: any) {
                  console.error('Error creating category:', error);
                  setErrorMsg(error.response?.data?.error || 'Failed to save category.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5"> {/* Adjusted spacing */}
                  {/* Category Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2"> {/* Improved label style */}
                      Category Name
                    </label>
                    <Field
                      name="name"
                      id="name"
                      placeholder="e.g., Web Development"
                      className={`w-full p-3 border-2 rounded-xl transition-all duration-200 ${errors.name && touched.name ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                        }`} // Conditional and improved input style
                    />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2"> {/* Improved label style */}
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      placeholder="Describe this category in detail..."
                      className={`w-full p-3 border-2 rounded-xl transition-all duration-200 resize-none ${errors.description && touched.description ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                        }`} // Conditional and improved textarea style
                    />
                    <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>

                  {/* Feedback */}
                  <AnimatePresence mode="wait">
                    {successMsg && (
                      <motion.p
                        key="success"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-green-600 bg-green-50 p-3 rounded-lg text-center font-semibold border border-green-200"
                      >
                        ✅ {successMsg}
                      </motion.p>
                    )}
                    {errorMsg && (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-600 bg-red-50 p-3 rounded-lg text-center font-semibold border border-red-200"
                      >
                        ⚠️ {errorMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 border-t pt-5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" // Enhanced button styling
                    >
                      {loading && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {loading ? 'Saving...' : 'Create Category'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}