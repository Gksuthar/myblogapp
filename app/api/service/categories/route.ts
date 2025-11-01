import { NextResponse } from 'next/server';
import { CategoryModel } from '../../model/service';
import { connectDB } from '@/lib/mongodb';
export async function GET() {
  await connectDB();

  try {
const studies = await CategoryModel.find().sort({ createdAt: -1 });
    if (!studies) return NextResponse.json({ error: "No Category found" }, { status: 404 });
    return NextResponse.json(studies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to Category  data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const payload = await req.json();
        const { name, description } = payload || {};
        if (!name || !description) {
            return NextResponse.json({ error: 'name and description are required' }, { status: 400 });
        }


        const created = await CategoryModel.create({ name, description });
        return NextResponse.json({ data: { id: created._id.toString(), name, description } }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to create category' }, { status: 500 });
    }
}