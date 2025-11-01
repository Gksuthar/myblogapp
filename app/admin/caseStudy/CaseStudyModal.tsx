'use client';

import React, { useState } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Textfield from '@/components/customeInput/Textfield';
import TextEditor from '@/components/TextEditor/TextEditor';

interface Card {
  cardTitle: string;
  cardDescription: string;
  cardImage: string; // base64 string
}

interface CaseStudyFormValues {
  title: string;
  content: string;
  headerTitle: string;
  headerDescription: string;
  cards: Card[];
  
}

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editdata?: Partial<CaseStudyFormValues> & { _id?: string } | null;
}

// ✅ Validation Schemas
const CardSchema = Yup.object().shape({
  cardTitle: Yup.string().required('Card title is required'),
  cardDescription: Yup.string().required('Card description is required'),
  cardImage: Yup.string().required('Card image is required'),
});

const CaseStudySchema = Yup.object().shape({
  title: Yup.string().min(3).max(100).required('Title is required'),
  content: Yup.string().required('Content is required'),
  headerTitle: Yup.string().required('Header title is required'),
  headerDescription: Yup.string().required('Header description is required'),
  cards: Yup.array().of(CardSchema).min(1, 'At least one card is required'),
});

export default function CaseStudyModal({
  isOpen,
  onClose,
  onSuccess,
  editdata,
}: CaseStudyModalProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  // ✅ Normalize cards (ensure consistent structure)
  const normalizeCards = (cards?: Partial<Card>[]): Card[] => {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return [{ cardTitle: '', cardDescription: '', cardImage: '' }];
    }
    return cards.map((card) => ({
      cardTitle: card.cardTitle || '',
      cardDescription: card.cardDescription || '',
      cardImage: card.cardImage || '',
    }));
  };

  const initialValues: CaseStudyFormValues = {
    title: editdata?.title ?? '',
    content: editdata?.content ?? '',
    headerTitle: editdata?.headerTitle ?? '',
    headerDescription: editdata?.headerDescription ?? '',
    cards: normalizeCards(editdata?.cards),
  };

  // ✅ Convert image file to Base64 string
  const handleImageUpload = (file: File, index: number, setFieldValue: any) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFieldValue(`cards[${index}].cardImage`, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 relative mx-3 overflow-y-auto max-h-[90vh]"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editdata ? '✏️ Edit Case Study' : '🧩 Create New Case Study'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <Formik
              key={editdata?._id || 'new'} // ✅ ensures re-render on different editdata
              enableReinitialize
              initialValues={initialValues}
              validationSchema={CaseStudySchema}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                try {
                  setSubmitError('');
                  setSubmitSuccess(false);

                  const payload = { ...values };
                  const url = '/api/caseStudy';

                  const response = editdata?._id
                    ? await axios.patch(url, { id: editdata._id, ...payload })
                    : await axios.post(url, payload);

                  if (response.status === 200 || response.status === 201) {
                    setSubmitSuccess(true);
                    if (onSuccess) onSuccess();

                    setTimeout(() => {
                      setSubmitSuccess(false);
                      onClose();
                      resetForm();
                    }, 1200);
                  }
                } catch (err: any) {
                  console.error('Error submitting case study:', err);
                  setSubmitError(
                    err?.response?.data?.error ||
                      'Something went wrong. Please try again.'
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Title
                    </label>
                    <Textfield
                      name="title"
                      placeholder="Enter case study title..."
                      value={values.title}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3"
                    />
                    <ErrorMessage
                      name="title"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Header Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Header Title
                      </label>
                      <Textfield
                        name="headerTitle"
                        placeholder="Enter header title..."
                        value={values.headerTitle}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 p-3"
                      />
                      <ErrorMessage
                        name="headerTitle"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Header Description
                      </label>
                      <Textfield
                        name="headerDescription"
                        placeholder="Enter header description..."
                        value={values.headerDescription}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 p-3"
                      />
                      <ErrorMessage
                        name="headerDescription"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Cards Section */}
                  <FieldArray name="cards">
                    {({ remove, push }) => (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                          🗂 Cards
                        </h3>

                        {values.cards.map((card, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-4 shadow-sm relative"
                          >
                            <div className="absolute top-3 right-3">
                              {values.cards.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  ✕ Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 font-semibold mb-1">
                                  Card Title
                                </label>
                                <Textfield
                                  name={`cards[${index}].cardTitle`}
                                  placeholder="Card title..."
                                  value={card.cardTitle}
                                  onChange={handleChange}
                                  className="w-full rounded-lg border border-gray-300 p-3"
                                />
                                <ErrorMessage
                                  name={`cards[${index}].cardTitle`}
                                  component="p"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-700 font-semibold mb-1">
                                  Card Image
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                      handleImageUpload(
                                        file,
                                        index,
                                        setFieldValue
                                      );
                                  }}
                                  className="w-full rounded-lg border border-gray-300 p-2"
                                />
                                {card.cardImage && (
                                  <img
                                    src={card.cardImage}
                                    alt="Card Preview"
                                    className="mt-2 w-24 h-24 object-cover rounded-md border"
                                  />
                                )}
                                <ErrorMessage
                                  name={`cards[${index}].cardImage`}
                                  component="p"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            </div>

                            <div className="mt-3">
                              <label className="block text-gray-700 font-semibold mb-1">
                                Card Description
                              </label>
                              <Textfield
                                name={`cards[${index}].cardDescription`}
                                placeholder="Short description..."
                                value={card.cardDescription}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-3"
                              />
                              <ErrorMessage
                                name={`cards[${index}].cardDescription`}
                                component="p"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            push({
                              cardTitle: '',
                              cardDescription: '',
                              cardImage: '',
                            })
                          }
                          className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100"
                        >
                          ➕ Add Another Card
                        </button>
                      </div>
                    )}
                  </FieldArray>

                  {/* Content Section */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Content
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <TextEditor
                        label="content"
                        initialContent={values.content}
                        onContentChange={(val: string) =>
                          setFieldValue('content', val)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="content"
                      component="p"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSubmitting
                        ? editdata
                          ? 'Updating...'
                          : 'Publishing...'
                        : editdata
                        ? 'Update'
                        : 'Publish'}
                    </button>
                  </div>

                  {submitSuccess && (
                    <p className="text-center text-green-600 font-medium mt-3">
                      🎉{' '}
                      {editdata
                        ? 'Case study updated'
                        : 'Case study created'}{' '}
                      successfully!
                    </p>
                  )}
                  {submitError && (
                    <p className="text-center text-red-600 font-medium mt-3">
                      ⚠️ {submitError}
                    </p>
                  )}
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
