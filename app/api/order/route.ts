import { NextRequest, NextResponse } from 'next/server';
import { supabase, Site } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateQRCode } from '@/lib/qrcode';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { SiteConfig } from '@/lib/types';
import { DEFAULT_THEME } from '@/config/defaults';
import { createHash } from 'crypto';
import { getIdempotencyReplay, saveIdempotencyResult } from '@/lib/db/idempotency';
import { validateAndNormalizeSiteConfig } from '@/lib/site-config-validation';

const addMonths = (date: Date, months: number): string => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result.toISOString();
};

const DEFAULT_HOSTING_MONTHS = 6;

const normalizeUniqueTextArray = (input: unknown[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of input) {
    if (typeof item !== 'string') continue;
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
};


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

const resolveUniqueWebsiteName = async (base: string): Promise<string> => {
  const candidateBase = base.trim();

  for (let i = 0; i < 5; i++) {
    const candidate = `${candidateBase}-${randomSuffix()}`;
    const { data } = await supabase
      .from('sites')
      .select('id')
      .eq('website_name', candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  return `${candidateBase}-${Date.now()}`;
};

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
  participants?: { id: string; name: string; role?: string }[];
  specialDate?: string;
  message?: string;
  tagline?: string;
  song_link?: string;
  photos?: string[];
  config?: SiteConfig;
  hero_photo?: string;
  password_input?: string;
  expires_at?: string;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const data: OrderRequest = JSON.parse(rawBody || '{}');
    const idempotencyKey = req.headers.get('idempotency-key')?.trim() || '';
    const requestHash = createHash('sha256').update(rawBody || '{}').digest('hex');

    if (idempotencyKey) {
      const replay = await getIdempotencyReplay('order:create', idempotencyKey, requestHash);
      if (replay) {
        return NextResponse.json(replay.response, { status: replay.statusCode });
      }
    }

    const occasion = (data.occasion || data.config?.occasion || 'couple').toString();

    const customerName = data.customer_name || data.participants?.[0]?.name || '';
    const partnerName = data.partner_name || data.participants?.[1]?.name || '';
    const specialDate = data.specialDate || '';
    const message = data.message || '';

    const requiredFieldsByOccasion: Record<string, string[]> = {
      couple: ['customer_name', 'partner_name', 'special_date'],
      wedding: ['customer_name', 'partner_name', 'special_date'],
      birthday: ['customer_name', 'special_date'],
      anniversary: ['customer_name', 'partner_name', 'special_date'],
      proposal: ['customer_name', 'partner_name', 'special_date'],
      graduation: ['customer_name', 'special_date'],
      baby_shower: ['customer_name', 'special_date'],
      debut: ['customer_name', 'special_date'],
      memorial: ['customer_name', 'special_date'],
      family: ['customer_name', 'special_date'],
      friendship: ['customer_name', 'special_date'],
      travel: ['customer_name', 'special_date'],
      valentines: ['customer_name', 'partner_name', 'special_date'],
      mothers_day: ['customer_name', 'special_date'],
      fathers_day: ['customer_name', 'special_date'],
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
    const website_name = cleanName ? await resolveUniqueWebsiteName(normalized) : slug;

    const MAX_SITE_IMAGES = 18;
    // upload pictures (cost-controlled)
    const photoUrls: string[] = [];
    const photoUploadWarnings: string[] = [];

    if (Array.isArray(data.photos) && data.photos.length > 0) {
      const photosToProcess = data.photos.slice(0, MAX_SITE_IMAGES);
      for (const photo of photosToProcess) {
        if (typeof photo === 'string' && !photo.trim()) continue;

        if (typeof photo === 'string' && photo.startsWith('data:')) {
          try {
            const url = await uploadToCloudinary(photo, { isHero: false });
            photoUrls.push(url);
          } catch (err: any) {
            console.error('cloudinary upload error', err);
            photoUploadWarnings.push(err?.message || 'Photo upload failed');
            // fallback to data URL to avoid dropping images
            photoUrls.push(photo);
          }
        } else if (typeof photo === 'string') {
          photoUrls.push(photo);
        }
      }
      if (data.photos.length > MAX_SITE_IMAGES) {
        console.warn(`Image limit exceeded, only storing first ${MAX_SITE_IMAGES} photos`);
      }
    }

    const uniquePhotoUrls = normalizeUniqueTextArray(photoUrls);

    // Get base URL safely
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app';
    const qrRedirectUrl = `${baseUrl}/r/${website_name}`;
    const qrCodeUrl = await generateQRCode(qrRedirectUrl);

    // Build normalized site config for storage
    let heroCoverPhotoUrl: string | undefined = data.config?.hero?.coverPhotoUrl;
    let heroUploadWarning: string | null = null;

    if (data.hero_photo) {
      try {
        heroCoverPhotoUrl = await uploadToCloudinary(data.hero_photo, { isHero: true });
      } catch (err: any) {
        console.error('hero photo upload error', err);
        heroUploadWarning = err?.message || 'Hero photo upload failed';
        if (typeof data.hero_photo === 'string' && data.hero_photo.startsWith('data:')) {
          heroCoverPhotoUrl = data.hero_photo;
        }
      }
    }

    if (
      typeof data.config?.hero?.coverPhotoIndex === 'number' &&
      uniquePhotoUrls[data.config.hero.coverPhotoIndex]
    ) {
      heroCoverPhotoUrl = uniquePhotoUrls[data.config.hero.coverPhotoIndex];
    }

    if (typeof data.config?.cover_photo_index === 'number' && !heroCoverPhotoUrl && uniquePhotoUrls[data.config.cover_photo_index]) {
      heroCoverPhotoUrl = uniquePhotoUrls[data.config.cover_photo_index];
    }

    const rawConfig = (data.config || {}) as any;

    // Remove duplicate template fields and only keep templates object
    const templates = rawConfig.templates || {
      home: rawConfig.home_template,
      gallery: rawConfig.gallery_template,
      timeline: rawConfig.timeline_template,
      song: rawConfig.song_template,
    };
    // Remove config.participants if present
    let { participants, ...configWithoutParticipants } = rawConfig;
    let siteConfig: any = {
      ...configWithoutParticipants,
      home_template: undefined,
      gallery_template: undefined,
      timeline_template: undefined,
      song_template: undefined,
      templates,
      people: {
        primary: customerName,
        secondary: partnerName,
      },
      dates: {
        special_date: specialDate,
      },
      theme: rawConfig.theme || DEFAULT_THEME,
      sections: rawConfig.sections || [],
      media: {
        photos: uniquePhotoUrls,
        song_link: rawConfig.media?.song_link || '',
        song_autoplay: rawConfig.media?.song_autoplay ?? false,
      },
      timeline: rawConfig.timeline_events || [],
      section_content: rawConfig.section_content || {},
      message,
      tagline: data.tagline || rawConfig.tagline || '',
      hero: {
        ...(rawConfig.hero || {}),
        ...(heroCoverPhotoUrl ? { coverPhotoUrl: heroCoverPhotoUrl } : {}),
      },
    };

    const validation = validateAndNormalizeSiteConfig(siteConfig);
    if (validation.errors.length > 0) {
      return NextResponse.json(
        { success: false, message: validation.errors.join('; ') },
        { status: 400 },
      );
    }

    siteConfig = await normalizePasswordConfig(validation.config, data.password_input);
    siteConfig.meta = {
      ...(siteConfig.meta || {}),
      revision: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
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

    const responsePayload = {
      success: true,
      slug,
      website_name,
      qr_code_url: qrCodeUrl,
      warnings: [
        ...photoUploadWarnings,
        ...(heroUploadWarning ? [heroUploadWarning] : []),
      ],
    };

    if (idempotencyKey) {
      await saveIdempotencyResult('order:create', idempotencyKey, requestHash, 200, responsePayload);
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error('order route exception', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
