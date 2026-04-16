import { connectDB } from "@/lib/mongodb";
import { parseMultipartFormData } from "@/lib/multipart";
import { saveImageFileToPublicUploads } from "@/lib/uploads";
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

type CaseStudyCardInfo = {
  cardTitle?: unknown;
  cardDescription?: unknown;
  cardImage?: unknown;
};

async function generateUniqueSlug(baseSlug: string, excludeId?: string) {
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? baseSlug : `${baseSlug}-${i}`;
    const query = excludeId
      ? ({ slug: candidate, _id: { $ne: excludeId } } as Record<string, unknown>)
      : ({ slug: candidate } as Record<string, unknown>);
    const exists = await caseStudyschema.exists(query);
    if (!exists) return candidate;
  }
  throw new Error('Unable to generate unique slug');
}

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
      const caseStudy = await caseStudyschema.findOne({
        $or: [{ title }, { slug: generatedSlug }, { slug: title }]
      }).lean();

      // Avoid full-collection scans here (can hang the server on large datasets).
      // If not found by title/slug, return 404.

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
  try {
    await connectDB();
    // 1. Read FormData
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;

    // 2. Get text fields
    const title = formData.get("title");
    const content = formData.get("content");
    const headerTitle = formData.get("headerTitle");
    const headerDescription = formData.get("headerDescription");
    const cardsDataString = formData.get("cardsData");

    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      typeof headerTitle !== 'string' ||
      typeof headerDescription !== 'string' ||
      typeof cardsDataString !== 'string' ||
      title.trim() === '' ||
      content.trim() === ''
    ) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    if (title.length > 200 || headerTitle.length > 200 || headerDescription.length > 2000 || content.length > 250_000) {
      return NextResponse.json({ error: 'Invalid input length' }, { status: 400 });
    }

    // 3. Parse cards metadata
    let cardsInfo: unknown[] = [];
    try {
      const parsedCards = JSON.parse(cardsDataString);
      if (!Array.isArray(parsedCards)) {
        return NextResponse.json({ error: 'cardsData must be an array' }, { status: 400 });
      }
      cardsInfo = parsedCards;
    } catch {
      return NextResponse.json({ error: 'Invalid cardsData JSON' }, { status: 400 });
    }

    if (cardsInfo.length > 25) {
      return NextResponse.json({ error: 'Too many cards' }, { status: 400 });
    }

    const processedCards: Array<{ cardTitle: string; cardDescription: string; cardImage: string }> = [];

    // 4. Process each card
    for (let i = 0; i < cardsInfo.length; i++) {
      const raw = cardsInfo[i];
      const cardInfo: CaseStudyCardInfo = raw && typeof raw === 'object' ? (raw as CaseStudyCardInfo) : {};
      const file = formData.get(`cardImage_${i}`) as File | null;

      let imagePath = "";

      if (file instanceof File) {
        try {
          imagePath = await saveImageFileToPublicUploads(file, 'case-studies');
        } catch {
          return NextResponse.json({ error: `Card ${i} has an invalid image upload` }, { status: 400 });
        }
      } else if (typeof cardInfo.cardImage === 'string') {
        // Allow existing local upload paths only.
        if (cardInfo.cardImage.length > 300 || (cardInfo.cardImage !== '' && !cardInfo.cardImage.startsWith('/uploads/'))) {
          return NextResponse.json({ error: `Card ${i} has an invalid image path` }, { status: 400 });
        }
        imagePath = cardInfo.cardImage;
      }

      if (
        typeof cardInfo.cardTitle !== 'string' ||
        typeof cardInfo.cardDescription !== 'string' ||
        cardInfo.cardTitle.trim() === '' ||
        cardInfo.cardDescription.trim() === '' ||
        !imagePath
      ) {
        return NextResponse.json({ error: `Card ${i} is missing title, description, or image` }, { status: 400 });
      }

      if (cardInfo.cardTitle.length > 200 || cardInfo.cardDescription.length > 2000) {
        return NextResponse.json({ error: `Card ${i} has invalid field length` }, { status: 400 });
      }

      processedCards.push({
        cardTitle: cardInfo.cardTitle,
        cardDescription: cardInfo.cardDescription,
        cardImage: imagePath,
      });
    }

    // 5. Generate unique slug (bounded attempts to avoid pathological while-loops)
    const baseSlug = createSlug(title);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

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
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;

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
    let cardsInfo: unknown[] = [];
    try {
      const parsedCards = JSON.parse(cardsDataString || '[]');
      if (!Array.isArray(parsedCards)) {
        return NextResponse.json({ error: 'cardsData must be an array' }, { status: 400 });
      }
      cardsInfo = parsedCards;
    } catch {
      return NextResponse.json({ error: 'Invalid cardsData JSON' }, { status: 400 });
    }

    if (cardsInfo.length > 25) {
      return NextResponse.json({ error: 'Too many cards' }, { status: 400 });
    }

    const processedCards: Array<{ cardTitle: string; cardDescription: string; cardImage: string }> = [];

    for (let i = 0; i < cardsInfo.length; i++) {
      const raw = cardsInfo[i];
      const cardInfo: CaseStudyCardInfo = raw && typeof raw === 'object' ? (raw as CaseStudyCardInfo) : {};
      const file = formData.get(`cardImage_${i}`);

      let imagePath = '';

      if (file instanceof File) {
        try {
          imagePath = await saveImageFileToPublicUploads(file, 'case-studies');
        } catch {
          return NextResponse.json({ error: `Card ${i} has an invalid image upload` }, { status: 400 });
        }
      } else if (typeof cardInfo.cardImage === 'string') {
        // Allow existing local upload paths only.
        if (cardInfo.cardImage.length > 300 || (cardInfo.cardImage !== '' && !cardInfo.cardImage.startsWith('/uploads/'))) {
          return NextResponse.json({ error: `Card ${i} has an invalid image path` }, { status: 400 });
        }
        imagePath = cardInfo.cardImage;
      }

      if (
        typeof cardInfo.cardTitle !== 'string' ||
        typeof cardInfo.cardDescription !== 'string' ||
        cardInfo.cardTitle.trim() === '' ||
        cardInfo.cardDescription.trim() === '' ||
        !imagePath
      ) {
        return NextResponse.json({ error: `Card ${i} is missing title, description, or image` }, { status: 400 });
      }

      if (cardInfo.cardTitle.length > 200 || cardInfo.cardDescription.length > 2000) {
        return NextResponse.json({ error: `Card ${i} has invalid field length` }, { status: 400 });
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
    if (typeof title === 'string' && title !== existing.title) {
      const baseSlug = createSlug(title);
      updateData.slug = await generateUniqueSlug(baseSlug, id);
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