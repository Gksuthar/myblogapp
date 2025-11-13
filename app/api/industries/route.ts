import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { IndustryCard } from "../model/IndustryCard";
import { Types } from "mongoose";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

async function saveImageToUploads(file: File | null) {
  if (!file) return "";
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(uploadDir, fileName);
  await writeFile(uploadPath, buffer);

  return `/uploads/${fileName}`;
}

export async function GET() {
  await connectDB();
  try {
    const items = await IndustryCard.find().sort({ _id: -1 });
    return NextResponse.json({ data: items });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch industries", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const tags = JSON.parse(formData.get("tags")?.toString() || "[]");

    const imageFile = formData.get("image");
    let imagePath = "";

    if (imageFile instanceof File) {
      imagePath = await saveImageToUploads(imageFile);
    } else if (typeof imageFile === "string") {
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
  } catch (error: any) {
    console.error("❌ POST error:", error);
    return NextResponse.json(
      { error: "Failed to create industry", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await connectDB();
  try {
    const formData = await req.formData();

    const id = formData.get('id')?.toString() || '';
    const title = formData.get('title')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const tags = JSON.parse(formData.get('tags')?.toString() || '[]');

    const imageFile = formData.get('image');
    let imagePath = '';

    if (imageFile instanceof File) {
      imagePath = await saveImageToUploads(imageFile);
    } else if (typeof imageFile === 'string') {
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
  } catch (error: any) {
    console.error('❌ PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update industry', details: error.message },
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
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete industry", details: error.message },
      { status: 500 }
    );
  }
}
