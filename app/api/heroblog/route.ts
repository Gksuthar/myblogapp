import { connectDB } from "@/lib/mongodb";
import { BlogHero } from "../model/hero"; // Make sure this path is correct
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
// Note: You might need to run `npm install fs promises path` if not already part of Node

// GET all heroes
export async function GET() {
  await connectDB();
  try {
    // Changed from findOne to find, as your frontend maps an array
    const heroes = await BlogHero.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(heroes ?? []);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero data" },
      { status: 500 }
    );
  }
}

// POST method (Create new hero with file upload)
export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const disc = formData.get("disc") as string;
    const buttonText = (formData.get("buttonText") as string) || "";
    const imageFile = formData.get("image") as File | null;

    if (!title || !disc) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    let imagePath = "";
    if (imageFile && imageFile.name) {
      // --- File Upload Logic ---
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Create a specific directory for hero uploads
      const uploadDir = path.join(process.cwd(), "public/uploads/hero");
      await mkdir(uploadDir, { recursive: true });

      // Sanitize filename and make unique
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      imagePath = `/uploads/hero/${fileName}`; // Path to be saved in DB
      // -------------------------
    }

    const hero = new BlogHero({
      title,
      disc,
      image: imagePath,
      buttonText,
    });

    await hero.save();
    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create hero" },
      { status: 500 }
    );
  }
}

// PUT method (Update existing hero, replaces PATCH)
export async function PUT(req: Request) {
  await connectDB();
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const disc = formData.get("disc") as string;
    const buttonText = (formData.get("buttonText") as string) || "";
    const imageFile = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json({ error: "Hero ID is required" }, { status: 400 });
    }

    const existingHero = await BlogHero.findById(id);
    if (!existingHero) {
      return NextResponse.json({ error: "Hero not found" }, { status: 404 });
    }

    // Keep old image path by default
    let imagePath = existingHero.image;

    // If a new image is uploaded, process it
    if (imageFile && imageFile.name) {
      // --- File Upload Logic (same as POST) ---
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads/hero");
      await mkdir(uploadDir, { recursive: true });
      
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      imagePath = `/uploads/hero/${fileName}`; // Set to the new path
      // -------------------------
      // TODO: Delete old image file from server to save space
    }

    const updatedHero = await BlogHero.findByIdAndUpdate(
      id,
      {
        title: title || existingHero.title,
        disc: disc || existingHero.disc,
        buttonText: buttonText || existingHero.buttonText,
        image: imagePath,
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(updatedHero, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update hero" },
      { status: 500 }
    );
  }
}

// DELETE method
export async function DELETE(req: Request) {
  await connectDB();
  try {
    const { id } = await req.json(); // DELETE still uses JSON body for ID
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const deleted = await BlogHero.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    // TODO: Delete image file from server
    
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}