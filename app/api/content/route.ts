import { connectDB } from "@/lib/mongodb";
import { parseMultipartFormData } from "@/lib/multipart";
import { deletePublicUploadIfLocal, saveImageFileToPublicUploads } from "@/lib/uploads";
import { NextResponse } from "next/server";
import { Content } from "../model/content";

export async function GET() {
  try {
    await connectDB();
    const items = await Content.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items ?? []);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// ✅ POST - Create
export async function POST(req: Request) {
  await connectDB();
  try {
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;
    const title = formData.get("title") as string;
    const disc = formData.get("disc") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title || !disc || !imageFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imagePath = '';
    try {
      imagePath = await saveImageFileToPublicUploads(imageFile, 'content');
    } catch {
      return NextResponse.json({ error: "Invalid image upload" }, { status: 400 });
    }

    const newDoc = new Content({ title, disc, image: imagePath });
    await newDoc.save();

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}

// ✅ PUT - Update
export async function PUT(req: Request) {
  await connectDB();
  try {
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const disc = formData.get("disc") as string;
    const imageFile = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await Content.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    let imagePath = existing.image;
    if (imageFile instanceof File && imageFile.size > 0) {
      let newPath = '';
      try {
        newPath = await saveImageFileToPublicUploads(imageFile, 'content');
      } catch {
        return NextResponse.json({ error: "Invalid image upload" }, { status: 400 });
      }

      await deletePublicUploadIfLocal(existing.image || '');
      imagePath = newPath;
    }

    const updated = await Content.findByIdAndUpdate(
      id,
      { title, disc, image: imagePath },
      { new: true }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update content", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE
export async function DELETE(req: Request) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const deleted = await Content.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deletePublicUploadIfLocal(deleted.image || '');

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
