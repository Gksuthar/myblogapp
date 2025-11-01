import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  cardTitle: { type: String, required: false },
  cardDescription: { type: String, required: false },
  cardImage: { type: String, required: false },
});

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    headerTitle: { type: String, required: false },
    headerDescription: { type: String, required: false },
    cards: { type: [cardSchema], default: [] },
  },
  { timestamps: true }
);

export const caseStudyschema =
  mongoose.models.caseStudy || mongoose.model("caseStudy", caseStudySchema);
