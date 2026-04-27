
'use client';
import React from 'react';

import { useState, useEffect, useMemo, useRef } from 'react';
import bcrypt from 'bcryptjs';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useRouter } from 'next/navigation';

import type { SiteConfig, CreateOrderPayload, OccasionType } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { DEFAULT_THEME } from '@/config/defaults';
import { calculateExpirationDate, getDaysRemaining, getExpirationLabel, ExpirationMode } from '@/lib/expiration-utils';
import { 
  WIZARD_STEPS, 
  TOTAL_STEPS, 
  validateStep, 
  validateAllSteps,
  getStepConfig 
} from '@/lib/builder-steps-config';
import { getTemplateSections, getSectionMetadata, getSectionTemplates } from '@/lib/section-registry';
import { getDefaultSelections } from '@/lib/config-helpers';
import { getPresetsForOccasion, getPresetById } from '@/lib/preset-registry';
import { applyLayoutPresetToConfig } from '@/lib/layout-preset';
import { SITE_TYPES } from '@/config/siteTypeConfig';
import type { SiteTypeKey } from '@/config/siteTypeConfig';
import {
  getParticipantFieldsForOccasion,
  OCCASION_DATE_LABELS,
} from '@/config/occasionFormConfig';
import ThemeSelector from '@/components/builder/ThemeSelector';
import SectionSelector from '@/components/builder/SectionSelector';
import TemplateSelector from '@/components/builder/TemplateSelector';
import LayoutPresetSelector from '@/components/builder/LayoutPresetSelector';
import TimelineEditor from '@/components/builder/TimelineEditor';
import LivePreview from '@/components/builder/LivePreview';
import StepNavigator from '@/components/builder/StepNavigator';
import SummaryPanel from '@/components/builder/SummaryPanel';
import SectionContentInputs from '@/components/builder/SectionContentInputs';
import {
  TextContentInput,
  UrlContentInput,
  ReasonsILoveYouInput,
  FutureDreamsInput,
  VideoMemoriesInput,
  SpecialMomentsInput,
  MilestonesInput,
  PlaylistInput,
  FirstDateInput,
  LetterToFutureInput,
  SurpriseMessageInput,
  GiftSectionInput,
  QuotesInput,
  MemoryMapInput,
  GuestMessagesInput,
} from '@/components/builder/ContentInputComponents';
import { SectionContentMap, Section } from '@/lib/types';
import {
  analyzeImageQuality,
  buildPublishChecklist,
  detectDuplicateParticipantNames,
  loadLocalTemplates,
  saveLocalTemplate,
  type ChecklistItem,
  type LocalTemplate,
} from '@/lib/builder-experience';


type LocalForm = Omit<CreateOrderPayload, 'config' | 'photos'> & { occasion: OccasionType; photos: File[]; heroPhoto?: File | null; heroPhotoIndex?: number; song_autoplay?: boolean; password_input?: string; eventTime?: string };

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

const sanitizeSlug = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const MAX_IMAGE_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB; will be optimized on server


const DRAFT_KEY = 'create-website-draft-v1';

