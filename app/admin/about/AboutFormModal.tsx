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
  image: string; // base64
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

  // === Fetch About Data ===
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

  // === Convert File to Base64 ===
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  if (loading || !initialData) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage About Us Page</h1>

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
            alert('About data saved successfully!');
          } catch (err) {
            console.error(err);
            alert('Error saving About data');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* === Basic Info === */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div>
                <label className="block font-medium">Title</label>
                <Field
                  name="title"
                  className="w-full border rounded p-2"
                  placeholder="Title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full border rounded p-2"
                  rows={3}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Mission</label>
                  <Field
                    as="textarea"
                    name="mission"
                    className="w-full border rounded p-2"
                    rows={3}
                  />
                  <ErrorMessage
                    name="mission"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium">Vision</label>
                  <Field
                    as="textarea"
                    name="vision"
                    className="w-full border rounded p-2"
                    rows={3}
                  />
                  <ErrorMessage
                    name="vision"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div> */}

              <div>
                <TextEditor
                  label="company History"
                  initialContent={values.companyHistory}
                  onContentChange={(value: string) =>
                    setFieldValue('companyHistory', value)
                  }
                />
                <ErrorMessage
                  name="companyHistory"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            {/* === Team Members === */}
            <FieldArray name="team">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Team Members</h2>
                    <button
                      type="button"
                      onClick={() =>
                        push({ name: '', position: '', bio: '', image: '' })
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      + Add Member
                    </button>
                  </div>

                  {values.team.map((member, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-md bg-gray-50 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">
                          Team Member {index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>

                      <div>
                        <label className="block font-medium">Name</label>
                        <Field
                          name={`team.${index}.name`}
                          className="w-full border rounded p-2"
                        />
                        <ErrorMessage
                          name={`team.${index}.name`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-medium">Position</label>
                        <Field
                          name={`team.${index}.position`}
                          className="w-full border rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="block font-medium">Bio</label>
                        <Field
                          as="textarea"
                          name={`team.${index}.bio`}
                          rows={3}
                          className="w-full border rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="block font-medium">Image</label>
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
                        />
                        {member.image && (
                          <img
                            src={member.image}
                            alt="Preview"
                            className="w-24 h-24 rounded mt-2 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            {/* === Company Values === */}
            <FieldArray name="values">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Company Values</h2>
                    <button
                      type="button"
                      onClick={() => push({ title: '', description: '' })}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      + Add Value
                    </button>
                  </div>

                  {values.values.map((value, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-md bg-gray-50 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Value {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>

                      <div>
                        <label className="block font-medium">Title</label>
                        <Field
                          name={`values.${index}.title`}
                          className="w-full border rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="block font-medium">Description</label>
                        <Field
                          as="textarea"
                          name={`values.${index}.description`}
                          rows={3}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            {/* === Save Button === */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
              >
                {isSubmitting ? 'Saving...' : 'Save About Us'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
