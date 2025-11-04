'use client';

import React, { useEffect, useState } from 'react';
import { BiUpload } from 'react-icons/bi';
import { BsTrash2 } from 'react-icons/bs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { Category } from '@/types/api';
import { motion, AnimatePresence } from 'framer-motion';
import Textfield from '@/components/customeInput/Textfield';
import TextEditor from '@/components/TextEditor/TextEditor';

// === Interfaces ===
interface HeroSection {
  title: string;
  description: string;
  image?: string;
}

interface Card {
  id: string;
  title: string;
  description: string;
}

interface CardSection {
  id: string;
  sectionTitle: string;
  sectionDescription: string;
  cards: Card[];
}

interface ServiceCardView {
  title: string;
  description: string;
}

interface Service {
  _id: string;
  categoryId?: string;
  heroSection: HeroSection;
  cardSections?: CardSection[];
  serviceCardView: ServiceCardView;
  content?: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingService?: Service | null;
}

interface FormValues {
  categoryId: string;
  heroSection: HeroSection;
  cardSections: CardSection[];
  serviceCardView: ServiceCardView;
  content: string;
}

export default function ServiceModal({
  isOpen,
  onClose,
  onSuccess,
  editingService,
}: ServiceModalProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const isEditing = !!editingService;

  useEffect(() => {
    if (isOpen) {
      axios
        .get('/api/service/categories')
        .then((res) => {
          const transformedCategories = (res.data || []).map((cat: any) => ({
            id: cat._id?.toString() || cat.id || '',
            name: cat.name || '',
            description: cat.description || '',
          }));
          setCategories(transformedCategories);
        })
        .catch((error) => {
          console.error('Failed to fetch categories:', error);
          setCategories([]);
        });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white w-full max-w-5xl rounded-3xl shadow-3xl p-8 relative overflow-y-auto max-h-[90vh]"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h2>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
            >
              ×
            </button>

            <Formik<FormValues>
              enableReinitialize
              initialValues={{
                categoryId: editingService?.categoryId?.toString() || '',
                heroSection:
                  editingService?.heroSection || { title: '', description: '', image: '' },
                cardSections:
                  editingService?.cardSections?.map((section) => ({
                    id: crypto.randomUUID(),
                    sectionTitle: section.sectionTitle || '',
                    sectionDescription: section.sectionDescription || '',
                    cards: (section.cards || []).map((card) => ({
                      id: crypto.randomUUID(),
                      title: card.title || '',
                      description: card.description || '',
                    })),
                  })) || [],
                serviceCardView:
                  editingService?.serviceCardView || { title: '', description: '' },
                content: editingService?.content || '',
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  if (isEditing && editingService?._id) {
                    await axios.put('/api/service', { id: editingService._id, ...values });
                  } else {
                    await axios.post('/api/service', values);
                  }
                  onSuccess();
                  resetForm();
                  onClose();
                  router.refresh();
                } catch (error: any) {
                  console.error('Service save error:', error);
                  alert(error.response?.data?.error || 'Failed to save service');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* === Category === */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Field as="select" name="categoryId" className="w-full p-3 border rounded-lg">
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="categoryId" component="p" className="text-red-500 text-sm" />
                  </div>

                  {/* === Hero Section === */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-3">Hero Section</h3>

                    {/* Image Upload */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Hero Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        id="hero-image"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setFieldValue('heroSection.image', reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="hero-image"
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <BiUpload size={18} />
                        Upload Image
                      </label>
                      {values.heroSection.image && (
                        <img
                          src={values.heroSection.image}
                          alt="Hero Preview"
                          className="mt-2 h-20 w-32 object-cover rounded"
                        />
                      )}
                    </div>

                    <Textfield
                      label="Hero Title"
                      name="heroSection.title"
                      placeholder="Enter hero title"
                      value={values.heroSection.title}
                      onChange={(e) => setFieldValue('heroSection.title', e.target.value)}
                    />
                    <ErrorMessage
                      name="heroSection.title"
                      component="p"
                      className="text-red-500 text-sm"
                    />

                    <Textfield
                      label="Hero Description"
                      name="heroSection.description"
                      type="textarea"
                      placeholder="Enter hero description"
                      value={values.heroSection.description}
                      onChange={(e) => setFieldValue('heroSection.description', e.target.value)}
                    />
                    <ErrorMessage
                      name="heroSection.description"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* === Service Card View === */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-3">Service Card View</h3>

                    <Textfield
                      label="Card Title"
                      name="serviceCardView.title"
                      placeholder="Enter card view title"
                      value={values.serviceCardView.title}
                      onChange={(e) => setFieldValue('serviceCardView.title', e.target.value)}
                    />
                    <ErrorMessage
                      name="serviceCardView.title"
                      component="p"
                      className="text-red-500 text-sm"
                    />

                    <Textfield
                      label="Card Description"
                      name="serviceCardView.description"
                      type="textarea"
                      placeholder="Enter card view description"
                      value={values.serviceCardView.description}
                      onChange={(e) =>
                        setFieldValue('serviceCardView.description', e.target.value)
                      }
                    />
                    <ErrorMessage
                      name="serviceCardView.description"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* === Card Sections === */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Card Sections</h3>
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue('cardSections', [
                            ...values.cardSections,
                            {
                              id: crypto.randomUUID(),
                              sectionTitle: '',
                              sectionDescription: '',
                              cards: [],
                            },
                          ])
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Add Section
                      </button>
                    </div>

                    {values.cardSections.map((section, sIndex) => (
                      <div key={section.id} className="p-3 mb-3 border rounded bg-white">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Section {sIndex + 1}</h4>
                          <button
                            type="button"
                            onClick={() =>
                              setFieldValue(
                                'cardSections',
                                values.cardSections.filter((s) => s.id !== section.id)
                              )
                            }
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <BsTrash2 size={16} />
                          </button>
                        </div>

                        <Textfield
                          name={`cardSections[${sIndex}].sectionTitle`}
                          placeholder="Section Title"
                          value={section.sectionTitle}
                          onChange={(e) => {
                            const updated = [...values.cardSections];
                            updated[sIndex].sectionTitle = e.target.value;
                            setFieldValue('cardSections', updated);
                          }}
                        />

                        <Textfield
                          name={`cardSections[${sIndex}].sectionDescription`}
                          type="textarea"
                          placeholder="Section Description"
                          value={section.sectionDescription}
                          onChange={(e) => {
                            const updated = [...values.cardSections];
                            updated[sIndex].sectionDescription = e.target.value;
                            setFieldValue('cardSections', updated);
                          }}
                        />

                        {/* Add Card Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...values.cardSections];
                            updated[sIndex].cards.push({
                              id: crypto.randomUUID(),
                              title: '',
                              description: '',
                            });
                            setFieldValue('cardSections', updated);
                          }}
                          className="text-blue-600 text-sm mb-2"
                        >
                          + Add Card
                        </button>

                        {section.cards.map((card, cIndex) => (
                          <div key={card.id} className="p-2 border rounded mb-2">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium">Card {cIndex + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...values.cardSections];
                                  updated[sIndex].cards = updated[sIndex].cards.filter(
                                    (c) => c.id !== card.id
                                  );
                                  setFieldValue('cardSections', updated);
                                }}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <BsTrash2 size={14} />
                              </button>
                            </div>

                            <Textfield
                              name={`cardSections[${sIndex}].cards[${cIndex}].title`}
                              placeholder="Card Title"
                              value={card.title}
                              onChange={(e) => {
                                const updated = [...values.cardSections];
                                updated[sIndex].cards[cIndex].title = e.target.value;
                                setFieldValue('cardSections', updated);
                              }}
                            />

                            <Textfield
                              name={`cardSections[${sIndex}].cards[${cIndex}].description`}
                              type="textarea"
                              placeholder="Card Description"
                              value={card.description}
                              onChange={(e) => {
                                const updated = [...values.cardSections];
                                updated[sIndex].cards[cIndex].description = e.target.value;
                                setFieldValue('cardSections', updated);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* === Content Editor === */}
                  <TextEditor
                    label="Content"
                    initialContent={values.content}
                    onContentChange={(value: string) => setFieldValue('content', value)}
                  />
                  <ErrorMessage name="content" component="p" className="text-red-500 text-sm" />

                  {/* === Buttons === */}
                  <div className="flex gap-4 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting
                        ? 'Saving...'
                        : isEditing
                        ? 'Update Service'
                        : 'Create Service'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
