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

// helper for server-side uploads
export async function uploadToCloudinary(dataUrl: string): Promise<string> {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  // Cost control / optimization settings:
  // - limit max dimensions via transformation
  // - use automatic quality and format (
  // - avoid retaining original heavy variants where possible
  const res = await cloudinary.uploader.upload(dataUrl, {
    folder: 'loveqr',
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
    use_filename: true,
    unique_filename: false,
  });
  return res.secure_url;
}
