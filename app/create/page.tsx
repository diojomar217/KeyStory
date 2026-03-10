'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { 
  SiteConfig, 
  CreateOrderPayload, 
  Theme, 
  LayoutPreset, 
  Section,
  PreviewDevice,
  TimelineEvent 
} from '@/lib/types';
import { 
  BUILDER_STEPS, 
  THEME_PRESETS, 
  LAYOUT_PRESETS, 
  SECTION_TOGGLES,
  getDefaultSectionToggles 
} from '@/lib/builder-constants';

// Import new builder components
import { 
  BuilderStepNav,
  BuilderPreview,
  DevicePreviewToggle,
  ThemePresetCard,
  LayoutPresetCard,
  SectionTogglePanel,
  SmartContentHelpers,
  ReviewPublishPanel,
  DraftAutosave,
  ToastContainer,
  toast,
  TimelineEditor,
} from '@/components/builder';

// Types for form data
type LocalForm = Omit<CreateOrderPayload, 'config' | 'photos'> & { photos: File[] };

// Sanitize slug
const sanitizeSlug = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Validation for each step
const validateStep = (
  step: number,
  form: LocalForm,
  config: SiteConfig,
  sectionToggles: Record<Section, boolean>
): { valid: boolean; error?: string } => {
  // Get enabled sections
  const enabledSections = Object.entries(sectionToggles)
    .filter(([_, enabled]) => enabled)
    .map(([section]) => section as Section);

  switch (step) {
    case 1: // Couple Details
      if (!form.website_name.trim()) {
        return { valid: false, error: 'Website name is required' };
      }
      if (!/^[a-z0-9-]+$/.test(form.website_name)) {
        return { valid: false, error: 'Website name can only contain letters, numbers, and hyphens' };
      }
      if (!form.customer_name.trim()) {
        return { valid: false, error: 'Your name is required' };
      }
      if (!form.partner_name.trim()) {
        return { valid: false, error: "Partner's name is required" };
      }
      if (!form.anniversary_date) {
        return { valid: false, error: 'Anniversary date is required' };
      }
      return { valid: true };

    case 2: // Hero Section
      // Tagline is optional
      return { valid: true };

    case 3: // Love Letter
      // Message is optional if love_letter section is disabled
      if (sectionToggles.love_letter && !form.message.trim()) {
        return { valid: false, error: 'Love message is required when Love Letter section is enabled' };
      }
      return { valid: true };

    case 4: // Timeline
      if (sectionToggles.timeline && (!config.timeline_events || config.timeline_events.length === 0)) {
        return { valid: false, error: 'Timeline events are required when Timeline section is enabled' };
      }
      return { valid: true };

    case 5: // Gallery
      if (sectionToggles.gallery && form.photos.length === 0) {
        return { valid: false, error: 'At least one photo is required when Gallery section is enabled' };
      }
      return { valid: true };

    case 6: // Music
      // Song is optional
      return { valid: true };

    case 7: // Theme & Style
      if (!config.theme) {
        return { valid: false, error: 'Please select a theme' };
      }
      return { valid: true };

    case 8: // Review & Publish
      return { valid: true };

    default:
      return { valid: true };
  }
};

