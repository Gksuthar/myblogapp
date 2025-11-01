import mongoose, { Schema } from 'mongoose';

// Define the About schema
const AboutSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  mission: {
    type: String,
    required: [true, 'Mission statement is required'],
  },
  vision: {
    type: String,
    required: [true, 'Vision statement is required'],
  },
  team: [{
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    }
  }],
  companyHistory: {
    type: String,
    required: [true, 'Company history is required'],
  },
  values: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Create or use existing About model
export default mongoose.models.About || mongoose.model('About', AboutSchema);