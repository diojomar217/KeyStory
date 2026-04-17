import type { SiteConfig } from '@/lib/types';

export interface ChecklistItem {
  key: string;
  label: string;
  ok: boolean;
  fixStep: number;
  suggestion: string;
}

export interface LocalTemplate {
  id: string;
  name: string;
  createdAt: string;
  form: {
    occasion?: string;
    participants?: Array<{ id?: string; name?: string; role?: string }>;
    specialDate?: string;
    eventTime?: string;
    tagline?: string;
    message?: string;
    song_link?: string;
  };
  config: Partial<SiteConfig>;
}

const TEMPLATE_STORAGE_KEY = 'keystory-local-builder-templates-v1';

export function detectDuplicateParticipantNames(
  participants: Array<{ name?: string }> = []
): string[] {
  const cleaned = participants
    .map((p) => (p.name || '').trim().toLowerCase())
    .filter(Boolean);

  const counts = new Map<string, number>();
  for (const name of cleaned) {
    counts.set(name, (counts.get(name) || 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([name]) => name);
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error('Image decode failed'));
      img.src = objectUrl;
    });
    return dimensions;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function analyzeImageQuality(files: File[]): Promise<string[]> {
  const warnings: string[] = [];

  for (const file of files) {
    try {
      const { width, height } = await getImageDimensions(file);
      if (width < 1000 || height < 700) {
        warnings.push(`${file.name}: low resolution (${width}x${height}). Use at least 1000x700 for clearer display.`);
      }

      const ratio = width / height;
      if (ratio > 2.5 || ratio < 0.4) {
        warnings.push(`${file.name}: unusual aspect ratio (${ratio.toFixed(2)}). It may crop poorly in templates.`);
      }

      if (file.size < 80 * 1024) {
        warnings.push(`${file.name}: very small file size. Compression artifacts may be visible.`);
      }
    } catch {
      warnings.push(`${file.name}: unable to check quality. Please preview it manually.`);
    }
  }

  return warnings;
}

export function buildPublishChecklist(params: {
  websiteName?: string;
  participants?: Array<{ name?: string }>;
  specialDate?: string;
  photosCount?: number;
  sections?: string[];
  templates?: Record<string, string | undefined>;
  message?: string;
  tagline?: string;
}): ChecklistItem[] {
  const sections = params.sections || [];
  const templates = params.templates || {};
  const participants = params.participants || [];

  return [
    {
      key: 'website-name',
      label: 'Website name is set',
      ok: !!params.websiteName?.trim(),
      fixStep: 1,
      suggestion: 'Add a URL-safe website name in Step 1.',
    },
    {
      key: 'participants',
      label: 'Participant names are filled',
      ok: participants.length > 0 && participants.every((p) => !!p.name?.trim()),
      fixStep: 1,
      suggestion: 'Fill all required participant name fields in Step 1.',
    },
    {
      key: 'date',
      label: 'Special date is selected',
      ok: !!params.specialDate,
      fixStep: 1,
      suggestion: 'Pick a special date in Step 1.',
    },
    {
      key: 'sections',
      label: 'At least one section is enabled',
      ok: sections.length > 0,
      fixStep: 3,
      suggestion: 'Enable and reorder sections in Step 3.',
    },
    {
      key: 'gallery-photos',
      label: 'Gallery has photos when enabled',
      ok: !sections.includes('gallery') || (params.photosCount || 0) > 0,
      fixStep: 5,
      suggestion: 'Upload photos in Step 5 for the Gallery section.',
    },
    {
      key: 'templates',
      label: 'Templates selected for enabled key sections',
      ok:
        (!sections.includes('home') || !!templates.home) &&
        (!sections.includes('gallery') || !!templates.gallery) &&
        (!sections.includes('timeline') || !!templates.timeline) &&
        (!sections.includes('song') || !!templates.song),
      fixStep: 4,
      suggestion: 'Choose templates in Step 4 for each enabled key section.',
    },
    {
      key: 'headline-copy',
      label: 'Tagline or message is present',
      ok: !!params.tagline?.trim() || !!params.message?.trim(),
      fixStep: 5,
      suggestion: 'Add a tagline or message in Step 5.',
    },
  ];
}

export function loadLocalTemplates(): LocalTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalTemplate(template: LocalTemplate): LocalTemplate[] {
  const templates = loadLocalTemplates();
  const next = [template, ...templates].slice(0, 20);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}
