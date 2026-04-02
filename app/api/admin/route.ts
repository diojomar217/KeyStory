import { DEFAULT_THEME } from '@/config/defaults';
import { NextRequest, NextResponse } from 'next/server';
import { createWebsite as insertSite, updateWebsite as updateSite, deleteWebsite as deleteSite, listWebsites as getSites, getWebsiteById as getSiteById } from '@/lib/db/websites';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { supabase, Site } from '@/lib/supabase';
import { createHash } from 'crypto';
import { getIdempotencyReplay, saveIdempotencyResult } from '@/lib/db/idempotency';
import { validateAndNormalizeSiteConfig } from '@/lib/site-config-validation';

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

const normalizePasswordConfig = async (siteConfig: any, passwordInput?: string): Promise<any> => {
  if (!siteConfig) siteConfig = {};

  if (siteConfig.password?.enabled === true) {
    if (passwordInput && passwordInput.trim()) {
      const password = passwordInput.trim();
      if (password.length < 4 || password.length > 6) {
        throw new Error('Password must be 4 to 6 characters long');
      }
      const hash = await bcrypt.hash(password, 10);
      return { ...siteConfig, password: { enabled: true, hash } };
    }

    if (siteConfig.password.hash) {
      return { ...siteConfig, password: { enabled: true, hash: siteConfig.password.hash } };
    }

    throw new Error('Password is required when protection is enabled');
  }

  const cleanedConfig = { ...siteConfig };
  delete cleanedConfig.password;
  return cleanedConfig;
};
import bcrypt from 'bcryptjs';

// GET - Fetch all orders or single order by id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const site = await getSiteById(id);
      return NextResponse.json({ site });
    }
    const orders = await getSites();
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new order (legacy, for backwards compatibility)
export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    await updateSite({ id, status });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('POST error:', err);
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 });
  }
}

// PUT - Update existing order
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const idempotencyKey = req.headers.get('idempotency-key')?.trim() || '';
    const requestHash = createHash('sha256').update(JSON.stringify(body || {})).digest('hex');

    if (idempotencyKey) {
      const replay = await getIdempotencyReplay('admin:update-site', idempotencyKey, requestHash);
      if (replay) {
        return NextResponse.json(replay.response, { status: replay.statusCode });
      }
    }

    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const existing = await getSiteById(id);
    const currentRevision = Number(existing?.config?.meta?.revision || 0);
    const expectedRevision =
      typeof body.expectedRevision === 'number' ? body.expectedRevision :
      typeof updates.config?.meta?.revision === 'number' ? updates.config.meta.revision :
      null;

    if (expectedRevision !== null && expectedRevision !== currentRevision) {
      return NextResponse.json(
        {
          message: 'Update conflict. Please refresh and retry.',
          currentRevision,
        },
        { status: 409 },
      );
    }

    // Build update object with normalized config in JSONB
    const inputPhotos = Array.isArray(updates.photos)
      ? updates.photos
      : Array.isArray(updates.config?.media?.photos)
        ? updates.config.media.photos
        : [];

    const processedPhotos: string[] = [];
    const photoUploadWarnings: string[] = [];

    for (const photo of inputPhotos) {
      if (typeof photo === 'string' && photo.startsWith('data:')) {
        try {
          const uploaded = await uploadToCloudinary(photo, { isHero: false });
          processedPhotos.push(uploaded);
        } catch (err: any) {
          console.error('admin photo upload error', err);
          photoUploadWarnings.push(err?.message || 'Photo upload failed');
          // fallback: keep data URL so the photos are preserved in place while investigation happens
          processedPhotos.push(photo);
        }
      } else if (typeof photo === 'string' && photo.trim()) {
        processedPhotos.push(photo);
      }
    }

    const uniqueProcessedPhotos = normalizeUniqueTextArray(processedPhotos);

    let heroCoverPhotoUrl: string | undefined = updates.config?.hero?.coverPhotoUrl;
    let heroUploadWarning: string | null = null;

    if (updates.hero_photo) {
      try {
        heroCoverPhotoUrl = await uploadToCloudinary(updates.hero_photo, { isHero: true });
      } catch (err: any) {
        console.error('admin hero photo upload error', err);
        heroUploadWarning = err?.message || 'Hero photo upload failed';
        // fallback: keep original hero_photo data URL to avoid erasing user selection until fix
        if (typeof updates.hero_photo === 'string' && updates.hero_photo.startsWith('data:')) {
          heroCoverPhotoUrl = updates.hero_photo;
        }
      }
    }

    const heroIndex = updates.config?.hero?.coverPhotoIndex;
    if (typeof heroIndex === 'number' && uniqueProcessedPhotos[heroIndex]) {
      heroCoverPhotoUrl = uniqueProcessedPhotos[heroIndex];
    }

    const legacyCoverIndex = updates.config?.cover_photo_index;
    if (!heroCoverPhotoUrl && typeof legacyCoverIndex === 'number' && uniqueProcessedPhotos[legacyCoverIndex]) {
      heroCoverPhotoUrl = uniqueProcessedPhotos[legacyCoverIndex];
    }

    const updateObj: Partial<Site> = {
      website_name: updates.website_name,
      site_type: updates.site_type || updates.occasion,
      status: updates.status,
      expires_at: updates.expires_at,
      archived_at: updates.archived_at,
      config: {
        ...updates.config,
        people: {
          primary: updates.customer_name || updates.config?.people?.primary,
          secondary: updates.partner_name || updates.config?.people?.secondary,
        },
        dates: {
          special_date: updates.specialDate || updates.config?.dates?.special_date,
        },
        occasion: updates.occasion || updates.site_type || updates.config?.occasion || undefined,
        theme: updates.config?.theme || updates.theme || DEFAULT_THEME,
        sections: updates.config?.sections || updates.sections || [],
        templates: {
          home: updates.config?.home_template || updates.home_template,
          gallery: updates.config?.gallery_template || updates.gallery_template,
          timeline: updates.config?.timeline_template || updates.timeline_template,
        },
        media: {
          photos: uniqueProcessedPhotos,
          song_link: updates.song_link || updates.config?.media?.song_link || '',
          song_autoplay: updates.song_autoplay ?? updates.config?.media?.song_autoplay ?? false,
        },
        timeline: updates.config?.timeline || updates.config?.timeline_events || updates.timeline_events || [],
        section_content: updates.config?.section_content || {},
        message: updates.message || updates.config?.message || '',
        tagline: updates.tagline || updates.config?.tagline || '',
        hero: {
          ...(updates.config?.hero || {}),
          ...(heroCoverPhotoUrl ? { coverPhotoUrl: heroCoverPhotoUrl } : {}),
          coverPhotoIndex: updates.config?.hero?.coverPhotoIndex,
        },
      },
    };

    // We keep only config JSONB here. Avoid top-level legacy fields unless explicitly required by your schema.
    // This prevents schema-cache issues when columns like theme/sections/home_template don't exist.
    // (If your DB actually has these columns, re-enable carefully.)

    // const configUpdates = updates.config as any;
    // if (configUpdates) {
    //   updateObj.theme = configUpdates.theme;
    // }

    const nextRevision = currentRevision + 1;
    updateObj.config = {
      ...updateObj.config,
      meta: {
        ...(updateObj.config?.meta || {}),
        revision: nextRevision,
        updatedAt: new Date().toISOString(),
      },
    };

    const validation = validateAndNormalizeSiteConfig(updateObj.config);
    if (validation.errors.length > 0) {
      return NextResponse.json({ message: validation.errors.join('; ') }, { status: 400 });
    }

    updateObj.config = await normalizePasswordConfig(validation.config, (updates as any).password_input);

    const { data, error } = await supabase
      .from('sites')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    try {
      const { revalidatePath } = await import('next/cache');
      if (data?.website_name) {
        revalidatePath(`/site/${data.website_name}`);
        revalidatePath(`/love/${data.website_name}`);
      } else if (data?.slug) {
        revalidatePath(`/site/${data.slug}`);
        revalidatePath(`/love/${data.slug}`);
      }
    } catch (err) {
      console.warn('Revalidation failed in admin update:', err);
    }

    const responsePayload = {
      success: true,
      order: data,
      warnings: [
        ...photoUploadWarnings,
        ...(heroUploadWarning ? [heroUploadWarning] : []),
      ],
    };

    if (idempotencyKey) {
      await saveIdempotencyResult('admin:update-site', idempotencyKey, requestHash, 200, responsePayload);
    }

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    let idForLog = 'unknown';
    if (!req.bodyUsed) {
      try {
        const parsed = await req.json();
        idForLog = parsed?.id || 'unknown';
      } catch {}
    }
    console.error('PUT /api/admin failed:', {
      id: idForLog,
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json({ 
      message: err.message || 'Update failed - check image sizes and try fewer photos' 
    }, { status: 400 });
  }
}

