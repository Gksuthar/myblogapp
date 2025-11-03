import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import WhyChooseUs from '../model/whyChooseUs';

export async function GET() {
  await connectDB();
  try {
    const doc = await WhyChooseUs.findOne({}).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ data: doc || null });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch Why Choose Us', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const payload = await req.json();
    const existing = await WhyChooseUs.findOne({});
    if (existing) {
      return NextResponse.json({ error: 'Why Choose Us already exists. Use PUT to update.' }, { status: 400 });
    }
    const created = await WhyChooseUs.create(payload);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to create Why Choose Us', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectDB();
  try {
    const payload = await req.json();
    const updated = await WhyChooseUs.findOneAndUpdate({}, payload, { new: true, upsert: true, runValidators: true });
    return NextResponse.json({ data: updated });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to update Why Choose Us', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE() {
  await connectDB();
  try {
    const deleted = await WhyChooseUs.findOneAndDelete({});
    return NextResponse.json({ message: deleted ? 'Deleted' : 'No document to delete' });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete Why Choose Us', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
