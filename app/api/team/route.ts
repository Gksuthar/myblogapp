import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TeamCategory } from '../model/teamCategory';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  await connectDB();
  const data = await TeamCategory.find({});
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  await connectDB();
  const formData = await req.formData();
  const tabName = formData.get('tabName') as string;
  const cards = JSON.parse(formData.get('cards') as string);
  const images = formData.getAll('images') as File[];

  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const updatedCards = await Promise.all(
    cards.map(async (card: any, i: number) => {
      const imageFile = images[i];
      let imagePath = card.image;
      if (imageFile && imageFile.name) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const fileName = `${Date.now()}-${imageFile.name}`;
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        imagePath = `/uploads/${fileName}`;
      }
      return { ...card, image: imagePath };
    })
  );

  const newCategory = new TeamCategory({ tabName, cards: updatedCards });
  await newCategory.save();
  return NextResponse.json({ success: true, data: newCategory });
}

export async function PUT(req: Request) {
  await connectDB();
  const formData = await req.formData();
  const id = formData.get('id') as string;
  const tabName = formData.get('tabName') as string;
  const cards = JSON.parse(formData.get('cards') as string);
  const images = formData.getAll('images') as File[];

  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const updatedCards = await Promise.all(
    cards.map(async (card: any, i: number) => {
      const imageFile = images[i];
      let imagePath = card.image;
      if (imageFile && imageFile.name) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const fileName = `${Date.now()}-${imageFile.name}`;
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        imagePath = `/uploads/${fileName}`;
      }
      return { ...card, image: imagePath };
    })
  );

  const updatedCategory = await TeamCategory.findByIdAndUpdate(
    id,
    { tabName, cards: updatedCards },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updatedCategory });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
  await TeamCategory.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: 'Category deleted' });
}
