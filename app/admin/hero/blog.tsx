'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface Hero {
  _id: string;
  title: string;
  disc: string;
  image: string;
  buttonText: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  disc: Yup.string().required('Description is required'),
  image: Yup.mixed().nullable(),
});

export default function Blog() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);

  // Fetch existing heroes/blogs
  const fetchHeroes = async () => {
    try {
      const res = await fetch('/api/heroblog');
      const data = await res.json();
      if (Array.isArray(data)) setHeroes(data);
      else if (data) setHeroes([data]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // Convert image to Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Handle form submission
  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const payload = {
        title: values.title,
        disc: values.disc,
        image: imagePreview || values.image || '',
        buttonText: values.buttonText || '',
      };

      let res;
      if (editingHero) {
        res = await fetch('/api/heroblog', {
          method: 'PATCH',
          body: JSON.stringify({ id: editingHero._id, ...payload }),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        res = await fetch('/api/heroblog', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await res.json();
      if (res.ok) {
        alert(editingHero ? 'Hero updated successfully' : 'Hero added successfully');
        resetForm();
        setImagePreview(null);
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

  const handleEdit = (hero: Hero) => {
    setEditingHero(hero);
    setImagePreview(hero.image || null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero?')) return;
    try {
      const res = await fetch('/api/heroblog', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        fetchHeroes();
      } else {
        alert(result.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting hero');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {editingHero ? 'Edit Hero / Blog' : 'Add Hero / Blog Section'}
      </h1>

      <Formik
        enableReinitialize
        initialValues={{
          title: editingHero?.title || '',
          disc: editingHero?.disc || '',
          image: editingHero?.image || null,
          buttonText: editingHero?.buttonText || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, resetForm }) => (
          <Form className="space-y-4 mb-8">
            <div>
              <label className="block font-medium mb-1">Title</label>
              <Field
                type="text"
                name="title"
                placeholder="Enter title"
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <Field
                as="textarea"
                name="disc"
                placeholder="Enter description"
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              <ErrorMessage name="disc" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block font-medium mb-1">Button Text (Optional)</label>
              <Field
                type="text"
                name="buttonText"
                placeholder="Enter button text"
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) {
                    const base64 = await toBase64(file);
                    setFieldValue('image', base64);
                    setImagePreview(base64);
                  }
                }}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                {editingHero ? 'Update' : 'Submit'}
              </button>
              {editingHero && (
                <button
                  type="button"
                  className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition"
                  onClick={() => {
                    setEditingHero(null);
                    resetForm();
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <h2 className="text-xl font-semibold mb-4">Existing Heroes / Blogs</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Button Text</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {heroes.length > 0 ? (
              heroes.map((hero) => (
                <tr key={hero._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{hero.title}</td>
                  <td className="border px-4 py-2">{hero.disc}</td>
                  <td className="border px-4 py-2">{hero.buttonText}</td>
                  <td className="border px-4 py-2">
                    {hero.image ? (
                      <img src={hero.image} alt={hero.title} className="w-20 h-20 object-cover rounded-md" />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      onClick={() => handleEdit(hero)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(hero._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border px-4 py-2 text-center">
                  No heroes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
