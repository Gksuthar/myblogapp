import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { parseMultipartFormData } from '@/lib/multipart';
import { saveUploadedFile } from '@/lib/upload';
import { TeamCategory } from '../model/teamCategory';
import { Types } from 'mongoose';

type TeamCard = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  buttonText: string;
};

export async function GET() {
  try {
    await connectDB();
    const data = await TeamCategory.find({}).lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET team error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch team categories' }, { status: 500 });
  }
}

function parseCardsJson(raw: unknown): unknown[] {
  const text = typeof raw === 'string' ? raw : '[]';
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error('cards must be an array');
  return parsed;
}

function normalizeExistingImagePath(image: unknown): string {
  const s = typeof image === 'string' ? image : '';
  if (!s) return '';
  if (s.length > 300) return '';
  if (!s.startsWith('/uploads/')) return '';
  return s;
}

function normalizeStringField(value: unknown, maxLen: number) {
  const s = typeof value === 'string' ? value.trim() : '';
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((t: unknown) => typeof t === 'string')
    .map((t: string) => t.trim().slice(0, 50))
    .filter((t: string) => t.length > 0)
    .slice(0, 30);
}

async function buildCardsWithUploads(cards: unknown[], images: unknown[]) {
  return Promise.all(
    cards.map(async (rawCard, i): Promise<TeamCard> => {
      const card = rawCard && typeof rawCard === 'object' ? (rawCard as Record<string, unknown>) : {};

      const title = normalizeStringField(card.title, 200);
      const description = normalizeStringField(card.description, 2000);
      const buttonText = normalizeStringField(card.buttonText, 100);
      const tags = normalizeTags(card.tags);

      const imageFile = images[i];
      let imagePath = normalizeExistingImagePath(card.image);

      if (imageFile instanceof File && imageFile.size > 0) {
        imagePath = await saveUploadedFile(imageFile);
      }

      if (!title || !description || !imagePath) {
        throw new Error('Invalid card');
      }

      return { title, description, image: imagePath, tags, buttonText };
    })
  );
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;

    const formData = parsed.formData;
    const tabNameRaw = formData.get('tabName');
    const tabName = typeof tabNameRaw === 'string' ? tabNameRaw.trim() : '';

    if (!tabName || tabName.length > 100) {
      return NextResponse.json({ success: false, message: 'Invalid tabName' }, { status: 400 });
    }

    let cards: unknown[] = [];
    try {
      cards = parseCardsJson(formData.get('cards'));
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid cards JSON' }, { status: 400 });
    }

    if (cards.length > 50) {
      return NextResponse.json({ success: false, message: 'Too many cards' }, { status: 400 });
    }

    const images = formData.getAll('images');

    let updatedCards: TeamCard[] = [];
    try {
      updatedCards = await buildCardsWithUploads(cards, images);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid cards or image upload' }, { status: 400 });
    }

    const newCategory = new TeamCategory({ tabName, cards: updatedCards });
    await newCategory.save();
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    console.error('POST team error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create team category' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;

    const formData = parsed.formData;
    const idRaw = formData.get('id');
    const id = typeof idRaw === 'string' ? idRaw : '';

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
    }

    const tabNameRaw = formData.get('tabName');
    const tabName = typeof tabNameRaw === 'string' ? tabNameRaw.trim() : '';

    if (!tabName || tabName.length > 100) {
      return NextResponse.json({ success: false, message: 'Invalid tabName' }, { status: 400 });
    }

    let cards: unknown[] = [];
    try {
      cards = parseCardsJson(formData.get('cards'));
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid cards JSON' }, { status: 400 });
    }

    if (cards.length > 50) {
      return NextResponse.json({ success: false, message: 'Too many cards' }, { status: 400 });
    }

    const images = formData.getAll('images');

    let updatedCards: TeamCard[] = [];
    try {
      updatedCards = await buildCardsWithUploads(cards, images);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid cards or image upload' }, { status: 400 });
    }

    const updatedCategory = await TeamCategory.findByIdAndUpdate(
      id,
      { tabName, cards: updatedCards },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('PUT team error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update team category' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
    }

    const deleted = await TeamCategory.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('DELETE team error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete team category' }, { status: 500 });
  }
}
