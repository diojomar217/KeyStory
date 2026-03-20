import { NextRequest, NextResponse } from 'next/server';
import { supabase, Site } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';

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

  if (id) {
    const { data, error } = await supabase.from('sites').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ site: data });
  }

  const { data, error } = await supabase.from('sites').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

// POST - Create new order (legacy, for backwards compatibility)
export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const { error } = await supabase.from('sites').update({ status }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// PUT - Update existing order
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
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
    if (typeof heroIndex === 'number' && processedPhotos[heroIndex]) {
      heroCoverPhotoUrl = processedPhotos[heroIndex];
    }

    const legacyCoverIndex = updates.config?.cover_photo_index;
    if (!heroCoverPhotoUrl && typeof legacyCoverIndex === 'number' && processedPhotos[legacyCoverIndex]) {
      heroCoverPhotoUrl = processedPhotos[legacyCoverIndex];
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
          special_date: updates.specialDate || updates.anniversary_date || updates.config?.dates?.special_date,
        },
        occasion: updates.occasion || updates.site_type || updates.config?.occasion || undefined,
        theme: updates.config?.theme || updates.theme || 'romantic_classic',
        sections: updates.config?.sections || updates.sections || [],
        templates: {
          home: updates.config?.home_template || updates.home_template,
          gallery: updates.config?.gallery_template || updates.gallery_template,
          timeline: updates.config?.timeline_template || updates.timeline_template,
        },
        media: {
          photos: processedPhotos,
          song_link: updates.song_link || updates.config?.media?.song_link || '',
          song_autoplay: updates.song_autoplay ?? updates.config?.media?.song_autoplay ?? false,
        },
        timeline: updates.config?.timeline || updates.config?.timeline_events || updates.timeline_events || [],
        content: updates.config?.content || updates.config?.section_content || {},
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

    updateObj.config = await normalizePasswordConfig(updateObj.config, (updates as any).password_input);

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

    return NextResponse.json({
      success: true,
      order: data,
      warnings: [
        ...photoUploadWarnings,
        ...(heroUploadWarning ? [heroUploadWarning] : []),
      ],
    });
  } catch (err: any) {
    const body = req.bodyUsed ? 'body already read' : 'body not read yet';
    console.error('PUT /api/admin failed:', { 
      id: body !== 'body not read yet' ? (await req.json()).id : 'unknown', 
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

