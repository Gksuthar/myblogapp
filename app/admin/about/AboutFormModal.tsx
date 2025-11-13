'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoadingSpinner from '@/components/LoadingSpinner';
import TextEditor from '@/components/TextEditor/TextEditor';
import Image from 'next/image';

// --- Icons (for better UI) ---
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);
const UploadIcon = () => (
  <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
);
// ------------------------------

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string | File; // Can be string (URL) or File (upload)
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

// Updated Schema to validate the image
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
      image: Yup.mixed().required('Image is required'),
    })
  ),
  values: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Value title is required'),
      description: Yup.string().required('Value description is required'),
    })
  ),
});

// Default empty state
const emptyData: AboutData = {
  title: '',
  description: '',
  mission: '',
  vision: '',
  companyHistory: '',
  team: [],
  values: [],
};

export default function AboutAdmin() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<AboutData>(emptyData);
  // State for temporary image previews
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/about');
        const data = await res.json();
        if (res.ok) {
          setInitialData(data);
        } else {
          setInitialData(emptyData); // Use empty state if not found
        }
      } catch (err) {
        console.error(err);
        setInitialData(emptyData); // Use empty state on error
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  // Handle new image selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Store the File object in Formik
    setFieldValue(`team.${index}.image`, file);

    // 2. Create and store a temporary preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews(prev => {
      // Clean up old preview URL if it exists
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return { ...prev, [index]: previewUrl };
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🛠 Manage About Us Page</h1>

      <Formik
        initialValues={initialData}
        validationSchema={AboutSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // 1. Create FormData
            const formData = new FormData();

            // 2. Append all simple text fields
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('mission', values.mission);
            formData.append('vision', values.vision);
            formData.append('companyHistory', values.companyHistory);

            // 3. Process and append complex arrays
            const teamData = [];
            for (let i = 0; i < values.team.length; i++) {
              const member = values.team[i];
              if (member.image instanceof File) {
                // It's a new file: append to formData
                formData.append(`teamImage_${i}`, member.image);
                // Add text data (with an empty image path)
                teamData.push({
                  name: member.name,
                  position: member.position,
                  bio: member.bio,
                  image: '', // Backend will generate and save the path
                });
              } else {
                // It's an existing string path: just send the data
                teamData.push({
                  name: member.name,
                  position: member.position,
                  bio: member.bio,
                  image: member.image, // Send existing path
                });
              }
            }
            
            // 4. Append the JSON data as strings
            formData.append('teamData', JSON.stringify(teamData));
            formData.append('valuesData', JSON.stringify(values.values)); // Values are simple

            // 5. Send the request (POST or PUT, backend handles both same way)
            const method = values._id ? 'PUT' : 'POST';
            const res = await fetch('/api/about', {
              method,
              body: formData,
              // DO NOT set Content-Type, browser does it for FormData
            });

            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.message || 'Failed to save');
            }
            
            alert('✅ About data saved successfully!');
            // Refetch data to get new image URLs
            fetch('/api/about').then(res => res.json()).then(data => setInitialData(data));
          
          } catch (err: any) {
            console.error(err);
            alert(`❌ Error saving About data: ${err.message}`);
          } finally {
            setSubmitting(false);
            // Clean up all preview URLs
            Object.values(imagePreviews).forEach(URL.revokeObjectURL);
            setImagePreviews({});
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-10">
            {/* === Basic Info Section === */}
            <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 space-y-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3">
                📋 Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                <Field
                  name="title"
                  className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter About Page Title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Main Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  rows={3}
                  placeholder="A brief introduction..."
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Our Mission</label>
                    <Field
                      as="textarea"
                      name="mission"
                      className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      rows={3}
                      placeholder="Our company mission..."
                    />
                    <ErrorMessage name="mission" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Our Vision</label>
                    <Field
                      as="textarea"
                      name="vision"
                      className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      rows={3}
                      placeholder="Our company vision..."
                    />
                    <ErrorMessage name="vision" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
              </div>

              <div>
                {/* <label className="block text-sm font-medium mb-2 text-gray-700">Company History</label> */}
                <TextEditor
                label='Company History'
                  initialContent={values.companyHistory}
                  onContentChange={(value: string) => setFieldValue('companyHistory', value)}
                />
                <ErrorMessage name="companyHistory" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* === Team Members Section === */}
            <FieldArray name="team">
              {({ push, remove }) => (
                <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-200 space-y-6">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-2xl font-semibold text-gray-700">👥 Team Members</h2>
                    <button
                      type="button"
                      onClick={() => push({ name: '', position: '', bio: '', image: '' })}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                    >
                      + Add Member
                    </button>
                  </div>

                  <div className="space-y-6">
                    {values.team.map((member, index) => {
                      // Get the correct image source
                      const imageSrc = imagePreviews[index] || (typeof member.image === 'string' ? member.image : '');

                      return (
                      <div key={index} className="p-4 border rounded-xl bg-gray-50 relative">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                          title="Remove Member"
                        >
                          <TrashIcon />
                        </button>

                        <h3 className="font-semibold text-lg text-gray-800 mb-4">Member {index + 1}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Col 1: Image Upload */}
                          <div className="md:col-span-1">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Image</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-white">
                              <div className="text-center">
                                {imageSrc ? (
                                  <Image
                                    src={imageSrc}
                                    alt="Preview"
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-white shadow-md"
                                  />
                                ) : (
                                  <UploadIcon />
                                )}
                                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                  <label
                                    htmlFor={`file-upload-${index}`}
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id={`file-upload-${index}`}
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageChange(e, index, setFieldValue)}
                                      className="sr-only"
                                    />
                                  </label>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 2MB</p>
                              </div>
                            </div>
                            <ErrorMessage name={`team.${index}.image`} component="div" className="text-red-500 text-sm mt-1" />
                          </div>

                          {/* Col 2: Text Fields */}
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                              <Field
                                name={`team.${index}.name`}
                                className="w-full border-gray-300 border rounded-lg p-3"
                              />
                              <ErrorMessage name={`team.${index}.name`} component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700">Position</label>
                              <Field
                                name={`team.${index}.position`}
                                className="w-full border-gray-300 border rounded-lg p-3"
                              />
                              <ErrorMessage name={`team.${index}.position`} component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-gray-700">Bio</label>
                              <Field
                                as="textarea"
                                name={`team.${index}.bio`}
                                rows={3}
                                className="w-full border-gray-300 border rounded-lg p-3"
                              />
                              <ErrorMessage name={`team.${index}.bio`} component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              )}
            </FieldArray>

            {/* === Values Section === */}
            <FieldArray name="values">
              {({ push, remove }) => (
                <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-200 space-y-5">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-2xl font-semibold text-gray-700">💎 Company Values</h2>
                    <button
                      type="button"
                      onClick={() => push({ title: '', description: '' })}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                    >
                      + Add Value
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.values.map((value, index) => (
                      <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                          title="Remove Value"
                        >
                           <TrashIcon />
                        </button>
                        <h3 className="font-semibold text-lg text-gray-800">Value {index + 1}</h3>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                          <Field
                            name={`values.${index}.title`}
                            className="w-full border-gray-300 border rounded-lg p-3"
                          />
                           <ErrorMessage name={`values.${index}.title`} component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                          <Field
                            as="textarea"
                            name={`values.${index}.description`}
                            rows={3}
                            className="w-full border-gray-300 border rounded-lg p-3"
                          />
                           <ErrorMessage name={`values.${index}.description`} component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>

            {/* === Submit Button === */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                {isSubmitting ? 'Saving...' : '💾 Save About Us Page'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}