
"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useRouter, useParams } from 'next/navigation';

import StepNavigator from '@/components/builder/StepNavigator';
import ThemeSelector from '@/components/builder/ThemeSelector';
import SectionSelector from '@/components/builder/SectionSelector';
import { calculateExpirationDate, getDaysRemaining, getExpirationLabel, ExpirationMode } from '@/lib/expiration-utils';
import TemplateSelector from '@/components/builder/TemplateSelector';
import TimelineEditor from '@/components/builder/TimelineEditor';
import SectionContentInputs from '@/components/builder/SectionContentInputs';
import LayoutPresetSelector from '@/components/builder/LayoutPresetSelector';
import LivePreview from '@/components/builder/LivePreview';
import type { SiteConfig, Section, SectionContentMap, OccasionType } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { DEFAULT_THEME } from '@/config/defaults';
import { Site } from '@/lib/supabase';
import { getSite, updateSite } from '@/lib/api/sites';
import { validateStep, WIZARD_STEPS } from '@/lib/builder-steps-config';
import { getPresetsForOccasion, getPresetById } from '@/lib/preset-registry';
import { getDefaultSelections, getTemplatesForSection } from '@/lib/config-helpers';
import { applyLayoutPresetToConfig } from '@/lib/layout-preset';
import { getSectionMetadata } from '@/lib/section-registry';
import { SITE_TYPES } from '@/config/siteTypeConfig';
import type { SiteTypeKey } from '@/config/siteTypeConfig';
import { getParticipantFieldsForOccasion, OCCASION_DATE_LABELS } from '@/config/occasionFormConfig';
import bcrypt from 'bcryptjs';
import {
  analyzeImageQuality,
  buildPublishChecklist,
  detectDuplicateParticipantNames,
  loadLocalTemplates,
  saveLocalTemplate,
  type ChecklistItem,
  type LocalTemplate,
} from '@/lib/builder-experience';

type LocalForm = {
  website_name: string;
  customer_name: string;
  partner_name: string;
  specialDate: string;
  eventTime?: string;
  message: string;
  tagline: string;
  song_link: string;
  song_autoplay: boolean;
  photos: File[];
  existingPhotos: string[];
  heroPhoto?: File | null;
  heroPhotoIndex?: number;
  occasion: OccasionType;
  participants: { id: string; name: string; role?: string }[];
  password_input?: string;
  expires_at?: string;
};

function buildParticipantsForOccasion(
  occasion: OccasionType,
  existingParticipants: Array<{ id: string; name: string; role?: string }> = []
): Array<{ id: string; name: string; role?: string }> {
  const fields = getParticipantFieldsForOccasion(occasion);
  return fields.map((field, index) => ({
    id: field.id,
    role: field.role,
    name: existingParticipants[index]?.name || '',
  }));
}

const isMaskedPasswordPlaceholder = (value?: string): boolean => {
  const normalized = (value || '').trim();
  return normalized.length > 0 && /^[*•]+$/.test(normalized);
};

