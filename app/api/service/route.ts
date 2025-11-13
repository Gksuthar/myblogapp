import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ServiceModel } from '../model/service';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
async function saveImageToUploads(file: File | null) {
  if (!file) return '';
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(uploadDir, fileName);
  await writeFile(uploadPath, buffer);
  return `/uploads/${fileName}`; // Accessible URL
}

const createSlug = (title?: string) =>
  slugify(title || '', { lower: true, strict: true, trim: true });

// --- GET ---
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const query: any = {};
    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      query.categoryId = categoryId;
    }

    const services = await ServiceModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: services });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch services' }, { status: 500 });
  }
}

// --- POST ---
// --- POST ---
export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const categoryId = formData.get('categoryId') as string;
    const heroTitle = formData.get('heroTitle') as string;
    const heroDescription = formData.get('heroDescription') as string;
    const heroImage = formData.get('heroImage') as File | null;
    const cardSections = JSON.parse(formData.get('cardSections') as string || '[]');
    const content = formData.get('content') as string;
    const serviceCardView = JSON.parse(formData.get('serviceCardView') as string || '{}');

    const imagePath = await saveImageToUploads(heroImage);
    const slug = createSlug(heroTitle);

    const newService = await ServiceModel.create({
      categoryId,
      slug,
      heroSection: {
        title: heroTitle,
        description: heroDescription,
        image: imagePath,
      },
      cardSections,
      serviceCardView,
      content,
    });

    return NextResponse.json({ data: newService }, { status: 201 });
  } catch (err: any) {
    console.error('❌ Create Service Error:', err);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// --- Update Helper ---
async function updateService(req: Request) {
  await connectDB();
  const payload = await req.json();
  const { id, categoryId, heroSection = {}, cardSections = [], content, serviceCardView = {} } = payload || {};

  if (!id) return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
  if (!Types.ObjectId.isValid(id))
    return NextResponse.json({ error: 'Invalid Service ID format' }, { status: 400 });

  const existingService = await ServiceModel.findById(id);
  if (!existingService) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

  // Ensure serviceCardView is an object, not an array
  const normalizedServiceCardView = Array.isArray(serviceCardView) && serviceCardView.length > 0
    ? serviceCardView[0] // Convert old array format to object
    : (typeof serviceCardView === 'object' && !Array.isArray(serviceCardView) ? serviceCardView : {});

  const slugUpdate =
    heroSection?.title && heroSection.title !== existingService.heroSection?.title
      ? { slug: createSlug(heroSection.title) }
      : {};

  const updatedData: any = {
    ...(categoryId && { categoryId }),
    ...(heroSection && { heroSection }),
    serviceCardView: {
      title: normalizedServiceCardView?.title || '',
      description: normalizedServiceCardView?.description || '',
    },
    ...slugUpdate,
    cardSections: (cardSections || []).map((cs: any) => ({
      sectionTitle: cs.sectionTitle || '',
      sectionDescription: cs.sectionDescription || '',
      cards: (cs.cards || []).map((c: any) => ({
        title: c.title || '',
        description: c.description || '',
      })),
    })),
  };

  if (content !== undefined) updatedData.content = content;

  const updatedService = await ServiceModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  return NextResponse.json({ message: 'Service updated successfully', data: updatedService });
}

// --- PUT ---
export async function PUT(req: Request) {
  try {
    return await updateService(req);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update sservice', details: err.message }, { status: 500 });
  }
}

// --- PATCH ---
// --- PATCH (update) ---
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const id = formData.get('id') as string;
    if (!id || !Types.ObjectId.isValid(id))
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const heroTitle = formData.get('heroTitle') as string;
    const heroDescription = formData.get('heroDescription') as string;
    const heroImage = formData.get('heroImage') as File | null;
    const cardSections = JSON.parse(formData.get('cardSections') as string || '[]');
    const content = formData.get('content') as string;
    const serviceCardView = JSON.parse(formData.get('serviceCardView') as string || '{}');
    const categoryId = formData.get('categoryId') as string;

    const existing = await ServiceModel.findById(id);
    if (!existing) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

    const slug =
      heroTitle && heroTitle !== existing.heroSection?.title
        ? createSlug(heroTitle)
        : existing.slug;

    let imagePath = existing.heroSection?.image || '';
    if (heroImage) {
      imagePath = await saveImageToUploads(heroImage);
    }

    existing.set({
      categoryId,
      slug,
      heroSection: { title: heroTitle, description: heroDescription, image: imagePath },
      cardSections,
      serviceCardView,
      content,
    });

    await existing.save();

    return NextResponse.json({ message: 'Updated successfully', data: existing });
  } catch (err: any) {
    console.error('❌ Update Service Error:', err);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// --- DELETE ---
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const payload = await req.json();
    const { id } = payload || {};

    if (!id) return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    if (!Types.ObjectId.isValid(id))
      return NextResponse.json({ error: 'Invalid Service ID format' }, { status: 400 });

    const existing = await ServiceModel.findById(id);
    if (!existing) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

    await ServiceModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete service', details: err.message }, { status: 500 });
  }
}
