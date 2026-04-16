import { connectDB } from "@/lib/mongodb";
import { parseMultipartFormData } from "@/lib/multipart";
import { deletePublicUploadIfLocal, saveImageFileToPublicUploads } from "@/lib/uploads";
import { Hero } from "../model/hero";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const hero = await Hero.findOne().sort({ createdAt: -1 });
    if (!hero) return NextResponse.json({ error: "No hero found" }, { status: 404 });
    return NextResponse.json(hero);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;
    const title = formData.get("title") as string;
    const disc = formData.get("disc") as string;
    const buttonText = formData.get("buttonText") as string;
    const file = formData.get("image") as File | null;

    if (!title || !disc) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imagePath = "";
    if (file instanceof File && file.size > 0) {
      try {
        imagePath = await saveImageFileToPublicUploads(file, 'hero');
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }
    }

    const hero = new Hero({ title, disc, image: imagePath, buttonText });
    await hero.save();

    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create hero" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const parsed = await parseMultipartFormData(req);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const disc = formData.get("disc") as string;
    const buttonText = formData.get("buttonText") as string;
    const file = formData.get("image") as File | null; // This will be null if no new file is sent

    const hero = await Hero.findById(id);
    if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

    if (title) hero.title = title;
    if (disc) hero.disc = disc;
    if (buttonText) hero.buttonText = buttonText; // Handles "" (empty string) correctly

    // This block only runs if a new file was *actually* uploaded
    if (file instanceof File && file.size > 0) {
      let newPath = '';
      try {
        newPath = await saveImageFileToPublicUploads(file, 'hero');
      } catch {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
      }

      await deletePublicUploadIfLocal(hero.image || '');
      hero.image = newPath;
    }

    await hero.save();
    return NextResponse.json(hero, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}