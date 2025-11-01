import mongoose, { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true }, // base64 or url
    disc: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// ✅ Avoid model overwrite errors during hot reload
export const BlogSectionlatest = models.Bloglatest || model("Bloglatest", BlogSchema);
