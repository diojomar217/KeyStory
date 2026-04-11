import { NextRequest, NextResponse } from 'next/server';
import { supabase, Site } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { normalizeAndUploadPhotos } from '@/lib/media';
import { generateQRCode } from '@/lib/qrcode';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { SiteConfig } from '@/lib/types';
import { DEFAULT_THEME } from '@/config/defaults';
import { createHash } from 'crypto';
import { getIdempotencyReplay, saveIdempotencyResult } from '@/lib/db/idempotency';
import { validateAndNormalizeSiteConfig } from '@/lib/site-config-validation';
import { enforceRateLimit } from '@/lib/reliability/rate-limit';
import { captureError } from '@/lib/reliability/monitoring';
import { enqueueJob } from '@/lib/reliability/job-queue';
import { featureFlags } from '@/lib/reliability/feature-flags';

const addMonths = (date: Date, months: number): string => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result.toISOString();
};

const DEFAULT_HOSTING_MONTHS = 6;

const normalizeUniqueTextArray = (input: unknown[], _maxLen?: number): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  if (!Array.isArray(input)) return result;

  for (const item of input) {
    if (typeof item !== 'string') continue;
    const normalized = item.trim();
    if (!normalized) continue;
    if (normalized.startsWith('blob:') || normalized.startsWith('file:')) continue;
    if (seen.has(normalized)) continue;
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

// NOTE: we intentionally do NOT auto-append numeric suffixes server-side anymore.
// Clients should check availability and offer generation of a unique slug.
// If a requested `website_name` is already taken, we return a 409 conflict.

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
  const limited = enforceRateLimit(req, {
    keyPrefix: 'api:order:create',
    limit: 20,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

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

    const participantPrimary = (data.participants?.[0]?.name || '').trim();
    const participantSecondary = (data.participants?.[1]?.name || '').trim();
    const customerName = participantPrimary || (data.customer_name || '').trim();
    const partnerName = participantSecondary || (data.partner_name || '').trim();
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

    let website_name: string;
    if (cleanName) {
      const { data: existing, error: existingError } = await supabase
        .from('sites')
        .select('id')
        .eq('website_name', normalized)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Website name is already in use. Please choose a different website name or generate a unique slug.' },
          { status: 409 }
        );
      }

      website_name = normalized;
    } else {
      website_name = slug;
    }

    const MAX_SITE_IMAGES = 18;
    // upload / normalize photos (cost-controlled)
    const { photos: photoUrls, warnings: photoUploadWarnings, pendingUploads: pendingPhotoUploads } =
      await normalizeAndUploadPhotos(Array.isArray(data.photos) ? data.photos : [], { maxImages: MAX_SITE_IMAGES });

    const uniquePhotoUrls = normalizeUniqueTextArray(photoUrls);

    // Get base URL safely
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app';
    const qrRedirectUrl = `${baseUrl}/r/${website_name}`;
    const qrCodeUrl = await generateQRCode(qrRedirectUrl);

    // Build normalized site config for storage
    let heroCoverPhotoUrl: string | undefined = data.config?.hero?.coverPhotoUrl;
    let heroUploadWarning: string | null = null;
    let heroUploadPending = false;

    if (data.hero_photo) {
      try {
        heroCoverPhotoUrl = await uploadToCloudinary(data.hero_photo, { isHero: true });
      } catch (err: any) {
        console.error('hero photo upload error', err);
        heroUploadWarning = err?.message || 'Hero photo upload failed';
        heroUploadPending = true;
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

    const hasRetriableDataUrlFallback =
      uniquePhotoUrls.some((url) => typeof url === 'string' && url.startsWith('data:')) ||
      (typeof heroCoverPhotoUrl === 'string' && heroCoverPhotoUrl.startsWith('data:'));

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
    const resolvedTimeline = Array.isArray(rawConfig.section_content?.timeline)
      ? rawConfig.section_content.timeline
      : Array.isArray(rawConfig.timeline)
        ? rawConfig.timeline
        : Array.isArray(rawConfig.timeline_events)
          ? rawConfig.timeline_events
          : [];

    const resolvedSectionContent = {
      ...(rawConfig.section_content || {}),
      ...(Array.isArray(rawConfig.section_content?.timeline) ? {} : { timeline: resolvedTimeline }),
    };

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
      timeline: resolvedTimeline,
      section_content: resolvedSectionContent,
      message,
      tagline: data.tagline || rawConfig.tagline || '',
      hero: {
        ...(rawConfig.hero || {}),
        ...(heroCoverPhotoUrl ? { coverPhotoUrl: heroCoverPhotoUrl } : {}),
      },
    };

    // Sanitize any gallery photo arrays in section_content to avoid persisting browser-local blob URLs
    try {
      // Persist canonical photos to `media.photos` only; remove legacy gallery.photos when we have canonical list
      if (Array.isArray(uniquePhotoUrls) && uniquePhotoUrls.length > 0) {
        if (siteConfig?.section_content?.gallery) {
          const gallery = { ...(siteConfig.section_content.gallery || {}) } as any;
          if (gallery && Object.prototype.hasOwnProperty.call(gallery, 'photos')) {
            delete gallery.photos;
            siteConfig.section_content = {
              ...(siteConfig.section_content || {}),
              gallery,
            };
          }
        }
      } else if (Array.isArray(siteConfig?.section_content?.gallery?.photos)) {
        siteConfig.section_content.gallery.photos = normalizeUniqueTextArray(siteConfig.section_content.gallery.photos || [], 18);
      }
    } catch (err) {}

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
      uploadStatus:
        pendingPhotoUploads > 0 || heroUploadPending
          ? {
              pendingPhotoUploads,
              ...(heroUploadPending ? { heroUploadPending: true } : {}),
            }
          : undefined,
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

    if (
      featureFlags.retryFailedUploads() &&
      featureFlags.backgroundJobQueue() &&
      site?.id &&
      hasRetriableDataUrlFallback
    ) {
      try {
        await enqueueJob('retry_site_media_upload', { siteId: site.id });
      } catch (queueError) {
        await captureError('order-create-enqueue-retry', queueError, { siteId: site.id });
      }
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
    await captureError('order-create', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
