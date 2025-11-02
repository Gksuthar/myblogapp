import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { BlogSectionlatest } from "../../model/BlogSection";

// Utility function to create a slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Migration endpoint to add slugs to existing blogs
export async function POST() {
  try {
    await connectDB();
    
    // Find all blogs without slugs
    const blogsWithoutSlugs = await BlogSectionlatest.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" }
      ]
    });

    if (blogsWithoutSlugs.length === 0) {
      return NextResponse.json({
        message: "All blogs already have slugs",
        updated: 0
      });
    }

    const updates = [];
    for (const blog of blogsWithoutSlugs) {
      const baseSlug = createSlug(blog.title);
      let counter = 1;
      let uniqueSlug = baseSlug;
      
      // Ensure slug is unique
      while (await BlogSectionlatest.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      updates.push(
        BlogSectionlatest.findByIdAndUpdate(blog._id, { slug: uniqueSlug })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({
      message: "Successfully added slugs to blogs",
      updated: blogsWithoutSlugs.length,
      blogs: blogsWithoutSlugs.map((b) => ({
        id: b._id,
        title: b.title,
        slug: createSlug(b.title)
      }))
    });
  } catch (error) {
    console.error("Migration Error:", error);
    return NextResponse.json(
      { error: "Failed to migrate blogs" },
      { status: 500 }
    );
  }
}
