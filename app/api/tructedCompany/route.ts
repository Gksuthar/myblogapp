import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { parseMultipartFormData } from "@/lib/multipart";
import { saveUploadedFile } from '@/lib/upload';
import { deletePublicUploadIfLocal } from "@/lib/uploads";
import { Tructed } from "../model/trusted";

// --- GET ---
export async function GET() {
  await connectDB();
  try {
    const trustedCompanies = await Tructed.find().sort({ createdAt: -1 });
    return NextResponse.json(trustedCompanies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch trusted companies" }, { status: 500 });
  }
}

// --- POST (with image upload) ---
export async function POST(req: Request) {
  await connectDB();

  try {
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    let imagePath = "";

    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        imagePath = await saveUploadedFile(imageFile);
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
    }

    const newTrusted = new Tructed({ name, image: imagePath });
    await newTrusted.save();

    return NextResponse.json(newTrusted, { status: 201 });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return NextResponse.json({ error: "Failed to add trusted company" }, { status: 500 });
  }
}

// --- PATCH ---
export async function PATCH(req: Request) {
  await connectDB();

  try {
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const trustedCompany = await Tructed.findById(id);
    if (!trustedCompany) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (name) trustedCompany.name = name;

    if (imageFile instanceof File && imageFile.size > 0) {
      let newPath = '';
      try {
        newPath = await saveUploadedFile(imageFile);
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }

      await deletePublicUploadIfLocal(trustedCompany.image || '');
      trustedCompany.image = newPath;
    }

    await trustedCompany.save();
    return NextResponse.json(trustedCompany, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update trusted company" }, { status: 500 });
  }
}

// --- DELETE ---
export async function DELETE(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const deleted = await Tructed.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    return NextResponse.json({ message: "Company deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete trusted company" }, { status: 500 });
  }
}
