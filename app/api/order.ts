// app/api/order.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase, Site } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateQRCode } from '@/lib/qrcode';
import { v4 as uuidv4 } from 'uuid';

const addMonths = (date: Date, months: number): string => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result.toISOString();
};

const DEFAULT_HOSTING_MONTHS = 6;


const slugify = (text: string): string =>
  text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const randomSuffix = () => Math.floor(1000 + Math.random() * 9000).toString();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const baseSlug = uuidv4();
  const cleanName = (data.website_name || '').trim();
  const websiteSlug = cleanName ? `${slugify(cleanName)}-${randomSuffix()}` : baseSlug;
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
  const coupleUrl = `${baseUrl}/site/${websiteSlug}`;
  const qrCodeUrl = await generateQRCode(coupleUrl);

  const siteConfig = {
    ...(data.config || {}),
    people: {
      primary: data.customer_name || data.participants?.[0]?.name || '',
      secondary: data.partner_name || data.participants?.[1]?.name || '',
    },
    dates: {
      special_date: data.specialDate || data.anniversary_date || '',
    },
    theme: data.config?.theme || 'romantic_classic',
    sections: data.config?.sections || [],
    templates: {
      home: data.config?.home_template,
      gallery: data.config?.gallery_template,
      timeline: data.config?.timeline_template,
    },
    media: {
      photos: photoUrls,
      song_link: data.song_link || '',
    },
    timeline: data.config?.timeline_events || [],
    content: data.config?.section_content || {},
    message: data.message || '',
    tagline: data.tagline || data.config?.tagline || '',
  };

  const { data: site, error } = await supabase.from('sites').insert([
    {
      slug: baseSlug,
      website_name: websiteSlug,
      site_type: data.occasion || 'couple',
      status: 'active',
      expires_at: addMonths(new Date(), DEFAULT_HOSTING_MONTHS),
      archived_at: null,
      qr_code_url: qrCodeUrl,
      config: siteConfig,
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slug: websiteSlug, coupleUrl, qrCodeUrl });
}
