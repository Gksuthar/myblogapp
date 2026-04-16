import { connectDB } from "@/lib/mongodb";
import { parseMultipartFormData } from "@/lib/multipart";
import { deletePublicUploadIfLocal, saveImageFileToPublicUploads } from "@/lib/uploads";
import Blog from "../model/blog";
import { NextResponse } from "next/server";

// 📌 GET ALL OR SINGLE BLOG
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const blog = await Blog.findOne({ slug }).lean();
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(blogs ?? []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// 📌 CREATE BLOG (with image upload)
export async function POST(req: Request) {
  await connectDB();

  try {
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;

    // 🧾 Get fields
    const title = formData.get("title");
    const content = formData.get("content");
    const excerpt = formData.get("excerpt");
    const author = formData.get("author");
    const slug = formData.get("slug");
    const published = formData.get("published") === "true";
    const imageFile = formData.get("image");

    const tagsRaw = formData.get("tags");
    let tags: string[] = [];
    if (typeof tagsRaw === "string" && tagsRaw.trim() !== "") {
      try {
        const parsedTags = JSON.parse(tagsRaw);
        if (!Array.isArray(parsedTags)) {
          return NextResponse.json({ error: "Invalid tags" }, { status: 400 });
        }
        tags = parsedTags
          .filter((t: unknown) => typeof t === "string")
          .map((t: string) => t.slice(0, 50))
          .slice(0, 30);
      } catch {
        return NextResponse.json({ error: "Invalid tags JSON" }, { status: 400 });
      }
    }

    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      typeof excerpt !== 'string' ||
      typeof author !== 'string' ||
      typeof slug !== 'string' ||
      title.trim() === '' ||
      content.trim() === '' ||
      excerpt.trim() === '' ||
      author.trim() === '' ||
      slug.trim() === ''
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (title.length > 200 || excerpt.length > 500 || author.length > 100 || slug.length > 200) {
      return NextResponse.json({ error: 'Invalid input length' }, { status: 400 });
    }

    // 🧩 Check for duplicate slug
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog with this slug already exists" },
        { status: 409 }
      );
    }

    // 🖼️ Save image if present
    let imagePath = "";
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        imagePath = await saveImageFileToPublicUploads(imageFile, 'blogs');
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
    }

    // 🗃️ Create blog
    const blog = new Blog({
      title,
      content,
      excerpt,
      author,
      image: imagePath,
      tags,
      slug,
      published,
    });

    await blog.save();
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("❌ Blog upload error:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

// 📌 UPDATE BLOG
// 📌 UPDATE BLOG (with optional image upload)
export async function PUT(req: Request) {
  await connectDB();

  try {
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;

    const id = formData.get("id");
    const title = formData.get("title");
    const content = formData.get("content");
    const excerpt = formData.get("excerpt");
    const author = formData.get("author");
    const slug = formData.get("slug");
    const published = formData.get("published") === "true";
    const imageFile = formData.get("image");

    const tagsRaw = formData.get("tags");
    let tags: string[] = [];
    if (typeof tagsRaw === "string" && tagsRaw.trim() !== "") {
      try {
        const parsedTags = JSON.parse(tagsRaw);
        if (!Array.isArray(parsedTags)) {
          return NextResponse.json({ error: "Invalid tags" }, { status: 400 });
        }
        tags = parsedTags
          .filter((t: unknown) => typeof t === "string")
          .map((t: string) => t.slice(0, 50))
          .slice(0, 30);
      } catch {
        return NextResponse.json({ error: "Invalid tags JSON" }, { status: 400 });
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    // Get existing blog
    const existing = await Blog.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // 🖼️ Handle new image upload (optional)
    let imagePath = existing.image || '';
    if (imageFile instanceof File && imageFile.size > 0) {
      let newPath = '';
      try {
        newPath = await saveImageFileToPublicUploads(imageFile, 'blogs');
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
      await deletePublicUploadIfLocal(existing.image || '');
      imagePath = newPath;
    }

    // 🗃️ Update blog
    if (typeof title === 'string') existing.title = title;
    if (typeof content === 'string') existing.content = content;
    if (typeof excerpt === 'string') existing.excerpt = excerpt;
    if (typeof author === 'string') existing.author = author;
    if (typeof slug === 'string') existing.slug = slug;

    existing.image = imagePath;
    existing.tags = tags;
    existing.published = published;

    await existing.save();

    return NextResponse.json({ success: true, blog: existing }, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// 📌 DELETE BLOG
export async function DELETE(req: Request) {
  await connectDB();

  try {
    let id: string | undefined;

    try {
      const body = await req.json();
      id = body?.id;
    } catch {
      const { searchParams } = new URL(req.url);
      id = searchParams.get("id") || undefined;
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID is required to delete blog" },
        { status: 400 }
      );
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await deletePublicUploadIfLocal(deletedBlog.image || '');

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
