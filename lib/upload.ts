import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function saveUploadedFile(file: File): Promise<string> {
  if (!(file instanceof File)) {
    throw new Error('Invalid file');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File size exceeds 5MB limit');
  }

  const extension = ALLOWED_MIME_TO_EXT[file.type];
  if (!extension) {
    throw new Error('Unsupported file type');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (buffer.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error('File size exceeds 5MB limit');
  }

  const fileName = `${crypto.randomUUID()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, fileName), buffer);

  return `/uploads/${fileName}`;
}