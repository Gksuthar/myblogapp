import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import About from '@/app/api/model/about'; // ✅ make sure this path matches your folder

// ==================== GET ====================
export async function GET() {
  try {
    await connectDB();

    // Find the most recent about document
    const aboutData = await About.findOne({}).sort({ updatedAt: -1 });

    if (!aboutData) {
      return NextResponse.json({ message: 'About us data not found' }, { status: 404 });
    }

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error fetching about us data:', error);
    return NextResponse.json({ message: 'Failed to fetch about us data' }, { status: 500 });
  }
}

// ==================== POST ====================
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();

    // Prevent duplicates (keep only one About document)
    const existing = await About.findOne({});
    if (existing) {
      return NextResponse.json({ message: 'About data already exists. Use PUT to update.' }, { status: 400 });
    }

    const newAbout = new About(data);
    await newAbout.save();

    return NextResponse.json(newAbout, { status: 201 });
  } catch (error) {
    console.error('Error creating about us data:', error);
    return NextResponse.json({ message: 'Failed to create about us data' }, { status: 500 });
  }
}

// ==================== PUT ====================
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();

    // Update existing document or create if not found
    const aboutData = await About.findOneAndUpdate({}, data, {
      new: true,
      upsert: true, // ✅ Creates if none exists
      runValidators: true,
    });

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error updating about us data:', error);
    return NextResponse.json({ message: 'Failed to update about us data' }, { status: 500 });
  }
}

// ==================== DELETE ====================
export async function DELETE() {
  try {
    await connectDB();

    const deleted = await About.findOneAndDelete({});
    if (!deleted) {
      return NextResponse.json({ message: 'About us data not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'About us data deleted successfully' });
  } catch (error) {
    console.error('Error deleting about us data:', error);
    return NextResponse.json({ message: 'Failed to delete about us data' }, { status: 500 });
  }
}
