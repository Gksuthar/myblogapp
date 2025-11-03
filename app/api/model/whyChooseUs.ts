import mongoose, { Schema } from 'mongoose';

const BenefitSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
});

const WhyChooseUsSchema = new Schema(
  {
    title: { type: String, default: 'Why Choose Us?' },
    intro: { type: [String], default: [] },
    benefits: { type: [BenefitSchema], default: [] },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    coreValues: { type: [String], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.WhyChooseUs || mongoose.model('WhyChooseUs', WhyChooseUsSchema);
