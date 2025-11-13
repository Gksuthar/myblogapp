import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { caseStudyschema } from "@/app/api/model/casestudy";
import path from 'path';
import { promises as fs } from 'fs';

// Utility function to create a slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// *** NEW HELPER for saving File objects ***
const saveFile = async (file: File, folder = 'uploads') => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and create filename
    const ext = file.type.split('/')[1] || 'png';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', folder);
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    return `/${folder}/${filename}`; // web-accessible path
  } catch (err) {
    console.error('File save error:', err);
    return ''; // Return empty string on failure
  }
};


// ✅ GET - (No changes needed)
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

// ✅ POST - Create new case study (Updated for FormData)
export async function POST(req: Request) {
  await connectDB();

  try {
    // 1. Read FormData
    const formData = await req.formData();

    // 2. Get text fields
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const headerTitle = formData.get("headerTitle") as string;
    const headerDescription = formData.get("headerDescription") as string;
    const cardsDataString = formData.get("cardsData") as string;

    if (!title || !content || !headerTitle || !headerDescription || !cardsDataString) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // 3. Parse cards metadata
    const cardsInfo = JSON.parse(cardsDataString);
    const processedCards = [];

    // 4. Process each card
    for (let i = 0; i < cardsInfo.length; i++) {
      const cardInfo = cardsInfo[i];
      const file = formData.get(`cardImage_${i}`) as File | null;

      let imagePath = "";

      if (file) {
        // Save the new file
        imagePath = await saveFile(file, 'uploads');
      } else if (cardInfo.cardImage) {
        // Use existing path (less likely in POST, but good practice)
        imagePath = cardInfo.cardImage;
      }

      if (!cardInfo.cardTitle || !cardInfo.cardDescription || !imagePath) {
        return NextResponse.json({ error: `Card ${i} is missing title, description, or image` }, { status: 400 });
      }

      processedCards.push({
        cardTitle: cardInfo.cardTitle,
        cardDescription: cardInfo.cardDescription,
        cardImage: imagePath,
      });
    }

    // 5. Generate unique slug
    const baseSlug = createSlug(title);
    let counter = 1;
    let uniqueSlug = baseSlug;
    while (await caseStudyschema.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 6. Save to DB
    const newCaseStudy = new caseStudyschema({
      title,
      slug: uniqueSlug,
      content,
      headerTitle,
      headerDescription,
      cards: processedCards,
    });

    await newCaseStudy.save();
    return NextResponse.json(newCaseStudy, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create case study" }, { status: 500 });
  }
}

// ✅ PATCH - Update case study (Updated for FormData)
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

    // 1. Read FormData
    const formData = await req.formData();

    // 2. Get fields
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const headerTitle = formData.get("headerTitle") as string;
    const headerDescription = formData.get("headerDescription") as string;
    const cardsDataString = formData.get("cardsData") as string;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await caseStudyschema.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    // 3. Process Cards
    const cardsInfo = JSON.parse(cardsDataString);
    const processedCards = [];

    for (let i = 0; i < cardsInfo.length; i++) {
      const cardInfo = cardsInfo[i];
      const file = formData.get(`cardImage_${i}`) as File | null;

      let imagePath = "";

      if (file) {
        // Save the new file
        imagePath = await saveFile(file, 'uploads');
        // TODO: Delete old image (cardInfo.cardImage) from filesystem if it was a file path
      } else {
        // No new file, use existing path
        imagePath = cardInfo.cardImage;
      }

      if (!cardInfo.cardTitle || !cardInfo.cardDescription || !imagePath) {
        return NextResponse.json({ error: `Card ${i} is missing title, description, or image` }, { status: 400 });
      }

      processedCards.push({
        cardTitle: cardInfo.cardTitle,
        cardDescription: cardInfo.cardDescription,
        cardImage: imagePath,
      });
    }

    // 4. Prepare update data
    const updateData: CaseStudyUpdate = {
      title,
      content,
      headerTitle,
      headerDescription,
      cards: processedCards
    };

    // If title changed, regenerate slug
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

    // 5. Update in DB
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

// ✅ DELETE - (No changes needed)
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

    // TODO: Iterate over deleted.cards and delete each cardImage from the filesystem

    return NextResponse.json({ message: "Case study deleted successfully", deleted }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 });
  }
}