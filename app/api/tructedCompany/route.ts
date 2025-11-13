import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Tructed } from "../model/trusted";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

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
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    let imagePath = "";

    if (imageFile) {
      // Convert file to buffer
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure /public/uploads exists
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(uploadDir, fileName);

      // Save file to /public/uploads
      await writeFile(uploadPath, buffer);

      imagePath = `/uploads/${fileName}`; // relative path accessible on frontend
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
    const formData = await req.formData();
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

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(uploadDir, fileName);
      await writeFile(uploadPath, buffer);

      trustedCompany.image = `/uploads/${fileName}`;
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
