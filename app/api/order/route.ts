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
    let photoUrls: string[] = [];
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

    const coupleUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/love/${website_name}`;
    const qrCodeUrl = await generateQRCode(coupleUrl);

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
    if (data.config) {
      insertObj.config = data.config;
      insertObj.theme = data.config.theme;
      insertObj.sections = data.config.sections || [];
      insertObj.home_template = data.config.home_template;
      insertObj.gallery_template = data.config.gallery_template;
      insertObj.timeline_template = data.config.timeline_template;
      insertObj.timeline_events = data.config.timeline_events || [];
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