function getInitialDraft(): { form: LocalForm; config: SiteConfig; currentStep: number; completedSteps: number[] } {
  const validOccasions = SITE_TYPES.map((siteType) => siteType.key) as OccasionType[];
  if (typeof window === 'undefined') {
      return {
        form: {
          website_name: '',
          occasion: 'couple' as OccasionType,
          participants: [
            { id: 'customer', name: '', role: 'primary' },
            { id: 'partner', name: '', role: 'partner' }
          ],
          specialDate: '',
          eventTime: '',
          message: '',
          tagline: '',
          song_link: '',
          song_autoplay: false,
          photos: [],
          password_input: '',
        },
      config: {
        occasion: 'couple' as OccasionType,
        theme: DEFAULT_THEME,
        sections: [],
        templates: {},
        timeline_events: [],
        cover_photo_index: undefined,
        section_content: {},
        section_assets: {},
      },
      currentStep: 1,
      completedSteps: [],
    };
  }
  const draft = window.localStorage.getItem(DRAFT_KEY);
  let initialForm: LocalForm = {
    website_name: '',
    occasion: 'couple' as OccasionType,
    participants: [
      { id: 'customer', name: '', role: 'primary' },
      { id: 'partner', name: '', role: 'partner' }
    ],
    specialDate: '',
    eventTime: '',
    message: '',
    tagline: '',
    song_link: '',
    song_autoplay: false,
    photos: [],
    password_input: '',
  };
  const validThemes: ThemeKey[] = [
    'romantic_classic', 'cute_pastel', 'minimal_modern', 'dark_elegant', 'soft_pastel',
    'elegant_rose_gold', 'vintage_love_letter', 'scrapbook_memories', 'wedding_style',
    'floral_romance', 'dreamy_pink', 'luxury_gold', 'minimal_white', 'cute_kawaii',
    'soft_lavender', 'photo_focus', 'colorful_celebration'
  ];
  let initialConfig: SiteConfig = {
    occasion: 'couple',
    theme: DEFAULT_THEME as ThemeKey,
    sections: [],
    templates: {},
    timeline_events: [],
    cover_photo_index: undefined,
    section_content: {},
    section_assets: {},
  };
  let initialStep = 1;
  let initialCompleted: number[] = [];
  if (draft) {
    try {
      const parsed = JSON.parse(draft);
      if (parsed.form) initialForm = { ...initialForm, ...parsed.form };
      if (parsed.config) {
        let parsedTheme = parsed.config.theme;
        if (!validThemes.includes(parsedTheme)) {
          console.warn('Invalid theme in draft, falling back to DEFAULT_THEME:', parsedTheme);
          parsedTheme = DEFAULT_THEME;
        }
        const parsedConfig: SiteConfig = {
          occasion: validOccasions.includes(parsed.config.occasion) ? parsed.config.occasion : 'couple',
          theme: parsedTheme as ThemeKey,
          sections: Array.isArray(parsed.config.sections) ? parsed.config.sections : [],
          templates: parsed.config.templates || { home: parsed.config.home_template, gallery: parsed.config.gallery_template },
          // timeline_events removed, use section_content.timeline
          cover_photo_index: parsed.config.cover_photo_index,
          section_content: parsed.config.section_content || {},
          section_assets: parsed.config.section_assets || {},
        };
        initialConfig = parsedConfig;
      }
      if (parsed.currentStep) initialStep = parsed.currentStep;
      if (parsed.completedSteps) initialCompleted = parsed.completedSteps;
    } catch {}
  }
  // Ensure occasion is a valid OccasionType
  if (!validOccasions.includes(initialForm.occasion as OccasionType)) {
    initialForm.occasion = 'couple';
  }
  initialForm.occasion = initialForm.occasion as OccasionType;
  if (!validOccasions.includes(initialConfig.occasion as OccasionType)) {
    initialConfig.occasion = 'couple';
  }
  initialConfig.occasion = initialConfig.occasion as OccasionType;
  return {
    form: initialForm,
    config: initialConfig as SiteConfig,
    currentStep: initialStep,
    completedSteps: initialCompleted,
  };
}

