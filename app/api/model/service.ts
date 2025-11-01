// src/models/service.ts (or wherever your model file is located)

import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

// --- Category Schemas ---

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
    },
    { timestamps: true, collection: 'categories' } // Explicitly setting collection name for safety
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema>;

export const CategoryModel: Model<CategoryDoc> =
    mongoose.models.Category || mongoose.model<CategoryDoc>('Category', CategorySchema);

// --- Service Sub-Schemas ---

const CardSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: true }
);

const CardSectionSchema = new Schema(
    {
        sectionTitle: { type: String, required: true },
        sectionDescription: { type: String, default: '' },
        cards: { type: [CardSchema], default: [] },
    },
    { _id: true }
);

const HeroSectionSchema = new Schema(
    {
        image: { type: String, default: '' }, // base64 or URL
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: false }
);

// --- Service Schema ---

const ServiceSchema = new Schema(
    {
        categoryId: { type: String, ref: 'Category', required: true },
        slug: { type: String, required: true, unique: true, trim: true },
        heroSection: { type: HeroSectionSchema, required: true },
        cardSections: { type: [CardSectionSchema], default: [] },
        content: { type: String, default: '' },
    },
    { 
        timestamps: true,
        // 💡 CRITICAL FIX/SAFETY: Explicitly defining the collection name 
        // to ensure Mongoose finds your documents.
        collection: 'services' 
    }
);

export type ServiceDoc = InferSchemaType<typeof ServiceSchema>;

export const ServiceModel: Model<ServiceDoc> =
    mongoose.models.Service || mongoose.model<ServiceDoc>('Service', ServiceSchema);

    