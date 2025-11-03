import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { caseStudyschema } from "@/app/api/model/casestudy";

// Utility function to create a slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const title = searchParams.get('title');

    // If id, slug, or title is passed → return one case study
    if (id) {
      const caseStudy = await caseStudyschema.findById(id).lean();
      if (!caseStudy) {
        return NextResponse.json({ error: "case study not found" }, { status: 404 });
      }
      return NextResponse.json(caseStudy);
    }

    if (slug) {
      const caseStudy = await caseStudyschema.findOne({ slug }).lean();
      if (!caseStudy) {
        return NextResponse.json({ error: "case study not found" }, { status: 404 });
      }
      return NextResponse.json(caseStudy);
    }

    if (title) {
      // Try to find by exact title or by generated slug from title
      const generatedSlug = createSlug(title);
      
      // First try to find by slug or title
      let caseStudy = await caseStudyschema.findOne({
        $or: [{ title }, { slug: generatedSlug }, { slug: title }]
      }).lean();
      
      // If not found, try to find any case study and check if the title matches when slugified
      if (!caseStudy) {
        const allCaseStudies = await caseStudyschema.find().lean();
        const foundStudy = allCaseStudies.find((cs) => {
          const csSlug = cs.slug || createSlug(cs.title);
          return csSlug === generatedSlug || csSlug === title;
        });
        if (foundStudy) {
          caseStudy = foundStudy;
        }
      }
      
      if (!caseStudy) {
        return NextResponse.json({ error: "case study not found" }, { status: 404 });
      }
      return NextResponse.json(caseStudy);
    }

    // Otherwise → return all case studies
    const caseStudies = await caseStudyschema.find().sort({ createdAt: -1 }).lean();
    if (!caseStudies || caseStudies.length === 0) {
      // Normalize empty list responses to 200 with [] to avoid breaking UIs
      return NextResponse.json([]);
    }

    return NextResponse.json(caseStudies);
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

    // Generate unique slug
    const baseSlug = createSlug(title);
    let counter = 1;
    let uniqueSlug = baseSlug;
    while (await caseStudyschema.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newCaseStudy = new caseStudyschema({
      title,
      slug: uniqueSlug,
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
    type CaseStudyUpdate = {
      title?: string;
      content?: string;
      headerTitle?: string;
      headerDescription?: string;
      cards?: Array<{ cardTitle: string; cardDescription: string; cardImage: string }>;
      slug?: string;
    };
    const body = await req.json();
    const { id, title, content, headerTitle, headerDescription, cards } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await caseStudyschema.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    // If title changed, regenerate slug
    const updateData: CaseStudyUpdate = { title, content, headerTitle, headerDescription, cards };
    if (title !== existing.title) {
      const baseSlug = createSlug(title);
      let counter = 1;
      let uniqueSlug = baseSlug;
      while (await caseStudyschema.findOne({ slug: uniqueSlug, _id: { $ne: id } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = uniqueSlug;
    }

    const updatedCase = await caseStudyschema.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json(
      { message: "Case study updated successfully", data: updatedCase },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update case study", details: error instanceof Error ? error.message : 'Unknown error' },
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
