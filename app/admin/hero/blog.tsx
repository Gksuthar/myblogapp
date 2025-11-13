'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// --- Icons Components (Inline for easy copy-paste) ---
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);
const UploadIcon = () => (
  <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>
);

interface Hero {
  _id: string;
  title: string;
  disc: string;
  image: string; // This will now be a URL path like /uploads/hero/image.jpg
  buttonText: string;
}

// Validation schema (image is optional)
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  disc: Yup.string().required('Description is required'),
  buttonText: Yup.string().optional(),
});

export default function Blog() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // Holds the actual file
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);

  // Fetch existing heroes/blogs
  const fetchHeroes = async () => {
    try {
      const res = await fetch('/api/heroblog');
      const data = await res.json();
      if (Array.isArray(data)) setHeroes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // Handle form submission (NOW USES FORMDATA)
  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      // 1. Create FormData
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("disc", values.disc);
      formData.append("buttonText", values.buttonText || "");

      // 2. Add image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      let res;
      if (editingHero) {
        // 3. Add ID for updates and use PUT
        formData.append("id", editingHero._id);
        res = await fetch('/api/heroblog', {
          method: 'PUT',
          body: formData, // No Content-Type header needed
        });
      } else {
        // 4. Use POST for creation
        res = await fetch('/api/heroblog', {
          method: 'POST',
          body: formData, // No Content-Type header needed
        });
      }

      const result = await res.json();
      if (res.ok) {
        resetForm();
        setImagePreview(null);
        setImageFile(null); // Clear the file
        setEditingHero(null);
        fetchHeroes();
      } else {
        alert(result.error || 'Error');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  // Handle Edit click
  const handleEdit = (hero: Hero)=> {
    setEditingHero(hero);
    setImagePreview(hero.image || null); // Set preview to existing image path
    setImageFile(null); // Clear any selected file
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Delete click
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch('/api/heroblog', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        fetchHeroes();
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle file input change
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setImageFile(file); // Store the file object
      setImagePreview(URL.createObjectURL(file)); // Create a temporary preview URL
    }
  };

  // Handle clearing the image
  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    // Clear the file input visually
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:text-4xl sm:tracking-tight">
              Hero & Blog Management
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Manage your website landing sections and blog highlights.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="mb-6 border-b border-gray-200 pb-4">
               <h3 className="text-base font-semibold leading-6 text-gray-900">
                 {editingHero ? 'Edit Entry' : 'Create New Entry'}
               </h3>
               <p className="mt-1 text-sm text-gray-500">Fill in the details below to update your content.</p>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                title: editingHero?.title || '',
                disc: editingHero?.disc || '',
                // 'image' field is no longer used to hold the file, only for initial load
                buttonText: editingHero?.buttonText || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ resetForm }) => (
                <Form className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  
                  {/* Title Field */}
                  <div className="sm:col-span-3">
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Title</label>
                    <div className="mt-2">
                      <Field
                        type="text"
                        name="title"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 h-12 p-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="e.g. Welcome to our Site"
                      />
                      <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                    {/* Button Text Field */}
                  <div className="sm:col-span-3">
                    <label htmlFor="buttonText" className="block text-sm font-medium leading-6 text-gray-900">Button Text (Optional)</label>
                    <div className="mt-2">
                      <Field
                        type="text"
                        name="buttonText"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900  h-12 p-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="e.g. Read More"
                      />
                    </div>
                  </div>

                  {/* Description Field */}
                  <div className="col-span-full">
                    <label htmlFor="disc" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                    <div className="mt-2">
                      <Field
                        as="textarea"
                        name="disc"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-90 p-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Write a few sentences about this section..."
                      />
                      <ErrorMessage name="disc" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Image Upload Field */}
                  <div className="col-span-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Cover Image</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 relative bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="text-center">
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="Preview" className="mx-auto h-48 object-contain rounded-md" />
                            <button 
                              type="button"
                              onClick={clearImage}
                              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <UploadIcon />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImageChange} // Updated handler
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-full flex items-center justify-end gap-x-3 border-t border-gray-900/10 pt-6">
                    {editingHero && (
                        <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => {
                          setEditingHero(null);
                          resetForm();
                          setImagePreview(null);
                          setImageFile(null); // Clear file
                        }}
                        >
                        Cancel
                        </button>
                    )}
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {editingHero ? 'Update Entry' : 'Save Entry'}
                    </button>
                  </div>

                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Current Entries</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:pl-6">Info</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Button</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {heroes.length > 0 ? (
                  heroes.map((hero) => (
                    <tr key={hero._id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {hero.image ? (
                                // Image src is now the path from the DB
                                <img className="h-10 w-10 rounded-lg object-cover border border-gray-200" src={hero.image} alt="" />
                            ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{hero.title}</div>
                            <div className="text-gray-500 text-xs">ID: {hero._id.substring(0,6)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {hero.disc}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {hero.buttonText ? (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {hero.buttonText}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(hero)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(hero._id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <UploadIcon />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No entries</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new hero or blog section.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}