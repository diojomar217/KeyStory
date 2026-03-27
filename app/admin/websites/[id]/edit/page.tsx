'use client';

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
import { SiteConfig, Theme, Section, SectionContentMap } from '@/lib/types';
import { Site } from '@/lib/supabase';

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


const MAX_IMAGE_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB



const validateStep = (
  step: number,
  form: LocalForm,
  config: SiteConfig
): { valid: boolean; error?: string } => {
  // TODO: Implement validation logic or restore previous implementation
  return { valid: true };
};



export default function EditWebsitePage() {
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
    occasion: 'couple' as const,
    theme: 'romantic_classic',
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
          occasion: occasionValue,
          participants: [
            { id: 'customer', name: customerName, role: 'primary' },
            { id: 'partner', name: partnerName, role: 'partner' },
          ],
          password_input: '',
          expires_at: site.expires_at || undefined,
        });

        setExpirationMode(computedMode);
        setCustomExpirationDate(computedCustomDate);

        setPhotoPreviews(site.photos || []);

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

        setConfig({
          occasion: occasionValue as 'couple' | 'birthday',
          theme: (site.config?.theme || siteAny.theme) as Theme || 'romantic_classic',
          sections: sectionsValue,
          home_template: homeTemplateValue as SiteConfig['home_template'],
          gallery_template: galleryTemplateValue as SiteConfig['gallery_template'],
          timeline_template: timelineTemplateValue as SiteConfig['timeline_template'],
          timeline_events: timelineEventsValue as SiteConfig['timeline_events'],
          cover_photo_index: coverPhotoIndexValue,
          section_content: sectionContentValue,
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
        });

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

    const newPreviews = validImages.map((file) => URL.createObjectURL(file));
    setPhotoPreviews([...form.existingPhotos, ...newPreviews]);

    if (config.cover_photo_index !== undefined && config.cover_photo_index >= validImages.length + form.existingPhotos.length) {
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
        normalizedConfig.password = { enabled: true };
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

      const resultData = await res.json().catch((err) => {
        console.error('Failed to parse server response as JSON', err);
        return null;
      });

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
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website Name</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">yoursite.com/site/</span>
                  <input
                    name="website_name"
                    required
                    value={form.website_name}
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {config.occasion === 'couple' ? 'Your Name' : 'Celebrant Name'}
                  </label>
                  <input
                    name="customer_name"
                    required
                    value={form.customer_name}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    onChange={handleChange}
                  />
                </div>
                {config.occasion === 'couple' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Partner's Name</label>
                    <input
                      name="partner_name"
                      required
                      value={form.partner_name}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Special Date</label>
                <input
                  name="specialDate"
                  required
                  type="date"
                  value={form.specialDate}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  onChange={handleChange}
                />
              </div>

              <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Hosting Duration</h3>
                <div className="grid grid-cols-1 gap-2">
                  {(['3_months','6_months','1_year','custom'] as ExpirationMode[]).map((mode) => (
                    <label key={mode} className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="expiration_mode"
                        checked={expirationMode === mode}
                        onChange={() => setExpirationMode(mode)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm text-slate-700">
                        {mode === '3_months' && '3 Months'}
                        {mode === '6_months' && '6 Months'}
                        {mode === '1_year' && '1 Year'}
                        {mode === 'custom' && 'Custom Expiration Date'}
                      </span>
                    </label>
                  ))}
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

              <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Privacy Settings</h3>
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
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password (4-6 chars)</label>
                    <div className="flex items-center gap-2">
                      <input
                        name="password_input"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password_input || ''}
                        minLength={4}
                        maxLength={6}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-rose-600 hover:text-rose-700"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );


      case 2:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Choose Your Theme</h2>
            <ThemeSelector value={config.theme} onChange={(theme) => handleConfigChange({ theme })} />
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Select Website Sections</h2>
            <SectionSelector
              value={config.sections}
              occasion={config.occasion || 'couple'}
              onChange={(sections) => handleConfigChange({ sections })}
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
                {config.sections.includes('home') && (
                  <TemplateSelector
                    section="home"
                    value={config.home_template}
                    onChange={(home_template) => handleConfigChange({ home_template: home_template as any })}
                  />
                )}
                {config.sections.includes('gallery') && (
                  <TemplateSelector
                    section="gallery"
                    value={config.gallery_template}
                    onChange={(gallery_template) => handleConfigChange({ gallery_template: gallery_template as any })}
                  />
                )}
                {config.sections.includes('timeline') && (
                  <TemplateSelector
                    section="timeline"
                    value={config.timeline_template}
                    onChange={(timeline_template) => handleConfigChange({ timeline_template: timeline_template as any })}
                  />
                )}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Add Your Content</h2>

            {config.sections.includes('home') && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Hero Tagline</h3>
                <input
                  name="tagline"
                  maxLength={120}
                  placeholder="Every love story is beautiful, but ours is my favorite."
                  value={form.tagline}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-400 mt-1">A short romantic line shown in the hero section. (Max 120 characters)</p>
              </div>
            )}

            {config.sections.includes('love_letter') && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Your Love Message</h3>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Write a heartfelt message for your partner..."
                  value={form.message}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all resize-none"
                  onChange={handleChange}
                />
              </div>
            )}

            {config.sections.includes('song') && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Song Link (Optional)</h3>
                <input
                  name="song_link"
                  value={form.song_link}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                  onChange={handleChange}
                />

                <div className="mt-3 flex items-center gap-2">
                  <input
                    id="song_autoplay"
                    name="song_autoplay"
                    type="checkbox"
                    checked={!!form.song_autoplay}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                  />
                  <label htmlFor="song_autoplay" className="text-sm text-slate-600">
                    Auto-play song when page loads
                  </label>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Dedicated Hero Cover Photo</h3>
              <p className="text-xs text-slate-500 mb-2">Optional: set a hero cover photo independent from gallery photos.</p>

              <input
                name="hero_photo"
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition-all cursor-pointer"
                onChange={handleHeroPhotoUpload}
              />
              <p className="text-xs text-slate-400 mt-1">Hero images are auto-optimized (1920px max, auto format/quality). High quality remains for your main display.</p>

              {heroPhotoPreview && (
                <div className="mt-3 relative border border-slate-200 rounded-lg overflow-hidden" style={{ height: 240 }}>
                  <Cropper
                    image={heroPhotoPreview}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                    cropShape="rect"
                    showGrid={true}
                    style={{ containerStyle: { width: '100%', height: 240 } }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (heroPhotoPreview) URL.revokeObjectURL(heroPhotoPreview);
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
                      }}
                      className="bg-black/40 text-white text-xs px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                    <label className="text-xs text-white bg-black/40 px-2 py-1 rounded">Zoom</label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {(form.photos.length > 0 || form.existingPhotos.length > 0) && (
                <div className="mt-3">
                  <p className="text-xs text-slate-600 mb-2">Or select from uploaded photos</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {photoPreviews.map((preview, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => handleHeroPhotoSelect(index)}
                        className={`border rounded-lg overflow-hidden ${config.hero?.coverPhotoIndex === index ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-200'}`}
                      >
                        <img src={preview} alt={`Hero option ${index + 1}`} className="w-full h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {config.hero?.coverPhotoIndex !== undefined && !heroPhotoPreview && (
                <p className="text-xs text-emerald-600 mt-2">Hero cover currently set to photo {config.hero.coverPhotoIndex + 1}</p>
              )}
            </div>

            {(config.sections.includes('gallery') || config.sections.includes('polaroid_gallery')) && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Photos <span className="text-rose-500">*</span>
                </label>
                <input
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50"
                  onChange={handlePhotos}
                />
                <p className="text-xs text-slate-400 mt-1">Gallery images are auto-optimized (1600px max, auto format/quality) for fast site performance.</p>
                {(form.photos.length > 0 || form.existingPhotos.length > 0) && (
                  <p className="text-sm text-emerald-600 mt-2">
                    {form.existingPhotos.length} existing + {form.photos.length} new = {form.existingPhotos.length + form.photos.length} total photo(s)
                  </p>
                )}
              </div>
            )}

            {photoPreviews.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Select Cover Photo</label>
                <div className="grid grid-cols-5 gap-3">
                  {photoPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                        config.cover_photo_index === index ? 'border-rose-500' : 'border-slate-200'
                      }`}
                      onClick={() => handleCoverPhotoSelect(index)}
                    >
                      <img src={preview} alt={`Photo ${index + 1}`} className="w-full aspect-square object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {config.sections.includes('timeline') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Timeline Events <span className="text-rose-500">*</span></label>
                <TimelineEditor
                  events={config.timeline_events || []}
                  onChange={(timeline_events) => handleConfigChange({ timeline_events })}
                />
              </div>
            )}

            {/* Dynamic Section Content Inputs */}
            <SectionContentInputs
              config={config}
              onSectionContentChange={handleSectionContentChange}
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

