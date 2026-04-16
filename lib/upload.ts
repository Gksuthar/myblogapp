import { saveImageFileToPublicUploads } from './uploads';

export async function saveUploadedFile(file: File): Promise<string> {
  return saveImageFileToPublicUploads(file);
}