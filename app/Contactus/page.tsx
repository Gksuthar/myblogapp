'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext, FormikHelpers } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef } from 'react';
import * as yup from 'yup';
import ComponentLoader from '@/components/ComponentLoader';
import EmailIcon from '@rsuite/icons/Email';
export const contactSchema = yup.object({
  name: yup.string().trim().required('Name is required.'),
  email: yup.string().trim().email('Invalid email address.').required('Email is required.'),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9\s-()+\.]{7,15}$/, 'Invalid phone number.')
    .required('Phone Number is required.'),
  message: yup
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters.')
    .required('Message is required.'),
}).required();

// Infer the TypeScript type from the Yup schema for strong typing
export type ContactFormData = yup.InferType<typeof contactSchema>;

// --- Trusted Companies fetched from API ---
type TrustedCompany = { _id: string; name: string; image: string };

// Custom Input Field with Tailwind Styling and Error Display
interface CustomFieldProps {
  label: string;
  name: keyof ContactFormData;
  type?: string;
  placeholder: string;
}

const CustomField: React.FC<CustomFieldProps> = ({ label, name, type = 'text', placeholder }) => {
  const { touched, errors } = useFormikContext<ContactFormData>();
  const isError = touched[name] && errors[name];

  const baseClasses = 'p-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 text-base placeholder:text-gray-400';
  const errorClasses = 'border-red-500 focus:ring-red-500';
  const defaultClasses = 'border-gray-300 focus:ring-[var(--primary-color)]';

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${baseClasses} ${isError ? errorClasses : defaultClasses}`}
      />
      <ErrorMessage name={name} component="div" className="mt-1 text-sm text-red-500" />
    </div>
  );
};

// Main Contact Form Component using Formik
const ContactForm: React.FC = () => {
  const [companies, setCompanies] = useState<TrustedCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState<boolean>(true);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/tructedCompany', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load trusted companies');
        if (alive) setCompanies(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to fetch trusted companies:', e);
      } finally {
        if (alive) setLoadingCompanies(false);
      }
    })();
    return () => { alive = false };
  }, []);

  const initialValues: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  const onSubmit = async (
    values: ContactFormData,
    { resetForm, setSubmitting }: FormikHelpers<ContactFormData>
  ) => {
    try {
      setSubmitting(true);
      const recaptchaToken = recaptchaRef.current?.getValue() || '';
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      alert('✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      resetForm();
      recaptchaRef.current?.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      alert('❌ Oops! Something went wrong. Please try again or contact us directly at info@stantaxes.com');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<ComponentLoader height="h-screen" message="Loading contact form..." />}>
      <div className="min-h-screen relative flex justify-center py-2 md:py-4 px-2 sm:px-6 lg:px-8">
        {/* Left-to-right brand tint on page background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-1/2 -z-10 bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent" />
        <div className="w-full rounded-lg overflow-hidden ">
          <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT SECTION (Info & Partners) */}
          <div className="p-8 md:p-6 lg:p-8 space-y-8 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">Contact Us</h1>
<p className="text-gray-600 max-w-2xl mb-5 text-lg md:text-2xl ">
                    Feel free to talk to our representative at any time you please use our contact form on our website or one of our contact numbers. Let us work on your future together.

You can always visit us at our HQ, we have a friendly staff and a mean cup of coffee.


              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-gray-700 mb-5">
                  <span className="text-gray-900 !text-gray-800">
                    <EmailIcon className="h-5 w-5 text-gray-900 !text-gray-800" />
                  </span>
                  <a href="mailto:shalin@sbaccounting.us" className="text-gray-900 md:text-[20px]   font-medium text-[var(--primary-color)] hover:underline">shalin@sbaccounting.us</a>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <span className="font-medium">📞</span>
                  <a href="tel:+14307552828" className="text-gray-900 md:text-[20px] font-medium text-[var(--primary-color)] hover:underline">+1 430 755 2828</a>
                </div>
              </div>

        <h2 className="text-sm font-semibold text-gray-700  tracking-wider mb-4 font-extrabold md:text-[23px]">Trusted By</h2>
          <div className="grid grid-cols-4 gap-2">
                {loadingCompanies && (
                      Array.from({ length: 8 }).map((_, i) => (
                        <div key={`skeleton-${i}`} className="aspect-square w-full rounded-md bg-gray-100 animate-pulse border border-gray-200" />
                  ))
                )}
                {!loadingCompanies && companies.length === 0 && (
                  <div className="col-span-4 text-xs text-gray-500">No trusted companies yet.</div>
                )}
                {!loadingCompanies && companies.map((c) => (
                      <div
                        key={c._id}
                        className="aspect-square w-full border border-gray-200 rounded-md bg-white p-1 overflow-hidden flex items-center justify-center
                        transition-all duration-300 ease-in-out
                        hover:border-[var(--primary-color)] hover:shadow-lg hover:shadow-[rgba(53,154,255,0.15)] hover:-translate-y-1 hover:scale-105
                        cursor-pointer group"
                      >
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.image}
                        alt={c.name}
                        loading="lazy"
                            className="max-h-[92%] max-w-[95%] object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : null}
                    {/* Fallback to name if image missing or failed */}
                    {!c.image && (
                      <span className="text-[11px] font-semibold text-gray-600 truncate px-2 text-center transition-colors duration-300 group-hover:text-[var(--primary-color)]">
                        {c.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
      <div className="mt-8 lg:mt-0 relative hidden lg:block self-end">
        {/* <img src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6740588b760df20a1555190c_contact_us.svg" alt="Contact Illustration" /> */}
            </div>
          </div>

          <hr className="lg:hidden border-gray-300/50" />
          
          {/* RIGHT SECTION (Form) */}
          <div className="p-8 md:p-12 lg:p-16 bg-white">
            <Formik
              initialValues={initialValues}
              validationSchema={contactSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="space-y-6 text-base">
                  {/* Name, Email, Phone each as full-width rows */}
                  <div className="grid grid-cols-1 gap-4">
                    <CustomField label="Name*" name="name" placeholder="Your full name" />
                    <CustomField label="Email*" name="email" type="email" placeholder="you@company.com" />
                    <CustomField label="Phone Number*" name="phone" type="tel" placeholder="Phone number" />
                  </div>

        

                  {/* Row 5: Message Textarea */}
                  <div>
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Leave us a message."
                      className={`block w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 text-base
                        ${touched.message && errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[var(--primary-color)]'}`}
                    />
                    <ErrorMessage name="message" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  {/* reCAPTCHA */}
                  <div>
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                      <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string} ref={recaptchaRef} />
                    ) : (
                      <p className="text-xs text-amber-600">reCAPTCHA not configured. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY to enable spam protection.</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-[var(--primary-color-contrast)] bg-[var(--primary-color)] hover:bg-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition-all duration-200 disabled:opacity-60"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ContactForm;