export default function CreatePage() {
  const router = useRouter();
  
  // Form state
  const [form, setForm] = useState<LocalForm>({
    website_name: '',
    customer_name: '',
    partner_name: '',
    anniversary_date: '',
    message: '',
    tagline: '',
    song_link: '',
    photos: [] as File[],
  });

  // Config state
  const [config, setConfig] = useState<SiteConfig>({
    theme: 'romantic_classic',
    layout_preset: 'elegant_story',
    sections: ['home'],
    timeline_events: [],
    cover_photo_index: undefined,
  });

  // Section toggles
  const [sectionToggles, setSectionToggles] = useState<Record<Section, boolean>>(getDefaultSectionToggles());

  // Photo previews
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Builder state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ slug: string; website_name: string; qr_code_url: string } | null>(null);
  
  // Preview state
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [slugSanitized, setSlugSanitized] = useState(false);

  // Autosave state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Smart defaults - Set random romantic tagline on first load
  useEffect(() => {
    const randomTagline = [
      "Every memory with you is my favorite.",
      "Our story written in moments.",
      "Forever started with you.",
      "A love story still being written.",
    ][Math.floor(Math.random() * 4)];
    setForm((prev) => ({ ...prev, tagline: randomTagline }));
  }, []);

  // Auto-sanitize website_name to slug format
  useEffect(() => {
    if (!slugSanitized && form.website_name) {
      const sanitized = sanitizeSlug(form.website_name);
      if (sanitized !== form.website_name) {
        setForm({ ...form, website_name: sanitized });
        setSlugSanitized(true);
      }
    }
  }, [form.website_name, slugSanitized]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [form, config, sectionToggles]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'website_name') {
      setSlugSanitized(false);
    }
  };

  const handleConfigChange = (newConfig: Partial<SiteConfig>) => {
    setConfig({ ...config, ...newConfig });
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 15) {
        toast.error('You can upload up to 15 images only.');
        setForm({ ...form, photos: files.slice(0, 15) });
        return;
      }
      const validImages = files.filter((f) => f.type.startsWith('image/'));
      if (validImages.length !== files.length) {
        toast.warning('Only image files are allowed.');
      }
      setForm({ ...form, photos: validImages });
      
      const newPreviews = validImages.map((file) => URL.createObjectURL(file));
      setPhotoPreviews(newPreviews);
      
      if (config.cover_photo_index !== undefined && config.cover_photo_index >= validImages.length) {
        setConfig({ ...config, cover_photo_index: undefined });
      }
    }
  };

  const handleCoverPhotoSelect = (index: number) => {
    setConfig({ ...config, cover_photo_index: index });
  };

  const handleSectionTogglesChange = (newToggles: Record<Section, boolean>) => {
    setSectionToggles(newToggles);
    // Update config.sections based on toggles
    const enabledSections = Object.entries(newToggles)
      .filter(([_, enabled]) => enabled)
      .map(([section]) => section as Section);
    setConfig({ ...config, sections: enabledSections });
  };

  // Navigation handlers
  const handleNext = () => {
    const validation = validateStep(currentStep, form, config, sectionToggles);
    if (!validation.valid) {
      setError(validation.error || 'Please complete this step');
      toast.error(validation.error || 'Please complete this step');
      return;
    }
    setError(null);
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      setHasUnsavedChanges(true);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep || completedSteps.includes(step - 1)) {
      setError(null);
      setCurrentStep(step);
    }
  };

  // Smart content handlers
  const handleSuggestTagline = (tagline: string) => {
    setForm({ ...form, tagline });
    toast.success('Tagline suggested!');
  };

  const handleSuggestLoveMessage = (message: string) => {
    setForm({ ...form, message });
    toast.success('Love message suggested!');
  };

  const handleGenerateTimeline = (events: TimelineEvent[]) => {
    setConfig({ ...config, timeline_events: events });
    toast.success(`${events.length} timeline events generated!`);
  };

  // Autosave handlers
  const handleRestoreDraft = (draft: any) => {
    setForm(draft.form);
    setConfig(draft.config);
    setCurrentStep(draft.currentStep);
    setCompletedSteps(draft.completedSteps);
    if (draft.config.section_toggles) {
      setSectionToggles(draft.config.section_toggles as Record<Section, boolean>);
    }
    toast.info('Draft restored!');
  };

  const handleSaveDraft = async () => {
    toast.success('Draft saved locally!');
    setHasUnsavedChanges(false);
  };

  // Core publish logic - reusable for both form submit and publish button
  const publishWebsite = async (): Promise<void> => {
    const validation = validateStep(5, form, config, sectionToggles);
    if (!validation.valid) {
      setError(validation.error || 'Please complete all required content');
      setCurrentStep(5);
      toast.error(validation.error || 'Please complete all required content');
      return;
    }

    setPublishing(true);

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

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          photos: photosBase64,
          config: {
            ...config,
            section_toggles: sectionToggles,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create');
      if (!data.slug) throw new Error('Missing slug from server');
      if (!data.website_name) throw new Error('Missing website name from server');
      if (!data.qr_code_url) throw new Error('Missing QR code from server');
      
      setResult({ slug: data.slug, website_name: data.website_name, qr_code_url: data.qr_code_url });
      toast.success('Your love website has been created! 💕');
      setHasUnsavedChanges(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save order. Please try again.');
      toast.error(err.message || 'Failed to create website. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  // Form submit handler - calls publishWebsite after preventing default
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await publishWebsite();
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Couple Details
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-4 shadow-lg shadow-rose-300/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Tell us about you both</h2>
              <p className="text-slate-500">Start building your love story by sharing some details</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  💍 What should we call your website?
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">yoursite.com/love/</span>
                  <input
                    name="website_name"
                    required
                    placeholder="john-and-jane"
                    value={form.website_name}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Only letters, numbers, and hyphens allowed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    👤 Your Name
                  </label>
                  <input
                    name="customer_name"
                    required
                    placeholder="Your name"
                    value={form.customer_name}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    💕 Partner's Name
                  </label>
                  <input
                    name="partner_name"
                    required
                    placeholder="Partner's name"
                    value={form.partner_name}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  📅 When is your anniversary?
                </label>
                <input
                  name="anniversary_date"
                  required
                  type="date"
                  value={form.anniversary_date}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Hero Section
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-4 shadow-lg shadow-rose-300/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Hero Section</h2>
              <p className="text-slate-500">Create a warm welcome for your visitors</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ✨ Hero Tagline <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  name="tagline"
                  maxLength={120}
                  placeholder="Every love story is beautiful, but ours is my favorite."
                  value={form.tagline}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-400 mt-1">
                  A short romantic line shown in the hero section. (Max 120 characters)
                </p>
              </div>
            </div>

            <SmartContentHelpers
              onSuggestTagline={handleSuggestTagline}
              onSuggestLoveMessage={() => {}}
              onGenerateTimeline={() => {}}
            />
          </div>
        );

      case 3: // Love Letter
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white mb-4 shadow-lg shadow-purple-300/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Love Letter</h2>
              <p className="text-slate-500">Write a heartfelt message for your partner</p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    💌 Your Love Message
                  </label>
                  {sectionToggles.love_letter && (
                    <span className="text-xs text-rose-500">* Required</span>
                  )}
                </div>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Write a heartfelt message for your partner..."
                  value={form.message}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all resize-none"
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Write something your partner will never forget
                </p>
              </div>
            </div>

            <SmartContentHelpers
              onSuggestTagline={() => {}}
              onSuggestLoveMessage={handleSuggestLoveMessage}
              onGenerateTimeline={() => {}}
            />
          </div>
        );

      case 4: // Timeline
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white mb-4 shadow-lg shadow-blue-300/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Timeline</h2>
              <p className="text-slate-500">Share your journey of love through time</p>
            </div>

            <TimelineEditor
              events={config.timeline_events || []}
              onChange={(timeline_events) => handleConfigChange({ timeline_events })}
            />

            <SmartContentHelpers
              onSuggestTagline={() => {}}
              onSuggestLoveMessage={() => {}}
              onGenerateTimeline={handleGenerateTimeline}
            />
          </div>
        );

      case 5: // Gallery
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white mb-4 shadow-lg shadow-pink-300/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Gallery</h2>
              <p className="text-slate-500">Upload your precious photos together</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📸 Upload Photos {sectionToggles.gallery && <span className="text-rose-500">*</span>}
              </label>
              <input
                name="photos"
                type="file"
                accept="image/*"
                multiple
                max={15}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition-all cursor-pointer"
                onChange={handlePhotos}
              />
              {form.photos.length > 0 && (
                <p className="text-sm text-emerald-600 mt-2">
                  ✅ {form.photos.length} photo(s) selected
                </p>
              )}
            </div>

            {form.photos.length > 0 && (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-5 border border-rose-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🖼️</span>
                  <label className="block font-semibold text-slate-700">
                    Select the photo that will welcome visitors first
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {photoPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        config.cover_photo_index === index
                          ? 'border-rose-500 ring-2 ring-rose-200 shadow-md'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                      onClick={() => handleCoverPhotoSelect(index)}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={preview}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {config.cover_photo_index === index && (
                          <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 shadow-md">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {config.cover_photo_index === undefined && (
                  <p className="text-xs text-slate-400 mt-3">
                    💡 First photo will be used as cover by default
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 6: // Music
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white mb-4 shadow-lg shadow-emerald-300/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Music</h2>
              <p className="text-slate-500">Add a special song that represents your relationship</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🎵 Your Special Song <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                name="song_link"
                placeholder="Spotify or YouTube link"
                value={form.song_link}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                onChange={handleChange}
              />
              <p className="text-xs text-slate-400 mt-1">
                Add a song that represents your relationship
              </p>
            </div>
          </div>
        );

      case 7: // Theme & Style
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-8">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-4 shadow-lg shadow-rose-300/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Theme & Style</h2>
              <p className="text-slate-500">Choose the perfect look for your love website</p>
            </div>

            {/* Section Toggles */}
            <SectionTogglePanel
              toggles={sectionToggles}
              onChange={handleSectionTogglesChange}
            />

            {/* Theme Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Choose Theme</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(THEME_PRESETS) as Theme[]).map((theme) => (
                  <ThemePresetCard
                    key={theme}
                    theme={theme}
                    isSelected={config.theme === theme}
                    onSelect={(t) => handleConfigChange({ theme: t })}
                  />
                ))}
              </div>
            </div>

            {/* Layout Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Choose Layout</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {LAYOUT_PRESETS.map((layout) => (
                  <LayoutPresetCard
                    key={layout.key}
                    layout={layout.key}
                    isSelected={config.layout_preset === layout.key}
                    onSelect={(l) => handleConfigChange({ layout_preset: l })}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 8: // Review & Publish
        return (
          <ReviewPublishPanel
            form={form}
            config={{ ...config, section_toggles: sectionToggles }}
            onSaveDraft={handleSaveDraft}
            onPublish={publishWebsite}
            isPublishing={publishing}
          />
        );

      default:
        return null;
    }
  };

  // Show success result
  if (result) {
    return (
      <div className="bg-gradient-to-b from-[#FFF7FB] to-[#FDF2F8] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center animate-fade-in bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Your website is ready! 💕</h2>
              <p className="text-slate-500">Share this special moment with your loved one</p>
            </div>

            <a
              href={`/love/${result.website_name}`}
              className="inline-block mb-6 text-rose-600 underline text-lg hover:text-rose-700"
            >
              View Couple Page 💝
            </a>

            <div className="mt-4">
              <img src={result.qr_code_url} alt="QR Code" className="mx-auto w-40 h-40 rounded-xl shadow-lg" />
            </div>
            <a
              href={result.qr_code_url}
              download
              className="inline-block mt-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl px-6 py-3 font-medium shadow-md hover:shadow-lg transition-all"
            >
              Download QR Code 📱
            </a>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#FFF7FB] to-[#FDF2F8] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                💕 Create Love Website
              </h1>
              <p className="text-sm text-slate-500">Step {currentStep} of 8</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Device Toggle */}
              <DevicePreviewToggle 
                device={previewDevice} 
                onChange={setPreviewDevice} 
              />
              
              {/* Mobile Preview Button */}
              <button
                onClick={() => setMobilePreviewOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Step Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sticky top-24">
              <BuilderStepNav
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
              />
              
              {/* Progress Bar */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((completedSteps.length / 8) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps.length / 8) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              {currentStep < 8 && (
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
                    <div></div>
                  )}

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Sidebar - Live Preview */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <BuilderPreview
                config={{ ...config, section_toggles: sectionToggles }}
                form={{
                  customer_name: form.customer_name,
                  partner_name: form.partner_name,
                  anniversary_date: form.anniversary_date,
                  tagline: form.tagline ?? "",
                  message: form.message,
                  song_link: form.song_link ?? "",
                }}
                photoPreviews={photoPreviews}
                device={previewDevice}
                isMobileOpen={mobilePreviewOpen}
                onMobileClose={() => setMobilePreviewOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

