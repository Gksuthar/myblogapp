import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import About from '@/app/api/model/about'; // ✅ make sure this path matches your folder
import path from 'path';
import { promises as fs } from 'fs'; // Use async file system

// === Helper function to save files ===
const saveFile = async (file: File, folder: string) => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Sanitize and create filename
    const ext = path.extname(file.name) || `.${file.type.split('/')[1] || 'png'}`;
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    
    const uploadsDir = path.join(process.cwd(), 'public', folder);
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);
    
    return `/${folder}/${filename}`; // web-accessible path
  } catch (err) {
    console.error('File save error:', err);
    return ''; // Return empty string on failure
  }
};

// ==================== GET ====================
export async function GET() {
  try {
    await connectDB();
    const aboutData = await About.findOne({}).sort({ updatedAt: -1 }).lean();

    if (!aboutData) {
      // Return a default empty structure if not found
      return NextResponse.json({
        title: '',
        description: '',
        mission: '',
        vision: '',
        companyHistory: '',
        team: [],
        values: [],
      });
    }
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error fetching about us data:', error);
    return NextResponse.json({ message: 'Failed to fetch about us data' }, { status: 500 });
  }
}

// ==================== POST / PUT (Consolidated) ====================
// This single function handles both create (POST) and update (PUT)
async function handlePostOrPut(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    
    // 1. Get all simple text fields
    const dataToUpdate: any = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      mission: formData.get('mission') as string,
      vision: formData.get('vision') as string,
      companyHistory: formData.get('companyHistory') as string,
    };

    // 2. Process Team Members
    const teamDataString = formData.get('teamData') as string;
    const teamInfo = JSON.parse(teamDataString || '[]');
    const processedTeam = [];

    for (let i = 0; i < teamInfo.length; i++) {
      const memberInfo = teamInfo[i];
      const file = formData.get(`teamImage_${i}`) as File | null;
      
      let imagePath = memberInfo.image || ""; // Keep old image path by default

      if (file) {
        // New file uploaded, save it
        imagePath = await saveFile(file, 'uploads/team');
        // TODO: Delete old image if it exists and is a path
        // if (memberInfo.image && memberInfo.image.startsWith('/uploads/')) {
        //   await fs.unlink(path.join(process.cwd(), 'public', memberInfo.image)).catch(console.error);
        // }
      }
      
      processedTeam.push({
        name: memberInfo.name,
        position: memberInfo.position,
        bio: memberInfo.bio,
        image: imagePath, // Save the new or existing path
      });
    }
    dataToUpdate.team = processedTeam;

    // 3. Process Values (they are just JSON, no files)
    const valuesDataString = formData.get('valuesData') as string;
    dataToUpdate.values = JSON.parse(valuesDataString || '[]');

    // 4. Update or Create the single document
    // findOneAndUpdate with upsert:true is perfect for this "singleton" model
    const aboutData = await About.findOneAndUpdate({}, dataToUpdate, {
      new: true,
      upsert: true, // Creates if no document exists
      runValidators: true,
    });

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error saving about us data:', error);
    return NextResponse.json({ message: 'Failed to save about us data', error: (error as Error).message }, { status: 500 });
  }
}

// POST and PUT routes now use the same handler
export const POST = handlePostOrPut;
export const PUT = handlePostOrPut;


// ==================== DELETE ====================
export async function DELETE() {
  try {
    await connectDB();
    const deleted = await About.findOneAndDelete({});
    if (!deleted) {
      return NextResponse.json({ message: 'About us data not found' }, { status: 404 });
    }
    
    // TODO: Clean up all image files from /public/uploads/team
    for (const member of deleted.team) {
      if (member.image && member.image.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', member.image);
        await fs.unlink(filePath).catch(err => console.warn(`Failed to delete image: ${filePath}`, err));
      }
    }

    return NextResponse.json({ message: 'About us data deleted successfully' });
  } catch (error) {
    console.error('Error deleting about us data:', error);
    return NextResponse.json({ message: 'Failed to delete about us data' }, { status: 500 });
  }
}