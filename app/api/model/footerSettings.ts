import mongoose, { Schema } from 'mongoose';

const CertificationSchema = new Schema({
  label: { type: String, required: true },
  image: { type: String, default: '' }, // optional future use
});

const FooterSettingsSchema = new Schema(
  {
    certifications: { type: [CertificationSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.FooterSettings || mongoose.model('FooterSettings', FooterSettingsSchema);