export default function CreateWebsitePage() {
    // Draft detection for UI
    const [draftExists, setDraftExists] = useState(false);
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const draftRaw = window.localStorage.getItem(DRAFT_KEY);
        if (!draftRaw) {
          setDraftExists(false);
          return;
        }
        try {
          const draft = JSON.parse(draftRaw);
          // Check for meaningful user input (not just default/empty draft)
          const hasInput = (
            (draft.form && (
              draft.form.website_name?.trim() ||
              draft.form.message?.trim() ||
              draft.form.tagline?.trim() ||
              draft.form.song_link?.trim() ||
              (Array.isArray(draft.form.participants) && draft.form.participants.some((p: any) => p.name?.trim())) ||
              draft.form.specialDate?.trim()
            )) ||
            (draft.config && Array.isArray(draft.config.sections) && draft.config.sections.length > 0)
          );
          setDraftExists(!!hasInput);
        } catch {
          setDraftExists(false);
        }
      }
    }, []);

    // Handler to clear draft and reload page
    const handleClearDraft = () => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(DRAFT_KEY);
        setDraftExists(false);
        // Optionally, also reset form/config/step state to initial if you want a true fresh start:
        // const { form: freshForm, config: freshConfig, currentStep: freshStep, completedSteps: freshCompleted } = getInitialDraft();
        // setForm(freshForm);
        // setConfig(freshConfig);
        // setCurrentStep(freshStep);
        // setCompletedSteps(freshCompleted);
      }
    };
  const [result, setResult] = useState<{
    slug: string;
    website_name: string;
    qr_code_url: string;
  } | null>(null);
  const { form: initialForm, config: initialConfig, currentStep: initialStep, completedSteps: initialCompleted } = getInitialDraft();
  const [form, setForm] = useState<LocalForm>(initialForm);
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  // ...existing code...
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialCompleted);
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

  const duplicateParticipantNames = useMemo(
    () => detectDuplicateParticipantNames(form.participants || []),
    [form.participants]
  );

  const publishChecklist: ChecklistItem[] = useMemo(
    () => {
      const effectiveTagline = (form.tagline && form.tagline.trim()) || (config.section_content?.home?.tagline && String(config.section_content.home.tagline)) || config.tagline || '';
      return buildPublishChecklist({
        websiteName: form.website_name,
        participants: form.participants,
        specialDate: form.specialDate,
        photosCount: form.photos?.length || 0,
        sections: config.sections,
        templates: config.templates as Record<string, string | undefined>,
        message: form.message,
        tagline: effectiveTagline,
      });
    },
    [form, config]
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Don't save photos or previews (too large)
    const { photos, heroPhoto, ...formRest } = form;
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        form: formRest,
        config,
        currentStep,
        completedSteps,
      })
    );
  }, [form, config, currentStep, completedSteps]);

  // Clear draft on successful submit
  useEffect(() => {
    if (result && typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, [result]);

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

  // ...existing code...

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [heroPhotoPreview, setHeroPhotoPreview] = useState<string | null>(null);
  // ...existing code...
  // ...existing code...
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  // Crop state for hero photo
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
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
  const [slugSanitized, setSlugSanitized] = useState(false);
  const [slugCheckState, setSlugCheckState] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [slugCheckMessage, setSlugCheckMessage] = useState('');
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [expirationMode, setExpirationMode] = useState<'3_months'|'6_months'|'1_year'|'custom'>('6_months');
  const [customExpirationDate, setCustomExpirationDate] = useState<string>('');

  // Review step validation state
  const [reviewBlocked, setReviewBlocked] = useState(false);
  const [reviewBlockReasons, setReviewBlockReasons] = useState<string[]>([]);

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

  const router = useRouter();

  useEffect(() => {
    if (!slugSanitized && form.website_name) {
      const sanitized = sanitizeSlug(form.website_name);
      if (sanitized !== form.website_name) {
        setForm((prev) => ({ ...prev, website_name: sanitized }));
        setSlugSanitized(true);
      }
    }
  }, [form.website_name, slugSanitized]);

  const generateRandomSlug = () => {
    const base = sanitizeSlug(form.website_name || 'site') || 'site';
    const suffix = Math.floor(1000 + Math.random() * 9000).toString();
    const candidate = `${base}-${suffix}`;
    setForm((prev) => ({ ...prev, website_name: candidate }));
    setSlugSanitized(true);
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
          setSlugCheckState('taken');
          setSlugCheckMessage('This slug is already in use. You can auto-generate a unique one.');
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
  }, [form.website_name]);

  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
      if (heroPhotoPreview) {
        URL.revokeObjectURL(heroPhotoPreview);
      }
    };
  }, [photoPreviews, heroPhotoPreview]);

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
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

  useEffect(() => {
    setConfig((prev) => {
      const updated = { ...prev };
      if (passwordEnabled) {
        updated.password = { enabled: true };
      } else {
        delete updated.password;
      }
      return updated;
    });
  }, [passwordEnabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof LocalForm;
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;

    if (name === 'website_name') {
      const sanitized = sanitizeSlug(value as string);
      setForm((prev) => ({ ...prev, [name]: sanitized }));
      setSlugSanitized(true);
    } else if (name === 'occasion') {
      const nextOccasion = value as OccasionType;
      setForm((prev) => ({
        ...prev,
        occasion: nextOccasion,
        preset_id: undefined,
        participants: buildParticipantsForOccasion(nextOccasion, prev.participants),
      }));
      // Auto-apply the first preset for the new occasion, or fall back to defaults
      const siteType = value as SiteTypeKey;
      const occasionPresets = getPresetsForOccasion(siteType);
      const firstPreset = occasionPresets[0];
      if (firstPreset) {
        setSelectedPresetId(firstPreset.id);
        setConfig((prev) => ({
          ...prev,
          occasion: value as any,
          theme: firstPreset.defaults.theme,
          layout_preset: firstPreset.defaults.layout_preset,
          sections: firstPreset.defaults.sections,
          templates: {
            ...(prev.templates || {}),
            ...(firstPreset.defaults.templates as Record<string, string>),
          },
          tagline: firstPreset.defaults.copy?.tagline || prev.tagline,
          message: firstPreset.defaults.copy?.message || prev.message,
        }));
      } else {
        setSelectedPresetId(null);
        const defaults = getDefaultSelections(siteType);
        setConfig((prev) => ({
          ...prev,
          occasion: value as any,
          theme: defaults.defaultTheme || prev.theme,
          sections: defaults.defaultSections || [],
          ...defaults.defaultTemplates,
        }));
      }
    } else if (name === 'specialDate') {
      setForm((prev) => ({ ...prev, specialDate: value as string }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value as any }));
    }
  };

  const handleConfigChange = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const merged = { ...prev, ...newConfig };
      // If section_content.song or section_content.playlist exists, sync to media
      const songContent = merged.section_content?.song;
      const playlistContent = merged.section_content?.playlist;
      if (songContent) {
        merged.media = {
          ...(prev.media || {}),
          song_link: songContent.song_link || '',
          song_autoplay: !!songContent.song_autoplay,
        };
      } else if (playlistContent) {
        merged.media = {
          ...(prev.media || {}),
          song_link: (playlistContent.playlistUrl as string) || (playlistContent.song_link as string) || '',
          song_autoplay: !!(playlistContent.song_autoplay || (playlistContent as any).autoplay),
        };
      }
      return merged;
    });
  };

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
      setError('Some images are larger than 12MB. They will still be optimized, but try smaller files for faster upload.');
      // continue with smaller files while excluding huge images
    }

    const validImages = limitedFiles.filter((f) => f.type.startsWith('image/') && f.size <= MAX_IMAGE_UPLOAD_BYTES);

    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    const newPreviews = validImages.map((file) => URL.createObjectURL(file));

    setForm((prev) => ({ ...prev, photos: validImages }));
    setPhotoPreviews(newPreviews);
    analyzeImageQuality(validImages)
      .then((warnings) => setPhotoQualityWarnings(warnings.slice(0, 4)))
      .catch(() => setPhotoQualityWarnings([]));

    if (
      config.cover_photo_index !== undefined &&
      config.cover_photo_index >= validImages.length
    ) {
      setConfig((prev) => ({ ...prev, cover_photo_index: undefined }));
    }
  };

  const handleCoverPhotoSelect = (index: number) => {
    setConfig((prev) => ({ ...prev, cover_photo_index: index }));
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
      setError('Hero image is larger than 12MB. It will be optimized, but try a smaller file for faster upload.');
      // continue as we can still optimize server-side
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

  const applyPreset = (presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);

    // Applying a preset should drive Step 3 defaults, so sections are preselected.
    setConfig((prev) => ({
      ...prev,
      occasion: form.occasion,
      theme: preset.defaults.theme,
      layout_preset: preset.defaults.layout_preset,
      sections: preset.defaults.sections,
      specialDate: form.specialDate,
      hero: {
        ...(prev.hero || {}),
        coverPhotoIndex: typeof form.heroPhotoIndex === 'number' ? form.heroPhotoIndex : prev.hero?.coverPhotoIndex,
      },
      media: {
        ...(prev.media || {}),
        song_link: form.song_link,
        song_autoplay: !!form.song_autoplay,
      },
      templates: {
        ...(prev.templates || {}),
        ...(preset.defaults.templates as Record<string, string>),
      },
      tagline: preset.defaults.copy?.tagline || prev.tagline,
      message: preset.defaults.copy?.message || prev.message,
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


  // Handle section content changes for dynamic content step
  function handleSectionContentChange(sectionKey: string, content: any) {
    setConfig((prev) => {
      // Special handling for timeline: update both section_content and timeline_events
      if (sectionKey === 'timeline') {
        return {
          ...prev,
          section_content: {
            ...prev.section_content,
            [sectionKey]: content,
          },
          timeline_events: content,
        };
      }
      return {
        ...prev,
        section_content: {
          ...prev.section_content,
          [sectionKey]: content,
        },
      };
    });
  }

  const handleNext = () => {
    const validation = validateStep(currentStep, form, config);
    if (!validation.valid) {
      setError(validation.error || 'Please complete this step');
      return;
    }

    setError(null);

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep || completedSteps.includes(step - 1)) {
      setError(null);
      setCurrentStep(step);
    }
  };

  // Handler for Edit buttons in SummaryPanel (Review step)
  const handleEditSection = (step: number) => {
    setError(null);
    setCurrentStep(step);
  };

  const handleSubmit = async () => {

    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const validation = validateStep(step, form, config);
      if (!validation.valid) {
        setError(validation.error || 'Please complete all required content');
        setCurrentStep(step);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const photosBase64 = await Promise.all(
        form.photos.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              if (!file.type.startsWith('image/')) {
                reject(new Error('Invalid file type'));
                return;
              }

              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error('File read error'));
              reader.readAsDataURL(file);
            })
        )
      );

      let heroPhotoBase64: string | null = null;
      if (form.heroPhoto) {
        heroPhotoBase64 = await new Promise<string>((resolve, reject) => {
          const file = form.heroPhoto as File;
          if (!file.type.startsWith('image/')) {
            reject(new Error('Invalid hero photo file type'));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Hero photo read error'));
          reader.readAsDataURL(file);
        });
      }

      const normalizedConfig = { ...config };
      // Keep top-level eventTime for consistency with edit flow
      normalizedConfig.eventTime = form.eventTime;
      if (normalizedConfig.hero?.coverPhotoUrl?.startsWith('blob:')) {
        delete normalizedConfig.hero.coverPhotoUrl;
      }
      if (passwordEnabled) {
        let hash = undefined;
        if (form.password_input && form.password_input.trim().length >= 4 && form.password_input.trim().length <= 6) {
          // Synchronously hash password (bcryptjs supports sync)
          hash = bcrypt.hashSync(form.password_input.trim(), 8);
        }
        normalizedConfig.password = { enabled: true, ...(hash ? { hash } : {}) };
      } else {
        delete normalizedConfig.password;
      }

      // Compute expiration date
      let expiresAt: string;
      try {
        expiresAt = calculateExpirationDate(expirationMode, customExpirationDate || undefined);
      } catch (err: any) {
        throw new Error(err?.message || 'Invalid expiration date');
      }

      const primaryParticipantName = (form.participants?.[0]?.name || '').trim();
      const secondaryParticipantName = (form.participants?.[1]?.name || '').trim();
      const resolvedCustomerName = primaryParticipantName || (form.customer_name || '').trim();
      const resolvedPartnerName = secondaryParticipantName || (form.partner_name || '').trim();

      const payload: any = {
        website_name: form.website_name,
        occasion: form.occasion,
        customer_name: resolvedCustomerName,
        partner_name: resolvedPartnerName,
        specialDate: form.specialDate,
        eventTime: form.eventTime,
        message: form.message,
        tagline: form.tagline,
        participants: Array.isArray(form.participants) ? form.participants : undefined,
        expires_at: expiresAt,
        photos: photosBase64,
        config: normalizedConfig,
        password_input: form.password_input,
      };
      if (heroPhotoBase64) {
        payload.hero_photo = heroPhotoBase64;
      }

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create');
      }
      if (!data.slug) {
        throw new Error('Missing slug from server');
      }
      if (!data.website_name) {
        throw new Error('Missing website name from server');
      }
      if (!data.qr_code_url) {
        throw new Error('Missing QR code from server');
      }

      setResult({
        slug: data.slug,
        website_name: data.website_name,
        qr_code_url: data.qr_code_url,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Removed duplicate showPassword state declaration. Only top-level remains.
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
                  <span className="ml-1 text-slate-400" title="Used for the public URL. Use short, readable slugs.">?</span>
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

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Choose a starting template</h3>
                <p className="text-xs text-slate-500 mb-3">Pick one and customize as needed later.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getPresetsForOccasion(form.occasion).map((preset) => (
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
                  Duplicate field detection: repeated participant name(s) detected ({duplicateParticipantNames.join(', ')}). Use unique names so sections render correctly.
                </div>
              )}

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
                        setForm({ ...form, participants: newParticipants });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  {OCCASION_DATE_LABELS[form.occasion] || 'Special Date'}
                  <span className="ml-1 text-slate-400" title="Shown in countdown and timeline sections.">?</span>
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
                {stepInfo?.title || 'Choose Style'}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {stepInfo?.title || 'Page Layout'}
              </h2>
            </div>

            <SectionSelector
              value={config.sections}
              siteType={config.occasion || 'couple'}
              onChange={(sections: import('@/lib/types').Section[]) => {
                // When sections change, reset templates for removed sections
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {stepInfo?.title || 'Templates'}
              </h2>
            </div>

            {config.sections.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Please select sections in the previous step first.
              </p>
            ) : (
              <div className="space-y-6">
                {config.sections.map((sectionKey) => {
                  const { getTemplatesForSection } = require('@/lib/config-helpers');
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {stepInfo?.title || 'Content'}
              </h2>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Step 5 (Content): Add text/image data for the sections you chose in Page Layout.
            </p>

            {config.sections.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                <p className="text-sm">No sections enabled yet. Go back to Step 4 to select sections and continue.</p>
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
                  onSectionContentChange={handleSectionContentChange}
                    onRemovePhoto={(index: number) => {
                      // Remove handler for Create flow: remove matching preview + file (do not persist blob URLs)
                      setPhotoPreviews((prev) => {
                        const next = prev.slice();
                        const removed = next.splice(index, 1)[0];
                        try { if (removed && removed.startsWith('blob:')) URL.revokeObjectURL(removed); } catch {}
                        setForm((fPrev) => ({ ...fPrev, photos: (fPrev.photos || []).filter((_, i) => i !== index) }));
                        return next;
                      });
                    }}
                    onSectionAssetsChange={(sectionKey: string, assets: any) => {
                      setConfig((prev) => ({
                        ...prev,
                        section_assets: {
                          ...(prev.section_assets || {}),
                          [sectionKey]: {
                            ...(prev.section_assets?.[sectionKey as Section] || {}),
                            ...assets,
                          },
                        },
                      }));
                    }}
                  validationErrors={(() => {
                    const errors: Record<string, boolean> = {};
                    const { sections = [], section_content = {} } = config;
                    sections.forEach((key: string) => {
                      const meta = getSectionMetadata(key as import('@/lib/types').Section);
                      if (meta?.required) {
                        // Gallery: must have at least 1 photo (check previews or any existing photos)
                        if (key === 'gallery' && (photoPreviews.length === 0 && (!((form as any).existingPhotos) || (form as any).existingPhotos.length === 0))) {
                          errors[key] = true;
                        }
                        // Timeline: must have at least 1 event (use config.timeline_events)
                        else if (key === 'timeline' && (!config.section_content?.timeline || !Array.isArray(config.section_content.timeline) || config.section_content.timeline.length === 0)) {
                          errors[key] = true;
                        }
                        // Love Letter: must have content
                        else if (
                          key === 'love_letter' &&
                          (!section_content.love_letter ||
                            !(section_content.love_letter.content || section_content.love_letter.text)?.trim())
                        ) {
                          errors[key] = true;
                        }
                        // Home: always considered complete (no input required)
                      }
                    });
                    return errors;
                  })()}
                  heroPhotoPreview={heroPhotoPreview}
                  crop={crop}
                  zoom={zoom}
                  setCrop={setCrop}
                  setZoom={setZoom}
                  setCroppedAreaPixels={setCroppedAreaPixels}
                  handleHeroPhotoUpload={handleHeroPhotoUpload}
                  handleHeroPhotoSelect={handleHeroPhotoSelect}
                  handleRemoveHeroPhoto={() => {
                    if (heroPhotoPreview) {
                      URL.revokeObjectURL(heroPhotoPreview);
                      setHeroPhotoPreview(null);
                      setForm((prev) => ({ ...prev, heroPhoto: null, heroPhotoIndex: undefined }));
                      setConfig((prev) => ({
                        ...prev,
                        hero: {
                          ...(prev.hero || {}),
                          coverPhotoUrl: undefined,
                          coverPhotoIndex: undefined,
                          crop: undefined,
                        },
                      }));
                    }
                  }}
                  photoPreviews={photoPreviews}
                  handlePhotos={handlePhotos}
                />
              </>
            )}
          </div>
        );

      case 6:
        // --- Helper functions for formatting ---
        const toLabel = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const sectionLabels = config.sections.map((key: import('@/lib/types').Section) => {
          const meta = getSectionMetadata ? getSectionMetadata(key) : undefined;
          return meta?.title || toLabel(key);
        });
        const sectionIcons = config.sections.map((key: import('@/lib/types').Section) => {
          const meta = getSectionMetadata ? getSectionMetadata(key) : undefined;
          return meta?.icon || '';
        });
        // --- Style grouping ---
        const keyTemplates: import('@/lib/types').Section[] = ['home', 'timeline', 'gallery'];
        const templateDisplay = [
          ...keyTemplates.map((key) =>
            (config.sections as import('@/lib/types').Section[]).includes(key)
              ? `${toLabel(key)}: ${config.templates?.[key] || 'Default'}`
              : null
          ).filter(Boolean),
        ];
        const otherTemplates = (config.sections as import('@/lib/types').Section[]).filter((key) => !keyTemplates.includes(key));
        if (otherTemplates.length > 0) {
          templateDisplay.push(`Other Sections: Default`);
        }
        // --- Sections summary ---
        let sectionsSummary = '';
        if (sectionLabels.length > 5) {
          sectionsSummary = `${sectionLabels.slice(0, 5).join(', ')} +${sectionLabels.length - 5} more sections`;
        } else {
          sectionsSummary = sectionLabels.join(', ');
        }
        // --- Content grouping ---
        const completed: { label: string; icon?: string }[] = [];
        const needsAttention: { label: string; icon?: string }[] = [];
        const autoGenerated: { label: string; icon?: string }[] = [];
        (config.sections as import('@/lib/types').Section[]).forEach((key) => {
          const meta = getSectionMetadata ? getSectionMetadata(key) : undefined;
          const label = meta?.title || toLabel(key);
          const sectionContent = (config.section_content && (config.section_content as any)[key]) || undefined;
          const rsvpContent = (config.section_content && (config.section_content as any).rsvp) || undefined;
          
          if ([
            'relationship_stats',
            'anniversary_countdown',
            'birthday_countdown',
            'wedding_countdown',
            'guest_messages',
            'qr_keepsake',
          ].includes(key)) {
            autoGenerated.push({ label, icon: meta?.icon });
          } else if (
            (key === 'home' && (config.tagline && config.tagline.trim() || (config.hero && typeof config.hero.coverPhotoIndex === 'number'))) ||
            (key === 'gallery' && form.photos && form.photos.length > 0) ||
            (key === 'photo_highlights' && form.photos && form.photos.length > 0) ||
            (key === 'timeline' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'wedding_timeline' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'school_memories' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'achievements' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'travel_timeline' && Array.isArray((config as any).timeline_events) && (config as any).timeline_events.length > 0) ||
            (key === 'event_details' && sectionContent && (
              (Array.isArray(sectionContent.locations) && sectionContent.locations.some((it: any) => ((typeof it.name === 'string' && it.name.trim()) || (typeof it.lat === 'number' && typeof it.lng === 'number')))) ||
              (typeof sectionContent.location === 'string' && sectionContent.location.trim()) ||
              (typeof sectionContent.date === 'string' && sectionContent.date.trim()) ||
              (typeof sectionContent.time === 'string' && sectionContent.time.trim()) ||
              (typeof sectionContent.dressCode === 'string' && sectionContent.dressCode.trim())
            )) ||
            (key === 'party_details' && sectionContent && (
              (typeof sectionContent.location === 'string' && sectionContent.location.trim()) ||
              (typeof sectionContent.date === 'string' && sectionContent.date.trim()) ||
              (typeof sectionContent.time === 'string' && sectionContent.time.trim()) ||
              (typeof sectionContent.dressCode === 'string' && sectionContent.dressCode.trim())
            )) ||
            (key === 'rsvp' && rsvpContent && (
              (typeof rsvpContent.deadline === 'string' && rsvpContent.deadline.trim()) ||
              (typeof rsvpContent.note === 'string' && rsvpContent.note.trim()) ||
              (Array.isArray(rsvpContent.messages) && rsvpContent.messages.length > 0)
            )) ||
            (key === 'gift_wishlist' && sectionContent && Array.isArray(sectionContent.items) && sectionContent.items.some((it: any) => typeof it === 'string' && it.trim().length > 0)) ||
            (key === 'gift_registry' && sectionContent && Array.isArray(sectionContent.items) && sectionContent.items.some((it: any) => typeof it === 'string' && it.trim().length > 0)) ||
            (key === 'gift_ideas' && sectionContent && Array.isArray(sectionContent.items) && sectionContent.items.some((it: any) => typeof it === 'string' && it.trim().length > 0)) ||
            (key === 'surprise_message' && sectionContent && (
              (typeof sectionContent.message === 'string' && sectionContent.message.trim()) ||
              (typeof sectionContent.hint === 'string' && sectionContent.hint.trim())
            )) ||
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
            {/* --- Summary Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm p-6 group transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800 tracking-tight">Basic Info</h3>
                  <button type="button" className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shadow-sm transition-all duration-150" onClick={() => handleEditSection(1)}>Edit</button>
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
                    <span className="font-medium">Special Date:</span> {form.specialDate ? new Date(form.specialDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : <span className="text-slate-400">Not set</span>}
                  </div>
                  <div><span className="font-medium">Slug:</span> {'slug' in form && typeof (form as any).slug === 'string' ? (form as any).slug : '(auto-generated)'}</div>
                  <div><span className="font-medium">Occasion:</span> {toLabel(form.occasion)}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Password:</span>
                    {form.password_input ? (
                      <>
                        <span className="tracking-widest select-all">
                          {showPassword ? form.password_input : '••••••••'}
                        </span>
                        <button
                          type="button"
                          className="ml-2 text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 font-medium transition-all duration-150"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
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
                      : expirationMode === 'custom' && customExpirationDate ? (() => {
                          const now = new Date();
                          const custom = new Date(customExpirationDate);
                          const months = (custom.getFullYear() - now.getFullYear()) * 12 + (custom.getMonth() - now.getMonth());
                          return months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '<1 month';
                        })()
                      : <span className="text-slate-400">Not set</span>
                    }
                  </div>
                </div>
              </div>
              {/* Style */}
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm p-6 group transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800 tracking-tight">Style</h3>
                  <button type="button" className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shadow-sm transition-all duration-150" onClick={() => handleEditSection(2)}>Edit</button>
                </div>
                <div className="text-base text-slate-700 space-y-2">
                  <div><span className="font-medium">Theme:</span> {toLabel(config.theme)}</div>
                  <div className="mt-1">
                    <span className="font-medium">Templates:</span>
                    <ul className="list-disc ml-6 mt-1 space-y-0.5">
                      {keyTemplates.map((key) => {
                        if (!(config.sections as import('@/lib/types').Section[]).includes(key)) return null;
                        const meta = getSectionMetadata ? getSectionMetadata(key) : undefined;
                        return (
                          <li key={key} className="flex items-center gap-1">
                            {meta?.icon && <span className="mr-1">{meta.icon}</span>}
                            <span>{meta?.title || toLabel(key)}: <span className="text-slate-500">{config.templates?.[key] || 'Default'}</span></span>
                          </li>
                        );
                      })}
                      {otherTemplates.length > 0 && (
                        <li className="flex items-center gap-1">
                          <span className="text-slate-500">Other Sections: Default</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Sections */}
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm p-6 group transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800 tracking-tight">Sections</h3>
                  <button type="button" className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shadow-sm transition-all duration-150" onClick={() => handleEditSection(4)}>Edit</button>
                </div>
                <div className="text-base text-slate-700">
                  {sectionLabels.length > 0 ? (
                    <span>{sectionsSummary}</span>
                  ) : (
                    <span>No sections selected</span>
                  )}
                </div>
              </div>
              {/* Content Summary */}
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm p-6 group transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800 tracking-tight">Content Summary</h3>
                  <button type="button" className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shadow-sm transition-all duration-150" onClick={() => handleEditSection(5)}>Edit</button>
                </div>
                <div className="text-base text-slate-700 space-y-3">
                  {completed.length > 0 && (
                    <div>
                      <span className="font-medium text-emerald-700">Completed:</span>
                      <ul className="list-disc ml-6 mt-1 space-y-0.5">
                        {completed.map((item, i) => (
                          <li key={i} className="flex items-center gap-1">
                            {typeof item === 'object' && item.icon && <span className="mr-1">{item.icon}</span>}
                            <span>{typeof item === 'object' ? item.label : item}</span>
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
                            {typeof item === 'object' && item.icon && <span className="mr-1">{item.icon}</span>}
                            <span>{typeof item === 'object' ? item.label : item}</span>
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
                            {typeof item === 'object' && item.icon && <span className="mr-1">{item.icon}</span>}
                            <span>{typeof item === 'object' ? item.label : item}</span>
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
                        onClick={() => handleEditSection(item.fixStep)}
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

            {/* --- Validation Status & Helper Message --- */}
            <div className={
              reviewBlocked && reviewBlockReasons.length > 0
                ? "bg-gradient-to-r from-rose-50 to-white rounded-2xl p-5 border border-rose-200 shadow"
                : needsAttention.length > 0
                  ? "bg-gradient-to-r from-amber-50 to-white rounded-2xl p-5 border border-amber-200 shadow"
                  : "bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-5 border border-emerald-200 shadow"
            }>
              {reviewBlocked && reviewBlockReasons.length > 0 ? (
                <div className="text-rose-700 text-sm">
                  <strong>Cannot submit:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {reviewBlockReasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-xs text-rose-500">Complete the missing sections to continue</div>
                </div>
              ) : needsAttention.length > 0 ? (
                <div className="text-amber-700 text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                  Some required sections need attention. Complete the missing sections to continue.
                </div>
              ) : (
                <div className="text-emerald-700 text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Your website is ready to go!
                  <span className="ml-2 text-xs text-emerald-600">You're one step away from creating your website 💕</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FFF7FB] to-[#FDF2F8] min-h-screen">
      {/* Centered Draft Resume Card */}
      {draftExists && (() => {
        let draftMeta = null;
        if (typeof window !== 'undefined') {
          try {
            const draftRaw = window.localStorage.getItem(DRAFT_KEY);
            if (draftRaw) {
              const parsed = JSON.parse(draftRaw);
              draftMeta = {
                websiteName: parsed.form?.website_name || '',
                lastEdited: parsed.lastEdited || parsed.updatedAt || null,
                sectionCount: Array.isArray(parsed.config?.sections) ? parsed.config.sections.length : 0,
              };
            }
          } catch {}
        }
        return (
          <div className="w-full flex justify-center mt-6 mb-2">
            <div className="relative max-w-xl w-full bg-white/95 border border-slate-100 rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch px-6 py-5 gap-4" style={{ boxShadow: '0 2px 8px 0 rgba(236, 72, 153, 0.04)' }}>
              <button
                aria-label="Dismiss draft card"
                onClick={() => setDraftExists(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-rose-400 focus:outline-none"
                style={{ fontSize: 18, lineHeight: 1 }}
              >
                ×
              </button>
              {/* Left: Title and Metadata */}
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="text-lg font-bold text-slate-800">Continue your website <span className="align-middle">💕</span></span>
                </div>
                {draftMeta?.websiteName && <div className="text-xs text-slate-500"><span className="font-semibold">Website:</span> {draftMeta.websiteName}</div>}
                {draftMeta && draftMeta.sectionCount > 0 && (
                  <div className="text-xs text-slate-500">
                    You’ve completed <span className="font-semibold">{draftMeta.sectionCount}</span> section{draftMeta.sectionCount > 1 ? 's' : ''}
                  </div>
                )}
                {draftMeta?.lastEdited && <div className="text-xs text-slate-500">Last edited: {new Date(draftMeta.lastEdited).toLocaleString()}</div>}
              </div>
              {/* Right: Actions */}
              <div className="flex flex-col justify-center gap-2 sm:items-end sm:justify-center">
                <button
                  onClick={() => setDraftExists(false)}
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-semibold shadow-sm hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  Continue Editing
                </button>
                <button
                  onClick={handleClearDraft}
                  className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold border border-slate-200 shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  Start New
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-center mb-3 text-slate-800">
            Create Website
          </h1>
          <p className="text-slate-500 text-sm lg:text-base">
            Build a beautiful memory site for your special someone
          </p>
        </div>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobilePreviewOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-slate-700 font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Live Preview
          </button>
        </div>

        <div className="mb-6">
          <StepNavigator
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
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

        {!result && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <form onSubmit={(e) => e.preventDefault()}>
                {renderStepContent()}

                <div className="flex justify-between mt-8">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < TOTAL_STEPS ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      {currentStep === 5 ? 'Next: Review' : 'Continue'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                      disabled={loading || reviewBlocked}
                      title={reviewBlocked && reviewBlockReasons.length > 0 ? reviewBlockReasons.join('\n') : undefined}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          Create Website
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </form>
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
        )}

        {result && (
          <div className="mt-8 text-center animate-fade-in bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Your website is ready!</h2>
              <p className="text-slate-500">Share this special moment with your loved one</p>
            </div>

            <a
              href={`/site/${result.website_name}`}
              className="inline-block mb-6 text-rose-600 underline text-lg hover:text-rose-700"
            >
              View Couple Page
            </a>

            <div className="mt-4">
              <img
                src={result.qr_code_url}
                alt="QR Code"
                className="mx-auto w-40 h-40 rounded-xl shadow-lg"
              />
            </div>

            <a
              href={result.qr_code_url}
              download
              className="inline-block mt-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl px-6 py-3 font-medium shadow-md hover:shadow-lg transition-all"
            >
              Download QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
