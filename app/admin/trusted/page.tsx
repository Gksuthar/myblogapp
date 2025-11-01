'use client'
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

// --- Interfaces ---

interface TrustedCompany {
  _id: string;
  name: string;
  image: string; // Base64 string or URL
}

interface FormValues {
  name: string;
  image: File | string | null;
}

interface ToastProps {
  message: string | null;
  type: 'success' | 'error';
  onClose: () => void;
}

// --- Custom Toast Component (Replaces alert/confirm) ---
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white transition-opacity duration-300 z-50";
  const typeClasses = type === 'error' ? 'bg-red-600' : 'bg-green-600';

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
      <button onClick={onClose} className="ml-4 font-bold">×</button>
    </div>
  );
};

// --- Validation Schema ---

// Factory function to create schema based on editing state
const createValidationSchema = (editingCompany: TrustedCompany | null) =>
  Yup.object<FormValues>().shape({
    name: Yup.string().required('Company name is required'),
    image: Yup.mixed()
      .test(
        'fileRequired',
        'Image is required',
        // Checks if it's a file (for new upload) or an existing base64 string (for editing)
        (value) => {
          if (!value) {
            return false;
          }
          if (editingCompany && typeof value === 'string') {
            return true; // Existing base64 image is fine during edit
          }
          return value instanceof File; // Must be a new file otherwise
        }
      ),
  });

export default function TrustedCompanies() {
  const [companies, setCompanies] = useState<any>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<TrustedCompany | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Convert file to Base64
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      // NOTE: API route is now fixed to return a list of companies
      const res = await fetch('/api/tructedCompany');
      const data = await res.json();

      if (res.ok) {
        setCompanies(data);
      } else if (res.status === 404) {
        setCompanies([]);
      } else {
        console.error("API Error:", data.error);
        showToast('Failed to load companies: ' + data.error, 'error');
        setCompanies([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Network error while fetching companies.', 'error');
      setCompanies([]);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      const isFile = values.image instanceof File;
      // FIX: Assert 'values.image' as 'File' in the 'true' branch to satisfy the toBase64 function's type requirement.
      const base64Image = isFile ? await toBase64(values.image as File) : values.image as string || '';

      const payload = {
        name: values.name,
        image: base64Image,
      };

      const url = '/api/tructedCompany';
      // Use PATCH for updates to only modify provided fields
      const method = editingCompany ? 'PATCH' : 'POST';
      const body = editingCompany ? JSON.stringify({ id: editingCompany._id, ...payload }) : JSON.stringify(payload);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Unknown error');

      showToast(editingCompany ? 'Company updated successfully!' : 'Company added successfully!');

      resetForm();
      setImagePreview(null);
      setEditingCompany(null);
      fetchCompanies();
    } catch (err: any) {
      console.error(err);
      showToast('Failed to add/update company: ' + err.message, 'error');
    }
  };

  const handleEdit = (company: TrustedCompany) => {
    setEditingCompany(company);
    setImagePreview(company.image);
  };

  const handleDelete = async (id: string) => {
    // NOTE: Removed confirm() - in a real app, this would be a custom modal.
    showToast('Deleting company... (No confirmation needed in this environment)', 'success');

    try {
      const res = await fetch('/api/tructedCompany', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Delete failed');

      showToast(result.message);
      fetchCompanies();
    } catch (err: any) {
      console.error(err);
      showToast('Failed to delete company: ' + err.message, 'error');
    }
  };

  const initialValues: FormValues = {
    name: editingCompany?.name || '',
    // If editing, image is the base64 string; otherwise, it's null for file input
    image: editingCompany?.image || null,
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded-xl shadow-2xl font-['Inter']">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        {editingCompany ? 'Edit Trusted Company' : 'Add New Trusted Company'}
      </h1>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={() => createValidationSchema(editingCompany)} // Pass state to schema creator
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, resetForm }) => (
          <Form className="space-y-6 p-6 bg-white rounded-lg shadow-inner">
            <div>
              <label htmlFor="name" className="block font-semibold mb-2 text-gray-700">Company Name</label>
              <Field
                id="name"
                type="text"
                name="name"
                placeholder="Enter company name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="imageFile" className="block font-semibold mb-2 text-gray-700">Image/Logo</label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    setFieldValue('image', file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150"
              />
              <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
              {(imagePreview || editingCompany?.image) && (
                <div className="mt-4 flex items-center space-x-4">
                  <img
                    src={imagePreview || editingCompany?.image}
                    alt="Preview"
                    className="w-24 h-24 object-contain p-2 border border-gray-200 rounded-lg bg-gray-100"
                  />
                  <span className="text-sm text-gray-500">
                    {imagePreview ? 'New Preview' : 'Current Image'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-4 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 transform hover:scale-[1.01]"
              >
                {editingCompany ? 'Save Changes' : 'Add Company'}
              </button>
              {editingCompany && (
                <button
                  type="button"
                  className="flex-1 bg-gray-400 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-gray-500 transition duration-200"
                  onClick={() => {
                    setEditingCompany(null);
                    resetForm();
                    setImagePreview(null);
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      {/* Table */}
      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-800 border-b pb-2">Existing Trusted Companies ({companies?.length ?? '...'})</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No companies found
                </td>
              </tr>
            ) : (
              companies.map((c: TrustedCompany) => (
                <tr key={c._id} className="hover:bg-gray-50 transition duration-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-16 h-16 object-contain rounded-md border p-1 bg-gray-100" />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-900 font-semibold transition"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 font-semibold transition"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
    </div>
  );
}
