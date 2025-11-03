import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FooterSettings from '@/app/api/model/footerSettings';

// GET: fetch latest footer settings
export async function GET() {
  try {
    await connectDB();
    const doc = await FooterSettings.findOne({}).sort({ updatedAt: -1 }).lean();
    if (!doc) return NextResponse.json({ data: null });
    return NextResponse.json({ data: { _id: doc._id.toString(), certifications: doc.certifications || [] } });
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    return NextResponse.json({ error: 'Failed to fetch footer settings' }, { status: 500 });
  }
}

// POST: create settings if none exists
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const existing = await FooterSettings.findOne({});
    if (existing) {
      return NextResponse.json({ error: 'Settings already exist. Use PUT to update.' }, { status: 400 });
    }
    const created = await FooterSettings.create({ certifications: body?.certifications || [] });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create footer settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: upsert settings
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await FooterSettings.findOneAndUpdate(
      {},
      { certifications: Array.isArray(body?.certifications) ? body.certifications : [] },
      { new: true, upsert: true }
    );
    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update footer settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
