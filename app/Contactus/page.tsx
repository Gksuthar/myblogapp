'use client';

import React, { Suspense, lazy } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as yup from 'yup';
import ComponentLoader from '@/components/ComponentLoader';

export const contactSchema = yup.object({
  firstName: yup.string().trim().required('First Name is required.'),
  lastName: yup.string().trim().required('Last Name is required.'),
  companyName: yup.string().trim().optional(),
  companyWebsite: yup.string().trim().url('Must be a valid URL.').optional(),
  email: yup.string().trim().email('Invalid email address.').required('Email is required.'),
  phone: yup.string().trim().matches(/^[0-9\s-()+\.]{7,15}$/, 'Invalid phone number.').required('Phone Number is required.'),
    message: yup.string().trim().min(10, 'Message must be at least 10 characters.').required('Message is required.'),
  privacyPolicy: yup.boolean().oneOf([true], 'You must accept the privacy policy.'),
}).required();

// Infer the TypeScript type from the Yup schema for strong typing
export type ContactFormData = yup.InferType<typeof contactSchema>;
// Assuming '@/lib/validationSchema' is the path to the file above

// --- Dummy Data ---
const trustedPartners = [
  { name: 'TaxApro', logo: 'TaxApro' },
  { name: 'Aykin', logo: 'Aykin' },
  { name: 'Reeder', logo: 'REEDER' },
  { name: 'DAVID DASS', logo: 'DAVID DASS, CPA' },
  { name: 'UNBOXED', logo: 'UNBOXED' },
  { name: 'Agranda', logo: 'Agranda CPA' },
  { name: 'SCINE & ASSOCIATES', logo: 'SCINE & ASSOCIATES' },
  { name: 'BlueFire', logo: 'BlueFire' },
  { name: 'Backroad Advisors', logo: 'Backroad Advisors' },
];

const helpOptions = [
  'Select one...',
  'Tax Preparation',
  'Accounting Services',
  'Business Consultation',
  'Other Inquiry',
];
// --- /Dummy Data ---

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

  const baseClasses = 'p-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200';
  const errorClasses = 'border-red-500 focus:ring-red-500';
  const defaultClasses = 'border-gray-300 focus:ring-blue-500';

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
  const initialValues: ContactFormData = {
    firstName: '',
    lastName: '',
    companyName: '',
    companyWebsite: '',
    email: '',
    phone: '',
    message: '',
    privacyPolicy: false,
  };

  const onSubmit = async (values: ContactFormData, { resetForm, setSubmitting }: any) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      alert('✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
      alert('❌ Oops! Something went wrong. Please try again or contact us directly at info@stantaxes.com');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<ComponentLoader height="h-screen" message="Loading contact form..." />}>
      <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-lg overflow-hidden ">
          <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT SECTION (Info & Partners - Content is identical to the previous solution) */}
          <div className="p-8 md:p-12 lg:p-16 space-y-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
              <p className="text-gray-600 max-w-md mb-8">
Feel free to talk to our representative at any time you please use our contact form on our website or one of our contact numbers. Let us work on your future together.

You can always visit us at our HQ, we have a friendly staff and a mean cup of coffee.


              </p>

              <div className="space-y-3 mb-10">
                <div className="flex items-center space-x-2 text-gray-700">
                  <span className="font-medium">📧 shalin@sbaccounting.us</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <span className="font-medium">📞 +1 430 755 2828</span>
                </div>
              </div>

              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Trusted By</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
                {trustedPartners.map((partner) => (
                  <div key={partner.name} className="flex items-center justify-center h-12 border border-gray-300/60 rounded-md bg-white/70 p-2 text-xs font-semibold text-gray-600 shadow-sm">
                    {partner.logo}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 lg:mt-0 relative hidden lg:block self-end">
                    <img src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6740588b760df20a1555190c_contact_us.svg" alt="" />
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
                <Form className="space-y-6">
                  {/* Row 1: First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomField label="First Name*" name="firstName" placeholder="First Name" />
                    <CustomField label="Last Name*" name="lastName" placeholder="Last Name" />
                  </div>

                  {/* Row 2: Company Name & Company Website */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomField label="Company Name" name="companyName" placeholder="Company Name" />
                    <CustomField label="Company Website" name="companyWebsite" type="url" placeholder="www.company.com" />
                  </div>

                  {/* Row 3: Email & Phone Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`block w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 
                        ${touched.message && errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    />
                    <ErrorMessage name="message" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  {/* Row 6: Privacy Policy Checkbox */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Field
                        id="privacyPolicy"
                        name="privacyPolicy"
                        type="checkbox"
                        className={`h-4 w-4 rounded transition-all duration-200 cursor-pointer 
                          ${touched.privacyPolicy && errors.privacyPolicy ? 'border-red-500 text-red-600 focus:ring-red-500' : 'border-gray-300 text-blue-600 focus:ring-blue-500'}`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="privacyPolicy" className="font-medium text-gray-700 cursor-pointer">
                        You agree to our friendly{' '}
                        <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline">
                          privacy policy
                        </a>
                        .
                      </label>
                      <ErrorMessage name="privacyPolicy" component="div" className="text-sm text-red-500" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 disabled:opacity-60"
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