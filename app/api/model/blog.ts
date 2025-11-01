import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  published: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Avoid recompiling model in Next.js hot reload
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;