import { connectDB } from '@/lib/mongodb';
import { parseMultipartFormData } from '@/lib/multipart';
import { saveImageFileToPublicUploads } from '@/lib/uploads';
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

    const query: Record<string, unknown> = {};
    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      query.categoryId = categoryId;
    }

    const services = await ServiceModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: services });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch services';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- POST ---
// --- POST ---
export async function POST(req: Request) {
  try {
    await connectDB();
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;

    const categoryId = formData.get('categoryId') as string;
    const heroTitle = formData.get('heroTitle') as string;
    const heroDescription = formData.get('heroDescription') as string;
    const heroImage = formData.get('heroImage');

    const cardSectionsRaw = (formData.get('cardSections') as string) || '[]';
    let cardSections: unknown[] = [];
    try {
      const parsedCardSections = JSON.parse(cardSectionsRaw);
      if (!Array.isArray(parsedCardSections)) {
        return NextResponse.json({ error: 'Invalid cardSections' }, { status: 400 });
      }
      cardSections = parsedCardSections;
    } catch {
      return NextResponse.json({ error: 'Invalid cardSections JSON' }, { status: 400 });
    }

    const content = (formData.get('content') as string) || '';

    const serviceCardViewRaw = (formData.get('serviceCardView') as string) || '{}';
    let serviceCardView: Record<string, unknown> = {};
    try {
      const parsedView = JSON.parse(serviceCardViewRaw);
      if (parsedView && typeof parsedView === 'object' && !Array.isArray(parsedView)) {
        serviceCardView = parsedView as Record<string, unknown>;
      }
    } catch {
      return NextResponse.json({ error: 'Invalid serviceCardView JSON' }, { status: 400 });
    }

    let imagePath = '';
    if (heroImage instanceof File && heroImage.size > 0) {
      try {
        imagePath = await saveImageFileToPublicUploads(heroImage, 'services');
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
    }
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
  } catch (err: unknown) {
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

  type ServiceCardViewLike = { title?: unknown; description?: unknown };
  type CardLike = { title?: unknown; description?: unknown };
  type CardSectionLike = { sectionTitle?: unknown; sectionDescription?: unknown; cards?: unknown };

  // Ensure serviceCardView is an object, not an array
  const normalizedServiceCardView: ServiceCardViewLike =
    Array.isArray(serviceCardView) && serviceCardView.length > 0
      ? (serviceCardView[0] as ServiceCardViewLike) // Convert old array format to object
      : (serviceCardView && typeof serviceCardView === 'object' && !Array.isArray(serviceCardView)
          ? (serviceCardView as ServiceCardViewLike)
          : {});

  const slugUpdate =
    heroSection?.title && heroSection.title !== existingService.heroSection?.title
      ? { slug: createSlug(heroSection.title) }
      : {};

  const normalizedSections = (Array.isArray(cardSections) ? (cardSections as unknown[]) : []).map((rawSection) => {
    const cs: CardSectionLike = rawSection && typeof rawSection === 'object' ? (rawSection as CardSectionLike) : {};
    const rawCards = Array.isArray(cs.cards) ? (cs.cards as unknown[]) : [];

    return {
      sectionTitle: typeof cs.sectionTitle === 'string' ? cs.sectionTitle : '',
      sectionDescription: typeof cs.sectionDescription === 'string' ? cs.sectionDescription : '',
      cards: rawCards.map((rawCard) => {
        const c: CardLike = rawCard && typeof rawCard === 'object' ? (rawCard as CardLike) : {};
        return {
          title: typeof c.title === 'string' ? c.title : '',
          description: typeof c.description === 'string' ? c.description : '',
        };
      }),
    };
  });

  const updatedData: Record<string, unknown> = {
    ...(categoryId && { categoryId }),
    ...(heroSection && { heroSection }),
    serviceCardView: {
      title: typeof normalizedServiceCardView.title === 'string' ? normalizedServiceCardView.title : '',
      description:
        typeof normalizedServiceCardView.description === 'string' ? normalizedServiceCardView.description : '',
    },
    ...slugUpdate,
    cardSections: normalizedSections,
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
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update service', details }, { status: 500 });
  }
}

// --- PATCH ---
// --- PATCH (update) ---
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;

    const id = formData.get('id') as string;
    if (!id || !Types.ObjectId.isValid(id))
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const heroTitle = formData.get('heroTitle') as string;
    const heroDescription = formData.get('heroDescription') as string;
    const heroImage = formData.get('heroImage');

    const cardSectionsRaw = (formData.get('cardSections') as string) || '[]';
    let cardSections: unknown[] = [];
    try {
      const parsedCardSections = JSON.parse(cardSectionsRaw);
      if (!Array.isArray(parsedCardSections)) {
        return NextResponse.json({ error: 'Invalid cardSections' }, { status: 400 });
      }
      cardSections = parsedCardSections;
    } catch {
      return NextResponse.json({ error: 'Invalid cardSections JSON' }, { status: 400 });
    }

    const content = (formData.get('content') as string) || '';

    const serviceCardViewRaw = (formData.get('serviceCardView') as string) || '{}';
    let serviceCardView: Record<string, unknown> = {};
    try {
      const parsedView = JSON.parse(serviceCardViewRaw);
      if (parsedView && typeof parsedView === 'object' && !Array.isArray(parsedView)) {
        serviceCardView = parsedView as Record<string, unknown>;
      }
    } catch {
      return NextResponse.json({ error: 'Invalid serviceCardView JSON' }, { status: 400 });
    }

    const categoryId = formData.get('categoryId') as string;

    const existing = await ServiceModel.findById(id);
    if (!existing) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

    const slug =
      heroTitle && heroTitle !== existing.heroSection?.title
        ? createSlug(heroTitle)
        : existing.slug;

    let imagePath = existing.heroSection?.image || '';
    if (heroImage instanceof File && heroImage.size > 0) {
      let newPath = '';
      try {
        newPath = await saveImageFileToPublicUploads(heroImage, 'services');
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
      imagePath = newPath;
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
  } catch (err: unknown) {
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
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete service', details }, { status: 500 });
  }
}
