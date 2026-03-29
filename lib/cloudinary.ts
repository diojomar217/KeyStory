// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

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
  const quality = options.quality ?? (isHero ? 'auto:good' : 'auto:eco');
  const fetchFormat = options.fetchFormat ?? 'auto';
  const crop = options.crop ?? 'limit';
  const stripMetadata = options.stripMetadata ?? true;


  const transformation: any[] = [{ width: maxWidth, crop }];
  // Hero uses slightly higher quality and larger width, gallery uses lighter optimization
  transformation.push({ quality, fetch_format: fetchFormat, flags: 'progressive' });
  // 'strip' is not a valid Cloudinary flag and causes errors. Do not add it.

  const res = await cloudinary.uploader.upload(dataUrl, {
    folder: 'loveqr',
    transformation,
    use_filename: true,
    unique_filename: false,
  });
  return res.secure_url;
}

