import { DEFAULT_THEME } from '@/config/defaults';
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import { enforceRateLimit } from '@/lib/reliability/rate-limit';
import { captureError } from '@/lib/reliability/monitoring';
import { recordAdminAudit } from '@/lib/reliability/audit';
import { enqueueJob } from '@/lib/reliability/job-queue';
import { featureFlags } from '@/lib/reliability/feature-flags';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createWebsite as insertSite, updateWebsite as updateSite, deleteWebsite as deleteSite, listWebsites as getSites, getWebsiteById as getSiteById } from '@/lib/db/websites';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { normalizeAndUploadPhotos } from '@/lib/media';
import { supabase, Site } from '@/lib/supabase';
import { createHash } from 'crypto';
import { getIdempotencyReplay, saveIdempotencyResult } from '@/lib/db/idempotency';
import { validateAndNormalizeSiteConfig } from '@/lib/site-config-validation';
import { getApprovedGuestMessagesBySiteIdTag, getPublicSiteBySlugTag } from '@/lib/site-data';

const adminListCache: Record<string, { data: any; cachedAt: number }> = {};
const ADMIN_LIST_CACHE_TTL = 30 * 1000;

const clearAdminListCache = () => {
  Object.keys(adminListCache).forEach((key) => {
    delete adminListCache[key];
  });
};

const invalidatePublicSiteCaches = (siteId?: string | null, slug?: string | null) => {
  if (siteId) {
    revalidateTag(getApprovedGuestMessagesBySiteIdTag(siteId), 'max');
  }

  if (slug) {
    revalidateTag(getPublicSiteBySlugTag(slug), 'max');
  }
};

const normalizeUniqueTextArray = (input: unknown[], _maxLen?: number): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  if (!Array.isArray(input)) return result;

  for (const item of input) {
    if (typeof item !== 'string') continue;
    const normalized = item.trim();
    if (!normalized) continue;
    // Skip browser-local object URLs which are not persistable server-side
    if (normalized.startsWith('blob:') || normalized.startsWith('file:')) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
};

const extractMediaUrlsFromConfig = (config: any): string[] => {
  const results: string[] = [];

  const recurse = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach(recurse);
      return;
    }

    Object.values(obj).forEach((value) => {
      if (typeof value === 'string' && value.includes('cloudinary.com')) {
        results.push(value);
      } else if (value && typeof value === 'object') {
        recurse(value);
      }
    });
  };

  recurse(config);
  return Array.from(new Set(results));
};

const getCloudinaryPublicIdFromUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const idx = parts.findIndex((part) => /^v\d+$/.test(part));
    const idParts = idx >= 0 ? parts.slice(idx + 1) : parts;
    return idParts.join('/').replace(/\.[^.]+$/, '');
  } catch {
    return null;
  }
};

const deleteCloudinaryMediaUrls = async (urls: string[]): Promise<void> => {
  if (urls.length === 0) return;

  const cloudinary = (await import('@/lib/cloudinary')).default;

  for (const mediaUrl of urls) {
    const publicId = getCloudinaryPublicIdFromUrl(mediaUrl);
    if (!publicId) continue;
    try {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
    } catch (err) {
      console.warn('Failed to remove Cloudinary media', publicId, err);
    }
  }
};

const isMaskedPasswordPlaceholder = (value?: string): boolean => {
  const normalized = (value || '').trim();
  return normalized.length > 0 && /^[*•]+$/.test(normalized);
};

