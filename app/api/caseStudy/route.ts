import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { caseStudyschema } from "@/app/api/model/casestudy";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // If ?slug=... is passed → return one blog
    if (id) {
      const blog = await caseStudyschema.findOne({ id }).lean();
      if (!blog) {
        return NextResponse.json({ error: "case studies not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    // Otherwise → return all blogs
    const blogs = await caseStudyschema.find().sort({ createdAt: -1 }).lean();
    if (!blogs || blogs.length === 0) {
      return NextResponse.json({ error: "No case studies found" }, { status: 404 });
    }

    return NextResponse.json(blogs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch case studies" },
      { status: 500 }
    );
  }
}

// ✅ POST - Create new case study
export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { title, content, headerTitle, headerDescription, cards } = body;

    if (!title || !content || !headerTitle || !headerDescription || !Array.isArray(cards)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // Validate cards
    for (const card of cards) {
      if (!card.cardTitle || !card.cardDescription || !card.cardImage) {
        return NextResponse.json({ error: "Each card must have all fields" }, { status: 400 });
      }
    }

    const newCaseStudy = new caseStudyschema({
      title,
      content,
      headerTitle,
      headerDescription,
      cards,
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
    const { id, title, content, headerTitle, headerDescription, cards } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await caseStudyschema.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    const updatedCase = await caseStudyschema.findByIdAndUpdate(
      id,
      { title, content, headerTitle, headerDescription, cards },
      { new: true }
    );

    return NextResponse.json(
      { message: "Case study updated successfully", data: updatedCase },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update case study", details: error.message },
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

    const deleted = await caseStudyschema.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Case study deleted successfully", deleted }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 });
  }
}
