import mongoose from "mongoose";

const TrustedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

// Correct: avoid reusing Hero model
export const Tructed = mongoose.models.TructedCompany || mongoose.model("TructedCompany", TrustedSchema);