const normalizePasswordConfig = async (siteConfig: any, passwordInput?: string): Promise<any> => {
  if (!siteConfig) siteConfig = {};

  if (siteConfig.password?.enabled === true) {
    if (passwordInput && passwordInput.trim()) {
      const password = passwordInput.trim();

      // Edit forms may send masked placeholders (e.g. "••••") for unchanged passwords.
      if (isMaskedPasswordPlaceholder(password)) {
        if (siteConfig.password.hash) {
          return { ...siteConfig, password: { enabled: true, hash: siteConfig.password.hash } };
        }
        throw new Error('Password is required when protection is enabled');
      }

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
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const site = await getSiteById(id);
      return NextResponse.json({ site });
    }

    const status = searchParams.get('status')?.toLowerCase() || undefined;
    const parsedLimit = parseInt(searchParams.get('limit') || '20', 10);
    const parsedOffset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = Number.isNaN(parsedLimit) ? 20 : Math.min(Math.max(parsedLimit, 1), 100);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);
    const search = searchParams.get('search')?.trim() || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortDirection = searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc';
    const guestMessageFilter = searchParams.get('guestMessageFilter') === 'pending' ? 'pending' : 'all';

    const cacheKey = JSON.stringify({
      limit,
      offset,
      status,
      search,
      sortBy,
      sortDirection,
      guestMessageFilter,
    });
    const now = Date.now();
    if (adminListCache[cacheKey] && now - adminListCache[cacheKey].cachedAt < ADMIN_LIST_CACHE_TTL) {
      return NextResponse.json(adminListCache[cacheKey].data);
    }

    const { data: orders, total } = await getSites({
      limit,
      offset,
      status,
      search,
      sortBy,
      sortDirection,
      guestMessageFilter,
    });

    const responseData = { orders, total };
    adminListCache[cacheKey] = { data: responseData, cachedAt: now };

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new order (legacy, for backwards compatibility)
export async function POST(req: NextRequest) {
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  try {
    const { id, status } = await req.json();
    const updated = await updateSite({ id, status });
    invalidatePublicSiteCaches(updated?.id || id, updated?.website_name || updated?.slug || null);
    clearAdminListCache();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('POST error:', err);
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 });
  }
}