const sanitizeSlug = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default function EditWebsitePage() {
        const MAX_IMAGE_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB

        // Remove hero photo handler (matches Create flow)
        const handleRemoveHeroPhoto = () => {
          if (heroPhotoPreview) {
            URL.revokeObjectURL(heroPhotoPreview);
            setHeroPhotoPreview(null);
          }
          setForm((prev) => ({ ...prev, heroPhoto: null, heroPhotoIndex: undefined }));
          setConfig((prev) => ({
            ...prev,
            hero: {
              ...(prev.hero || {}),
              coverPhotoUrl: undefined,
              coverPhotoIndex: undefined,
            },
          }));
        };
      const router = useRouter();
      const params = useParams();
      const id = params.id as string;
    const [form, setForm] = useState<LocalForm>({
      website_name: '',
      customer_name: '',
      partner_name: '',
      specialDate: '',
      message: '',
      tagline: '',
      song_link: '',
      song_autoplay: false,
      photos: [],
      existingPhotos: [],
      occasion: 'couple' as OccasionType,
      participants: [
        { id: 'customer', name: '', role: 'primary' },
        { id: 'partner', name: '', role: 'partner' },
      ],
      password_input: '',
    });

    const [config, setConfig] = useState<SiteConfig>({
      occasion: 'couple' as OccasionType,
      theme: DEFAULT_THEME,
      sections: ['home'],
      templates: { home: undefined, gallery: undefined, timeline: undefined, song: undefined },
      timeline_events: [],
      cover_photo_index: undefined,
      section_content: {},
    });
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [heroPhotoPreview, setHeroPhotoPreview] = useState<string | null>(null);

  // Crop state for hero photo
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // --- Preset selection state (moved to top level) ---
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // When crop changes, update config.hero.crop
  useEffect(() => {
    if (heroPhotoPreview && croppedAreaPixels) {
      setConfig((prev) => ({
        ...prev,
        hero: {
          ...(prev.hero || {}),
          crop: {
            x: crop.x,
            y: crop.y,
            zoom,
            width: croppedAreaPixels.width,
            height: croppedAreaPixels.height,
          },
        },
      }));
    }
  }, [crop, zoom, croppedAreaPixels, heroPhotoPreview]);

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [photoQualityWarnings, setPhotoQualityWarnings] = useState<string[]>([]);
  const [localTemplates, setLocalTemplates] = useState<LocalTemplate[]>([]);
  const [selectedLocalTemplateId, setSelectedLocalTemplateId] = useState('');

  const [history, setHistory] = useState<Array<{
    form: LocalForm;
    config: SiteConfig;
    currentStep: number;
    completedSteps: number[];
    createdAt: string;
  }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isRestoringHistoryRef = useRef(false);

  const [expirationMode, setExpirationMode] = useState<'3_months'|'6_months'|'1_year'|'custom'>('6_months');
  const [customExpirationDate, setCustomExpirationDate] = useState('');

  const duplicateParticipantNames = useMemo(
    () => detectDuplicateParticipantNames(form.participants || []),
    [form.participants]
  );

  const [slugCheckState, setSlugCheckState] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [slugCheckMessage, setSlugCheckMessage] = useState('');

  const publishChecklist: ChecklistItem[] = useMemo(
    () => {
      const effectiveTagline = (form.tagline && form.tagline.trim()) || (config.section_content?.home?.tagline && String(config.section_content.home.tagline)) || config.tagline || '';
      return buildPublishChecklist({
        websiteName: form.website_name,
        participants: form.participants,
        specialDate: form.specialDate,
        photosCount: (photoPreviews.length || 0) + (form.existingPhotos?.length || 0),
        sections: config.sections,
        templates: config.templates as Record<string, string | undefined>,
        message: form.message,
        tagline: effectiveTagline,
      });
    },
    [form, config, photoPreviews.length]
  );

  const formatSelectedExpiration = () => {
    try {
      const expires = calculateExpirationDate(expirationMode, customExpirationDate || undefined);
      const days = getDaysRemaining(expires);
      return `Active until ${getExpirationLabel(expires)}${days !== null ? ` (${days} days remaining)` : ''}`;
    } catch (error: unknown) {
      const msg = error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string'
        ? (error as any).message
        : 'Enter a valid expiration date.';
      return msg;
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
      if (heroPhotoPreview) {
        URL.revokeObjectURL(heroPhotoPreview);
      }
    };
  }, [photoPreviews, heroPhotoPreview]);

  useEffect(() => {
    setLocalTemplates(loadLocalTemplates());
  }, []);

  useEffect(() => {
    if (isRestoringHistoryRef.current) {
      isRestoringHistoryRef.current = false;
      return;
    }

    const snapshot = {
      form,
      config,
      currentStep,
      completedSteps,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => {
      const base = historyIndex >= 0 ? prev.slice(0, historyIndex + 1) : prev;
      const last = base[base.length - 1];
      const isDuplicate =
        last &&
        JSON.stringify(last.form) === JSON.stringify(snapshot.form) &&
        JSON.stringify(last.config) === JSON.stringify(snapshot.config) &&
        last.currentStep === snapshot.currentStep &&
        JSON.stringify(last.completedSteps) === JSON.stringify(snapshot.completedSteps);

      if (isDuplicate) return prev;
      const next = [...base, snapshot].slice(-30);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [form, config, currentStep, completedSteps, historyIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey;
      const isRedo =
        (event.ctrlKey || event.metaKey) &&
        (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'));

      if (!isUndo && !isRedo) return;
      event.preventDefault();

      if (isUndo && historyIndex > 0) {
        const target = history[historyIndex - 1];
        if (!target) return;
        isRestoringHistoryRef.current = true;
        setForm(target.form);
        setConfig(target.config);
        setCurrentStep(target.currentStep);
        setCompletedSteps(target.completedSteps);
        setHistoryIndex(historyIndex - 1);
      }

      if (isRedo && historyIndex < history.length - 1) {
        const target = history[historyIndex + 1];
        if (!target) return;
        isRestoringHistoryRef.current = true;
        setForm(target.form);
        setConfig(target.config);
        setCurrentStep(target.currentStep);
        setCompletedSteps(target.completedSteps);
        setHistoryIndex(historyIndex + 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [history, historyIndex]);

  const fetchOrder = async () => {
    try {
      const site = await getSite(id);
      if (site) {
        // Safely extract tagline - it could be in config or at top level
        const taglineValue = typeof site.tagline === 'string' 
          ? site.tagline 
          : (typeof site.config?.tagline === 'string' ? site.config.tagline : '');

        const customerName = site.config?.people?.primary || site.customer_name || '';
        const partnerName = site.config?.people?.secondary || site.partner_name || '';
        const specialDateValue = site.config?.dates?.special_date || site.specialDate || '';
        const eventTimeValue = site.config?.eventTime || site.config?.section_content?.home?.eventTime || '';

        const partnerFromData = (site.config?.people?.secondary || site.partner_name || '').toString().trim();
        const customerFromData = (site.config?.people?.primary || site.customer_name || '').toString().trim();
        const declaredOccasion = (site.config?.occasion || site.site_type) as 'couple' | 'birthday' | undefined;
        const occasionValue = declaredOccasion
          ? declaredOccasion
          : partnerFromData
          ? 'couple'
          : customerFromData
          ? 'birthday'
          : 'couple';

        let computedMode: '3_months'|'6_months'|'1_year'|'custom' = '6_months';
        let computedCustomDate = '';

        if (site.expires_at) {
          const now = new Date();
          const expires = new Date(site.expires_at);
          if (!Number.isNaN(expires.getTime()) && expires > now) {
            const monthsDiff = (expires.getFullYear() - now.getFullYear()) * 12 + (expires.getMonth() - now.getMonth());
            if (monthsDiff <= 3) {
              computedMode = '3_months';
            } else if (monthsDiff <= 6) {
              computedMode = '6_months';
            } else if (monthsDiff <= 12) {
              computedMode = '1_year';
            } else {
              computedMode = 'custom';
              computedCustomDate = expires.toISOString().slice(0, 10);
            }
          } else {
            computedMode = 'custom';
            computedCustomDate = site.expires_at || '';
          }
        }

        // If preset is present, use its siteType for occasion and set selectedPresetId
        let loadedOccasion = occasionValue;
        let loadedPresetId = null;
        if (site.config?.preset?.siteType && site.config?.preset?.id) {
          loadedOccasion = site.config.preset.siteType;
          loadedPresetId = site.config.preset.id;
        }
        // Build participants based on occasion type, restoring names from saved data
        const savedParticipants: Array<{ id: string; name: string; role?: string }>  =
          Array.isArray(site.config?.participants) ? site.config.participants : [];
        // If no participants saved, fallback using customer/partner names
        const fallbackParticipants = savedParticipants.length > 0
          ? savedParticipants
          : [
              { id: 'customer', name: customerName, role: 'primary' },
              { id: 'partner', name: partnerName, role: 'partner' },
            ];
        const loadedParticipants = buildParticipantsForOccasion(loadedOccasion as OccasionType, fallbackParticipants);

        setForm({
          website_name: site.website_name || site.slug || '',
          customer_name: customerName,
          partner_name: partnerName,
          specialDate: specialDateValue,
          eventTime: eventTimeValue,
          message: site.config?.message || site.message || '',
          tagline: taglineValue,
          song_link: site.config?.media?.song_link || site.song_link || '',
          song_autoplay: site.config?.media?.song_autoplay ?? false,
          photos: [],
          existingPhotos: site.config?.media?.photos || site.photos || [],
          heroPhoto: null,
          heroPhotoIndex: site.config?.hero?.coverPhotoIndex,
          occasion: loadedOccasion as OccasionType,
          participants: loadedParticipants,
          password_input: site.config?.password?.enabled ? '••••' : '',
          expires_at: site.expires_at || undefined,
        });

        // Safely extract sections - ensure it's an array and cast to Section[]
        const siteAny = site as any;
        const rawSections = Array.isArray(site.config?.sections)
          ? site.config.sections
          : (Array.isArray(siteAny.sections) ? siteAny.sections : ['home']);
        const sectionsValue: Section[] = rawSections as Section[];
        
        // Safely extract template values with proper type assertions
        const templates = site.config?.templates || {};

        // Debug: Log loaded config and template values
        console.log('[EditWebsitePage] Loaded config from DB:', {
          templates,
          config: site.config,
          siteAny,
          sectionsValue,
        });

        // Safely extract timeline events from section_content.timeline
        const timelineEventsValue = Array.isArray(site.config?.section_content?.timeline)
          ? site.config.section_content.timeline
          : (Array.isArray(siteAny.section_content?.timeline) ? siteAny.section_content.timeline : []);
        // Safely extract cover photo index (only from config)
        const coverPhotoIndexValue = typeof site.config?.cover_photo_index === 'number'
          ? site.config.cover_photo_index
          : undefined;
        // Safely extract section_content (new feature)
        const sectionContentValue = site.config?.section_content || {};
        // Ensure tagline is set in section_content.home as well
        if (taglineValue) {
          if (!sectionContentValue.home) sectionContentValue.home = {};
          sectionContentValue.home.tagline = taglineValue;
        }

      

        // Set config and selectedPresetId from loaded data (define configPatch only once)
        const configPatch: any = {
          occasion: loadedOccasion as OccasionType,
          theme: (site.config?.theme || siteAny.theme) as ThemeKey || DEFAULT_THEME,
          sections: sectionsValue,
          templates,
          timeline_events: timelineEventsValue as SiteConfig['timeline_events'],
          cover_photo_index: coverPhotoIndexValue,
          section_content: sectionContentValue,
          section_divider_style: site.config?.section_divider_style,
          layout_preset: site.config?.layout_preset,
          preset: site.config?.preset,
          hero: {
            ...(site.config?.hero || {}),
            coverPhotoUrl: site.config?.hero?.coverPhotoUrl,
            coverPhotoIndex: site.config?.hero?.coverPhotoIndex,
          },
          media: {
            ...(site.config?.media || {}),
            song_link: site.config?.media?.song_link || site.song_link || '',
            song_autoplay: site.config?.media?.song_autoplay ?? false,
          },
          password: site.config?.password ? { ...site.config.password } : undefined,
        };

        // Only set selectedPresetId if it matches a valid preset for the loaded occasion
        const { getPresetsForOccasion } = require('@/lib/preset-registry');
        const validPresets = getPresetsForOccasion(loadedOccasion);

        // Set config first (configPatch is now always defined)
        setConfig(configPatch);

        // Now run preset detection logic
        if (loadedPresetId && validPresets.some((p: any) => p.id === loadedPresetId)) {
          setSelectedPresetId(loadedPresetId);
        } else {
          // Try to auto-detect preset if not set or invalid
          const match = validPresets.find((preset: any) => {
            // Compare sections, theme, and templates for a close match
            const sectionsMatch = Array.isArray(preset.defaults.sections) && Array.isArray(sectionsValue)
              && preset.defaults.sections.length === sectionsValue.length
              && preset.defaults.sections.every((s: any, i: number) => s === sectionsValue[i]);
            const themeMatch = preset.defaults.theme === configPatch.theme;
            const layoutMatch = preset.defaults.layout_preset === configPatch.layout_preset;
            const templates = preset.defaults.templates || {};
            const templatesMatch =
              (!templates.home || templates.home === configPatch.templates?.home) &&
              (!templates.gallery || templates.gallery === configPatch.templates?.gallery) &&
              (!templates.timeline || templates.timeline === configPatch.templates?.timeline) &&
              (!templates.song || templates.song === configPatch.templates?.song);
            return sectionsMatch && themeMatch && layoutMatch && templatesMatch;
          });
          if (match) {
            setSelectedPresetId(match.id);
          } else {
            setSelectedPresetId(null);
          }
        }



        setExpirationMode(computedMode);
        setCustomExpirationDate(computedCustomDate);

        // Gather all possible sources for gallery images
        let galleryPhotos: string[] = [];
        if (Array.isArray(site.config?.section_content?.gallery?.photos)) {
          galleryPhotos = site.config.section_content.gallery.photos;
        } else if (Array.isArray(site.config?.media?.photos)) {
          galleryPhotos = site.config.media.photos;
        } else if (Array.isArray(site.photos)) {
          galleryPhotos = site.photos;
        } else if (Array.isArray(site.config?.photos)) {
          galleryPhotos = site.config.photos;
        }
        setPhotoPreviews(galleryPhotos);

        // Safely extract sections - ensure it's an array and cast to Section[]
        // ...existing code...

        // Set selectedPresetId if preset is present and valid for the current occasion
        if (site.config?.preset?.id) {
          const { getPresetsForOccasion } = require('@/lib/preset-registry');
          const validPresets = getPresetsForOccasion(occasionValue);
          if (validPresets.some((p: any) => p.id === site.config.preset.id)) {
            setSelectedPresetId(site.config.preset.id);
          } else {
            setSelectedPresetId(null);
          }
        } else {
          setSelectedPresetId(null);
        }

        // Restore crop and zoom state from config.hero.crop if present
        if (site.config?.hero?.crop) {
          setCrop({ x: site.config.hero.crop.x ?? 0, y: site.config.hero.crop.y ?? 0 });
          setZoom(site.config.hero.crop.zoom ?? 1);
        }

        setHeroPhotoPreview(site.config?.hero?.coverPhotoUrl || null);
        setPasswordEnabled(!!site.config?.password?.enabled);

        setCompletedSteps([1, 2, 3, 4, 5]);
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError('Failed to load website data');
    } finally {
      setFetching(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;

    if (name === 'occasion') {
      const nextOccasion = value as OccasionType;
      setForm((prev) => ({
        ...prev,
        occasion: nextOccasion,
        participants: buildParticipantsForOccasion(nextOccasion, prev.participants),
      }));
      // Auto-apply the first preset for the new occasion
      const occasionPresets = getPresetsForOccasion(nextOccasion as SiteTypeKey);
      const firstPreset = occasionPresets[0];
      if (firstPreset) {
        setSelectedPresetId(firstPreset.id);
        setConfig((prev) => ({
          ...prev,
          occasion: nextOccasion,
          theme: firstPreset.defaults.theme,
          layout_preset: firstPreset.defaults.layout_preset,
          sections: firstPreset.defaults.sections,
          templates: {
            ...(prev.templates || {}),
            ...(firstPreset.defaults.templates as Record<string, string>),
          },
        }));
      } else {
        setSelectedPresetId(null);
        const defaults = getDefaultSelections(nextOccasion as SiteTypeKey);
        setConfig((prev) => ({
          ...prev,
          occasion: nextOccasion,
          theme: defaults.defaultTheme || prev.theme,
          sections: defaults.defaultSections || [],
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value as any }));
    }
  };

  // Separate handler for <select> elements (kept for backward compat)
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e as any);
  };

  const generateRandomSlug = () => {
    const base = sanitizeSlug(form.website_name || 'site') || 'site';
    const suffix = Math.floor(1000 + Math.random() * 9000).toString();
    const candidate = `${base}-${suffix}`;
    setForm((prev) => ({ ...prev, website_name: candidate }));
    setSlugCheckState('checking');
    setSlugCheckMessage('Checking availability...');
  };

  useEffect(() => {
    const slug = (form.website_name || '').trim();
    if (!slug) {
      setSlugCheckState('idle');
      setSlugCheckMessage('');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugCheckState('taken');
      setSlugCheckMessage('Use lowercase letters, numbers, and hyphen only.');
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setSlugCheckState('checking');
        setSlugCheckMessage('Checking availability...');
        const response = await fetch(`/api/qrcode/verify?slug=${encodeURIComponent(slug)}`);
        const result = await response.json();
        if (!response.ok || !result?.success) throw new Error('Unable to validate slug');

        if (result.exists) {
          if (String(result.site_id) === String(id)) {
            setSlugCheckState('available');
            setSlugCheckMessage('This is the current slug for this site.');
          } else {
            setSlugCheckState('taken');
            setSlugCheckMessage('This slug is already used by another website.');
          }
        } else {
          setSlugCheckState('available');
          setSlugCheckMessage('Slug is available.');
        }
      } catch {
        setSlugCheckState('idle');
        setSlugCheckMessage('Could not validate slug right now.');
      }
    }, 400);

    return () => window.clearTimeout(timer as unknown as number);
  }, [form.website_name, id]);


  const handleConfigChange = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const merged = { ...prev, ...newConfig };
      // If section_content.song exists, sync to media
      const songContent = merged.section_content?.song;
      if (songContent) {
        merged.media = {
          ...(merged.media || {}),
          song_link: songContent.song_link || '',
          song_autoplay: !!songContent.song_autoplay,
        };
      }
      return merged;
    });
  };

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      media: {
        ...(prev.media || {}),
        song_link: form.song_link,
        song_autoplay: !!form.song_autoplay,
      },
      password: passwordEnabled ? { enabled: true } : undefined,
    }));
  }, [form.song_link, form.song_autoplay, passwordEnabled]);

  // Sync form fields → config (occasion, participants, message, tagline, specialDate)
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      occasion: form.occasion,
      participants: form.participants,
      message: form.message,
      tagline: form.tagline,
      specialDate: form.specialDate,
      eventTime: form.eventTime,
      hero: {
        ...(prev.hero || {}),
        coverPhotoIndex: typeof form.heroPhotoIndex === 'number' ? form.heroPhotoIndex : prev.hero?.coverPhotoIndex,
      },
      media: {
        ...(prev.media || {}),
        song_link: form.song_link,
        song_autoplay: !!form.song_autoplay,
      },
    }));
  }, [form.occasion, form.participants, form.message, form.tagline, form.specialDate, form.eventTime, form.song_link, form.song_autoplay, form.heroPhotoIndex]);

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const limitedFiles = files.slice(0, 15);

    if (files.length > 15) {
      setError('You can upload up to 15 images only.');
    } else {
      setError(null);
    }

    const unsupported = limitedFiles.filter((f) => !f.type.startsWith('image/'));
    const tooLarge = limitedFiles.filter((f) => f.size > MAX_IMAGE_UPLOAD_BYTES);

    if (unsupported.length > 0) {
      setError('Only image files are allowed.');
      return;
    }

    if (tooLarge.length > 0) {
      setError('Some images are larger than 12MB. They will still be optimized, but smaller files are faster.');
    }

    const validImages = limitedFiles.filter((f) => f.type.startsWith('image/') && f.size <= MAX_IMAGE_UPLOAD_BYTES);
    setForm({ ...form, photos: validImages });

    // Only show new previews, matching Create flow
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    const newPreviews = validImages.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(newPreviews);

    analyzeImageQuality(validImages)
      .then((warnings) => setPhotoQualityWarnings(warnings.slice(0, 4)))
      .catch(() => setPhotoQualityWarnings([]));

    if (config.cover_photo_index !== undefined && config.cover_photo_index >= validImages.length) {
      setConfig({ ...config, cover_photo_index: undefined });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const existingCount = (form.existingPhotos || []).length;
    if (index < existingCount) {
      // Removing an existing saved photo — update saved list only (do not persist previews)
      const nextExisting = (form.existingPhotos || []).slice();
      nextExisting.splice(index, 1);
      setForm((prev) => ({ ...prev, existingPhotos: nextExisting }));
      setConfig((prev) => ({
        ...prev,
        section_content: {
          ...(prev.section_content || {}),
          gallery: { photos: nextExisting },
        },
        media: {
          ...(prev.media || {}),
          photos: nextExisting,
        },
      }));
    } else {
      // Removing a newly added file preview
      const newIndex = index - existingCount;
      const removed = photoPreviews[newIndex];
      try {
        if (removed && removed.startsWith('blob:')) URL.revokeObjectURL(removed);
      } catch {}
      setPhotoPreviews((prev) => {
        const next = prev.slice();
        next.splice(newIndex, 1);
        // Keep config.media.photos reflecting only existing remote URLs
        setConfig((cPrev) => ({
          ...cPrev,
          section_content: {
            ...(cPrev.section_content || {}),
            gallery: { photos: [...(form.existingPhotos || [])] },
          },
          media: {
            ...(cPrev.media || {}),
            photos: [...(form.existingPhotos || [])],
          },
        }));
        return next;
      });
      setForm((prev) => ({ ...prev, photos: (prev.photos || []).filter((_, i) => i !== newIndex) }));
    }
  };

  const handleCoverPhotoSelect = (index: number) => {
    setConfig({ ...config, cover_photo_index: index });
  };

  const handleHeroPhotoSelect = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      hero: {
        ...(prev.hero || {}),
        coverPhotoIndex: index,
        coverPhotoUrl: undefined,
      },
    }));
    setForm((prev) => ({ ...prev, heroPhotoIndex: index, heroPhoto: null }));
    if (heroPhotoPreview) {
      URL.revokeObjectURL(heroPhotoPreview);
      setHeroPhotoPreview(null);
    }
  };

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed for hero photo.');
      return;
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      setError('Hero image is larger than 12MB. It will be optimized for web but smaller original files upload faster.');
    } else {
      setError(null);
    }

    const preview = URL.createObjectURL(file);

    if (heroPhotoPreview) {
      URL.revokeObjectURL(heroPhotoPreview);
    }

    setHeroPhotoPreview(preview);
    setForm((prev) => ({ ...prev, heroPhoto: file, heroPhotoIndex: undefined }));
    setConfig((prev) => ({
      ...prev,
      hero: {
        ...(prev.hero || {}),
        coverPhotoUrl: preview,
        coverPhotoIndex: undefined,
      },
    }));
  };

  const handleSectionContentChange = <K extends keyof SectionContentMap>(
    section: K,
    content: SectionContentMap[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      section_content: {
        ...prev.section_content,
        [section]: content,
      },
    }));
  };

  const handleNext = () => {
    const validation = validateStep(currentStep, form, config);
    if (!validation.valid) {
      setError(validation.error || 'Please complete this step');
      return;
    }
    setError(null);

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const validation = validateStep(5, form, config);
    if (!validation.valid) {
      setError(validation.error || 'Please complete all required content');
      setCurrentStep(5);
      return false;
    }

    setLoading(true);
    setError(null);
    setWarning(null);
    setSuccess(false);

    let allPhotos = [...form.existingPhotos];
    
    if (form.photos.length > 0) {
      const photosBase64 = await Promise.all(
        form.photos.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              if (!file.type.startsWith('image/')) return reject('Invalid file type');
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject('File read error');
              reader.readAsDataURL(file);
            })
        )
      );
      allPhotos = [...allPhotos, ...photosBase64];
    }

    try {
      const normalizedConfig = {
        ...config,
      } as SiteConfig & {
        people?: {
          primary?: string;
          secondary?: string;
        };
      };
      // Ensure top-level eventTime is kept in config for consistency
      normalizedConfig.eventTime = form.eventTime;
      const primaryParticipantName = (form.participants?.[0]?.name || '').trim();
      const secondaryParticipantName = (form.participants?.[1]?.name || '').trim();
      const resolvedCustomerName = primaryParticipantName || (form.customer_name || '').trim();
      const resolvedPartnerName = secondaryParticipantName || (form.partner_name || '').trim();

      normalizedConfig.people = {
        ...(normalizedConfig.people || {}),
        primary: resolvedCustomerName,
        secondary: resolvedPartnerName,
      };

      if (normalizedConfig?.hero?.coverPhotoUrl?.startsWith('blob:')) {
        delete normalizedConfig.hero.coverPhotoUrl;
      }

      const rawPasswordInput = (form.password_input || '').trim();
      const passwordUnchanged = isMaskedPasswordPlaceholder(rawPasswordInput);
      const effectivePasswordInput = passwordUnchanged ? '' : rawPasswordInput;

      if (passwordEnabled) {
        if (!passwordUnchanged) {
          // User typed a new password — hash and overwrite
          let hash = undefined;
          if (effectivePasswordInput.length >= 4 && effectivePasswordInput.length <= 6) {
            hash = bcrypt.hashSync(effectivePasswordInput, 8);
          }
          normalizedConfig.password = { enabled: true, ...(hash ? { hash } : {}) };
        }
        // else: passwordUnchanged — normalizedConfig already has the existing hash from config state
      } else {
        delete normalizedConfig.password;
      }
      let heroPhotoBase64: string | null = null;
      if (form.heroPhoto) {
        heroPhotoBase64 = await new Promise<string>((resolve, reject) => {
          const file = form.heroPhoto as File;
          if (!file.type.startsWith('image/')) return reject('Invalid hero photo file type');
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject('Hero photo read error');
          reader.readAsDataURL(file);
        });
      }

      let expiresAt = form.expires_at || '';
      try {
        expiresAt = calculateExpirationDate(expirationMode, customExpirationDate || undefined);
      } catch (err: any) {
        throw new Error(err?.message || 'Invalid expiration date');
      }

      // Sync song/playlist settings from section content (playlist/song sections)
      const songContent = (normalizedConfig.section_content as any)?.song;
      const playlistContent = (normalizedConfig.section_content as any)?.playlist;
      let effectiveSongLink = (form.song_link || '').trim();
      let effectiveSongAutoplay = !!form.song_autoplay;

      if (songContent) {
        effectiveSongLink = (songContent.song_link || '').trim();
        effectiveSongAutoplay = !!songContent.song_autoplay;
      } else if (playlistContent) {
        effectiveSongLink = ((playlistContent.playlistUrl as string) || (playlistContent.song_link as string) || '').trim();
        effectiveSongAutoplay = !!(playlistContent.song_autoplay || (playlistContent as any).autoplay);
      }

      normalizedConfig.media = {
        ...(normalizedConfig.media || {}),
        song_link: effectiveSongLink,
        song_autoplay: effectiveSongAutoplay,
      };

      const payload = {
        id,
        website_name: form.website_name,
        site_type: config.occasion,
        occasion: config.occasion,
        customer_name: resolvedCustomerName,
        partner_name: resolvedPartnerName,
        specialDate: form.specialDate,
        eventTime: form.eventTime,
        message: form.message,
        tagline: form.tagline,
        song_link: normalizedConfig.media?.song_link || '',
        song_autoplay: !!normalizedConfig.media?.song_autoplay,
        photos: allPhotos,
        config: normalizedConfig,
        password_input: effectivePasswordInput,
        expires_at: expiresAt,
        hero_photo: heroPhotoBase64,
      };
      try {
        const resultData = await updateSite(payload);
        if (resultData?.warnings?.length) {
          setWarning(`Update completed with warnings: ${resultData.warnings.join('; ')}`);
        } else {
          setWarning(null);
        }
        setSuccess(true);
        if (!completedSteps.includes(5)) {
          setCompletedSteps((prev) => (prev.includes(5) ? prev : [...prev, 5]));
        }
        return true;
      } catch (err: any) {
        let errorMessage = err?.message || 'Server error (500)';
        setError(`Update failed: ${errorMessage}`);
        return false;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setForm((prev) => ({
      ...prev,
      occasion: preset.siteType as OccasionType,
      participants: buildParticipantsForOccasion(preset.siteType as OccasionType, prev.participants),
    }));
    setConfig((prev) => ({
      ...prev,
      occasion: preset.siteType as OccasionType,
      preset: { id: preset.id, label: preset.label, siteType: preset.siteType },
      theme: preset.defaults.theme,
      layout_preset: preset.defaults.layout_preset,
      sections: preset.defaults.sections,
      templates: {
        ...(prev.templates || {}),
        ...(preset.defaults.templates as Record<string, string>),
      },
    }));
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const target = history[historyIndex - 1];
    if (!target) return;
    isRestoringHistoryRef.current = true;
    setForm(target.form);
    setConfig(target.config);
    setCurrentStep(target.currentStep);
    setCompletedSteps(target.completedSteps);
    setHistoryIndex(historyIndex - 1);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const target = history[historyIndex + 1];
    if (!target) return;
    isRestoringHistoryRef.current = true;
    setForm(target.form);
    setConfig(target.config);
    setCurrentStep(target.currentStep);
    setCompletedSteps(target.completedSteps);
    setHistoryIndex(historyIndex + 1);
  };

  const handleSaveAsTemplate = () => {
    const name = window.prompt('Template name');
    if (!name || !name.trim()) return;

    const template: LocalTemplate = {
      id: `${Date.now()}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      form: {
        occasion: form.occasion,
        participants: form.participants,
        specialDate: form.specialDate,
        eventTime: form.eventTime,
        tagline: form.tagline,
        message: form.message,
        song_link: form.song_link,
      },
      config: {
        occasion: config.occasion,
        theme: config.theme,
        layout_preset: config.layout_preset,
        sections: config.sections,
        templates: config.templates,
        section_content: config.section_content,
      },
    };

    const next = saveLocalTemplate(template);
    setLocalTemplates(next);
    setSelectedLocalTemplateId(template.id);
  };

  const handleApplyLocalTemplate = (templateId: string) => {
    const template = localTemplates.find((item) => item.id === templateId);
    if (!template) return;
    setSelectedLocalTemplateId(templateId);
    const sanitizedParticipants = (template.form.participants || [])
      .filter((participant) => !!participant.name)
      .map((participant, index) => ({
        id: participant.id || `participant-${index + 1}`,
        name: participant.name || '',
        role: participant.role,
      }));

    setForm((prev) => ({
      ...prev,
      occasion: (template.form.occasion as OccasionType) || prev.occasion,
      participants: sanitizedParticipants.length > 0 ? sanitizedParticipants : prev.participants,
      specialDate: template.form.specialDate || prev.specialDate,
      eventTime: (template.form as any).eventTime || prev.eventTime,
      tagline: template.form.tagline || prev.tagline,
      message: template.form.message || prev.message,
      song_link: template.form.song_link || prev.song_link,
    }));

    setConfig((prev) => ({
      ...prev,
      ...template.config,
      occasion: (template.form.occasion as OccasionType) || prev.occasion,
    }));
  };

  const handleCloneToNewWebsite = () => {
    const cloneDraftKey = 'create-website-draft-v1';
    const clonePayload = {
      form: {
        website_name: `${form.website_name}-copy`,
        occasion: form.occasion,
        participants: form.participants,
        specialDate: form.specialDate,
        eventTime: form.eventTime,
        message: form.message,
        tagline: form.tagline,
        song_link: form.song_link,
        song_autoplay: form.song_autoplay,
      },
      config,
      currentStep: 1,
      completedSteps: [],
      clonedFromId: id,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(cloneDraftKey, JSON.stringify(clonePayload));
    router.push('/admin/websites/create');
  };

  const renderStepContent = () => {
    const stepInfo = WIZARD_STEPS.find((s) => s.id === currentStep);

    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {stepInfo?.title || 'Your Details'}
                </h2>
                {stepInfo?.helpText && (
                  <div className="mt-1 text-slate-500 text-sm max-w-xl">
                    {stepInfo.helpText}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Website Name (used in URL)
                  <span className="ml-1 text-slate-400" title="Used for the public URL. Keep it short and readable.">?</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">yoursite.com/</span>
                  <input
                    name="website_name"
                    required
                    placeholder="john-birthday"
                    value={form.website_name}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Only letters, numbers, and hyphens allowed
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <p className={`text-xs ${slugCheckState === 'taken' ? 'text-rose-600' : slugCheckState === 'available' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {slugCheckMessage || ''}
                  </p>
                  {slugCheckState === 'taken' && (
                    <button
                      type="button"
                      onClick={generateRandomSlug}
                      className="px-2 py-1 rounded-md text-xs bg-rose-50 border border-rose-200 text-rose-700"
                    >
                      Generate random slug
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Occasion Type
                </label>
                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                >
                  {[...SITE_TYPES]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((siteType) => (
                      <option key={siteType.key} value={siteType.key}>
                        {siteType.icon} {siteType.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Preset selector */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Choose a starting template</h3>
                <p className="text-xs text-slate-500 mb-3">Pick one and customize as needed later.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getPresetsForOccasion(form.occasion as SiteTypeKey).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={`text-left rounded-xl border p-3 transition hover:shadow-lg ${
                        selectedPresetId === preset.id
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-sm text-slate-800">{preset.label}</strong>
                        <span className="text-[11px] font-medium text-slate-500">{preset.badge}</span>
                      </div>
                      <p className="text-xs text-slate-500">{preset.description}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAsTemplate}
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                  >
                    Save As Template
                  </button>
                  <select
                    value={selectedLocalTemplateId}
                    onChange={(e) => handleApplyLocalTemplate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="">Load saved template</option>
                    {localTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {duplicateParticipantNames.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Duplicate field detection: repeated participant name(s) detected ({duplicateParticipantNames.join(', ')}).
                </div>
              )}

              {/* Dynamic participant fields based on occasion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getParticipantFieldsForOccasion(form.occasion).map((field, index) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">
                      {field.label}
                    </label>
                    <input
                      name={`participants.${index}.name`}
                      required
                      placeholder={field.placeholder}
                      value={form.participants?.[index]?.name || ''}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                      onChange={(e) => {
                        const newParticipants = buildParticipantsForOccasion(form.occasion, form.participants);
                        newParticipants[index] = { ...newParticipants[index], name: e.target.value };
                        setForm((prev) => ({ ...prev, participants: newParticipants }));
                      }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  {OCCASION_DATE_LABELS[form.occasion] || 'Special Date'}
                  <span className="ml-1 text-slate-400" title="Used by countdown/timeline sections.">?</span>
                </label>
                <input
                  name="specialDate"
                  required
                  type="date"
                  value={form.specialDate}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Event Time (optional)
                </label>
                <input
                  name="eventTime"
                  type="time"
                  value={form.eventTime || ''}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                  onChange={handleChange}
                />
              </div>

              {/* Music Settings removed — configure playlist and autoplay in Step 5 */}

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  QR Destination Override (optional)
                </label>
                <input
                  type="text"
                  placeholder="/site/your-slug or https://example.com/page"
                  value={config.qr_data_url || ''}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                  onChange={(e) => handleConfigChange({ qr_data_url: e.target.value.trim() || undefined })}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Leave blank to use the default destination.
                </p>
              </div>
              {/* Advanced Options Collapsible */}
              <div className="mt-6">
                <details className="bg-white border border-slate-200 rounded-xl p-4 group" style={{ transition: 'box-shadow 0.2s' }}>
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700 mb-3 outline-none focus:ring-2 focus:ring-rose-400 rounded-xl">
                    Show Advanced Options
                  </summary>
                  <div className="mt-3 space-y-6">
                    {/* Hosting Duration */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">Hosting Duration</h3>
                      <div>
                        <select
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                          value={expirationMode}
                          onChange={e => setExpirationMode(e.target.value as '3_months'|'6_months'|'1_year'|'custom')}
                        >
                          <option value="3_months">3 Months</option>
                          <option value="6_months">6 Months</option>
                          <option value="1_year">1 Year</option>
                          <option value="custom">Custom Expiration Date</option>
                        </select>
                      </div>
                      {expirationMode === 'custom' && (
                        <div className="mt-2">
                          <input
                            type="date"
                            value={customExpirationDate}
                            onChange={(e) => setCustomExpirationDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min={new Date().toISOString().slice(0, 10)}
                          />
                        </div>
                      )}
                      <p className="text-xs mt-2 text-slate-500">{formatSelectedExpiration()}</p>
                    </div>
                    {/* Privacy Settings */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">Privacy Settings</h3>
                      <label className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-600">Protect this website with a password</span>
                        <input
                          type="checkbox"
                          checked={passwordEnabled}
                          onChange={(e) => setPasswordEnabled(e.target.checked)}
                          className="h-4 w-4 text-rose-500 rounded"
                        />
                      </label>
                      {passwordEnabled && (
                        <div className="mt-3 space-y-2">
                          <label className="block text-sm font-medium text-slate-600">Password (4-6 chars)</label>
                          <div className="flex items-center gap-2">
                            <input
                              name="password_input"
                              type={showPassword ? 'text' : 'password'}
                              value={form.password_input || ''}
                              minLength={4}
                              maxLength={6}
                              onFocus={() => {
                                if (isMaskedPasswordPlaceholder(form.password_input)) {
                                  setForm((prev) => ({ ...prev, password_input: '' }));
                                }
                              }}
                              onChange={handleChange}
                              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                              placeholder="Enter password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-sm text-rose-600 hover:text-rose-700"
                            >
                              {showPassword ? 'Hide' : 'Show'}
                            </button>
                          </div>
                          <p className="text-xs text-slate-400">Saved as an encrypted hash, never in plain text.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        );


      case 2:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Choose Style
              </h2>
            </div>


            <ThemeSelector
              value={config.theme as ThemeKey}
              occasion={config.occasion}
              onChange={(theme) => handleConfigChange({ theme })}
            />

            {/* Advanced Options Collapsible */}
            <div className="mt-6">
              <details className="bg-white border border-slate-200 rounded-xl p-4 group" style={{ transition: 'box-shadow 0.2s' }}>
                <summary className="cursor-pointer text-sm font-semibold text-slate-700 mb-3 outline-none focus:ring-2 focus:ring-rose-400 rounded-xl">
                  Show Advanced Options
                </summary>
                <div className="mt-3 space-y-6">
                  {/* Section Divider Style */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Section Divider Style</label>
                    <select
                      value={config.section_divider_style || 'standard'}
                      onChange={(e) => handleConfigChange({ section_divider_style: e.target.value as 'none' | 'standard' | 'gradient' | 'dots' })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                    >
                      <option value="standard">Standard (Heart line)</option>
                      <option value="gradient">Gradient bar</option>
                      <option value="dots">Dots & sparkle</option>
                      <option value="none">No separator</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Premium site divider style between sections. Try gradient for a polished look.</p>
                  </div>

                  {/* Site Layout */}
                  <div className="pt-6 border-t border-slate-200">
                    <LayoutPresetSelector
                      value={config.layout_preset}
                      onChange={(layout_preset) => {
                        handleConfigChange(applyLayoutPresetToConfig(config, layout_preset));
                      }}
                    />
                  </div>
                </div>
              </details>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Page Layout</h2>
            </div>
            <SectionSelector
              value={config.sections}
              siteType={config.occasion || 'couple'}
              onChange={(sections) => {
                const prevSections = config.sections || [];
                const removedSections = prevSections.filter((s) => !sections.includes(s));
                const newConfig = { ...config, sections };
                removedSections.forEach((sectionKey) => {
                  if (newConfig.templates && newConfig.templates[sectionKey]) {
                    delete newConfig.templates[sectionKey];
                  }
                });
                handleConfigChange(newConfig);
              }}
            />
          </div>
        );

      case 4:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-8 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Templates</h2>
            </div>
            {config.sections.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Please select sections in the previous step first.
              </p>
            ) : (
              <div className="space-y-6">
                {config.sections.map((sectionKey) => {
                  const templates = getTemplatesForSection(sectionKey);
                  if (!templates.length) return null;
                  return (
                    <TemplateSelector
                      key={sectionKey}
                      section={sectionKey}
                      value={config.templates?.[sectionKey] as string}
                      onChange={(templateKey: string) =>
                        handleConfigChange({ templates: { ...config.templates, [sectionKey]: templateKey } })
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Add Your Content</h2>
            </div>
            {config.sections.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                <p className="text-sm">No sections enabled yet. Go back to Step 3 to select sections and continue.</p>
              </div>
            ) : (
              <>
                {photoQualityWarnings.length > 0 && (
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                    <div className="font-semibold mb-1">Photo quality checker</div>
                    <ul className="list-disc ml-4 space-y-1">
                      {photoQualityWarnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {form.occasion === 'baptism' && (
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Event Date</label>
                      <input
                        name="specialDate"
                        type="date"
                        value={form.specialDate}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Event Time</label>
                      <input
                        name="eventTime"
                        type="time"
                        value={form.eventTime || ''}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <SectionContentInputs
                  config={config}
                  onSectionContentChange={(sectionKey: string, content: any) => handleSectionContentChange(sectionKey as keyof SectionContentMap, content)}
                  onRemovePhoto={handleRemovePhoto}
                  validationErrors={(() => {
                    const errors: Record<string, boolean> = {};
                    const { sections = [], section_content = {} } = config;
                    sections.forEach((key: string) => {
                      const meta = getSectionMetadata(key as Section);
                      if (meta?.required) {
                        if (key === 'gallery' && (photoPreviews.length === 0 && (!form.existingPhotos || form.existingPhotos.length === 0))) {
                          errors[key] = true;
                        } else if (key === 'timeline' && (!config.section_content?.timeline || !Array.isArray(config.section_content.timeline) || config.section_content.timeline.length === 0)) {
                          errors[key] = true;
                        } else if (key === 'love_letter' && (!(section_content as any).love_letter || !((section_content as any).love_letter?.content || (section_content as any).love_letter?.text)?.trim())) {
                          errors[key] = true;
                        }
                      }
                    });
                    return errors;
                  })()}
                  photoPreviews={photoPreviews}
                  handlePhotos={handlePhotos}
                  heroPhotoPreview={heroPhotoPreview}
                  crop={crop}
                  zoom={zoom}
                  setCrop={setCrop}
                  setZoom={setZoom}
                  setCroppedAreaPixels={setCroppedAreaPixels}
                  handleHeroPhotoUpload={handleHeroPhotoUpload}
                  handleHeroPhotoSelect={handleHeroPhotoSelect}
                  handleRemoveHeroPhoto={handleRemoveHeroPhoto}
                />
              </>
            )}
          </div>
        );

      case 6: {
        const toLabel = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const sectionLabels = config.sections.map((key: Section) => {
          const meta = getSectionMetadata ? getSectionMetadata(key) : undefined;
          return meta?.title || toLabel(key);
        });
        const keyTemplates: Section[] = ['home', 'timeline', 'gallery'];
        const otherTemplates = (config.sections as Section[]).filter((key) => !keyTemplates.includes(key));
        let sectionsSummary = '';
        if (sectionLabels.length > 5) {
          sectionsSummary = `${sectionLabels.slice(0, 5).join(', ')} +${sectionLabels.length - 5} more sections`;
        } else {
          sectionsSummary = sectionLabels.join(', ');
        }
        const completed: { label: string; icon?: string }[] = [];
        const needsAttention: { label: string; icon?: string }[] = [];
        const autoGenerated: { label: string; icon?: string }[] = [];
        (config.sections as Section[]).forEach((key) => {
          const meta = getSectionMetadata ? getSectionMetadata(key) : undefined;
          const label = meta?.title || toLabel(key);
          const sectionContent = (config.section_content && (config.section_content as any)[key]) || undefined;
          const rsvpContent = (config.section_content && (config.section_content as any).rsvp) || undefined;
          if (['relationship_stats','anniversary_countdown','birthday_countdown','wedding_countdown','guest_messages','qr_keepsake'].includes(key)) {
            autoGenerated.push({ label, icon: meta?.icon });
          } else if (
            (key === 'home' && (config.tagline && config.tagline.trim() || (config.hero && typeof config.hero.coverPhotoIndex === 'number'))) ||
            (key === 'gallery' && ((photoPreviews.length > 0) || (form.existingPhotos && form.existingPhotos.length > 0))) ||
            (key === 'photo_highlights' && ((photoPreviews.length > 0) || (form.existingPhotos && form.existingPhotos.length > 0))) ||
            (key === 'timeline' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'wedding_timeline' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'school_memories' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'achievements' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'travel_timeline' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'event_details' && sectionContent && ((typeof sectionContent.location === 'string' && sectionContent.location.trim()) || (typeof sectionContent.date === 'string' && sectionContent.date.trim()))) ||
            (key === 'party_details' && sectionContent && ((typeof sectionContent.location === 'string' && sectionContent.location.trim()) || (typeof sectionContent.date === 'string' && sectionContent.date.trim()))) ||
            (key === 'rsvp' && rsvpContent && ((typeof rsvpContent.deadline === 'string' && rsvpContent.deadline.trim()) || (Array.isArray(rsvpContent.messages) && rsvpContent.messages.length > 0))) ||
            (key === 'gift_wishlist' && sectionContent && Array.isArray(sectionContent.items) && sectionContent.items.length > 0) ||
            (key === 'gift_registry' && sectionContent && Array.isArray(sectionContent.items) && sectionContent.items.length > 0) ||
            (key === 'surprise_message' && sectionContent && ((typeof sectionContent.message === 'string' && sectionContent.message.trim()) || (typeof sectionContent.hint === 'string' && sectionContent.hint.trim()))) ||
            (sectionContent && (
              (Array.isArray(sectionContent.gifts) && sectionContent.gifts.length > 0) ||
              (Array.isArray(sectionContent.reasons) && sectionContent.reasons.length > 0) ||
              (Array.isArray(sectionContent.quotes) && sectionContent.quotes.length > 0) ||
              (Array.isArray(sectionContent.dreams) && sectionContent.dreams.length > 0) ||
              (Array.isArray(sectionContent.videos) && sectionContent.videos.length > 0) ||
              (Array.isArray(sectionContent.locations) && sectionContent.locations.length > 0) ||
              (typeof sectionContent.content === 'string' && sectionContent.content.trim()) ||
              (typeof sectionContent.letter === 'string' && sectionContent.letter.trim()) ||
              (typeof sectionContent.message === 'string' && sectionContent.message.trim()) ||
              (typeof sectionContent.playlistUrl === 'string' && sectionContent.playlistUrl.trim())
            ))
          ) {
            completed.push({ label, icon: meta?.icon });
          } else {
            needsAttention.push({ label, icon: meta?.icon });
          }
        });
        return (
          <div className="bg-gradient-to-br from-white via-slate-50 to-rose-50/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 p-8 md:p-12 space-y-10 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm p-6 group transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800 tracking-tight">Basic Info</h3>
                  <button type="button" className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shadow-sm transition-all duration-150" onClick={() => setCurrentStep(1)}>Edit</button>
                </div>
                <div className="text-base text-slate-700 space-y-2">
                  <div><span className="font-medium">Website Name:</span> {form.website_name}</div>
                  <div>
                    <span className="font-medium">Names:</span> {
                      Array.isArray(form.participants) && form.participants.length > 0
                        ? form.participants.map((p: any) => p.name).filter(Boolean).join(' & ') || <span className="text-slate-400">Not set</span>
                        : <span className="text-slate-400">Not set</span>
                    }
                  </div>
                  <div>
                    <span className="font-medium">Special Date:</span>
                    {form.specialDate
                      ? `${new Date(form.specialDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}${form.eventTime ? ' • ' + form.eventTime : ''}`
                      : <span className="text-slate-400">Not set</span>
                    }
                  </div>
                  <div><span className="font-medium">Occasion:</span> {toLabel(form.occasion)}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Password:</span>
                    {form.password_input ? (
                      <>
                        <span className="tracking-widest select-all">{showPassword ? form.password_input : '••••••••'}</span>
                        <button type="button" className="ml-2 text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 font-medium transition-all duration-150" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
                      </>
                    ) : (
                      <span className="text-slate-400">Not set</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Hosting Duration:</span> {
                      expirationMode === '3_months' ? '3 months'
                      : expirationMode === '6_months' ? '6 months'
                      : expirationMode === '1_year' ? '12 months'
                      : <span className="text-slate-400">Not set</span>
                    }
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm p-6 group transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800 tracking-tight">Style</h3>
                  <button type="button" className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shadow-sm transition-all duration-150" onClick={() => setCurrentStep(2)}>Edit</button>
                </div>
                <div className="text-base text-slate-700 space-y-2">
                  <div><span className="font-medium">Theme:</span> {toLabel(config.theme)}</div>
                  <div className="mt-1">
                    <span className="font-medium">Templates:</span>
                    <ul className="list-disc ml-6 mt-1 space-y-0.5">
                      {keyTemplates.map((key) => {
                        if (!(config.sections as Section[]).includes(key)) return null;
                        const meta = getSectionMetadata ? getSectionMetadata(key) : undefined;
                        return (
                          <li key={key} className="flex items-center gap-1">
                            {meta?.icon && <span className="mr-1">{meta.icon}</span>}
                            <span>{meta?.title || toLabel(key)}: <span className="text-slate-500">{config.templates?.[key] || 'Default'}</span></span>
                          </li>
                        );
                      })}
                      {otherTemplates.length > 0 && <li className="flex items-center gap-1"><span className="text-slate-500">Other Sections: Default</span></li>}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm p-6 group transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800 tracking-tight">Sections</h3>
                  <button type="button" className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shadow-sm transition-all duration-150" onClick={() => setCurrentStep(3)}>Edit</button>
                </div>
                <div className="text-base text-slate-700">
                  {sectionLabels.length > 0 ? <span>{sectionsSummary}</span> : <span>No sections selected</span>}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm p-6 group transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800 tracking-tight">Content Summary</h3>
                  <button type="button" className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shadow-sm transition-all duration-150" onClick={() => setCurrentStep(5)}>Edit</button>
                </div>
                <div className="text-base text-slate-700 space-y-3">
                  {completed.length > 0 && (
                    <div>
                      <span className="font-medium text-emerald-700">Completed:</span>
                      <ul className="list-disc ml-6 mt-1 space-y-0.5">
                        {completed.map((item, i) => (
                          <li key={i} className="flex items-center gap-1">
                            {item.icon && <span className="mr-1">{item.icon}</span>}
                            <span>{item.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {needsAttention.length > 0 && (
                    <div>
                      <span className="font-medium text-rose-700">Needs Attention:</span>
                      <ul className="list-disc ml-6 mt-1 space-y-0.5">
                        {needsAttention.map((item, i) => (
                          <li key={i} className="flex items-center gap-1">
                            {item.icon && <span className="mr-1">{item.icon}</span>}
                            <span>{item.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {autoGenerated.length > 0 && (
                    <div>
                      <span className="font-medium text-slate-500">Auto-generated:</span>
                      <ul className="list-disc ml-6 mt-1 space-y-0.5">
                        {autoGenerated.map((item, i) => (
                          <li key={i} className="flex items-center gap-1">
                            {item.icon && <span className="mr-1">{item.icon}</span>}
                            <span>{item.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {completed.length === 0 && needsAttention.length === 0 && autoGenerated.length === 0 && (
                    <span className="text-slate-400">No content sections</span>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">Publish Readiness Checklist</h3>
                <span className="text-xs text-slate-500">
                  {publishChecklist.filter((item) => item.ok).length}/{publishChecklist.length} complete
                </span>
              </div>
              <div className="space-y-2">
                {publishChecklist.map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-3 text-sm">
                    <div className={item.ok ? 'text-emerald-700' : 'text-amber-700'}>
                      {item.ok ? 'OK' : 'Fix'} {item.label}
                    </div>
                    {!item.ok && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(item.fixStep)}
                        className="text-xs px-2 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700"
                        title={item.suggestion}
                      >
                        Fix in Step {item.fixStep}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={needsAttention.length > 0
              ? "bg-gradient-to-r from-amber-50 to-white rounded-2xl p-5 border border-amber-200 shadow"
              : "bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-5 border border-emerald-200 shadow"
            }>
              {needsAttention.length > 0 ? (
                <div className="text-amber-700 text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                  Some sections need attention. You can still save — review the content sections when ready.
                </div>
              ) : (
                <div className="text-emerald-700 text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Everything looks great! Save your changes below.
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Website Updated!</h2>
        <p className="text-slate-500 mb-6">Your changes have been saved successfully.</p>
        
        <div className="flex gap-4 justify-center">
          <a
            href={`/site/${form.website_name}`}
            target="_blank"
            className="px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700"
          >
            View Website
          </a>
          <button
            onClick={() => router.push(`/admin/websites/${id}/edit`)}
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
          >
            Edit Website
          </button>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 6) {
      await handleSubmit();
    }
  };

    return (
    <div className="bg-gradient-to-b from-[#FFF7FB] to-[#FDF2F8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-center mb-3 text-slate-800">
            Edit Website
          </h1>
          <p className="text-slate-500 text-sm lg:text-base">
            Update your website configuration
          </p>
        </div>

        <div className="flex flex-wrap justify-end items-center gap-2 mb-4">
          <button
            type="button"
            onClick={handleCloneToNewWebsite}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
          >
            Clone Existing Website
          </button>
          <a href="/admin/websites" className="text-rose-600 hover:text-rose-700 font-medium text-sm">
            ← Back to Websites
          </a>
        </div>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobilePreviewOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-slate-700 font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Live Preview
          </button>
        </div>

        <div className="mb-6">
          <StepNavigator
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={(step) => {
              if (step < currentStep || completedSteps.includes(step - 1)) {
                setCurrentStep(step);
                setError(null);
              }
            }}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50"
              title="Undo (Ctrl/Cmd+Z)"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50"
              title="Redo (Ctrl/Cmd+Y)"
            >
              Redo
            </button>
            <span>Version history: {Math.max(history.length, 1)} snapshots</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        {warning && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl">
            {warning}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div>
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    {currentStep === 5 ? 'Next: Review' : 'Continue'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <LivePreview
            occasion={form.occasion}
            config={config}
            coupleNames={{
              customer_name: form.participants?.[0]?.name ?? form.customer_name ?? '',
              partner_name: form.participants?.[1]?.name ?? form.partner_name ?? '',
            }}
            tagline={form.tagline}
            message={form.message}
            specialDate={form.specialDate}
            isMobileOpen={mobilePreviewOpen}
            onMobileClose={() => setMobilePreviewOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
