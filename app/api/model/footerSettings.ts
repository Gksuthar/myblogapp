import mongoose, { Schema } from 'mongoose';

const CertificationSchema = new Schema({
  label: { type: String, required: true },
  image: { type: String, default: '' }, // optional future use
});

const LinkSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    title: { type: String, required: true },
    lines: { type: [String], default: [] },
  },
  { _id: false }
);

const FooterSettingsSchema = new Schema(
  {
    // Branding
    logoUrl: { type: String, default: '' },
    tagline: { type: String, default: '' },

    // Navigation
    companyLinks: { type: [LinkSchema], default: [] },

    // Certifications section
    certifications: { type: [CertificationSchema], default: [] },
    associatePartner: { type: String, default: '' },

    // Contact & addresses
    contactPhoneUSA: { type: String, default: '' },
    contactPhoneIND: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    officeUSA: { type: AddressSchema, default: { title: 'USA Office', lines: [] } },
    officeIND: { type: AddressSchema, default: { title: 'India Office', lines: [] } },
  contactNotes: { type: [String], default: [] },
  internationalNote: { type: String, default: '' },

    // Legal
    copyrightText: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.FooterSettings || mongoose.model('FooterSettings', FooterSettingsSchema);
