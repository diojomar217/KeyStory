import { uploadToCloudinary, CloudinaryUploadOptions } from '@/lib/cloudinary';

export type NormalizeUploadResult = {
  photos: string[];
  warnings: string[];
  pendingUploads: number;
};

export async function normalizeAndUploadPhotos(
  inputPhotos: unknown[] | undefined,
  opts?: { maxImages?: number; cloudinaryOptions?: CloudinaryUploadOptions },
): Promise<NormalizeUploadResult> {
  const MAX = opts?.maxImages ?? 18;
  const cloudinaryOptions = opts?.cloudinaryOptions ?? {};

  const warnings: string[] = [];
  let pendingUploads = 0;
  const seen = new Set<string>();
  const processed: string[] = [];

  if (!Array.isArray(inputPhotos) || inputPhotos.length === 0) {
    return { photos: [], warnings, pendingUploads };
  }

  const toProcess = inputPhotos.slice(0, MAX);
  for (const item of toProcess) {
    if (typeof item !== 'string') continue;
    const trimmed = item.trim();
    if (!trimmed) continue;

    // Skip browser-local object URLs which cannot be uploaded/persisted
    if (trimmed.startsWith('blob:') || trimmed.startsWith('file:')) {
      if (!warnings.includes('Ignored local blob/file URL')) warnings.push('Ignored local blob/file URL');
      continue;
    }

    if (seen.has(trimmed)) continue;
    seen.add(trimmed);

    if (trimmed.startsWith('data:')) {
      try {
        const uploaded = await uploadToCloudinary(trimmed, { ...cloudinaryOptions });
        processed.push(uploaded);
      } catch (err: any) {
        console.error('media upload error', err);
        pendingUploads += 1;
        warnings.push(err?.message || 'Photo upload failed');
      }
    } else {
      processed.push(trimmed);
    }
  }

  // Final dedupe & trim
  const out: string[] = [];
  const seenOut = new Set<string>();
  for (const p of processed) {
    const t = (p || '').toString().trim();
    if (!t) continue;
    if (seenOut.has(t)) continue;
    seenOut.add(t);
    out.push(t);
  }

  return { photos: out, warnings, pendingUploads };
}

export const isDataUrl = (s: unknown): s is string => typeof s === 'string' && s.startsWith('data:');
