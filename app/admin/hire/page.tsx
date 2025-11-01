"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";

// Validation Schema
const hireSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  disc: Yup.string().trim().required("Description is required"),
  author: Yup.string().trim().required("Author is required"),
  image: Yup.mixed().required("Image is required"),
});

function HirePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [heroes, setHeroes] = useState<any[]>([]);
  const [editHero, setEditHero] = useState<any | null>(null);

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Fetch heroes
  const fetchHeroes = async () => {
    try {
      const res = await axios.get("/api/hire");
      setHeroes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // Delete hero
  const deleteHero = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero?")) return;
    try {
      const res = await axios.delete("/api/hire", { data: { id } });
      if (res.status === 200) {
        setResponseMsg("✅ Hero deleted successfully!");
        fetchHeroes();
      }
    } catch (error) {
      console.error(error);
      setResponseMsg("❌ Failed to delete hero");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* ====== Form Section ====== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {editHero ? "Edit Hero Card" : "Create Hero Card"}
        </h2>

        <Formik
          enableReinitialize
          initialValues={{
            title: editHero?.title || "",
            disc: editHero?.disc || "",
            author: editHero?.author || "",
            image: editHero?.image || "",
          }}
          validationSchema={hireSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              setResponseMsg("Processing...");

              if (editHero) {
                await axios.patch("/api/hire", { id: editHero._id, ...values });
                setResponseMsg("✅ Hero updated successfully!");
              } else {
                await axios.post("/api/hire", values);
                setResponseMsg("✅ Hero created successfully!");
              }

              fetchHeroes();
              resetForm();
              setEditHero(null);
              setPreview(null);
            } catch (error) {
              console.error(error);
              setResponseMsg("❌ Operation failed");
            }
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label className="font-medium">Title</label>
                <Field
                  name="title"
                  type="text"
                  placeholder="Enter title"
                  className="w-full border rounded-lg p-2"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="font-medium">Description</label>
                <Field
                  name="disc"
                  as="textarea"
                  placeholder="Enter description"
                  className="w-full border rounded-lg p-2 h-24"
                />
                <ErrorMessage name="disc" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="font-medium">Author</label>
                <Field
                  name="author"
                  type="text"
                  placeholder="Enter author name"
                  className="w-full border rounded-lg p-2"
                />
                <ErrorMessage name="author" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      setFieldValue("image", base64);
                      setPreview(base64);
                    }
                  }}
                  className="w-full border rounded-lg p-2"
                />
                <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
              </div>

              {(preview || values.image) && (
                <div className="flex justify-center mt-4">
                  <Image
                    src={preview || values.image}
                    alt="Preview"
                    width={200}
                    height={150}
                    className="rounded-lg shadow-md"
                  />
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                {editHero ? "Update Hero" : "Create Hero"}
              </motion.button>

              {responseMsg && (
                <p
                  className={`text-center mt-2 ${
                    responseMsg.startsWith("✅") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {responseMsg}
                </p>
              )}
            </Form>
          )}
        </Formik>
      </motion.div>

      {/* ====== Table Section ====== */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <h3 className="text-xl font-semibold text-center p-4 border-b">All Hero Cards</h3>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Author</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {heroes.length > 0 ? (
              heroes.map((hero) => (
                <tr key={hero._id} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{hero.title}</td>
                  <td className="p-2 border">{hero.disc}</td>
                  <td className="p-2 border">{hero.author}</td>
                  <td className="p-2 border">
                    <Image
                      src={hero.image}
                      alt="Hero"
                      width={80}
                      height={60}
                      className="rounded-md mx-auto"
                    />
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => setEditHero(hero)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHero(hero._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500 italic">
                  No hero data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HirePage;
