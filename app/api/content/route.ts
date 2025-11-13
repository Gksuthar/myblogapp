import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Content } from "../model/content";

export async function GET() {
  try {
    await connectDB()
    const items = await Content.find().sort({ createdAt: -1 }).lean();
    if (!items || items.length === 0) {
      // Normalize empty list responses to 200 with [] to avoid breaking UIs
      return NextResponse.json([]);
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
} 

// ✅ POST - Create new case study
export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { title, disc, image } = body;

    if (!title ||!disc || !image ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const newCaseStudy = new Content({
      title,
      disc,
      image
    });

    await newCaseStudy.save();
    return NextResponse.json(newCaseStudy, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create case study" }, { status: 500 });
  }
}

// ✅ PATCH - Update case study
export async function PATCH(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const {  id, title, disc, image } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await Content.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    const updatedCase = await Content.findByIdAndUpdate(
      id,
      { title, disc, image },
      { new: true }
    );

    return NextResponse.json(
      { message: "Case study updated successfully", data: updatedCase },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update content", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete a case study
export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    const deleted = await Content.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Case study deleted successfully", deleted }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
