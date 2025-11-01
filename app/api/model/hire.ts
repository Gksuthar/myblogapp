import mongoose from "mongoose";

const hireSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    disc: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot reload
const hireschema = mongoose.models.hire || mongoose.model("hire", hireSchema);
export default hireschema;
