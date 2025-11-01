import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("❌ Please define MONGODB_URI as an environment variable");
  }
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
    console.log("📦 Database Name:", db.connection.name);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}
