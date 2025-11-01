import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AboutHero from '../model/aboutHero';

// GET handler to retrieve About Hero section data
export async function GET() {
  try {
    await connectDB();

    const hero = await AboutHero.findOne({}).sort({ updatedAt: -1 });

    if (!hero) {
      return NextResponse.json({ message: 'About hero data not found' }, { status: 404 });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching about hero data:', error);
    return NextResponse.json({ message: 'Failed to fetch about hero data' }, { status: 500 });
  }
}

// POST handler to create About Hero section data
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();
    const newHero = new AboutHero(data);
    await newHero.save();

    return NextResponse.json(newHero, { status: 201 });
  } catch (error) {
    console.error('Error creating about hero data:', error);
    return NextResponse.json({ message: 'Failed to create about hero data' }, { status: 500 });
  }
}

// PUT handler to update About Hero section data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();
    const hero = await AboutHero.findOneAndUpdate({}, data, { new: true, runValidators: true });

    if (!hero) {
      const newHero = new AboutHero(data);
      await newHero.save();
      return NextResponse.json(newHero, { status: 201 });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error updating about hero data:', error);
    return NextResponse.json({ message: 'Failed to update about hero data' }, { status: 500 });
  }
}