import { uploadToCloudinary } from '@/lib/cloudinary';
import { getWebsiteByIdWithConfig } from '@/lib/db/websites';
import { supabase } from '@/lib/supabase';

const isDataUrl = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('data:');

export async function retrySiteMediaUpload(siteId: string): Promise<{ updatedPhotos: number; updatedHero: boolean }> {
  const site = await getWebsiteByIdWithConfig(siteId);
  const config = site?.config || {};

  const photos = Array.isArray(config?.media?.photos) ? config.media.photos : [];
  const nextPhotos: string[] = [];
  let updatedPhotos = 0;

  for (const photo of photos) {
    if (!isDataUrl(photo)) {
      nextPhotos.push(photo);
      continue;
    }

    try {
      const uploaded = await uploadToCloudinary(photo, { isHero: false });
      nextPhotos.push(uploaded);
      updatedPhotos += 1;
    } catch {
      nextPhotos.push(photo);
    }
  }

  const heroUrl = config?.hero?.coverPhotoUrl;
  let nextHeroUrl = heroUrl;
  let updatedHero = false;

  if (isDataUrl(heroUrl)) {
    try {
      nextHeroUrl = await uploadToCloudinary(heroUrl, { isHero: true });
      updatedHero = true;
    } catch {
      nextHeroUrl = heroUrl;
    }
  }

  if (!updatedPhotos && !updatedHero) {
    return { updatedPhotos: 0, updatedHero: false };
  }

  const nextConfig = {
    ...config,
    media: {
      ...(config.media || {}),
      photos: nextPhotos,
    },
    hero: {
      ...(config.hero || {}),
      ...(nextHeroUrl ? { coverPhotoUrl: nextHeroUrl } : {}),
    },
  };

  const { error } = await supabase
    .from('sites')
    .update({ config: nextConfig })
    .eq('id', siteId);

  if (error) {
    throw new Error(`retrySiteMediaUpload update failed: ${error.message}`);
  }

  return { updatedPhotos, updatedHero };
}
