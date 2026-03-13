// app/api/order.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase, Order } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateQRCode } from '@/lib/qrcode';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const slug = uuidv4();
  const photoUrls: string[] = [];

  // Upload images to Cloudinary (server-side)
  if (Array.isArray(data.photos) && data.photos.length > 0) {
    for (const photo of data.photos) {
      try {
        const url = await uploadToCloudinary(photo);
        photoUrls.push(url);
      } catch (err) {
        console.error('Cloudinary upload failed', err);
      }
    }
  }

  // Generate QR code with safe fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app';
  const coupleUrl = `${baseUrl}/love/${slug}`;
  const qrCodeUrl = await generateQRCode(coupleUrl);

  // Save order to Supabase - save entire config including section_content
  const { data: order, error } = await supabase.from('orders').insert([
    {
      slug,
      customer_name: data.customer_name,
      partner_name: data.partner_name,
      anniversary_date: data.anniversary_date,
      message: data.message,
      photos: photoUrls,
      song_link: data.song_link,
      qr_code_url: qrCodeUrl,
      status: 'pending',
      // Save config with all settings including section_content
      config: data.config || {},
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slug, coupleUrl, qrCodeUrl });
}
