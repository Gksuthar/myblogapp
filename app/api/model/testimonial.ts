import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: false },
    quote: { type: String, required: true },
    image: { type: String, required: false }, // URL or /uploads/ path
  },
  { timestamps: true }
);

export const testimonialModel = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

export default testimonialModel;
