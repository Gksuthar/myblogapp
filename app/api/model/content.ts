import mongoose from "mongoose";

// Hero (Home Hero)
const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  disc: { type: String, required: true },
  image: { type: String },
}, { timestamps: true });

export const Content = mongoose.models.Content || mongoose.model("Content", ContentSchema);