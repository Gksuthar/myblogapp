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

export default function AboutHero() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch latest hero
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/heroabout');
      const data = await res.json();
      if (!data.error) setHero(data);
      else setHero(null);
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
      const res = await fetch('/api/heroabout', {
        method: hero ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero ? { id: hero._id, ...payload } : payload),
      });
      const result = await res.json();
      if (res.ok) {
        alert(hero ? 'Updated successfully' : 'Added successfully');
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
        {hero ? 'Edit About Hero' : 'Add About Hero'}
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
          <Form className="space-y-6 mb-8">
            <div className="mb-4">
              <label className="block font-medium mb-2">Title</label>
              <Field
                type="text"
                name="title"
                placeholder="Enter title"
                className="w-full border border-gray-300 p-3 rounded-md"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Description</label>
              <Field
                as="textarea"
                name="disc"
                placeholder="Enter description"
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-md resize-none"
              />
              <ErrorMessage name="disc" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Button Text</label>
              <Field
                type="text"
                name="buttonText"
                placeholder="Enter button text"
                className="w-full border border-gray-300 p-3 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Image</label>
              <div className="flex items-center gap-4">
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
                  className="border border-gray-300 p-2 rounded-md"
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-28 h-28 object-cover rounded-md shadow-sm" />
                ) : (
                  <div className="w-28 h-28 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Preview</div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full max-w-xs mx-auto block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                {hero ? 'Update' : 'Submit'}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <h2 className="text-xl font-semibold mb-4">Existing Hero</h2>
      {hero ? (
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
      ) : (
        <p className="text-center text-gray-500">No hero added yet</p>
      )}
    </div>
  );
}
