import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { BlogSectionlatest } from "../model/BlogSection";

// ✅ GET - Fetch all blogs
export async function GET() {
  try {
    await connectDB();
    const blogs = await BlogSectionlatest.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// ✅ POST - Create new blog
export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, image, disc } = await req.json();

    if (!title || !image || !disc) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const newBlog = await BlogSectionlatest.create({ title, image, disc });
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

// ✅ PATCH - Update blog
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, title, image, disc } = await req.json();

    const updated = await BlogSectionlatest.findByIdAndUpdate(
      id,
      { title, image, disc },
      { new: true }
    );

    if (!updated)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// ✅ DELETE - Delete blog
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    const deleted = await BlogSectionlatest.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
