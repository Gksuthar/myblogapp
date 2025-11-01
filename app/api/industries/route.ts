import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { IndustryCard } from "../model/IndustryCard";
import { Types } from "mongoose";

export async function GET() {
  await connectDB();
  try {
    const items = await IndustryCard.find().sort({ _id: -1 });
    return NextResponse.json({ data: items });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch industries", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { title, description, image, tags = [] } = body || {};
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    const doc = await IndustryCard.create({ title, description, image: image || "", tags });
    return NextResponse.json({ message: "Industry created", data: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create industry", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, title, description, image, tags } = body || {};
    if (!id) {
      return NextResponse.json({ error: "Industry id is required" }, { status: 400 });
    }
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }
    const updated = await IndustryCard.findByIdAndUpdate(
      id,
      { ...(title !== undefined && { title }), ...(description !== undefined && { description }), ...(image !== undefined && { image }), ...(tags !== undefined && { tags }) },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Industry updated", data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update industry", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id } = body || {};
    if (!id) {
      return NextResponse.json({ error: "Industry id is required" }, { status: 400 });
    }
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }
    const deleted = await IndustryCard.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Industry deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete industry", details: error.message }, { status: 500 });
  }
}


