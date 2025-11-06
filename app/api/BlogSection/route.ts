import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { BlogSectionlatest } from "../model/BlogSection";

// Utility function to create a slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

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

    // Generate slug from title
    const slug = createSlug(title);
    
    // Ensure slug is unique by appending a number if needed
    let counter = 1;
    let uniqueSlug = slug;
    while (await BlogSectionlatest.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const newBlog = await BlogSectionlatest.create({ title, image, disc, slug: uniqueSlug });
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

    // Get existing blog to check if title changed
    const existingBlog = await BlogSectionlatest.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // If title changed, regenerate slug
    const updateData: any = { title, image, disc };
    if (title !== existingBlog.title) {
      const baseSlug = createSlug(title);
      let counter = 1;
      let uniqueSlug = baseSlug;
      while (await BlogSectionlatest.findOne({ slug: uniqueSlug, _id: { $ne: id } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = uniqueSlug;
    }

    const updated = await BlogSectionlatest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

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
