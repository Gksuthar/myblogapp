import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { parseMultipartFormData } from '@/lib/multipart';
import { deletePublicUploadIfLocal, saveImageFileToPublicUploads } from '@/lib/uploads';
import About from '@/app/api/model/about'; // ✅ make sure this path matches your folder

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

    const parsed = await parseMultipartFormData(request);
    if (!parsed.ok) return parsed.response;
    const formData = parsed.formData;
    
    // 1. Get all simple text fields
    const dataToUpdate: Record<string, unknown> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      mission: formData.get('mission') as string,
      vision: formData.get('vision') as string,
      companyHistory: formData.get('companyHistory') as string,
    };

    // 2. Process Team Members
    const teamDataString = formData.get('teamData');
    let teamInfo: unknown[] = [];
    try {
      const parsedTeam = JSON.parse(typeof teamDataString === 'string' ? teamDataString : '[]');
      if (!Array.isArray(parsedTeam)) {
        return NextResponse.json({ message: 'teamData must be an array' }, { status: 400 });
      }
      teamInfo = parsedTeam;
    } catch {
      return NextResponse.json({ message: 'Invalid teamData JSON' }, { status: 400 });
    }

    if (teamInfo.length > 50) {
      return NextResponse.json({ message: 'Too many team members' }, { status: 400 });
    }

    const processedTeam: Array<{ name: string; position: string; bio: string; image: string }> = [];

    for (let i = 0; i < teamInfo.length; i++) {
      const raw = teamInfo[i];
      const memberInfo = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
      const file = formData.get(`teamImage_${i}`);

      let imagePath = typeof memberInfo.image === 'string' ? memberInfo.image : '';
      if (imagePath && (imagePath.length > 300 || !imagePath.startsWith('/uploads/'))) {
        imagePath = '';
      }

      if (file instanceof File && file.size > 0) {
        let newPath = '';
        try {
          newPath = await saveImageFileToPublicUploads(file, 'team');
        } catch {
          return NextResponse.json({ message: `Invalid team image upload at index ${i}` }, { status: 400 });
        }

        await deletePublicUploadIfLocal(imagePath);
        imagePath = newPath;
      }

      const name = typeof memberInfo.name === 'string' ? memberInfo.name : '';
      const position = typeof memberInfo.position === 'string' ? memberInfo.position : '';
      const bio = typeof memberInfo.bio === 'string' ? memberInfo.bio : '';

      if (name.length > 100 || position.length > 100 || bio.length > 2000) {
        return NextResponse.json({ message: `Invalid team field length at index ${i}` }, { status: 400 });
      }

      processedTeam.push({
        name,
        position,
        bio,
        image: imagePath,
      });
    }
    dataToUpdate.team = processedTeam;

    // 3. Process Values (they are just JSON, no files)
    const valuesDataString = formData.get('valuesData');
    try {
      const parsedValues = JSON.parse(typeof valuesDataString === 'string' ? valuesDataString : '[]');
      if (!Array.isArray(parsedValues)) {
        return NextResponse.json({ message: 'valuesData must be an array' }, { status: 400 });
      }
      if (parsedValues.length > 50) {
        return NextResponse.json({ message: 'Too many values' }, { status: 400 });
      }
      dataToUpdate.values = parsedValues;
    } catch {
      return NextResponse.json({ message: 'Invalid valuesData JSON' }, { status: 400 });
    }

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
    
    // Best-effort cleanup of local uploaded images
    for (const member of deleted.team) {
      await deletePublicUploadIfLocal(member?.image || '');
    }

    return NextResponse.json({ message: 'About us data deleted successfully' });
  } catch (error) {
    console.error('Error deleting about us data:', error);
    return NextResponse.json({ message: 'Failed to delete about us data' }, { status: 500 });
  }
}