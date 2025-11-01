import mongoose, { Schema } from 'mongoose';

const AboutHeroSchema = new Schema({
  headline: {
    type: String,
    required: [true, 'Headline is required'],
    trim: true,
  },
  subheadline: {
    type: String,
    default: '',
  },
  backgroundImage: {
    type: String,
    default: '',
  },
  ctaText: {
    type: String,
    default: '',
  },
  ctaUrl: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

export default mongoose.models.AboutHero || mongoose.model('AboutHero', AboutHeroSchema);