// DELETE - Delete an order
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    // Fetch the site config before deleting
    const { data: site, error: fetchError } = await supabase.from('sites').select('config').eq('id', id).single();
    if (fetchError) {
      return NextResponse.json({ message: fetchError.message }, { status: 500 });
    }

    // Extract and delete Cloudinary images
    if (site && site.config) {
      // Inline extractMediaUrls and getCloudinaryPublicId from archiver.ts
      function extractMediaUrls(config: any): string[] {
        const results: string[] = [];
        function recurse(obj: any): void {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) { obj.forEach(recurse); return; }
          Object.values(obj).forEach((value) => {
            if (typeof value === 'string' && value.includes('cloudinary.com')) {
              results.push(value);
            } else if (typeof value === 'object') {
              recurse(value);
            }
          });
        }
        recurse(config);
        return Array.from(new Set(results));
      }
      function getCloudinaryPublicId(url: string): string | null {
        try {
          const parsed = new URL(url);
          const parts = parsed.pathname.split('/').filter(Boolean);
          const idx = parts.findIndex((part) => /^v\d+$/.test(part));
          const idParts = idx >= 0 ? parts.slice(idx + 1) : parts;
          const publicId = idParts.join('/').replace(/\.[^.]+$/, '');
          return publicId;
        } catch { return null; }
      }
      const mediaUrls = extractMediaUrls(site.config);
      const cloudinary = (await import('@/lib/cloudinary')).default;
      for (const mediaUrl of mediaUrls) {
        const publicId = getCloudinaryPublicId(mediaUrl);
        if (!publicId) continue;
        try {
          await cloudinary.uploader.destroy(publicId, { invalidate: true });
        } catch (err) {
          console.warn('Failed to remove Cloudinary media', publicId, err);
        }
      }
    }

    // Now delete the site record
    const { error } = await supabase.from('sites').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}

