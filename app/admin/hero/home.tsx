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

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero');
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFieldValue('image', file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('disc', values.disc);
    formData.append('buttonText', values.buttonText || '');
    if (values.image) formData.append('image', values.image);
    if (hero?._id) formData.append('id', hero._id);

    try {
      const res = await fetch('/api/hero', {
        method: hero ? 'PATCH' : 'POST',
        body: formData,
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
                onChange={(e) => handleImageChange(e, setFieldValue)}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-md"
                />
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
    </div>
  );
}
