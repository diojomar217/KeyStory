import { NextRequest, NextResponse } from 'next/server';
import { supabase, Order } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateQRCode } from '@/lib/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { SiteConfig } from '@/lib/types';

interface OrderRequest {
  website_name?: string;
  customer_name: string;
  partner_name: string;
  anniversary_date: string;
  message: string;
  tagline?: string;
  song_link?: string;
  photos?: string[];
  config?: SiteConfig;
}

export async function POST(req: NextRequest) {
  try {
    const data: OrderRequest = await req.json();

    // basic validation
    if (
      !data.customer_name ||
      !data.partner_name ||
      !data.anniversary_date ||
      !data.message
    ) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = uuidv4();
    const website_name = data.website_name || slug; // use provided name, fallback to slug

    // upload pictures
    const photoUrls: string[] = [];
    if (Array.isArray(data.photos) && data.photos.length > 0) {
      for (const photo of data.photos) {
        try {
          const url = await uploadToCloudinary(photo);
          photoUrls.push(url);
        } catch (err) {
          console.error('cloudinary upload error', err);
        }
      }
    }

    // Get base URL safely
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app';
    const coupleUrl = `${baseUrl}/love/${website_name}`;
    const qrCodeUrl = await generateQRCode(coupleUrl);

    // Store the URL in config for styled QR generation
    const qrConfig = {
      ...data.config,
      qr_data_url: coupleUrl,
      tagline: data.tagline,
    };

    // prepare insert object
    const insertObj: Partial<Order> = {
      slug,
      website_name,
      customer_name: data.customer_name,
      partner_name: data.partner_name,
      anniversary_date: data.anniversary_date,
      message: data.message,
      photos: photoUrls,
      song_link: data.song_link,
      qr_code_url: qrCodeUrl,
      status: 'pending',
    };

    // configuration extracted from payload
    if (qrConfig) {
      insertObj.config = qrConfig;
      insertObj.theme = qrConfig.theme;
      insertObj.sections = qrConfig.sections || [];
      insertObj.home_template = qrConfig.home_template;
      insertObj.gallery_template = qrConfig.gallery_template;
      insertObj.timeline_template = qrConfig.timeline_template;
      insertObj.timeline_events = qrConfig.timeline_events || [];
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert([insertObj])
      .select()
      .single();

    if (error) {
      console.error('supabase insert error', error);
      // expose error message in development to aid debugging
      return NextResponse.json({ success: false, message: error.message || 'Database error', details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug, website_name, qr_code_url: qrCodeUrl });
  } catch (err) {
    console.error('order route exception', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
