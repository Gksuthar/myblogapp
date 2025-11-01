import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import {AboutHero} from "../model/hero";
import { NextResponse } from "next/server";
// home section 
export async function GET() {
  await connectDB();

  try {
    const hero = await AboutHero.findOne().sort({ createdAt: -1 });
    if (!hero) return NextResponse.json({ error: "No hero found" }, { status: 404 });
    return NextResponse.json(hero);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 });
  }
}

// POST method
export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();

    if (!body.title || !body.disc) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const hero = new AboutHero({
      title: body.title,
      disc: body.disc,
      image: body.image || "",
      buttonText: body.buttonText || "",
    });

    await hero.save();
    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create hero" }, { status: 500 });
  }
}
export async function PATCH(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, title, disc, image, buttonText } = body;

    if (!id) {
      return NextResponse.json({ error: "Hero ID is required" }, { status: 400 });
    }

    const hero = await AboutHero.findById(id);
    if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

    // Update fields if provided
    if (title) hero.title = title;
    if (disc) hero.disc = disc;
    if (image) hero.image = image;
    if (buttonText) hero.buttonText = buttonText;

    await hero.save();
    return NextResponse.json(hero, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}
