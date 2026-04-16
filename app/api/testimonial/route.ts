import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import testimonialModel from '@/app/api/model/testimonial';
import { deletePublicUploadIfLocal, saveImageDataUrlToPublicUploads } from '@/lib/uploads';

export async function GET() {
  await connectDB();
  try {
    const items = await testimonialModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (err) {
    console.error('GET testimonials error', err);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { name, title, quote, image } = body as { name?: string; title?: string; quote?: string; image?: string };
    if (!name || !quote) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    let imagePath = '';
    if (typeof image === 'string' && image.startsWith('data:')) {
      try {
        imagePath = await saveImageDataUrlToPublicUploads(image, 'testimonials');
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
    } else if (typeof image === 'string') {
      // If the client sends a previously-uploaded path, only accept local upload paths.
      if (image.length > 300 || (image !== '' && !image.startsWith('/uploads/'))) {
        return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
      }
      imagePath = image;
    }

    const created = await testimonialModel.create({ name, title, quote, image: imagePath });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('POST testimonial error', err);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, name, title, quote, image } = body as { id?: string; name?: string; title?: string; quote?: string; image?: string };
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await testimonialModel.findById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (typeof image === 'string' && image.startsWith('data:')) {
      let savedPath = '';
      try {
        savedPath = await saveImageDataUrlToPublicUploads(image, 'testimonials');
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }

      await deletePublicUploadIfLocal(existing.image || '');
      existing.image = savedPath;
    } else if (typeof image === 'string') {
      if (image.length > 300 || (image !== '' && !image.startsWith('/uploads/'))) {
        return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
      }
      existing.image = image;
    }

    if (name) existing.name = name;
    if (title !== undefined) existing.title = title as string;
    if (quote) existing.quote = quote;

    await existing.save();
    return NextResponse.json(existing, { status: 200 });
  } catch (err) {
    console.error('PATCH testimonial error', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id } = body as { id?: string };
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const existing = await testimonialModel.findById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await deletePublicUploadIfLocal(existing.image || '');
    await testimonialModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (err) {
    console.error('DELETE testimonial error', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
