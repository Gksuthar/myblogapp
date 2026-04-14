import { NextResponse } from 'next/server';

type MultipartParseResult =
  | { ok: true; formData: FormData }
  | { ok: false; response: NextResponse };

export async function parseMultipartFormData(req: Request): Promise<MultipartParseResult> {
  const contentType = req.headers.get('content-type') || '';

  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Expected multipart/form-data request body' },
        { status: 415 }
      ),
    };
  }

  try {
    const formData = await req.formData();
    return { ok: true, formData };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid multipart/form-data payload' }, { status: 400 }),
    };
  }
}
