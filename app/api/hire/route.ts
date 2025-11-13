import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import hireschema from "../model/hire";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// 🟢 GET – Fetch all heroes
export async function GET() {
  await connectDB();
  try {
    const heroes = await hireschema.find().sort({ createdAt: -1 });
    return NextResponse.json(heroes, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch heroes" }, { status: 500 });
  }
}

// 🟡 POST – Create new hero with image upload
export async function POST(req: Request) {
  await connectDB();
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const disc = formData.get("disc") as string;
    const author = formData.get("author") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title || !disc || !author) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    let imagePath = "";

    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const hero = await hireschema.create({
      title,
      disc,
      author,
      image: imagePath,
    });

    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create hero" }, { status: 500 });
  }
}

// 🟠 PATCH – Update hero (with optional image upload)
export async function PATCH(req: Request) {
  await connectDB();
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const disc = formData.get("disc") as string;
    const author = formData.get("author") as string;
    const imageFile = formData.get("image") as File | null;

    if (!id) return NextResponse.json({ error: "Hero ID required" }, { status: 400 });

    const hero = await hireschema.findById(id);
    if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

    if (title) hero.title = title;
    if (disc) hero.disc = disc;
    if (author) hero.author = author;

    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      hero.image = `/uploads/${fileName}`;
    }

    await hero.save();
    return NextResponse.json(hero, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}

// 🔴 DELETE – Remove hero
export async function DELETE(req: Request) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Hero ID is required" }, { status: 400 });

    const deleted = await hireschema.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

    return NextResponse.json({ message: "Hero deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete hero" }, { status: 500 });
  }
}
