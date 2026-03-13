'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SiteConfig, CreateOrderPayload } from '@/lib/types';
import { 
  WIZARD_STEPS, 
  TOTAL_STEPS, 
  validateStep, 
  validateAllSteps,
  getStepConfig 
} from '@/lib/builder-steps-config';
import { getTemplateSections, getSectionMetadata, getSectionTemplates } from '@/lib/section-registry';
import ThemeSelector from '@/components/builder/ThemeSelector';
import SectionSelector from '@/components/builder/SectionSelector';
import TemplateSelector from '@/components/builder/TemplateSelector';
import LayoutPresetSelector from '@/components/builder/LayoutPresetSelector';
import TimelineEditor from '@/components/builder/TimelineEditor';
import LivePreview from '@/components/builder/LivePreview';
import StepNavigator from '@/components/builder/StepNavigator';
import SummaryPanel from '@/components/builder/SummaryPanel';
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

type LocalForm = Omit<CreateOrderPayload, 'config' | 'photos'> & { photos: File[] };

const sanitizeSlug = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default function CreateWebsitePage() {
  const [form, setForm] = useState<LocalForm>({
    website_name: '',
    customer_name: '',
    partner_name: '',
    anniversary_date: '',
    message: '',
    tagline: '',
    song_link: '',
    photos: [],
  });

  const [config, setConfig] = useState<SiteConfig>({
    theme: 'romantic_classic',
    sections: ['home'],
    home_template: undefined,
    gallery_template: undefined,
    timeline_template: undefined,
    song_template: undefined,
    timeline_events: [],
    cover_photo_index: undefined,
    section_content: {},
  });

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    slug: string;
    website_name: string;
    qr_code_url: string;
  } | null>(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [slugSanitized, setSlugSanitized] = useState(false);
  const [explicitSubmit, setExplicitSubmit] = useState(false);

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
    };
  }, [photoPreviews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'website_name') {
      setSlugSanitized(false);
    }
  };

  const handleConfigChange = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
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

    const validImages = limitedFiles.filter((f) => f.type.startsWith('image/'));

    if (validImages.length !== limitedFiles.length) {
      setError('Only image files are allowed.');
    }

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

  // Handle section content changes for dynamic content step
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

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          photos: photosBase64,
          config,
        }),
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
              <h2 className="text-xl font-bold text-slate-800">
                {stepInfo?.title || 'Your Details'}
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Website Name (used in URL)
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
                <p className="text-xs text-slate-400 mt-1">
                  Only letters, numbers, and hyphens allowed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Your Name
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
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Partner&apos;s Name
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
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Anniversary Date
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

      case 2:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 md:p-8 space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold text-sm">
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
                {stepInfo?.title || 'Hero & Message'}
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Your Love Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Write a heartfelt message for your partner..."
                value={form.message}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all resize-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Hero Tagline
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

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Song Link (Optional)
              </label>
              <input
                name="song_link"
                placeholder="Spotify or YouTube link"
                value={form.song_link}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                onChange={handleChange}
              />
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

            <div className="mt-8 pt-6 border-t border-slate-200">
              <LayoutPresetSelector
                value={config.layout_preset}
                onChange={(layout_preset) => handleConfigChange({ layout_preset })}
              />
            </div>
          </div>
        );

      case 4:
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
onChange={(sections: import('@/lib/types').Section[]) => handleConfigChange({ sections })}
            />
          </div>
        );

      case 5:
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
                {config.sections.includes('home') && (
                  <TemplateSelector
                    section="home"
                    value={config.home_template}
                    onChange={(home_template) =>
                      handleConfigChange({ home_template: home_template as any })
                    }
                  />
                )}

                {config.sections.includes('gallery') && (
                  <TemplateSelector
                    section="gallery"
                    value={config.gallery_template}
                    onChange={(gallery_template) =>
                      handleConfigChange({ gallery_template: gallery_template as any })
                    }
                  />
                )}

                {config.sections.includes('timeline') && (
                  <TemplateSelector
                    section="timeline"
                    value={config.timeline_template}
                    onChange={(timeline_template) =>
                      handleConfigChange({ timeline_template: timeline_template as any })
                    }
                  />
                )}

                {config.sections.includes('song') && (
                  <TemplateSelector
                    section="song"
                    value={config.song_template}
                    onChange={(song_template) =>
                      handleConfigChange({ song_template: song_template as any })
                    }
                  />
                )}
              </div>
            )}
          </div>
        );

      case 6:
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

            {/* Media Content Section - Photos */}
            {(config.sections.includes('gallery') || config.sections.includes('polaroid_gallery')) && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">📸</span>
                  <h3 className="font-semibold text-slate-700">Photos</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Upload Photos {(config.sections.includes('gallery') || config.sections.includes('polaroid_gallery')) && <span className="text-rose-500">*</span>}
                  </label>

                  <input
                    name="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition-all cursor-pointer"
                    onChange={handlePhotos}
                  />

                  {form.photos.length > 0 && (
                    <p className="text-sm text-emerald-600 mt-2">
                      {form.photos.length} photo(s) selected
                    </p>
                  )}

                  {(config.sections.includes('gallery') || config.sections.includes('polaroid_gallery')) && form.photos.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Gallery section requires at least one photo
                    </p>
                  )}
                </div>

                {form.photos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <label className="block font-semibold text-slate-700">
                        Select Cover Photo
                      </label>
                    </div>

                    <p className="text-sm text-slate-500 mb-4">
                      Choose which photo to display in the hero section of your website.
                    </p>

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
                            <img src={preview} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
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
                  </div>
                )}
              </div>
            )}

            {/* Timeline Events */}
            {config.sections.includes('timeline') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">📅</span>
                  <h3 className="font-semibold text-slate-700">Timeline Events</h3>
                  <span className="text-rose-500">*</span>
                </div>

                <TimelineEditor
                  events={config.timeline_events || []}
                  onChange={(timeline_events) => handleConfigChange({ timeline_events })}
                />

                {config.timeline_events && config.timeline_events.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Timeline section requires at least one event
                  </p>
                )}
              </div>
            )}

            {/* Text Content Sections */}
            {config.sections.includes('love_letter') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💌</span>
                  <h3 className="font-semibold text-slate-700">Love Letter</h3>
                </div>
                <TextContentInput
                  label="Your Love Letter"
                  value={config.section_content?.love_letter?.content || ''}
                  onChange={(content) => handleSectionContentChange('love_letter', { content })}
                  placeholder="Write your heartfelt love letter here..."
                  rows={6}
                />
              </div>
            )}

            {config.sections.includes('our_story') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">📖</span>
                  <h3 className="font-semibold text-slate-700">Our Story</h3>
                </div>
                <TextContentInput
                  label="Your Love Story"
                  value={config.section_content?.our_story?.content || ''}
                  onChange={(content) => handleSectionContentChange('our_story', { content })}
                  placeholder="Share your relationship story..."
                  rows={6}
                />
              </div>
            )}

            {config.sections.includes('first_date') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🌹</span>
                  <h3 className="font-semibold text-slate-700">First Date</h3>
                </div>
                <FirstDateInput
                  value={config.section_content?.first_date}
                  onChange={(content) => handleSectionContentChange('first_date', content)}
                />
              </div>
            )}

            {/* List/Repeater Sections */}
            {config.sections.includes('reasons_love_you') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💖</span>
                  <h3 className="font-semibold text-slate-700">Reasons I Love You</h3>
                  <span className="text-rose-500">*</span>
                </div>
                <ReasonsILoveYouInput
                  value={config.section_content?.reasons_love_you}
                  onChange={(content) => handleSectionContentChange('reasons_love_you', content)}
                />
              </div>
            )}

            {config.sections.includes('future_dreams') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💭</span>
                  <h3 className="font-semibold text-slate-700">Future Dreams</h3>
                  <span className="text-rose-500">*</span>
                </div>
                <FutureDreamsInput
                  value={config.section_content?.future_dreams}
                  onChange={(content) => handleSectionContentChange('future_dreams', content)}
                />
              </div>
            )}

            {config.sections.includes('special_moments') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">⭐</span>
                  <h3 className="font-semibold text-slate-700">Special Moments</h3>
                </div>
                <SpecialMomentsInput
                  value={config.section_content?.special_moments}
                  onChange={(content) => handleSectionContentChange('special_moments', content)}
                />
              </div>
            )}

            {config.sections.includes('milestones') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏆</span>
                  <h3 className="font-semibold text-slate-700">Milestones</h3>
                </div>
                <MilestonesInput
                  value={config.section_content?.milestones}
                  onChange={(content) => handleSectionContentChange('milestones', content)}
                />
              </div>
            )}

            {config.sections.includes('video_memories') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎬</span>
                  <h3 className="font-semibold text-slate-700">Video Memories</h3>
                  <span className="text-rose-500">*</span>
                </div>
                <VideoMemoriesInput
                  value={config.section_content?.video_memories}
                  onChange={(content) => handleSectionContentChange('video_memories', content)}
                />
              </div>
            )}

            {/* Media Links */}
            {config.sections.includes('playlist') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎶</span>
                  <h3 className="font-semibold text-slate-700">Playlist</h3>
                  <span className="text-rose-500">*</span>
                </div>
                <PlaylistInput
                  value={config.section_content?.playlist}
                  onChange={(content) => handleSectionContentChange('playlist', content)}
                />
              </div>
            )}

            {/* Interactive Sections */}
            {config.sections.includes('quotes') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💕</span>
                  <h3 className="font-semibold text-slate-700">Love Quotes</h3>
                </div>
                <QuotesInput
                  value={config.section_content?.quotes}
                  onChange={(content) => handleSectionContentChange('quotes', content)}
                />
              </div>
            )}

            {config.sections.includes('memory_map') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🗺️</span>
                  <h3 className="font-semibold text-slate-700">Memory Map</h3>
                </div>
                <MemoryMapInput
                  value={config.section_content?.memory_map}
                  onChange={(content) => handleSectionContentChange('memory_map', content)}
                />
              </div>
            )}

            {config.sections.includes('letter_future') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">📮</span>
                  <h3 className="font-semibold text-slate-700">Letter to the Future</h3>
                </div>
                <LetterToFutureInput
                  value={config.section_content?.letter_future}
                  onChange={(content) => handleSectionContentChange('letter_future', content)}
                />
              </div>
            )}

            {config.sections.includes('surprise_message') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎉</span>
                  <h3 className="font-semibold text-slate-700">Surprise Message</h3>
                </div>
                <SurpriseMessageInput
                  value={config.section_content?.surprise_message}
                  onChange={(content) => handleSectionContentChange('surprise_message', content)}
                />
              </div>
            )}

            {config.sections.includes('gift_section') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎁</span>
                  <h3 className="font-semibold text-slate-700">Gift Section</h3>
                </div>
                <GiftSectionInput
                  value={config.section_content?.gift_section}
                  onChange={(content) => handleSectionContentChange('gift_section', content)}
                />
              </div>
            )}

            {config.sections.includes('guest_messages') && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💬</span>
                  <h3 className="font-semibold text-slate-700">Guest Messages</h3>
                </div>
                <GuestMessagesInput
                  value={config.section_content?.guest_messages}
                />
              </div>
            )}
          </div>
        );

      case 7:
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

            <SummaryPanel config={config} form={form} onEditSection={handleEditSection} />

            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
              <p className="text-sm text-rose-700">
                By clicking &quot;Create Your Love Website&quot;, you agree to create a beautiful
                memory site for your special someone.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FFF7FB] to-[#FDF2F8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-center mb-3 text-slate-800">
            Create Your Love Website
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
                      {currentStep === 6 ? 'Next: Review' : 'Continue'}
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
                      disabled={loading}
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
                          Create Your Love Website
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

<LivePreview
              config={config}
              coupleNames={{
                customer_name: form.customer_name,
                partner_name: form.partner_name,
              }}
              tagline={form.tagline}
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
              href={`/love/${result.website_name}`}
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