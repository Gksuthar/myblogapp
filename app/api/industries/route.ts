import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { parseMultipartFormData } from "@/lib/multipart";
import { saveUploadedFile } from '@/lib/upload';
import { IndustryCard } from "../model/IndustryCard";
import { Types } from "mongoose";

export async function GET() {
  await connectDB();
  try {
    const items = await IndustryCard.find().sort({ _id: -1 });
    return NextResponse.json({ data: items });
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch industries", details },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";

    const tagsRaw = formData.get("tags")?.toString() || "[]";
    let tags: string[] = [];
    try {
      const parsedTags = JSON.parse(tagsRaw);
      if (!Array.isArray(parsedTags)) {
        return NextResponse.json({ error: 'Invalid tags' }, { status: 400 });
      }
      tags = parsedTags
        .filter((t: unknown) => typeof t === 'string')
        .map((t: string) => t.slice(0, 50))
        .slice(0, 30);
    } catch {
      return NextResponse.json({ error: 'Invalid tags JSON' }, { status: 400 });
    }

    const imageFile = formData.get("image");
    let imagePath = "";

    if (imageFile instanceof File) {
      try {
        imagePath = await saveUploadedFile(imageFile);
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
    } else if (typeof imageFile === "string") {
      if (imageFile.length > 300 || (imageFile !== '' && !imageFile.startsWith('/uploads/'))) {
        return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
      }
      imagePath = imageFile;
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const doc = await IndustryCard.create({
      title,
      description,
      image: imagePath,
      tags,
    });

    return NextResponse.json(
      { message: "Industry created successfully", data: doc },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("❌ POST error:", error);
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create industry", details },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await connectDB();
  try {
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;

    const id = formData.get('id')?.toString() || '';
    const title = formData.get('title')?.toString() || '';
    const description = formData.get('description')?.toString() || '';

    const tagsRaw = formData.get('tags')?.toString() || '[]';
    let tags: string[] = [];
    try {
      const parsedTags = JSON.parse(tagsRaw);
      if (!Array.isArray(parsedTags)) {
        return NextResponse.json({ error: 'Invalid tags' }, { status: 400 });
      }
      tags = parsedTags
        .filter((t: unknown) => typeof t === 'string')
        .map((t: string) => t.slice(0, 50))
        .slice(0, 30);
    } catch {
      return NextResponse.json({ error: 'Invalid tags JSON' }, { status: 400 });
    }

    const imageFile = formData.get('image');
    let imagePath = '';

    if (imageFile instanceof File) {
      try {
        imagePath = await saveUploadedFile(imageFile);
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
    } else if (typeof imageFile === 'string') {
      if (imageFile.length > 300 || (imageFile !== '' && !imageFile.startsWith('/uploads/'))) {
        return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
      }
      imagePath = imageFile;
    }

    if (!id) {
      return NextResponse.json({ error: 'Industry id is required' }, { status: 400 });
    }
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id format' }, { status: 400 });
    }

    const updated = await IndustryCard.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(imagePath && { image: imagePath }),
        ...(tags && { tags }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Industry updated successfully', data: updated });
  } catch (error: unknown) {
    console.error('❌ PUT error:', error);
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: 'Failed to update industry', details },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id } = body || {};
    if (!id) {
      return NextResponse.json({ error: "Industry id is required" }, { status: 400 });
    }
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }
    const deleted = await IndustryCard.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Industry deleted" });
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete industry", details },
      { status: 500 }
    );
  }
}
