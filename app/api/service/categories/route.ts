import { NextResponse } from 'next/server';
import { CategoryModel } from '../../model/service';
import { connectDB } from '@/lib/mongodb';
export async function GET() {
  await connectDB();

  try {
const studies = await CategoryModel.find().sort({ createdAt: -1 });
    if (!studies || studies.length === 0) return NextResponse.json([]);
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
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to create category' }, { status: 500 });
    }
}

// PUT: update a category by id
export async function PUT(req: Request) {
  try {
    await connectDB();
    const payload = await req.json();
    const { id, name, description } = payload || {};
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    if (!name || !description) return NextResponse.json({ error: 'name and description are required' }, { status: 400 });

    const updated = await CategoryModel.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updated) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ data: { id: updated._id.toString(), name: updated.name, description: updated.description } });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to update category' }, { status: 500 });
  }
}

// DELETE: remove categories by ids or names
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { ids, names } = body as { ids?: string[] | string; names?: string[] | string };

    type CategoryDeleteFilter = {
      _id?: { $in: string[] };
      name?: { $in: (string | RegExp)[] };
    };

    const toDelete: CategoryDeleteFilter = {};
    if (ids) {
      const arr = Array.isArray(ids) ? ids : [ids];
      toDelete._id = { $in: arr };
    }
    if (names) {
      const arr = (Array.isArray(names) ? names : [names])
        .map((n) => String(n).trim())
        // case-insensitive exact match via regex
        .map((n) => new RegExp(`^${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
      toDelete.name = { $in: arr };
    }

    if (!toDelete._id && !toDelete.name) {
      return NextResponse.json({ error: 'Provide ids or names to delete' }, { status: 400 });
    }

  const result = await CategoryModel.deleteMany(toDelete);
    return NextResponse.json({ deletedCount: result.deletedCount ?? 0 });
  } catch (error) {
    console.error('Failed to delete categories:', error);
    return NextResponse.json({ error: 'Failed to delete categories' }, { status: 500 });
  }
}