
"use client";

import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useRouter, useParams } from 'next/navigation';

import EditStepNav from '@/components/builder/EditStepNav';
import ThemeSelector from '@/components/builder/ThemeSelector';
import SectionSelector from '@/components/builder/SectionSelector';
import { calculateExpirationDate, getDaysRemaining, getExpirationLabel, ExpirationMode } from '@/lib/expiration-utils';
import TemplateSelector from '@/components/builder/TemplateSelector';
import TimelineEditor from '@/components/builder/TimelineEditor';
import SectionContentInputs from '@/components/builder/SectionContentInputs';
import SummaryPanel from '@/components/builder/SummaryPanel';
import LayoutPresetSelector from '@/components/builder/LayoutPresetSelector';
import type { SiteConfig, Section, SectionContentMap } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { DEFAULT_THEME } from '@/config/defaults';
import { Site } from '@/lib/supabase';
import { validateStep } from '@/lib/builder-steps-config';
import bcrypt from 'bcryptjs';

type LocalForm = {
  website_name: string;
  customer_name: string;
  partner_name: string;
  anniversary_date: string;
  specialDate: string;
  message: string;
  tagline: string;
  song_link: string;
  song_autoplay: boolean;
  photos: File[];
  existingPhotos: string[];
  heroPhoto?: File | null;
  heroPhotoIndex?: number;
  occasion: 'couple' | 'birthday';
  participants: { id: string; name: string; role?: string }[];
  password_input?: string;
  expires_at?: string;
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
      anniversary_date: '',
      specialDate: '',
      message: '',
      tagline: '',
      song_link: '',
      song_autoplay: false,
      photos: [],
      existingPhotos: [],
      occasion: 'couple',
      participants: [
        { id: 'customer', name: '', role: 'primary' },
        { id: 'partner', name: '', role: 'partner' },
      ],
      password_input: '',
    });

    const [config, setConfig] = useState<SiteConfig>({
      occasion: 'couple',
      theme: DEFAULT_THEME,
      sections: ['home'],
      home_template: undefined,
      gallery_template: undefined,
      timeline_template: undefined,
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

  const [expirationMode, setExpirationMode] = useState<'3_months'|'6_months'|'1_year'|'custom'>('6_months');
  const [customExpirationDate, setCustomExpirationDate] = useState('');

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

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin?id=${id}`);
      const data = await res.json();

      if (data.site || data.order) {
        const site: Site = (data.site || data.order) as Site;
        // Safely extract tagline - it could be in config or at top level
        const taglineValue = typeof site.tagline === 'string' 
          ? site.tagline 
          : (typeof site.config?.tagline === 'string' ? site.config.tagline : '');

        const customerName = site.config?.people?.primary || site.customer_name || '';
        const partnerName = site.config?.people?.secondary || site.partner_name || '';
        const anniversaryDateValue = site.config?.dates?.special_date || site.specialDate || site.anniversary_date || '';

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
        setForm({
          website_name: site.website_name || site.slug || '',
          customer_name: customerName,
          partner_name: partnerName,
          anniversary_date: anniversaryDateValue,
          specialDate: anniversaryDateValue,
          message: site.config?.message || site.message || '',
          tagline: taglineValue,
          song_link: site.config?.media?.song_link || site.song_link || '',
          song_autoplay: site.config?.media?.song_autoplay ?? false,
          photos: [],
          existingPhotos: site.config?.media?.photos || site.photos || [],
          heroPhoto: null,
          heroPhotoIndex: site.config?.hero?.coverPhotoIndex,
          occasion: loadedOccasion,
          participants: [
            { id: 'customer', name: customerName, role: 'primary' },
            { id: 'partner', name: partnerName, role: 'partner' },
          ],
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
        const homeTemplateValue = site.config?.home_template || siteAny.home_template;
        const galleryTemplateValue = site.config?.gallery_template || siteAny.gallery_template;
        const timelineTemplateValue = site.config?.timeline_template || siteAny.timeline_template;
        // Fallback: If song_template is missing, try playlist_template (legacy/old data)
        let songTemplateValue = site.config?.song_template || siteAny.song_template;
        if (!songTemplateValue && (site.config?.playlist_template || siteAny.playlist_template)) {
          songTemplateValue = site.config?.playlist_template || siteAny.playlist_template;
        }

        // Debug: Log loaded config and template values
        console.log('[EditWebsitePage] Loaded config from DB:', {
          homeTemplateValue,
          galleryTemplateValue,
          timelineTemplateValue,
          songTemplateValue,
          config: site.config,
          siteAny,
          sectionsValue,
        });

        // Safely extract timeline events
        const timelineEventsValue = Array.isArray(site.config?.timeline_events)
          ? site.config.timeline_events
          : (Array.isArray(siteAny.timeline_events) ? siteAny.timeline_events : []);
        // Safely extract cover photo index (only from config)
        const coverPhotoIndexValue = typeof site.config?.cover_photo_index === 'number'
          ? site.config.cover_photo_index
          : undefined;
        // Safely extract section_content (new feature)
        const sectionContentValue = site.config?.section_content || {};

        // Set config and selectedPresetId from loaded data (define configPatch only once)
        const configPatch: any = {
          occasion: loadedOccasion as 'couple' | 'birthday',
          theme: (site.config?.theme || siteAny.theme) as ThemeKey || DEFAULT_THEME,
          sections: sectionsValue,
          home_template: homeTemplateValue as SiteConfig['home_template'],
          gallery_template: galleryTemplateValue as SiteConfig['gallery_template'],
          timeline_template: timelineTemplateValue as SiteConfig['timeline_template'],
          song_template: songTemplateValue as SiteConfig['song_template'],
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
        if (sectionsValue.includes('playlist')) {
          configPatch.playlist_template = songTemplateValue;
        }

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
              (!templates.home || templates.home === configPatch.home_template) &&
              (!templates.gallery || templates.gallery === configPatch.gallery_template) &&
              (!templates.timeline || templates.timeline === configPatch.timeline_template) &&
              (!templates.song || templates.song === configPatch.song_template);
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

        setPhotoPreviews(site.photos || []);

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Separate handler for <select> elements to fix TS error
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    // Always keep gallery section_content in sync with all gallery images (existing + new)
    setConfig((prev) => {
      const allGallery = [
        ...(form.existingPhotos || []),
        ...newPreviews,
      ];
      return {
        ...prev,
        section_content: {
          ...prev.section_content,
          gallery: { photos: allGallery },
        },
      };
    });

    if (config.cover_photo_index !== undefined && config.cover_photo_index >= validImages.length) {
      setConfig({ ...config, cover_photo_index: undefined });
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
      return;
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
      const normalizedConfig = { ...config };
      if (normalizedConfig?.hero?.coverPhotoUrl?.startsWith('blob:')) {
        delete normalizedConfig.hero.coverPhotoUrl;
      }
      if (passwordEnabled) {
        let hash = undefined;
        if (form.password_input && form.password_input.trim().length >= 4 && form.password_input.trim().length <= 6) {
          hash = bcrypt.hashSync(form.password_input.trim(), 8);
        }
        normalizedConfig.password = { enabled: true, ...(hash ? { hash } : {}) };
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

      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          website_name: form.website_name,
          site_type: config.occasion,
          occasion: config.occasion,
          customer_name: form.customer_name,
          partner_name: form.partner_name,
          specialDate: form.specialDate || form.anniversary_date,
          anniversary_date: form.specialDate || form.anniversary_date,
          message: form.message,
          tagline: form.tagline,
          song_link: form.song_link,
          song_autoplay: form.song_autoplay,
          photos: allPhotos,
          config: normalizedConfig,
          password_input: form.password_input,
          expires_at: expiresAt,
          hero_photo: heroPhotoBase64,
        }),
      });

      let resultData = null;
      try {
        const text = await res.text();
        resultData = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error('Failed to parse server response as JSON', err);
        resultData = null;
      }

      if (res.ok) {
        if (resultData?.warnings?.length) {
          setWarning(`Update completed with warnings: ${resultData.warnings.join('; ')}`);
        } else {
          setWarning(null);
        }
        setSuccess(true);
      } else {
        let errorMessage = res.statusText || 'Server error (500)';

        if (resultData) {
          errorMessage = resultData?.message || resultData?.error || errorMessage;
          if (resultData?.warnings?.length) {
            setWarning(`Upload warnings: ${resultData.warnings.join('; ')}`);
          }
        }

        setError(`Update failed: ${errorMessage}`);
        return;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        const { getPresetsForOccasion, getPresetById } = require('@/lib/preset-registry');
        const applyPreset = (presetId: string) => {
          const preset = getPresetById(presetId);
          if (!preset) return;
          setSelectedPresetId(presetId);
          setForm((prev: any) => ({
            ...prev,
            occasion: preset.siteType,
            preset_id: preset.id,
            tagline: preset.defaults.copy?.tagline || prev.tagline,
            message: preset.defaults.copy?.message || prev.message,
          }));
          setConfig((prev: any) => ({
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
                  Basic Information
                </h2>
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
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                >
                  <option value="couple">💑 Romantic Couple</option>
                  <option value="birthday">🎂 Birthday Celebration</option>
                </select>
              </div>
              <div className="mt-4">
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
                        Partner's Name
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
                Choose Style
              </h2>
            </div>


            <ThemeSelector
              value={config.theme as ThemeKey}
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
                    {/* Debug log moved out of JSX */}
                    {(() => { console.log('[DEBUG] Render LayoutPresetSelector', { selectedPresetId, layout_preset: config.layout_preset }); return null; })()}
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Select Website Sections</h2>
            <SectionSelector
              value={config.sections}
              siteType={config.occasion || 'couple'}
              onChange={(sections) => {
                // When sections change, reset templates for removed sections (match Create flow)
                const prevSections = config.sections || [];
                const removedSections = prevSections.filter((s) => !sections.includes(s));
                const newConfig = { ...config, sections };
                removedSections.forEach((sectionKey) => {
                  const key = `${sectionKey}_template` as keyof SiteConfig;
                  if ((newConfig as any)[key] !== undefined) {
                    delete (newConfig as any)[key];
                  }
                });
                handleConfigChange(newConfig);
              }}
            />
          </div>
        );

      case 4:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Choose Templates</h2>
            {config.sections.length === 0 ? (
              <p className="text-slate-500">Please select sections in step 3 first.</p>
            ) : (
              <div className="space-y-6">
                {config.sections.map((sectionKey) => {
                  // Only render TemplateSelector if templates exist for this section
                  const { getTemplatesForSection } = require('@/config/templateConfig');
                  const templates = getTemplatesForSection(sectionKey);
                  if (!templates.length) return null;
                  console.log('[DEBUG] Render TemplateSelector', {
                    sectionKey,
                    selectedPresetId,
                    templateValue: config[`${sectionKey}_template` as keyof typeof config],
                  });
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
        // Debug: Log photoPreviews whenever this step renders
        console.log('DEBUG: photoPreviews passed to SectionContentInputs:', photoPreviews);
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Add Your Content</h2>
            {/* Only SectionContentInputs, matching Create flow */}
            <SectionContentInputs
              config={config}
              onSectionContentChange={(sectionKey: string, content: any) => handleSectionContentChange(sectionKey as keyof SectionContentMap, content)}
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
          </div>
        );

      case 6:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Review</h2>
            <SummaryPanel
              config={config}
              form={form}
              onEditSection={(step) => setCurrentStep(step)}
            />
          </div>
        );

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Website</h1>
          <p className="text-slate-500 mt-1">Update website configuration</p>
        </div>
        <a href="/admin/websites" className="text-rose-600 hover:text-rose-700 font-medium">
          ← Back to Websites
        </a>
      </div>

{/* Edit Steps Navigation */}
      <EditStepNav 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
        onStepClick={(step) => {
          if (step < currentStep || completedSteps.includes(step - 1)) {
            setCurrentStep(step);
            setError(null);
          }
        }} 
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {warning && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg">
          {warning}
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        {renderStepContent()}

        <div className="flex justify-between mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700"
            >
              {currentStep === 5 ? 'Next: Review' : 'Continue'}
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

