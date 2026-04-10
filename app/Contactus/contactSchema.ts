import * as yup from 'yup';

export const contactSchema = yup
  .object({
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
  })
  .required();
