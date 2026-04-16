import { NextRequest, NextResponse } from 'next/server';
import { parseMultipartFormData } from '@/lib/multipart';
import { saveImageFileToPublicUploads } from '@/lib/uploads';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

const uploadLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  namespace: 'secure-upload',
});

const ALLOWED_SUBDIRS = new Set([
  'about',
  'blog',
  'case-study',
  'content',
  'hero',
  'hire',
  'industries',
  'service',
  'team',
  'testimonials',
]);

function normalizeRequestedSubdir(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return '';
  const subdir = value.trim().toLowerCase();
  if (!subdir) return '';
  if (!ALLOWED_SUBDIRS.has(subdir)) {
    throw new Error('Invalid upload category');
  }
  return subdir;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const limit = uploadLimiter.consume(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many uploads. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const parsed = await parseMultipartFormData(request);
    if (!parsed.ok) return parsed.response;

    const formData = parsed.formData;
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const subdir = normalizeRequestedSubdir(formData.get('subdir'));
    const path = await saveImageFileToPublicUploads(file, subdir);

    return NextResponse.json({ success: true, path }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 });
  }
}
