import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { caseStudyschema } from "../../model/casestudy";

// Utility function to create a slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Migration endpoint to add slugs to existing case studies
export async function POST() {
  try {
    await connectDB();
    
    // Find all case studies without slugs
    const caseStudiesWithoutSlugs = await caseStudyschema.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" }
      ]
    });

    if (caseStudiesWithoutSlugs.length === 0) {
      return NextResponse.json({
        message: "All case studies already have slugs",
        updated: 0
      });
    }

    const updates = [];
    for (const caseStudy of caseStudiesWithoutSlugs) {
      const baseSlug = createSlug(caseStudy.title);
      let counter = 1;
      let uniqueSlug = baseSlug;
      
      // Ensure slug is unique
      while (await caseStudyschema.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      updates.push(
        caseStudyschema.findByIdAndUpdate(caseStudy._id, { slug: uniqueSlug })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({
      message: "Successfully added slugs to case studies",
      updated: caseStudiesWithoutSlugs.length,
      caseStudies: caseStudiesWithoutSlugs.map((cs) => ({
        id: cs._id,
        title: cs.title,
        slug: createSlug(cs.title)
      }))
    });
  } catch (error) {
    console.error("Migration Error:", error);
    return NextResponse.json(
      { error: "Failed to migrate case studies" },
      { status: 500 }
    );
  }
}
