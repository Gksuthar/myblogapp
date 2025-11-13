'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface Card {
  title: string;
  description: string;
  image: File | string;
  tags?: string[];
}

interface TeamCategory {
  _id?: string;
  tabName: string;
  cards: Card[];
}

export default function TeamManagement() {
  const [categories, setCategories] = useState<TeamCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<TeamCategory | null>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team');
      setCategories(res.data.data);
    } catch (err) {
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Validation Schema
  const schema = Yup.object().shape({
    tabName: Yup.string().required('Tab name is required'),
    cards: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().required('Title is required'),
          description: Yup.string().required('Description is required'),
          image: Yup.mixed().required('Image is required'),
        })
      )
      .min(1, 'At least one card is required'),
  });

  // Handle Submit
  const handleSubmit = async (
    values: TeamCategory,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);
    const formData = new FormData();

    formData.append('tabName', values.tabName);
    formData.append(
      'cards',
      JSON.stringify(
        values.cards.map(({ title, description, tags, image }) => ({
          title,
          description,
          tags,
          image: typeof image === 'string' ? image : null, // keep URL if string
        }))
      )
    );

    values.cards.forEach((card) => {
      if (card.image instanceof File) formData.append('images', card.image);
      else formData.append('images', new Blob());
    });

    try {
      if (editCategory && editCategory._id) {
        formData.append('id', editCategory._id);
        await axios.put('/api/team', formData);
        alert('Category updated successfully');
        setEditCategory(null);
      } else {
        await axios.post('/api/team', formData);
        alert('Category added successfully');
      }
      fetchData();
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/team?id=${id}`);
      alert('Category deleted');
      fetchData();
    } catch {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Team Tabs & Cards Management
      </h1>

      {loading && <p className="text-blue-500 text-center font-semibold">Processing...</p>}

      <Formik
        enableReinitialize
        initialValues={{
          tabName: editCategory?.tabName || '',
          cards: editCategory?.cards || [
            { title: '', description: '', image: '', tags: [] },
          ],
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="bg-white rounded-xl shadow p-6 space-y-4 border">
            {/* Tab Name */}
            <div>
              <label className="block font-semibold mb-1">Tab Name</label>
              <Field
                name="tabName"
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                placeholder="Enter tab name"
              />
              <ErrorMessage name="tabName" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Cards */}
            <FieldArray name="cards">
              {({ remove, push }) => (
                <div>
                  {values.cards.map((card, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm relative"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Title */}
                        <div>
                          <label className="block font-semibold mb-1">Title</label>
                          <Field
                            name={`cards.${index}.title`}
                            className="border p-2 w-full rounded-md"
                            placeholder="Card title"
                          />
                          <ErrorMessage
                            name={`cards.${index}.title`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block font-semibold mb-1">Description</label>
                          <Field
                            name={`cards.${index}.description`}
                            className="border p-2 w-full rounded-md"
                            placeholder="Enter description"
                          />
                          <ErrorMessage
                            name={`cards.${index}.description`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        {/* Image Upload */}
                        <div>
                          <label className="block font-semibold mb-1">Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setFieldValue(`cards.${index}.image`, file);
                            }}
                            className="border p-2 w-full rounded-md"
                          />
                          {values.cards[index].image &&
                            typeof values.cards[index].image === 'string' && (
                              <img
                                src={values.cards[index].image}
                                alt="Preview"
                                className="mt-2 h-20 w-20 object-cover rounded-md border"
                              />
                            )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      push({ title: '', description: '', image: '', tags: [] })
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded-md mt-2 hover:bg-blue-700"
                  >
                    + Add Card
                  </button>
                </div>
              )}
            </FieldArray>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {editCategory ? 'Update Category' : 'Add Category'}
            </button>
          </Form>
        )}
      </Formik>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md p-4 border">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Existing Tabs</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border">Tab Name</th>
                <th className="p-3 border">Cards Count</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border font-medium">{cat.tabName}</td>
                  <td className="p-3 border text-center">{cat.cards.length}</td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => {
                        setEditCategory(cat);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    No tabs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
