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

export default function HomeHero() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch existing hero
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero'); // adjust API route
      const data = await res.json();
      if (!data.error) {
        setHero(data);
        setImagePreview(data.image || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      title: values.title,
      disc: values.disc,
      image: imagePreview || values.image || '',
      buttonText: values.buttonText || '',
    };

    try {
      const res = await fetch('/api/hero', {
        method: hero ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero ? { id: hero._id, ...payload } : payload),
      });
      const result = await res.json();
      if (res.ok) {
        alert(hero ? 'Hero updated successfully' : 'Hero added successfully');
        fetchHero();
      } else {
        alert(result.error || 'Error');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {hero ? 'Edit Home Hero' : 'Add Home Hero'}
      </h1>

      <Formik
        enableReinitialize
        initialValues={{
          title: hero?.title || '',
          disc: hero?.disc || '',
          image: hero?.image || '',
          buttonText: hero?.buttonText || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
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
                    const base64 = await fileToBase64(file);
                    setFieldValue('image', base64);
                    setImagePreview(base64);
                  }
                }}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              {hero ? 'Update' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>

      {hero && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Existing Hero</h2>
          <table className="w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Button Text</th>
                <th className="border px-4 py-2">Image</th>
              </tr>
            </thead>
            <tbody>
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
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
