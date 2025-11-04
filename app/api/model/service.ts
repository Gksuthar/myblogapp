import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

// --- Category Schema ---
const CategorySchema = new Schema(
  {
    name: { type: String, trim: true, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true, collection: 'categories' }
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema>;

export const CategoryModel: Model<CategoryDoc> =
  mongoose.models.Category || mongoose.model<CategoryDoc>('Category', CategorySchema);

// --- Service Sub-Schemas ---

const CardSchema = new Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const CardSectionSchema = new Schema(
  {
    sectionTitle: { type: String, default: '' },
    sectionDescription: { type: String, default: '' },
    cards: { type: [CardSchema], default: [] },
  },
  { _id: true }
);

const HeroSectionSchema = new Schema(
  {
    image: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const cserviceCardView = new Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: true }
);

// --- Service Schema ---
const ServiceSchema = new Schema(
  {
    categoryId: { type: String, ref: 'Category', default: '' },
    slug: { type: String, trim: true, default: '' },
    heroSection: { type: HeroSectionSchema, default: {} },
    cardSections: { type: [CardSectionSchema], default: [] },
    serviceCardView:{type:[cserviceCardView] , default:[]},
    content: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'services',
  }
);

export type ServiceDoc = InferSchemaType<typeof ServiceSchema>;

// ✅ Force Mongoose to drop cached model before redefining
delete mongoose.models.Service;

export const ServiceModel: Model<ServiceDoc> =
  mongoose.model<ServiceDoc>('Service', ServiceSchema);