// PUT - Update existing order
export async function PUT(req: NextRequest) {
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  const limited = enforceRateLimit(req, {
    keyPrefix: 'api:admin:put',
    limit: 40,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

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

    const { photos: processedPhotos, warnings: photoUploadWarnings, pendingUploads: pendingPhotoUploads } =
      await normalizeAndUploadPhotos(inputPhotos, { maxImages: 18 });

    const uniqueProcessedPhotos = normalizeUniqueTextArray(processedPhotos);

    let heroCoverPhotoUrl: string | undefined = updates.config?.hero?.coverPhotoUrl;
    let heroUploadWarning: string | null = null;
    let heroUploadPending = false;

    if (updates.hero_photo) {
      try {
        heroCoverPhotoUrl = await uploadToCloudinary(updates.hero_photo, { isHero: true });
      } catch (err: any) {
        console.error('admin hero photo upload error', err);
        heroUploadWarning = err?.message || 'Hero photo upload failed';
        heroUploadPending = true;
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

    const hasRetriableDataUrlFallback =
      uniqueProcessedPhotos.some((url) => typeof url === 'string' && url.startsWith('data:')) ||
      (typeof heroCoverPhotoUrl === 'string' && heroCoverPhotoUrl.startsWith('data:'));

    const resolvedTemplates = {
      ...(updates.config?.templates || {}),
      ...(updates.config?.home_template || updates.home_template
        ? { home: updates.config?.home_template || updates.home_template }
        : {}),
      ...(updates.config?.gallery_template || updates.gallery_template
        ? { gallery: updates.config?.gallery_template || updates.gallery_template }
        : {}),
      ...(updates.config?.timeline_template || updates.timeline_template
        ? { timeline: updates.config?.timeline_template || updates.timeline_template }
        : {}),
      ...(updates.config?.song_template || updates.song_template
        ? { song: updates.config?.song_template || updates.song_template }
        : {}),
    };

    const resolvedTimeline = Array.isArray(updates.config?.section_content?.timeline)
      ? updates.config.section_content.timeline
      : Array.isArray(updates.config?.timeline)
        ? updates.config.timeline
        : Array.isArray(updates.config?.timeline_events)
          ? updates.config.timeline_events
          : Array.isArray(updates.timeline_events)
            ? updates.timeline_events
            : [];

    const resolvedSectionContent = {
      ...(updates.config?.section_content || {}),
      ...(Array.isArray(updates.config?.section_content?.timeline) ? {} : { timeline: resolvedTimeline }),
    };

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
        templates: resolvedTemplates,
        media: {
          photos: uniqueProcessedPhotos,
          song_link: updates.song_link || updates.config?.media?.song_link || '',
          song_autoplay: updates.song_autoplay ?? updates.config?.media?.song_autoplay ?? false,
        },
        timeline: resolvedTimeline,
        section_content: resolvedSectionContent,
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
        uploadStatus:
          pendingPhotoUploads > 0 || heroUploadPending
            ? {
                pendingPhotoUploads,
                ...(heroUploadPending ? { heroUploadPending: true } : {}),
              }
            : undefined,
      },
    };

    // Sanitize any gallery or media photo arrays to avoid persisting browser-local blob URLs
    try {
      if (Array.isArray(updateObj.config?.media?.photos)) {
        updateObj.config.media.photos = normalizeUniqueTextArray(updateObj.config.media.photos || [], 18);
      }
    } catch (err) {}

    try {
      // We persist canonical photo URLs only to `config.media.photos`.
      // Remove legacy `section_content.gallery.photos` when we have canonical photos to avoid duplication.
      if (Array.isArray(uniqueProcessedPhotos) && uniqueProcessedPhotos.length > 0) {
        if (updateObj.config?.section_content?.gallery) {
          const gallery = { ...(updateObj.config.section_content.gallery || {}) } as any;
          if (gallery && Object.prototype.hasOwnProperty.call(gallery, 'photos')) {
            delete gallery.photos;
            updateObj.config.section_content = {
              ...(updateObj.config.section_content || {}),
              gallery,
            };
          }
        }
      } else if (Array.isArray(updateObj.config?.section_content?.gallery?.photos)) {
        // Sanitize any existing legacy gallery.photos (no blob/file URLs)
        updateObj.config.section_content.gallery.photos = normalizeUniqueTextArray(updateObj.config.section_content.gallery.photos || [], 18);
      }
    } catch (err) {}

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

    // Remove Cloudinary assets that were replaced during this update.
    const previousMediaUrls = extractMediaUrlsFromConfig(existing?.config || {});
    const nextMediaUrls = extractMediaUrlsFromConfig(data?.config || {});
    const nextMediaSet = new Set(nextMediaUrls);
    const removedMediaUrls = previousMediaUrls.filter((url) => !nextMediaSet.has(url));
    await deleteCloudinaryMediaUrls(removedMediaUrls);

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

    if (
      featureFlags.retryFailedUploads() &&
      featureFlags.backgroundJobQueue() &&
      id &&
      hasRetriableDataUrlFallback
    ) {
      try {
        await enqueueJob('retry_site_media_upload', { siteId: id });
      } catch (queueError) {
        await captureError('admin-update-enqueue-retry', queueError, { id });
      }
    }

    if (idempotencyKey) {
      await saveIdempotencyResult('admin:update-site', idempotencyKey, requestHash, 200, responsePayload);
    }

    await recordAdminAudit(req, {
      action: 'admin.site.update',
      targetType: 'site',
      targetId: id,
      success: true,
      details: {
        warnings: responsePayload.warnings,
      },
    });

    invalidatePublicSiteCaches(existing?.id || id, existing?.website_name || existing?.slug || null);
    invalidatePublicSiteCaches(data?.id || id, data?.website_name || data?.slug || null);

    clearAdminListCache();

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    let idForLog = 'unknown';
    if (!req.bodyUsed) {
      try {
        const parsed = await req.json();
        idForLog = parsed?.id || 'unknown';
      } catch {}
    }
    await captureError('admin-put', err, { id: idForLog });
    await recordAdminAudit(req, {
      action: 'admin.site.update',
      targetType: 'site',
      targetId: idForLog,
      success: false,
      details: {
        error: err.message || 'unknown error',
      },
    });
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
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  const limited = enforceRateLimit(req, {
    keyPrefix: 'api:admin:delete',
    limit: 20,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    // Fetch the site config before deleting
    const { data: site, error: fetchError } = await supabase.from('sites').select('id,website_name,slug,config').eq('id', id).single();
    if (fetchError) {
      return NextResponse.json({ message: fetchError.message }, { status: 500 });
    }

    // Extract and delete Cloudinary images
    if (site && site.config) {
      const mediaUrls = extractMediaUrlsFromConfig(site.config);
      await deleteCloudinaryMediaUrls(mediaUrls);
    }

    // Now delete the site record
    const { error } = await supabase.from('sites').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    invalidatePublicSiteCaches(site?.id || id, site?.website_name || site?.slug || null);

    clearAdminListCache();

    await recordAdminAudit(req, {
      action: 'admin.site.delete',
      targetType: 'site',
      targetId: id,
      success: true,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    await captureError('admin-delete', err);
    await recordAdminAudit(req, {
      action: 'admin.site.delete',
      targetType: 'site',
      success: false,
      details: { error: err.message || 'unknown error' },
    });
    console.error('DELETE error:', err);
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}

