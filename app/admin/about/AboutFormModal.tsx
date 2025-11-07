'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoadingSpinner from '@/components/LoadingSpinner';
import TextEditor from '@/components/TextEditor/TextEditor';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
}

interface Value {
  title: string;
  description: string;
}

interface AboutData {
  _id?: string;
  title: string;
  description: string;
  mission: string;
  vision: string;
  companyHistory: string;
  team: TeamMember[];
  values: Value[];
}

const AboutSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  mission: Yup.string().required('Mission is required'),
  vision: Yup.string().required('Vision is required'),
  companyHistory: Yup.string().required('Company history is required'),
  team: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name is required'),
      position: Yup.string().required('Position is required'),
      bio: Yup.string().required('Bio is required'),
    })
  ),
  values: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Value title is required'),
      description: Yup.string().required('Value description is required'),
    })
  ),
});

export default function AboutAdmin() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<AboutData | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const data = await res.json();
          setInitialData(data);
        } else {
          setInitialData({
            title: '',
            description: '',
            mission: '',
            vision: '',
            companyHistory: '',
            team: [{ name: '', position: '', bio: '', image: '' }],
            values: [{ title: '', description: '' }],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  if (loading || !initialData) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🛠 Manage About Us Page</h1>

      <Formik
        initialValues={initialData}
        validationSchema={AboutSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const method = values._id ? 'PUT' : 'POST';
            const res = await fetch('/api/about', {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error('Failed to save');
            alert('✅ About data saved successfully!');
          } catch (err) {
            console.error(err);
            alert('❌ Error saving About data');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-10">
            {/* === Basic Info Section === */}
            <div className="bg-white shadow-md rounded-xl p-6 space-y-5 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">
                📋 Basic Information
              </h2>

              <div>
                <label className="block font-medium mb-1">Title</label>
                <Field
                  name="title"
                  className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter About Page Title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={3}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <TextEditor
                  label="Company History"
                  initialContent={values.companyHistory}
                  onContentChange={(value: string) => setFieldValue('companyHistory', value)}
                />
                <ErrorMessage name="companyHistory" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* === Team Members Section === */}
            <FieldArray name="team">
              {({ push, remove }) => (
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 space-y-5">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-semibold text-gray-700">👥 Team Members</h2>
                    <button
                      type="button"
                      onClick={() => push({ name: '', position: '', bio: '', image: '' })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      + Add Member
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {values.team.map((member, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>

                        <h3 className="font-medium text-gray-700">Member {index + 1}</h3>

                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Field
                            name={`team.${index}.name`}
                            className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Position</label>
                          <Field
                            name={`team.${index}.position`}
                            className="w-full border-gray-300 border rounded-lg p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Bio</label>
                          <Field
                            as="textarea"
                            name={`team.${index}.bio`}
                            rows={3}
                            className="w-full border-gray-300 border rounded-lg p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const b64 = await toBase64(file);
                                setFieldValue(`team.${index}.image`, b64);
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {member.image && (
                            <img
                              src={member.image}
                              alt="Preview"
                              className="w-24 h-24 rounded-lg mt-2 object-cover border"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>

            {/* === Values Section === */}
            <FieldArray name="values">
              {({ push, remove }) => (
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 space-y-5">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-semibold text-gray-700">💎 Company Values</h2>
                    <button
                      type="button"
                      onClick={() => push({ title: '', description: '' })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      + Add Value
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {values.values.map((value, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>

                        <h3 className="font-medium text-gray-700">Value {index + 1}</h3>

                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <Field
                            name={`values.${index}.title`}
                            className="w-full border-gray-300 border rounded-lg p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <Field
                            as="textarea"
                            name={`values.${index}.description`}
                            rows={3}
                            className="w-full border-gray-300 border rounded-lg p-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>

            {/* === Submit Button === */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : '💾 Save About Us'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
