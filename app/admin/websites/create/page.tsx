'use client';

import { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useRouter } from 'next/navigation';

import { SiteConfig, CreateOrderPayload, OccasionType, Theme } from '@/lib/types';
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


type LocalForm = Omit<CreateOrderPayload, 'config' | 'photos'> & { occasion: OccasionType; photos: File[]; heroPhoto?: File | null; heroPhotoIndex?: number; song_autoplay?: boolean; password_input?: string };

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
  const validOccasions: OccasionType[] = ['couple', 'wedding', 'birthday', 'proposal', 'anniversary'];
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
        message: '',
        tagline: '',
        song_link: '',
        song_autoplay: false,
        photos: [],
        password_input: '',
      },
      config: {
        occasion: 'couple' as OccasionType,
        theme: 'romantic_classic',
        sections: [],
        home_template: undefined,
        gallery_template: undefined,
        timeline_template: undefined,
        song_template: undefined,
        timeline_events: [],
        cover_photo_index: undefined,
        section_content: {},
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
    message: '',
    tagline: '',
    song_link: '',
    song_autoplay: false,
    photos: [],
    password_input: '',
  };
  const validThemes: Theme[] = [
    'romantic_classic', 'cute_pastel', 'minimal_modern', 'dark_elegant', 'soft_pastel',
    'elegant_rose_gold', 'vintage_love_letter', 'scrapbook_memories', 'wedding_style',
    'floral_romance', 'dreamy_pink', 'luxury_gold', 'minimal_white', 'cute_kawaii',
    'soft_lavender', 'photo_focus', 'colorful_celebration'
  ];
  let initialConfig: SiteConfig = {
    occasion: 'couple',
    theme: 'romantic_classic' as Theme,
    sections: [],
    home_template: undefined,
    gallery_template: undefined,
    timeline_template: undefined,
    song_template: undefined,
    timeline_events: [],
    cover_photo_index: undefined,
    section_content: {},
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
          console.warn('Invalid theme in draft, falling back to romantic_classic:', parsedTheme);
          parsedTheme = 'romantic_classic';
        }
        const parsedConfig: SiteConfig = {
          occasion: validOccasions.includes(parsed.config.occasion) ? parsed.config.occasion : 'couple',
          theme: parsedTheme as Theme,
          sections: Array.isArray(parsed.config.sections) ? parsed.config.sections : [],
          home_template: parsed.config.home_template,
          gallery_template: parsed.config.gallery_template,
          timeline_template: parsed.config.timeline_template,
          song_template: parsed.config.song_template,
          timeline_events: Array.isArray(parsed.config.timeline_events) ? parsed.config.timeline_events : [],
          cover_photo_index: parsed.config.cover_photo_index,
          section_content: parsed.config.section_content || {},
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
  // ...existing code...
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialCompleted);
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
  const [explicitSubmit, setExplicitSubmit] = useState(false);
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
      occasion: form.occasion,
      participants: form.participants,
      message: form.message,
      tagline: form.tagline,
      specialDate: form.specialDate,
      media: {
        ...(prev.media || {}),
        song_link: form.song_link,
        song_autoplay: !!form.song_autoplay,
      },
    }));
  }, [form.occasion, form.participants, form.message, form.tagline, form.specialDate, form.song_link, form.song_autoplay]);

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
      setSelectedPresetId(null);
      setForm((prev) => ({ ...prev, occasion: value as any, preset_id: undefined }));
      // Set config defaults for new site type
      const defaults = getDefaultSelections(value as string);
      setConfig((prev) => ({
        ...prev,
        occasion: value as any,
        theme: defaults.defaultTheme || prev.theme,
        sections: defaults.defaultSections || [],
        ...defaults.defaultTemplates,
      }));
    } else if (name === 'specialDate') {
      setForm((prev) => ({ ...prev, specialDate: value as string }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value as any }));
    }
  };

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
    setForm((prev) => ({
      ...prev,
      occasion: preset.siteType,
      preset_id: preset.id,
      tagline: preset.defaults.copy?.tagline || prev.tagline,
      message: preset.defaults.copy?.message || prev.message,
    }));

    setConfig((prev) => ({
      ...prev,
      occasion: preset.siteType,
      preset: { id: preset.id, label: preset.label },
      theme: preset.defaults.theme,
      layout_preset: preset.defaults.layout_preset,
      sections: preset.defaults.sections,
      home_template: preset.defaults.templates.home,
      gallery_template: preset.defaults.templates.gallery,
      timeline_template: preset.defaults.templates.timeline,
      song_template: preset.defaults.templates.song,
      tagline: preset.defaults.copy?.tagline || prev.tagline,
      message: preset.defaults.copy?.message || prev.message,
    }));
  };


  // Handle section content changes for dynamic content step
  function handleSectionContentChange(sectionKey: string, content: any) {
    setConfig((prev) => ({
      ...prev,
      section_content: {
        ...prev.section_content,
        [sectionKey]: content,
      },
    }));
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
    if (!explicitSubmit) return;

    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const validation = validateStep(step, form, config);
      if (!validation.valid) {
        setError(validation.error || 'Please complete all required content');
        setCurrentStep(step);
        setExplicitSubmit(false);
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
      if (normalizedConfig.hero?.coverPhotoUrl?.startsWith('blob:')) {
        delete normalizedConfig.hero.coverPhotoUrl;
      }
      if (passwordEnabled) {
        normalizedConfig.password = { enabled: true };
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

      const payload: any = {
        ...form,
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
      setExplicitSubmit(false);
    }
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
                  <option value="couple">💕 Romantic Couple</option>
                  <option value="birthday">🎂 Birthday Celebration</option>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    {form.occasion === 'couple' ? 'Your Name' : 'Celebrant Name'}
                  </label>
                  <input
                    name="participants.0.name"
                    required
                    placeholder={form.occasion === 'couple' ? 'Your name' : 'Celebrant name'}
                    value={form.participants?.[0]?.name || ''}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                    onChange={(e) => {
                      const newParticipants = [...(form.participants || [{id: '0', name: ''}])];
                      newParticipants[0] = { ...newParticipants[0], name: e.target.value };
                      setForm({...form, participants: newParticipants});
                    }}
                  />
                </div>

                <div>
                  {form.occasion === 'couple' && (
                    <>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">
                        Partner&apos;s Name
                      </label>
                      <input
                        name="participants.1.name"
                        required
                        placeholder="Partner's name"
                        value={form.participants?.[1]?.name || ''}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                        onChange={(e) => {
                          const newParticipants = [...(form.participants || [{id: '0', name: ''}, {id: '1', name: ''}])];
                          newParticipants[1] = { ...newParticipants[1], name: e.target.value };
                          setForm({...form, participants: newParticipants});
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  {form.occasion === 'couple' ? 'Anniversary Date' : 'Birth Date'}
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
              value={config.theme}
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
                      onChange={(layout_preset) => handleConfigChange({ layout_preset })}
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
                  const key = `${sectionKey}_template` as keyof typeof newConfig;
                  if (newConfig[key] !== undefined) {
                    delete newConfig[key];
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
                  // Only render TemplateSelector if templates exist for this section
                  // Import getTemplatesForSection from config/templateConfig
                  // (import at top if not already)
                  const { getTemplatesForSection } = require('@/config/templateConfig');
                  const templates = getTemplatesForSection(sectionKey);
                  if (!templates.length) return null;
                  return (
                    <TemplateSelector
                      key={sectionKey}
                      section={sectionKey}
                      value={config[`${sectionKey}_template` as keyof typeof config] as string}
                      onChange={(templateKey: string) =>
                        handleConfigChange({ [`${sectionKey}_template`]: templateKey })
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

                <SectionContentInputs
                  config={config}
                  onSectionContentChange={handleSectionContentChange}
                  validationErrors={(() => {
                    // Compute validation errors for required sections
                    const errors: Record<string, boolean> = {};
                    const { sections = [], section_content = {} } = config;
                    // Use SECTION_CONFIG for required info
                    const sectionMeta: Record<string, any> = {};
                    require('@/config/sectionConfig').SECTION_CONFIG.forEach((s: any) => (sectionMeta[s.key] = s));
                    sections.forEach((key: string) => {
                      const meta = sectionMeta[key];
                      if (meta?.required) {
                        // Gallery: must have at least 1 photo (use config.photos)
                        if (key === 'gallery' && (!form.photos || !Array.isArray(form.photos) || form.photos.length === 0)) {
                          errors[key] = true;
                        }
                        // Timeline: must have at least 1 event (use config.timeline_events)
                        else if (key === 'timeline' && (!config.timeline_events || !Array.isArray(config.timeline_events) || config.timeline_events.length === 0)) {
                          errors[key] = true;
                        }
                        // Love Letter: must have content
                        else if (key === 'love_letter' && (!section_content.love_letter || !section_content.love_letter.content || !section_content.love_letter.content.trim())) {
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
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {stepInfo?.title || 'Review'}
              </h2>
            </div>

            {/* Only show song summary if song section is selected */}

            {/* Review summary with validation state reporting */}
            <SummaryPanel
              config={{
                ...config,
                song_template: config.sections.includes('song') ? config.song_template : undefined,
              }}
              form={form}
              onEditSection={handleEditSection}
              showValidationSummary={true}
              onValidationStateChange={({ isBlocked, reasons }) => {
                setReviewBlocked(isBlocked);
                setReviewBlockReasons(reasons);
              }}
            />

            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
              {reviewBlocked && reviewBlockReasons.length > 0 ? (
                <div className="text-rose-700 text-sm">
                  <strong>Cannot submit:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {reviewBlockReasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-rose-700">
                  By clicking &quot;Create Website&quot;, you agree to create a beautiful
                  memory site for your special someone.
                </p>
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
      {/* Draft warning and controls */}
      {draftExists && (
        <div className="max-w-2xl mx-auto mt-6 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 shadow">
          <span className="text-amber-700 font-medium text-center sm:text-left flex-1">A draft was detected. You can continue editing, or start from new.</span>
          <div className="flex justify-center sm:justify-end w-full sm:w-auto">
            <button
              onClick={handleClearDraft}
              className="px-4 py-2 bg-white border border-amber-300 rounded-lg text-amber-700 font-semibold hover:bg-amber-100 transition shadow-sm"
            >
              Start from New (Drop Draft)
            </button>
          </div>
        </div>
      )}
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
                      onClick={() => {
                        setExplicitSubmit(true);
                        handleSubmit();
                      }}
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
                customer_name: form.customer_name ?? form.participants?.[0]?.name ?? '',
                partner_name: form.partner_name ?? form.participants?.[1]?.name ?? '',
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
