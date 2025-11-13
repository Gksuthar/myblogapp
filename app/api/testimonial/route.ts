import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import testimonialModel from '@/app/api/model/testimonial';
import path from 'path';
import { promises as fs } from 'fs';

const saveDataUrlToFile = async (dataUrl: string, folder = 'uploads') => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid data URL');
  const mime = matches[1];
  const base64Data = matches[2];
  const ext = (mime.split('/')[1] || 'png').split('+')[0];
  const uploadsDir = path.join(process.cwd(), 'public', folder);
  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(base64Data, 'base64');
  await fs.writeFile(filePath, buffer);
  return `/${folder}/${filename}`;
};

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

    let imagePath = image || '';
    if (typeof image === 'string' && image.startsWith('data:')) {
      try {
        imagePath = await saveDataUrlToFile(image, 'uploads');
      } catch (err) {
        console.error('Failed saving image', err);
      }
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

    if (image && typeof image === 'string' && image.startsWith('data:')) {
      try {
        const saved = await saveDataUrlToFile(image, 'uploads');
        // delete old if local
        if (existing.image && existing.image.startsWith('/uploads/')) {
          const rel = existing.image.replace(/^\//, '');
          const filePath = path.join(process.cwd(), 'public', rel);
          await fs.unlink(filePath).catch(() => {});
        }
        existing.image = saved;
      } catch (err) {
        console.error('Failed to save new image', err);
      }
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
    // delete local file if present
    if (existing.image && existing.image.startsWith('/uploads/')) {
      const rel = existing.image.replace(/^\//, '');
      const filePath = path.join(process.cwd(), 'public', rel);
      await fs.unlink(filePath).catch(() => {});
    }
    await testimonialModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (err) {
    console.error('DELETE testimonial error', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
