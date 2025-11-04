import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TeamCategory } from "../model/teamCategory";

// ✅ GET: Fetch all tabs with cards
export async function GET() {
  try {
    await connectDB();
    const data = await TeamCategory.find({});
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new tab with cards
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newCategory = new TeamCategory(body);
    await newCategory.save();

    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update existing tab or card
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, updateData } = await req.json();

    const updatedCategory = await TeamCategory.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCategory)
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a category by ID
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing category ID" },
        { status: 400 }
      );
    }

    const deletedCategory = await TeamCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
