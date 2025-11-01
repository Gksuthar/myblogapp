import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import hireschema from "../model/hire";

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

// 🟡 POST – Create new hero
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { title, disc, author, image, published } = body;

    if (!title || !disc || !author) {
      return NextResponse.json(
        { error: "Title, description, and author are required." },
        { status: 400 }
      );
    }

    const hero = await hireschema.create({
      title,
      disc,
      author,
      image: image || "",
      published: published ?? true,
    });

    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create hero" }, { status: 500 });
  }
}

// 🟠 PATCH – Update hero by ID
export async function PATCH(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, title, disc, author, image, published } = body;

    if (!id) return NextResponse.json({ error: "Hero ID is required" }, { status: 400 });

    const hero = await hireschema.findById(id);
    if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

    if (title) hero.title = title;
    if (disc) hero.disc = disc;
    if (author) hero.author = author;
    if (image) hero.image = image;
    if (typeof published === "boolean") hero.published = published;

    await hero.save();
    return NextResponse.json(hero, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}

// 🔴 DELETE – Remove hero by ID
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
