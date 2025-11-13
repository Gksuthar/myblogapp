import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { caseStudyschema } from '@/app/api/model/casestudy';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, cardIndex, imageUrl } = body as { id?: string; cardIndex?: number; imageUrl?: string };

    if (!id || typeof cardIndex !== 'number' || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields: id, cardIndex, imageUrl' }, { status: 400 });
    }

    const existing = await caseStudyschema.findById(id);
    if (!existing) return NextResponse.json({ error: 'Case study not found' }, { status: 404 });

    if (!Array.isArray(existing.cards) || cardIndex < 0 || cardIndex >= existing.cards.length) {
      return NextResponse.json({ error: 'Invalid cardIndex' }, { status: 400 });
    }

    const oldImage = existing.cards[cardIndex]?.cardImage;

    // If old image is a local upload (starts with /uploads/), try to remove it from disk
    try {
      if (typeof oldImage === 'string' && oldImage.startsWith('/uploads/')) {
        const rel = oldImage.replace(/^\//, ''); // uploads/...
        const filePath = path.join(process.cwd(), 'public', rel);
        await fs.unlink(filePath).catch(() => {
          // no-op if file doesn't exist
        });
      }
    } catch (err) {
      console.warn('Failed to delete old upload file:', err);
    }

    // Update with new image URL (could be external or /uploads/)
    existing.cards[cardIndex].cardImage = imageUrl;
    await existing.save();

    return NextResponse.json({ message: 'Image replaced successfully', data: existing }, { status: 200 });
  } catch (error) {
    console.error('replaceImage POST error:', error);
    return NextResponse.json({ error: 'Failed to replace image' }, { status: 500 });
  }
}
