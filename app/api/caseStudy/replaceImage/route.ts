import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { caseStudyschema } from '@/app/api/model/casestudy';
import { deletePublicUploadIfLocal, isSafePublicUploadPath } from '@/lib/uploads';

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, cardIndex, imageUrl } = body as { id?: string; cardIndex?: number; imageUrl?: string };

    if (!id || typeof cardIndex !== 'number' || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields: id, cardIndex, imageUrl' }, { status: 400 });
    }

    const trimmedImageUrl = String(imageUrl).trim();
    const isLocalUpload = trimmedImageUrl.startsWith('/uploads/');
    const isHttpsRemote = /^https:\/\/[\w.-]+(?:\:[0-9]{2,5})?(?:\/[^\s]*)?$/i.test(trimmedImageUrl);
    if (
      trimmedImageUrl.length > 500 ||
      (!isLocalUpload && !isHttpsRemote) ||
      (isLocalUpload && !isSafePublicUploadPath(trimmedImageUrl))
    ) {
      return NextResponse.json({ error: 'Invalid imageUrl' }, { status: 400 });
    }

    const existing = await caseStudyschema.findById(id);
    if (!existing) return NextResponse.json({ error: 'Case study not found' }, { status: 404 });

    if (!Array.isArray(existing.cards) || cardIndex < 0 || cardIndex >= existing.cards.length) {
      return NextResponse.json({ error: 'Invalid cardIndex' }, { status: 400 });
    }

    const oldImage = existing.cards[cardIndex]?.cardImage;

    await deletePublicUploadIfLocal(typeof oldImage === 'string' ? oldImage : '');

    // Update with new image URL (could be external or /uploads/)
    existing.cards[cardIndex].cardImage = trimmedImageUrl;
    await existing.save();

    return NextResponse.json({ message: 'Image replaced successfully', data: existing }, { status: 200 });
  } catch (error) {
    console.error('replaceImage POST error:', error);
    return NextResponse.json({ error: 'Failed to replace image' }, { status: 500 });
  }
}
