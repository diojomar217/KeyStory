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
  const seenPhotoInputs = new Set<string>();
  const seenPhotoOutputs = new Set<string>();

  for (const photo of photos) {
    if (typeof photo === 'string') {
      const normalizedPhotoInput = photo.trim();
      if (!normalizedPhotoInput) continue;
      if (seenPhotoInputs.has(normalizedPhotoInput)) continue;
      seenPhotoInputs.add(normalizedPhotoInput);
    }

    if (!isDataUrl(photo)) {
      if (!seenPhotoOutputs.has(photo)) {
        nextPhotos.push(photo);
        seenPhotoOutputs.add(photo);
      }
      continue;
    }

    try {
      const uploaded = await uploadToCloudinary(photo, { isHero: false });
      if (!seenPhotoOutputs.has(uploaded)) {
        nextPhotos.push(uploaded);
        seenPhotoOutputs.add(uploaded);
      }
      updatedPhotos += 1;
    } catch {
      if (!seenPhotoOutputs.has(photo)) {
        nextPhotos.push(photo);
        seenPhotoOutputs.add(photo);
      }
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
