import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });

    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;

    const url = await uploadToCloudinary(dataUrl, { isHero: false });
    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    console.error('cloudinary upload failed', err);
    return NextResponse.json({ success: false, message: err?.message || 'Upload failed' }, { status: 500 });
  }
}
