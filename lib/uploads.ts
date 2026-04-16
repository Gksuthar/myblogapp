import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedImageMime = (typeof ALLOWED_IMAGE_MIMES)[number];
const UPLOADS_ROOT = path.resolve(process.cwd(), 'public', 'uploads');

function isAllowedImageMime(mime: string): mime is AllowedImageMime {
  return (ALLOWED_IMAGE_MIMES as readonly string[]).includes(mime);
}

function normalizeSubdir(subdir: string) {
  const cleaned = String(subdir || '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (!cleaned) return '';
  if (cleaned.includes('..')) {
    throw new Error('Invalid upload subdir');
  }
  if (!/^[a-zA-Z0-9/_-]+$/.test(cleaned)) {
    throw new Error('Invalid upload subdir');
  }
  return cleaned;
}

function resolvePathInsideUploads(relativePath: string): string | null {
  const safeRelative = String(relativePath || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!safeRelative || safeRelative.includes('..') || safeRelative.includes('\u0000')) {
    return null;
  }

  const absolute = path.resolve(UPLOADS_ROOT, safeRelative);
  if (absolute !== UPLOADS_ROOT && !absolute.startsWith(UPLOADS_ROOT + path.sep)) {
    return null;
  }

  return absolute;
}

export function isSafePublicUploadPath(webPath: string) {
  if (!webPath || typeof webPath !== 'string') return false;
  if (!webPath.startsWith('/uploads/')) return false;

  const rel = webPath.slice('/uploads/'.length);
  return resolvePathInsideUploads(rel) !== null;
}

function detectImageMime(buffer: Buffer): AllowedImageMime | null {
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

function extensionForMime(mime: AllowedImageMime) {
  switch (mime) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
  }
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function saveImageFileToPublicUploads(file: File, subdir = '') {
  if (!file) throw new Error('Missing file');
  if (typeof file.size === 'number' && file.size > MAX_IMAGE_BYTES) {
    throw new Error('File too large');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error('File too large');
  }

  const detected = detectImageMime(buffer);
  if (!detected) {
    throw new Error('Unsupported image type');
  }

  // Some clients spoof `file.type`; we validate by magic bytes.
  const normalizedSubdir = normalizeSubdir(subdir);
  const ext = extensionForMime(detected);
  const filename = `${crypto.randomUUID()}.${ext}`;

  const uploadDir = path.resolve(UPLOADS_ROOT, normalizedSubdir);
  if (uploadDir !== UPLOADS_ROOT && !uploadDir.startsWith(UPLOADS_ROOT + path.sep)) {
    throw new Error('Invalid upload target');
  }
  await ensureDir(uploadDir);

  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${normalizedSubdir ? `${normalizedSubdir}/` : ''}${filename}`;
}

export async function saveImageDataUrlToPublicUploads(dataUrl: string, subdir = '') {
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid data URL');

  const claimedMime = match[1].trim().toLowerCase();
  const base64Data = match[2];

  if (!isAllowedImageMime(claimedMime)) {
    throw new Error('Unsupported image type');
  }

  // Rough upper bound: base64 inflates by ~4/3.
  if (base64Data.length > Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 16) {
    throw new Error('File too large');
  }

  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error('File too large');
  }

  const detected = detectImageMime(buffer);
  if (!detected || detected !== claimedMime) {
    throw new Error('Invalid image payload');
  }

  const normalizedSubdir = normalizeSubdir(subdir);
  const ext = extensionForMime(detected);
  const filename = `${crypto.randomUUID()}.${ext}`;

  const uploadDir = path.resolve(UPLOADS_ROOT, normalizedSubdir);
  if (uploadDir !== UPLOADS_ROOT && !uploadDir.startsWith(UPLOADS_ROOT + path.sep)) {
    throw new Error('Invalid upload target');
  }
  await ensureDir(uploadDir);

  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${normalizedSubdir ? `${normalizedSubdir}/` : ''}${filename}`;
}

export async function deletePublicUploadIfLocal(webPath: string) {
  if (!isSafePublicUploadPath(webPath)) return;

  const rel = webPath.slice('/uploads/'.length);
  const filePath = resolvePathInsideUploads(rel);
  if (!filePath) return;

  try {
    const stat = await fs.lstat(filePath);
    if (!stat.isFile()) return;
    await fs.unlink(filePath);
  } catch {
    // best effort
  }
}
