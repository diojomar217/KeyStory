import { DEFAULT_THEME } from '@/config/defaults';
import { v4 as uuidv4 } from 'uuid';

type ValidationResult = {
  config: Record<string, any>;
  errors: string[];
};

const isPlainObject = (value: unknown): value is Record<string, any> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const normalizeParticipantsArray = (input: unknown): Array<{ id: string; name: string; role?: string }> => {
  if (!Array.isArray(input)) return [];
  const out: Array<{ id: string; name: string; role?: string }> = [];
  for (const item of input) {
    if (!item) continue;
    if (typeof item === 'string') {
      const name = item.trim().slice(0, 120);
      if (!name) continue;
      out.push({ id: uuidv4(), name });
      continue;
    }

    if (isPlainObject(item)) {
      const name = typeof item.name === 'string' ? item.name.trim().slice(0, 120) : '';
      if (!name) continue;
      const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : uuidv4();
      const role = typeof item.role === 'string' ? item.role.trim().slice(0, 50) : undefined;
      out.push({ id, name, role });
    }
  }
  return out;
};

const normalizeUniqueStringArray = (input: unknown, maxItems: number): string[] => {
  if (!Array.isArray(input)) return [];

  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of input) {
    if (typeof item !== 'string') continue;
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= maxItems) break;
  }
  return result;
};

export function validateAndNormalizeSiteConfig(input: unknown): ValidationResult {
  const source = isPlainObject(input) ? input : {};
  const errors: string[] = [];

  const sections = normalizeUniqueStringArray(source.sections, 24);
  const photos = normalizeUniqueStringArray(source.media?.photos, 18);
  const message = typeof source.message === 'string' ? source.message.trim().slice(0, 1000) : '';
  const tagline = typeof source.tagline === 'string' ? source.tagline.trim().slice(0, 250) : '';

  if (source.sections && !Array.isArray(source.sections)) {
    errors.push('config.sections must be an array of strings');
  }

  if (source.media?.photos && !Array.isArray(source.media.photos)) {
    errors.push('config.media.photos must be an array of strings');
  }

  const people = isPlainObject(source.people)
    ? {
        primary: typeof source.people.primary === 'string' ? source.people.primary.trim().slice(0, 120) : '',
        secondary: typeof source.people.secondary === 'string' ? source.people.secondary.trim().slice(0, 120) : '',
      }
    : { primary: '', secondary: '' };

  const dates = isPlainObject(source.dates)
    ? {
        special_date: typeof source.dates.special_date === 'string' ? source.dates.special_date.trim() : '',
      }
    : { special_date: '' };

  const participants = normalizeParticipantsArray(source.participants);

  const hero = isPlainObject(source.hero)
    ? {
        ...source.hero,
        coverPhotoUrl: typeof source.hero.coverPhotoUrl === 'string' ? source.hero.coverPhotoUrl.trim() : undefined,
        coverPhotoIndex: typeof source.hero.coverPhotoIndex === 'number' ? source.hero.coverPhotoIndex : undefined,
      }
    : {};

  const sectionContent = isPlainObject(source.section_content) ? source.section_content : {};
  const timeline = Array.isArray(source.timeline) ? source.timeline : [];
  const qr = isPlainObject(source.qr) ? source.qr : undefined;
  const preset = isPlainObject(source.preset) ? source.preset : undefined;

  const password = isPlainObject(source.password)
    ? {
        enabled: Boolean(source.password.enabled),
        hash: typeof source.password.hash === 'string' ? source.password.hash : undefined,
      }
    : undefined;

  const config: Record<string, any> = {
    theme: typeof source.theme === 'string' && source.theme.trim() ? source.theme : DEFAULT_THEME,
    occasion: typeof source.occasion === 'string' ? source.occasion.trim() : undefined,
    sections,
    people,
    participants,
    dates,
    message,
    tagline,
    media: {
      photos,
      song_link: typeof source.media?.song_link === 'string' ? source.media.song_link.trim() : '',
      song_autoplay: Boolean(source.media?.song_autoplay),
    },
    templates: {
      ...(isPlainObject(source.templates) ? source.templates : {}),
      home: typeof source.templates?.home === 'string' ? source.templates.home : source.home_template,
      gallery: typeof source.templates?.gallery === 'string' ? source.templates.gallery : source.gallery_template,
      timeline: typeof source.templates?.timeline === 'string' ? source.templates.timeline : source.timeline_template,
      song: typeof source.templates?.song === 'string' ? source.templates.song : source.song_template,
    },
    timeline,
    section_content: sectionContent,
    hero,
    qr_data_url: typeof source.qr_data_url === 'string' ? source.qr_data_url.trim() : undefined,
    ...(qr ? { qr } : {}),
    ...(preset ? { preset } : {}),
    ...(password ? { password } : {}),
    business_contact: isPlainObject(source.business_contact) ? source.business_contact : undefined,
    meta: isPlainObject(source.meta) ? source.meta : undefined,
  };

  return { config, errors };
}
