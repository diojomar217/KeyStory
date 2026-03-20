import { NextRequest, NextResponse } from 'next/server';
import { supabase, Site } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateQRCode } from '@/lib/qrcode';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { SiteConfig } from '@/lib/types';

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

const normalizePasswordConfig = async (siteConfig: any, passwordInput?: string): Promise<any> => {
  if (!siteConfig) siteConfig = {};

  if (siteConfig.password?.enabled === true) {
    if (passwordInput && passwordInput.trim()) {
      const password = passwordInput.trim();
      if (password.length < 4 || password.length > 6) {
        throw new Error('Password must be 4 to 6 characters long');
      }
      const hash = await bcrypt.hash(password, 10);
      return {
        ...siteConfig,
        password: {
          enabled: true,
          hash,
        },
      };
    }

    if (siteConfig.password.hash) {
      return {
        ...siteConfig,
        password: {
          enabled: true,
          hash: siteConfig.password.hash,
        },
      };
    }

    throw new Error('Password is required when protection is enabled');
  }

  const cleanedConfig = { ...siteConfig };
  delete cleanedConfig.password;
  return cleanedConfig;
};

interface OrderRequest {
  website_name?: string;
  occasion?: 'couple' | 'birthday' | string;
  customer_name?: string;
  partner_name?: string;
  anniversary_date?: string;
  participants?: { id: string; name: string; role?: string }[];
  specialDate?: string;
  message?: string;
  tagline?: string;
  song_link?: string;
  photos?: string[];
  config?: SiteConfig;
  password_input?: string;
  expires_at?: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: OrderRequest = await req.json();
    const occasion = (data.occasion || data.config?.occasion || 'couple').toString();

    const customerName = data.customer_name || data.participants?.[0]?.name || '';
    const partnerName = data.partner_name || data.participants?.[1]?.name || '';
    const specialDate = data.specialDate || data.anniversary_date || '';
    const message = data.message || '';

    const requiredFieldsByOccasion: Record<string, string[]> = {
      couple: ['customer_name', 'partner_name', 'special_date', 'message'],
      birthday: ['customer_name', 'special_date', 'message'],
    };

    const requiredFields = requiredFieldsByOccasion[occasion] || requiredFieldsByOccasion.couple;

    const missingFields = requiredFields.filter((field) => {
      if (field === 'customer_name') return !customerName.trim();
      if (field === 'partner_name') return !partnerName.trim();
      if (field === 'special_date') return !specialDate.trim();
      if (field === 'message') return !message.trim();
      return true;
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields for ${occasion} occasion: ${missingFields.join(', ')}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    const slug = uuidv4();
    const cleanName = (data.website_name || '').trim();
    const normalized = cleanName ? slugify(cleanName) : slug;
    const website_name = cleanName ? `${normalized}-${randomSuffix()}` : slug;

    const MAX_SITE_IMAGES = 18;
    // upload pictures (cost-controlled)
    const photoUrls: string[] = [];
    if (Array.isArray(data.photos) && data.photos.length > 0) {
      const photosToProcess = data.photos.slice(0, MAX_SITE_IMAGES);
      for (const photo of photosToProcess) {
        try {
          const url = await uploadToCloudinary(photo);
          photoUrls.push(url);
        } catch (err) {
          console.error('cloudinary upload error', err);
        }
      }
      if (data.photos.length > MAX_SITE_IMAGES) {
        console.warn(`Image limit exceeded, only storing first ${MAX_SITE_IMAGES} photos`);
      }
    }

    // Get base URL safely
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app';
    const coupleUrl = `${baseUrl}/site/${website_name}`;
    const qrCodeUrl = await generateQRCode(coupleUrl);

    // Build normalized site config for storage
    let siteConfig = {
      ...data.config,
      people: {
        primary: customerName,
        secondary: partnerName,
      },
      dates: {
        special_date: specialDate,
      },
      theme: data.config?.theme || data.config?.theme || 'romantic_classic',
      sections: data.config?.sections || [],
      templates: {
        home: data.config?.home_template,
        gallery: data.config?.gallery_template,
        timeline: data.config?.timeline_template,
      },
      media: {
        photos: photoUrls,
        song_link: data.song_link || '',
        song_autoplay: (data as any).song_autoplay ?? false,
      },
      timeline: data.config?.timeline_events || [],
      content: data.config?.section_content || {},
      message,
      tagline: data.tagline || data.config?.tagline || '',
    };

    siteConfig = await normalizePasswordConfig(siteConfig, data.password_input);
    let expiresAt = addMonths(new Date(), DEFAULT_HOSTING_MONTHS);
    if (data.expires_at) {
      const parsed = new Date(data.expires_at);
      if (!Number.isNaN(parsed.getTime()) && parsed > new Date()) {
        expiresAt = parsed.toISOString();
      } else {
        return NextResponse.json({ success: false, message: 'Invalid expires_at' }, { status: 400 });
      }
    }

    const insertObj: Partial<Site> = {
      slug,
      website_name,
      site_type: occasion,
      status: 'active',
      expires_at: expiresAt,
      archived_at: null,
      qr_code_url: qrCodeUrl,
      config: siteConfig,
    };

    const { data: site, error } = await supabase
      .from('sites')
      .insert([insertObj])
      .select()
      .single();

    if (error) {
      console.error('supabase insert error', error);
      return NextResponse.json({ success: false, message: error.message || 'Database error', details: error }, { status: 500 });
    }

    try {
      const { revalidatePath } = await import('next/cache');
      if (site?.website_name) {
        revalidatePath(`/site/${site.website_name}`);
        revalidatePath(`/love/${site.website_name}`);
      }
    } catch (err) {
      console.warn('Revalidate path failed on create site:', err);
    }

    return NextResponse.json({ success: true, slug, website_name, qr_code_url: qrCodeUrl });
  } catch (err) {
    console.error('order route exception', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
