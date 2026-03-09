// app/create/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { SiteConfig, CreateOrderPayload } from '@/lib/types';
import ThemeSelector from '@/components/ThemeSelector';
import SectionSelector from '@/components/SectionSelector';
import TemplateSelector from '@/components/TemplateSelector';
import TimelineEditor from '@/components/TimelineEditor';

export default function CreatePage() {
  // core order fields (photos are handled locally as File objects)
  type LocalForm = Omit<CreateOrderPayload, 'config' | 'photos'> & { photos: File[] };
  const [form, setForm] = useState<LocalForm>({
    website_name: '',
    customer_name: '',
    partner_name: '',
    anniversary_date: '',
    message: '',
    song_link: '',
    photos: [] as File[],
  });

  // configuration state
  const [config, setConfig] = useState<SiteConfig>({
    theme: 'romantic_classic',
    sections: ['home'],
    home_template: undefined,
    gallery_template: undefined,
    timeline_template: undefined,
    timeline_events: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ slug: string; website_name: string; qr_code_url: string } | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfigChange = (newConfig: Partial<SiteConfig>) => {
    setConfig({ ...config, ...newConfig });
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        setError('You can upload up to 5 images only.');
        setForm({ ...form, photos: files.slice(0, 5) });
        return;
      }
      const validImages = files.filter((f) => f.type.startsWith('image/'));
      if (validImages.length !== files.length) {
        setError('Only image files are allowed.');
      }
      setForm({ ...form, photos: validImages });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // convert files to base64
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
          config,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create');
      if (!data.slug) throw new Error('Missing slug from server');
      if (!data.website_name) throw new Error('Missing website name from server');
      if (!data.qr_code_url) throw new Error('Missing QR code from server');
      setResult({ slug: data.slug, website_name: data.website_name, qr_code_url: data.qr_code_url });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFF7FB] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
        <h1 className="text-2xl font-bold text-center mb-4 text-pink-600">Create Your Love Website</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {!result && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Basic Information</h2>
              <input
                name="website_name"
                required
                placeholder="Website Name (used in URL)"
                className="border border-slate-300 rounded-md px-3 py-2 w-full text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="customer_name"
                  required
                  placeholder="Your Name"
                  className="border border-slate-300 rounded-md px-3 py-2 w-full text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                  onChange={handleChange}
                />
                <input
                  name="partner_name"
                  required
                  placeholder="Partner's Name"
                  className="border border-slate-300 rounded-md px-3 py-2 w-full text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                  onChange={handleChange}
                />
              </div>
              <input
                name="anniversary_date"
                required
                type="date"
                className="border border-slate-300 rounded-md px-3 py-2 w-full text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                onChange={handleChange}
              />
              <textarea
                name="message"
                required
                placeholder="Your Love Message"
                className="border border-slate-300 rounded-md px-3 py-2 w-full text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                onChange={handleChange}
              />
              <input
                name="song_link"
                placeholder="Optional Song Link (Spotify/YouTube)"
                className="border border-slate-300 rounded-md px-3 py-2 w-full text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                onChange={handleChange}
              />
              <input
                name="photos"
                type="file"
                accept="image/*"
                multiple
                max={5}
                className="w-full"
                onChange={handlePhotos}
              />
            </div>

            {/* configuration section */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Customize Your Site</h2>
              <ThemeSelector value={config.theme} onChange={(theme) => handleConfigChange({ theme })} />
              <SectionSelector value={config.sections} onChange={(sections) => handleConfigChange({ sections })} />

            {/* template selectors conditionally shown based on sections */}
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

            {config.sections.includes('timeline') && (
              <div className="space-y-2">
                <label className="font-medium">Timeline events</label>
                <TimelineEditor
                  events={config.timeline_events || []}
                  onChange={(timeline_events) => handleConfigChange({ timeline_events })}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-6 py-2 font-medium disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Website'}
          </button>
        </form>
      )}
      {result && (
        <div className="mt-6 text-center animate-fade-in bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <p className="mb-2">Your website is ready!</p>
          <a href={`/love/${result.website_name}`} className="text-pink-600 underline mb-2 block">View Couple Page</a>
          <div className="mt-2">
            <img src={result.qr_code_url} alt="QR Code" className="mx-auto w-32 h-32" />
          </div>
          <a
            href={result.qr_code_url}
            download
            className="inline-block mt-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-4 py-2 font-medium"
          >
            Download QR Code
          </a>
        </div>
      )}
    </div>
    </div>
  );
}
