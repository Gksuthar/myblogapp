import { connectDB } from "@/lib/mongodb";
import Blog from "../model/blog";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    // If ?slug=... is passed → return one blog
    if (slug) {
      const blog = await Blog.findOne({ slug }).lean();
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    // Otherwise → return all blogs
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    if (!blogs || blogs.length === 0) {
      return NextResponse.json({ error: "No blogs found" }, { status: 404 });
    }

    return NextResponse.json(blogs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}


// POST new blog
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { title, content, excerpt, author, image, tags, slug, published } = body;

    if (!title || !content || !excerpt || !author || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json({ error: "Blog with this slug already exists" }, { status: 409 });
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      author,
      image: image || "",
      tags: tags || [],
      slug,
      published: published !== undefined ? published : true,
    });

    await blog.save();
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, title, content, excerpt, author, image, tags, slug, published } = body;

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required to update" }, { status: 400 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, excerpt, author, image, tags, slug, published },
      { new: true } // returns updated document
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}


// DELETE blog by slug
export async function DELETE(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Slug is required to delete blog" }, { status: 400 });
    }

    const deletedBlog = await Blog.findOneAndDelete({ id });

    if (!deletedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
