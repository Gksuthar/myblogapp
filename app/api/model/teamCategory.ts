import mongoose from "mongoose";

const teamCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  tags: [{ type: String }],
  buttonText: { type: String, default: "Hire Now" },
});

const teamCategorySchema = new mongoose.Schema({
  tabName: { type: String, required: true },
  cards: [teamCardSchema],
});

export const TeamCategory = mongoose.models.TeamCategory ||  mongoose.model("TeamCategory", teamCategorySchema);
