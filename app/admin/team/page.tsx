"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

// 🧩 Types
interface Card {
  title: string;
  description: string;
  image: string;
  tags?: string[];
}

interface TeamCategory {
  _id?: string;
  tabName: string;
  cards: Card[];
}

export default function Page() {
  const [categories, setCategories] = useState<TeamCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<TeamCategory | null>(null);

  // ✅ Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/team");
      setCategories(res.data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Delete Category
  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this tab?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/team?id=${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Yup Validation Schema
  const schema = Yup.object().shape({
    tabName: Yup.string().required("Tab name is required"),
    cards: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().required("Title is required"),
          description: Yup.string().required("Description is required"),
          image: Yup.string().required("Image is required"),
        })
      )
      .min(1, "At least one card is required"),
  });

  // ✅ Initial Form Values
  const initialValues: TeamCategory = {
    tabName: editCategory?.tabName || "",
    cards:
      editCategory?.cards || [
        { title: "", description: "", image: "", tags: [] },
      ],
  };

  // ✅ Convert file to Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // ✅ Handle Submit
  const handleSubmit = async (
    values: TeamCategory,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);
    try {
      if (editCategory && editCategory._id) {
        await axios.put("/api/team", {
          id: editCategory._id,
          updateData: values,
        });
        setEditCategory(null);
      } else {
        await axios.post("/api/team", values);
      }
      fetchData();
      resetForm();
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Team Tabs & Cards Management</h1>

      {loading && (
        <div className="text-center text-blue-600 font-semibold mb-4">
          Loading...
        </div>
      )}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="bg-white shadow-md rounded-lg p-6 mb-8">
            {/* Tab Name */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Tab Name</label>
              <Field
                name="tabName"
                className="border p-2 w-full rounded"
                placeholder="Enter Tab Name"
              />
              <ErrorMessage
                name="tabName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Cards Array */}
            <FieldArray name="cards">
              {({ push, remove }) => (
                <div>
                  {values.cards.map((card, index) => (
                    <div
                      key={index}
                      className="border rounded p-4 mb-4 bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                          <label className="block font-medium mb-1">Title</label>
                          <Field
                            name={`cards.${index}.title`}
                            className="border p-2 w-full rounded"
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
                          <label className="block font-medium mb-1">
                            Description
                          </label>
                          <Field
                            name={`cards.${index}.description`}
                            className="border p-2 w-full rounded"
                            placeholder="Enter description"
                          />
                          <ErrorMessage
                            name={`cards.${index}.description`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        {/* Image */}
                        <div>
                          <label className="block font-medium mb-1">
                            Upload Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const base64 = await toBase64(file);
                                setFieldValue(`cards.${index}.image`, base64);
                              }
                            }}
                            className="border p-2 w-full rounded"
                          />
                          {values.cards[index].image && (
                            <img
                              src={values.cards[index].image}
                              alt="Preview"
                              className="mt-2 h-20 rounded"
                            />
                          )}
                          <ErrorMessage
                            name={`cards.${index}.image`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Remove Card
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      push({ title: "", description: "", image: "", tags: [] })
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    + Add Card
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editCategory ? "Update Tab" : "Add Tab"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* ✅ Table View */}
      <h2 className="text-xl font-semibold mb-3">All Tabs & Cards</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Tab Name</th>
              <th className="p-2 border">Cards Count</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="p-2 border font-medium">{cat.tabName}</td>
                <td className="p-2 border">{cat.cards.length}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => setEditCategory(cat)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
