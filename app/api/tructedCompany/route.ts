import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Tructed } from "../model/trusted";

// GET - fetch latest trusted company
export async function GET() {
  await connectDB();

  try {
    const trustedCompanies = await Tructed.find().sort({ createdAt: -1 });
    return NextResponse.json(trustedCompanies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch trusted company data" }, { status: 500 });
  }
}


// POST - add new trusted company
export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { name, image } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newTrusted = new Tructed({ name, image: image });
    await newTrusted.save();

    return NextResponse.json(newTrusted, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add trusted company" }, { status: 500 });
  }
}

// PATCH - update trusted company
export async function PATCH(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, name, image } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const trustedCompany = await Tructed.findById(id);
    if (!trustedCompany) 
      return NextResponse.json({ error: "Trusted company not found" }, { status: 404 });

    if (name) trustedCompany.name = name;
    if (image) trustedCompany.image = image;

    await trustedCompany.save();
    return NextResponse.json(trustedCompany, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update trusted company" }, { status: 500 });
  }
}

// Optional: DELETE - remove trusted company
export async function DELETE(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const deleted = await Tructed.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Trusted company not found" }, { status: 404 });

    return NextResponse.json({ message: "Trusted company deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete trusted company" }, { status: 500 });
  }
}
