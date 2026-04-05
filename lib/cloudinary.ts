// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { withRetry } from '@/lib/reliability/retry';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('Warning: Cloudinary environment variables are not fully configured. Image uploads may fail.');
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export default cloudinary;

export type CloudinaryUploadOptions = {
  isHero?: boolean;
  maxWidth?: number;
  quality?: string;
  fetchFormat?: string;
  outputFormat?: 'webp' | 'jpg' | 'png' | 'avif';
  crop?: 'limit' | 'fill' | 'scale';
  stripMetadata?: boolean;
};

// helper for server-side uploads
export async function uploadToCloudinary(dataUrl: string, options: CloudinaryUploadOptions = {}): Promise<string> {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  const isHero = options.isHero ?? false;
  const maxWidth = options.maxWidth ?? (isHero ? 1920 : 1600);
  // Use visually-lossless defaults while reducing bytes significantly for storage.
  const quality = options.quality ?? 'auto:good';
  const fetchFormat = options.fetchFormat ?? 'auto';
  const outputFormat = options.outputFormat ?? 'webp';
  const crop = options.crop ?? 'limit';
  const stripMetadata = options.stripMetadata ?? true;

  const progressiveFlags = stripMetadata
    ? 'progressive,strip_profile'
    : 'progressive';

  const transformation: any[] = [{ width: maxWidth, crop }];
  transformation.push({
    quality,
    fetch_format: fetchFormat,
    flags: progressiveFlags,
  });

  const res = await withRetry(
    () => cloudinary.uploader.upload(dataUrl, {
      folder: 'loveqr',
      transformation,
      format: outputFormat,
      use_filename: true,
      unique_filename: false,
    }),
    {
      retries: 2,
      minDelayMs: 400,
      maxDelayMs: 2500,
    },
  );
  return res.secure_url;
}

