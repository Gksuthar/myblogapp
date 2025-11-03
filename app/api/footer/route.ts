import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FooterSettings from '@/app/api/model/footerSettings';

// GET: fetch latest footer settings
export async function GET() {
  try {
    await connectDB();
    type FooterDoc = {
      _id: unknown;
      logoUrl?: string;
      tagline?: string;
      companyLinks?: Array<{ label: string; href: string }>;
      certifications?: Array<{ label: string; image?: string }>;
      associatePartner?: string;
      contactPhoneUSA?: string;
      contactPhoneIND?: string;
      contactEmail?: string;
      officeUSA?: { title: string; lines: string[] };
      officeIND?: { title: string; lines: string[] };
      contactNotes?: string[];
      internationalNote?: string;
      copyrightText?: string;
    };
    let doc = await FooterSettings.findOne({}).sort({ updatedAt: -1 }).lean<FooterDoc>();
    if (!doc) {
      // Create a default document if none exists so admin UI can edit immediately
      const created = await FooterSettings.create({});
      doc = (await FooterSettings.findById(created._id).lean()) as unknown as FooterDoc;
    }
    const id = (doc as { _id: { toString?: () => string } })._id?.toString?.() ?? '';
    return NextResponse.json({
      data: {
        _id: id,
        logoUrl: doc.logoUrl || '',
        tagline: doc.tagline || '',
        companyLinks: doc.companyLinks || [],
        certifications: doc.certifications || [],
        associatePartner: doc.associatePartner || '',
        contactPhoneUSA: doc.contactPhoneUSA || '',
        contactPhoneIND: doc.contactPhoneIND || '',
        contactEmail: doc.contactEmail || '',
        officeUSA: doc.officeUSA || { title: 'USA Office', lines: [] },
        officeIND: doc.officeIND || { title: 'India Office', lines: [] },
        contactNotes: Array.isArray(doc.contactNotes) ? doc.contactNotes : [],
        internationalNote: doc.internationalNote || '',
        copyrightText: doc.copyrightText || '',
      },
    });
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
    const created = await FooterSettings.create({
      logoUrl: body?.logoUrl || '',
      tagline: body?.tagline || '',
      companyLinks: Array.isArray(body?.companyLinks) ? body.companyLinks : [],
      certifications: Array.isArray(body?.certifications) ? body.certifications : [],
      associatePartner: body?.associatePartner || '',
      contactPhoneUSA: body?.contactPhoneUSA || '',
      contactPhoneIND: body?.contactPhoneIND || '',
      contactEmail: body?.contactEmail || '',
      officeUSA: body?.officeUSA || { title: 'USA Office', lines: [] },
      officeIND: body?.officeIND || { title: 'India Office', lines: [] },
      contactNotes: Array.isArray(body?.contactNotes) ? body.contactNotes : [],
      internationalNote: body?.internationalNote || '',
      copyrightText: body?.copyrightText || '',
    });
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
    const payload = {
      logoUrl: typeof body?.logoUrl === 'string' ? body.logoUrl : undefined,
      tagline: typeof body?.tagline === 'string' ? body.tagline : undefined,
      companyLinks: Array.isArray(body?.companyLinks) ? body.companyLinks : undefined,
      certifications: Array.isArray(body?.certifications) ? body.certifications : undefined,
      associatePartner: typeof body?.associatePartner === 'string' ? body.associatePartner : undefined,
      contactPhoneUSA: typeof body?.contactPhoneUSA === 'string' ? body.contactPhoneUSA : undefined,
      contactPhoneIND: typeof body?.contactPhoneIND === 'string' ? body.contactPhoneIND : undefined,
      contactEmail: typeof body?.contactEmail === 'string' ? body.contactEmail : undefined,
      officeUSA: body?.officeUSA && typeof body.officeUSA === 'object' ? body.officeUSA : undefined,
      officeIND: body?.officeIND && typeof body.officeIND === 'object' ? body.officeIND : undefined,
      contactNotes: Array.isArray(body?.contactNotes) ? body.contactNotes : undefined,
      internationalNote: typeof body?.internationalNote === 'string' ? body.internationalNote : undefined,
      copyrightText: typeof body?.copyrightText === 'string' ? body.copyrightText : undefined,
    } as const;
    // prune undefined fields so we don't set undefined in $set
    const updateFields = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    );
    const updated = await FooterSettings.findOneAndUpdate(
      {},
      { $set: updateFields },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );
    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update footer settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
