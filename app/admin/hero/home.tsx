'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface Hero {
  _id: string;
  title: string;
  disc: string;
  image: string; // This is a URL path like /uploads/image.jpg
  buttonText: string;
}

// Validation schema (image is no longer needed here)
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  disc: Yup.string().required('Description is required'),
  buttonText: Yup.string().optional(),
});

export default function HomeHero() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the actual file

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero');
      const data = await res.json();
      if (!data.error) {
        setHero(data);
        setImagePreview(data.image || null); // Set preview to existing image path
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // Updated image handler:
  // - No longer uses setFieldValue
  // - Sets the imageFile state
  // - Creates an object URL for preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file); // 1. Store the file object
    setImagePreview(URL.createObjectURL(file)); // 2. Create a temporary URL for preview
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('disc', values.disc);
    formData.append('buttonText', values.buttonText || '');
    
    if (hero?._id) {
      formData.append('id', hero._id);
    }

    // *** CRITICAL CHANGE ***
    // Only append the 'image' field if a *new file* has been selected
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    try {
      const res = await fetch('/api/hero', {
        method: hero ? 'PATCH' : 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert(hero ? 'Hero updated successfully' : 'Hero added successfully');
        setImageFile(null); // Clear the selected file
        fetchHero(); // Refetch data to show the saved image
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
          buttonText: hero?.buttonText || '',
          // 'image' is no longer part of Formik's state
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => ( // setFieldValue is no longer needed here
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
                onChange={handleImageChange} // Updated handler
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