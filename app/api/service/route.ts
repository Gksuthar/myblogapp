import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ServiceModel } from '../model/service';
import { Types } from 'mongoose';
import slugify from 'slugify';

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
export async function POST(req: Request) {
  try {
    await connectDB();
    const payload = await req.json();
    const { categoryId = '', heroSection = {}, cardSections = [], content = '', serviceCardView = {} } = payload || {};

    // Ensure serviceCardView is an object, not an array
    const normalizedServiceCardView = Array.isArray(serviceCardView) && serviceCardView.length > 0
      ? serviceCardView[0] // Convert old array format to object
      : (typeof serviceCardView === 'object' && !Array.isArray(serviceCardView) ? serviceCardView : {});

    const slug = createSlug(heroSection?.title || categoryId);

    const payloadDoc = {
      categoryId,
      heroSection,
      slug,
      serviceCardView: {
        title: normalizedServiceCardView?.title || '',
        description: normalizedServiceCardView?.description || '',
      },
      cardSections: (cardSections || []).map((cs: any) => ({
        sectionTitle: cs.sectionTitle || '',
        sectionDescription: cs.sectionDescription || '',
        cards: (cs.cards || []).map((c: any) => ({
          title: c.title || '',
          description: c.description || '',
        })),
      })),
      content,
    };

    const created = await ServiceModel.create(payloadDoc);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create service' }, { status: 500 });
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
export async function PATCH(req: Request) {
  try {
    return await updateService(req);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update service', details: err.message }, { status: 500 });
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
