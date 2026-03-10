'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ThemeSelector from '@/components/ThemeSelector';
import SectionSelector from '@/components/SectionSelector';
import TemplateSelector from '@/components/TemplateSelector';
import TimelineEditor from '@/components/TimelineEditor';
import { SiteConfig, Theme } from '@/lib/types';
import { Order } from '@/lib/supabase';

type LocalForm = {
  website_name: string;
  customer_name: string;
  partner_name: string;
  anniversary_date: string;
  message: string;
  song_link: string;
  photos: File[];
  existingPhotos: string[];
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
        return { valid: false, error: 'Your name is required' };
      }
      if (!form.partner_name.trim()) {
        return { valid: false, error: "Partner's name is required" };
      }
      if (!form.anniversary_date) {
        return { valid: false, error: 'Anniversary date is required' };
      }
      if (!form.message.trim()) {
        return { valid: false, error: 'Love message is required' };
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
      if (config.sections.includes('gallery') && form.photos.length === 0 && form.existingPhotos.length === 0) {
        return { valid: false, error: 'Please upload at least one photo for the gallery section' };
      }
      if (config.sections.includes('timeline') && (!config.timeline_events || config.timeline_events.length === 0)) {
        return { valid: false, error: 'Please add at least one event for the timeline section' };
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
    message: '',
    song_link: '',
    photos: [],
    existingPhotos: [],
  });

  const [config, setConfig] = useState<SiteConfig>({
    theme: 'romantic_classic',
    sections: ['home'],
    home_template: undefined,
    gallery_template: undefined,
    timeline_template: undefined,
    timeline_events: [],
    cover_photo_index: undefined,
  });

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin?id=${id}`);
      const data = await res.json();

      if (data.order) {
        const order: Order = data.order;
        setForm({
          website_name: order.website_name || order.slug || '',
          customer_name: order.customer_name || '',
          partner_name: order.partner_name || '',
          anniversary_date: order.anniversary_date || '',
          message: order.message || '',
          song_link: order.song_link || '',
          photos: [],
          existingPhotos: order.photos || [],
        });

        setPhotoPreviews(order.photos || []);

        setConfig({
          theme: (order.config?.theme || order.theme) as Theme || 'romantic_classic',
          sections: order.config?.sections || order.sections || ['home'],
          home_template: order.config?.home_template || order.home_template,
          gallery_template: order.config?.gallery_template || order.gallery_template,
          timeline_template: order.config?.timeline_template || order.timeline_template,
          timeline_events: order.config?.timeline_events || order.timeline_events || [],
          cover_photo_index: order.config?.cover_photo_index,
        });

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfigChange = (newConfig: Partial<SiteConfig>) => {
    setConfig({ ...config, ...newConfig });
  };

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

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          website_name: form.website_name,
          customer_name: form.customer_name,
          partner_name: form.partner_name,
          anniversary_date: form.anniversary_date,
          message: form.message,
          song_link: form.song_link,
          photos: allPhotos,
          config,
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
                  <span className="text-slate-400 text-sm">yoursite.com/love/</span>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                  <input
                    name="customer_name"
                    required
                    value={form.customer_name}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    onChange={handleChange}
                  />
                </div>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Anniversary Date</label>
                <input
                  name="anniversary_date"
                  required
                  type="date"
                  value={form.anniversary_date}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Love Message</label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={form.message}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Song Link (Optional)</label>
                <input
                  name="song_link"
                  value={form.song_link}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  onChange={handleChange}
                />
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
            <SectionSelector value={config.sections} onChange={(sections) => handleConfigChange({ sections })} />
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
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Photos {config.sections.includes('gallery') && <span className="text-rose-500">*</span>}
              </label>
              <input
                name="photos"
                type="file"
                accept="image/*"
                multiple
                max={15}
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
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Timeline Events <span className="text-rose-500">*</span>
                </label>
                <TimelineEditor
                  events={config.timeline_events || []}
                  onChange={(timeline_events) => handleConfigChange({ timeline_events })}
                />
              </div>
            )}
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
            href={`/love/${form.website_name}`}
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
        {[1, 2, 3, 4, 5].map((step) => (
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
            {step === 1 ? 'Info' : step === 2 ? 'Theme' : step === 3 ? 'Sections' : step === 4 ? 'Templates' : 'Content'}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700"
            >
              Continue
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

