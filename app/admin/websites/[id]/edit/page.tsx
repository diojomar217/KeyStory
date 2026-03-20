'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  occasion: 'couple' | 'birthday';
  participants: { id: string; name: string; role?: string }[];
  password_input?: string;
  expires_at?: string;
};

const validateStep = (
  step: number,
  form: LocalForm,
  config: SiteConfig
): { valid: boolean; error?: string } => {
  switch (step) {
    case 1:
      if (!form.website_name.trim()) {
        return { valid: false, error: 'Website name is required' };
      }
      if (!form.customer_name.trim()) {
        return { valid: false, error: config.occasion === 'couple' ? 'Your name is required' : 'Celebrant name is required' };
      }
      if (config.occasion === 'couple' && !form.partner_name.trim()) {
        return { valid: false, error: "Partner's name is required" };
      }
      if (!form.specialDate && !form.anniversary_date) {
        return { valid: false, error: config.occasion === 'couple' ? 'Anniversary date is required' : 'Birth date is required' };
      }

      if (config?.password?.enabled) {
        if (!form.password_input?.trim()) {
          return { valid: false, error: 'Password is required when protection is enabled' };
        }
        const len = form.password_input.trim().length;
        if (len < 4 || len > 6) {
          return { valid: false, error: 'Password must be 4 to 6 characters long' };
        }
      }

      return { valid: true };

    case 2:
      if (!config.theme) {
        return { valid: false, error: 'Please select a theme' };
      }
      return { valid: true };

    case 3:
      if (config.sections.length === 0) {
        return { valid: false, error: 'Please select at least one section' };
      }
      return { valid: true };

    case 4:
      if (config.sections.includes('home') && !config.home_template) {
        return { valid: false, error: 'Please select a home template' };
      }
      if (config.sections.includes('gallery') && !config.gallery_template) {
        return { valid: false, error: 'Please select a gallery template' };
      }
      if (config.sections.includes('timeline') && !config.timeline_template) {
        return { valid: false, error: 'Please select a timeline template' };
      }
      return { valid: true };

    case 5:
      const sections = config.sections || [];
      const sectionContent = config.section_content || {};

      // Gallery requires photos (existing or new)
      if (sections.includes('gallery') && form.photos.length === 0 && form.existingPhotos.length === 0) {
        return { valid: false, error: 'Please upload at least one photo for the gallery section' };
      }

      // Timeline requires events
      if (sections.includes('timeline') && (!config.timeline_events || config.timeline_events.length === 0)) {
        return { valid: false, error: 'Please add at least one event for the timeline section' };
      }

      // Love Letter requires text content (if section content exists)
      if (sections.includes('love_letter') && sectionContent.love_letter) {
        const loveLetterContent = sectionContent.love_letter.content || '';
        if (!loveLetterContent.trim()) {
          return { valid: false, error: 'Love Letter section requires content' };
        }
      }

      // Our Story requires text content (if section content exists)
      if (sections.includes('our_story') && sectionContent.our_story) {
        const storyContent = sectionContent.our_story.content || '';
        if (!storyContent.trim()) {
          return { valid: false, error: 'Our Story section requires content' };
        }
      }

      // Reasons I Love You requires at least one reason (if section content exists)
      if (sections.includes('reasons_love_you') && sectionContent.reasons_love_you) {
        const reasons = sectionContent.reasons_love_you.reasons || [];
        if (reasons.length === 0) {
          return { valid: false, error: 'Reasons I Love You requires at least one reason' };
        }
      }

      // Future Dreams requires at least one dream (if section content exists)
      if (sections.includes('future_dreams') && sectionContent.future_dreams) {
        const dreams = sectionContent.future_dreams.dreams || [];
        if (dreams.length === 0) {
          return { valid: false, error: 'Future Dreams requires at least one dream' };
        }
      }

      // Song requires song link (from form)
      if (sections.includes('song') && !form.song_link?.trim()) {
        return { valid: false, error: 'Song section requires a song link' };
      }

      // Playlist requires playlist URL (if section content exists)
      if (sections.includes('playlist') && sectionContent.playlist) {
        if (!sectionContent.playlist.playlistUrl?.trim()) {
          return { valid: false, error: 'Playlist section requires a playlist link' };
        }
      }

      // Video Memories requires at least one video (if section content exists)
      if (sections.includes('video_memories') && sectionContent.video_memories) {
        const videos = sectionContent.video_memories.videos || [];
        if (videos.length === 0) {
          return { valid: false, error: 'Video Memories requires at least one video' };
        }
      }

      return { valid: true };

    default:
      return { valid: true };
  }
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

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          media: {
            ...(site.config?.media || {}),
            song_link: site.config?.media?.song_link || site.song_link || '',
            song_autoplay: site.config?.media?.song_autoplay ?? false,
          },
          password: site.config?.password ? { ...site.config.password } : undefined,
        });
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
    setConfig({ ...config, ...newConfig });
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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 15) {
        setError('You can upload up to 15 images only.');
        setForm({ ...form, photos: files.slice(0, 15) });
        return;
      }
      const validImages = files.filter((f) => f.type.startsWith('image/'));
      if (validImages.length !== files.length) {
        setError('Only image files are allowed.');
      }
      setForm({ ...form, photos: validImages });

      const newPreviews = validImages.map((file) => URL.createObjectURL(file));
      setPhotoPreviews([...form.existingPhotos, ...newPreviews]);

      if (config.cover_photo_index !== undefined && config.cover_photo_index >= validImages.length + form.existingPhotos.length) {
        setConfig({ ...config, cover_photo_index: undefined });
      }
    }
  };

  const handleCoverPhotoSelect = (index: number) => {
    setConfig({ ...config, cover_photo_index: index });
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
      if (passwordEnabled) {
        normalizedConfig.password = { enabled: true };
      } else {
        delete normalizedConfig.password;
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
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update');
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Photos {config.sections.includes('gallery') && <span className="text-rose-500">*</span>}
              </label>
              <input
                name="photos"
                type="file"
                accept="image/*"
                multiple
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50"
                onChange={handlePhotos}
              />
              {(form.photos.length > 0 || form.existingPhotos.length > 0) && (
                <p className="text-sm text-emerald-600 mt-2">
                  {form.existingPhotos.length} existing + {form.photos.length} new = {form.existingPhotos.length + form.photos.length} total photo(s)
                </p>
              )}
            </div>

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
            onClick={() => router.push('/admin/websites')}
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
          >
            Back to Websites
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

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <button
            key={step}
            onClick={() => {
              if (step < currentStep || completedSteps.includes(step - 1)) {
                setCurrentStep(step);
                setError(null);
              }
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              step === currentStep
                ? 'bg-rose-600 text-white'
                : completedSteps.includes(step)
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {step === 1
              ? 'Info'
              : step === 2
              ? 'Theme'
              : step === 3
              ? 'Sections'
              : step === 4
              ? 'Templates'
              : step === 5
              ? 'Content'
              : 'Review'}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
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

