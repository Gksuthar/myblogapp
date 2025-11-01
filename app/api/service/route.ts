// src/app/api/service/route.ts

import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { CategoryModel, ServiceModel } from '../model/service';
import { Types } from 'mongoose'; // Import Types for ObjectId validation
import slugify from 'slugify'; // You'll need to install this: npm install slugify

// Utility function to create a slug
const createSlug = (title: string) => {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
};

// --- GET (Fetch All Services) ---
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const query: any = {};

    // ✅ FIX 1: Validate categoryId format before querying
    if (categoryId) {
      if (!Types.ObjectId.isValid(categoryId)) {
        // Return a 400 error for an invalid ID format, avoiding a 500 BSONError
        return NextResponse.json(
          { error: `Invalid categoryId format: ${categoryId}` },
          { status: 400 }
        );
      }
      query.categoryId = categoryId;
    }
    
    const services = await ServiceModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: services });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// --- POST (Create Service) ---
export async function POST(req: Request) {
  try {
    await connectDB();
    const payload = await req.json();

    const { categoryId, heroSection, cardSections = [], content = '' } = payload || {};
    if (!categoryId || !heroSection?.title || !heroSection?.description) {
      return NextResponse.json(
        { error: 'categoryId, heroSection.title, heroSection.description are required' },
        { status: 400 }
      );
    }

    // ✅ FIX 2: Create the required slug from the heroSection.title
    const slug = createSlug(heroSection.title);

    const payloadDoc = {
      categoryId,
      heroSection,
      slug,
      cardSections: (cardSections || []).map((cs: any) => ({
        sectionTitle: cs.sectionTitle,
        sectionDescription: cs.sectionDescription || '',
        cards: (cs.cards || []).map((c: any) => ({
          title: c.title,
          description: c.description,
        })),
      })),
      content,
    };

    const created = await ServiceModel.create(payloadDoc);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err: any) {
    console.error('POST Service Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Failed to create service' },
      { status: 500 }
    );
  }
}

// --- Helper function for update logic (used by both PUT and PATCH) ---
async function updateService(req: Request) {
  await connectDB();
  const payload = await req.json();
  const { id, categoryId, heroSection, cardSections = [], content = '' } = payload || {};

  if (!id) {
    return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
  }

  // Add validation for both ID fields
  if (!Types.ObjectId.isValid(id) || (categoryId && !Types.ObjectId.isValid(categoryId))) {
    return NextResponse.json(
      { error: 'Invalid ID format for service or category' },
      { status: 400 }
    );
  }

  const existingService = await ServiceModel.findById(id);
  if (!existingService) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  // ✅ ADDED: If heroSection is being updated, generate a new slug
  let slugUpdate = {};
  if (heroSection && heroSection.title) {
    slugUpdate = { slug: createSlug(heroSection.title) };
  }

  const updatedData = {
    ...(categoryId && { categoryId }),
    ...(heroSection && { heroSection }),
    ...slugUpdate, // <-- ADDED: Update slug if title is changed
    cardSections: (cardSections || []).map((cs: any) => ({
      sectionTitle: cs.sectionTitle,
      sectionDescription: cs.sectionDescription || '',
      cards: (cs.cards || []).map((c: any) => ({
        title: c.title,
        description: c.description,
      })),
    })),
    ...(content !== undefined && { content }),
  };

  const updatedService = await ServiceModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true, // Ensure validation runs on updates
  });

  return NextResponse.json({
    message: 'Service updated successfully',
    data: updatedService,
  });
}

// --- PUT (Update Service) ---
export async function PUT(req: Request) {
  try {
    return await updateService(req);
  } catch (error: any) {
    console.error('PUT Service Error:', error);
    return NextResponse.json(
      { error: 'Failed to update service', details: error.message },
      { status: 500 }
    );
  }
}

// --- PATCH (Update Service) ---
export async function PATCH(req: Request) {
  try {
    return await updateService(req);
  } catch (error: any) {
    console.error('PATCH Service Error:', error);
    return NextResponse.json(
      { error: 'Failed to update service', details: error.message },
      { status: 500 }
    );
  }
}

// --- DELETE (Remove a Service by ID) ---
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const payload = await req.json();
    const { id } = payload || {};

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    // Add validation for ID field
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid Service ID format' },
        { status: 400 }
      );
    }

    const existing = await ServiceModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await ServiceModel.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    console.error('DELETE Service Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete service', details: error.message },
      { status: 500 }
    );
  }
}