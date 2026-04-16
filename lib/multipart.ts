import { NextResponse } from 'next/server';

const MAX_MULTIPART_BYTES = 6 * 1024 * 1024; // 6MB including form fields

type MultipartParseResult =
  | { ok: true; formData: FormData }
  | { ok: false; response: NextResponse };

export async function parseMultipartFormData(req: Request): Promise<MultipartParseResult> {
  const contentType = req.headers.get('content-type') || '';
  const contentLengthHeader = req.headers.get('content-length');

  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Expected multipart/form-data request body' },
        { status: 415 }
      ),
    };
  }

  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > MAX_MULTIPART_BYTES) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Multipart payload too large' },
          { status: 413 }
        ),
      };
    }
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
