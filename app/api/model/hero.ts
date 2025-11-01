import mongoose from "mongoose";

// Hero (Home Hero)
const HeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  disc: { type: String, required: true },
  image: { type: String },
  buttonText: { type: String },
}, { timestamps: true });

export const Hero = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);

// Blog Hero
const BlogHeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  disc: { type: String, required: true },
  image: { type: String },
  buttonText: { type: String },
}, { timestamps: true });

export const BlogHero = mongoose.models.BlogHero || mongoose.model("BlogHero", BlogHeroSchema);

// About Hero
const AboutHeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  disc: { type: String, required: true },
  image: { type: String },
  buttonText: { type: String },
}, { timestamps: true });

export const AboutHero = mongoose.models.AboutHero || mongoose.model("AboutHero", AboutHeroSchema);
