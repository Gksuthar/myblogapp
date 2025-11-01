import mongoose, { Schema, Document } from "mongoose";

export interface IIndustryCard extends Document {
  title: string;
  description: string;
  image: string; 
  tags?: string[];
}

const IndustryCardSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  tags: [{ type: String }],
});

export const IndustryCard =
  mongoose.models.IndustryCard ||
  mongoose.model<IIndustryCard>("IndustryCard", IndustryCardSchema);
