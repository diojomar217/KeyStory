'use client';
import { useState, useEffect } from 'react';
import { OccasionType, Participant, CreateOrderPayload } from '@/lib/types';
import { OCCASION_REGISTRY, getProductionReadyOccasions } from '@/lib/occasion-registry';
import { getParticipantLabel } from '@/lib/occasion-registry';

interface FormPreviewState {
  website_name: string;
  coupleNames: string;
  coverPhotoPreviewUrl?: string;
  occasion: OccasionType;
  participants: Participant[];
  photosPreview: string[];
}

type Props = {
  onCreated: (result: { slug: string; url: string; qrCodeUrl: string }) => void;
  onFormChange?: (previewState: FormPreviewState) => void;
  initialForm?: Partial<CreateOrderPayload>;
};

export default function BuilderForm({ 
  onCreated, 
  onFormChange, 
  initialForm = {}
}: Props) {
  const [form, setForm] = useState<Partial<CreateOrderPayload>>({
    occasion: 'couple' as OccasionType,
    participants: [],
    photos: [],
    ...initialForm
  });
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [productionOccasions, setProductionOccasions] = useState<OccasionType[]>([]);

  useEffect(() => {
    setProductionOccasions(getProductionReadyOccasions());
  }, []);

  const occasionMeta = OCCASION_REGISTRY[form.occasion || 'couple'];
  const minParticipants = form.occasion === 'couple' ? 2 : 1;
  const participantLabel = getParticipantLabel(form.occasion || 'couple');

  const handleOccasionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const occasion = e.target.value as OccasionType;
    setForm({
      ...form,
      occasion,
      participants: [], // Reset participants
    });
  };

  const handleParticipantChange = (index: number, field: 'name' | 'role', value: string) => {
    const newParticipants = [...(form.participants || [])];
    if (!newParticipants[index]) {
      newParticipants[index] = { id: `${index}`, name: '' };
    }
    newParticipants[index]![field] = value;
    setForm({ ...form, participants: newParticipants });
  };

  const addParticipant = () => {
    const newParticipants = [...(form.participants || [])];
    newParticipants.push({ id: `${newParticipants.length}`, name: '' });
    setForm({ ...form, participants: newParticipants });
  };

  const handlePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10);
      // Cast to any to avoid TS strict checking - files are File[] for submit, string[] for preview
      setForm({ ...form, photos: files as any });
      
      // Generate preview URLs for live preview
      const previews: string[] = [];
      for (const file of files) {
        const previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        previews.push(previewUrl);
      }
      setPhotoPreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.website_name?.trim()) return;
    
    setLoading(true);
    // Convert to full payload
    const payload: CreateOrderPayload = {
      website_name: form.website_name!,
      occasion: form.occasion!,
      participants: form.participants || [],
      specialDate: form.specialDate || '',
      message: form.message || '',
      photos: [],
      config: {
        occasion: form.occasion!,
        theme: 'romantic_classic', // default
        sections: occasionMeta.defaultSections,
      },
      // Legacy compat
      customer_name: form.participants?.[0]?.name,
      partner_name: form.participants?.[1]?.name,
      anniversary_date: form.specialDate,
    };

    // Convert photos to base64
    const photosBase64 = await Promise.all(
      ((form.photos as any[]) as File[]).map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    );
    payload.photos = photosBase64;

    const res = await fetch('/api/order', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await res.json();
    onCreated(data);
    setLoading(false);
  };

  // Live preview state for parent component
  const previewState: FormPreviewState = {
    website_name: form.website_name || '',
    coupleNames: form.participants?.map(p => p.name || '').filter(Boolean).join(' & ') || '',
    coverPhotoPreviewUrl: photoPreviews[0],
    occasion: form.occasion || 'couple',
    participants: form.participants || [],
    photosPreview: photoPreviews,
  };

  // Notify parent of form changes for live preview
  useEffect(() => {
    onFormChange?.(previewState);
  }, [previewState, onFormChange]);

  const isValid = form.website_name?.trim() &&
    (form.participants?.length || 0) >= minParticipants &&
    (form.participants || []).every(p => p.name?.trim()) &&
    form.specialDate;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>

      <div>
        <label className="label">
          <span className="label-text">Occasion Type</span>
        </label>
        <select 
          className="select select-bordered w-full" 
          value={form.occasion} 
          onChange={handleOccasionChange}
        >
          {productionOccasions.map((occasion) => (
            <option key={occasion} value={occasion}>
              {OCCASION_REGISTRY[occasion].label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">
          <span className="label-text">{participantLabel}</span>
        </label>
        {(form.participants || []).map((participant, index) => (
          <div key={participant.id || index} className="flex gap-2 mb-2">
            <input
              className="input input-bordered flex-1"
              placeholder={`Name ${index + 1}`}
              value={participant.name || ''}
              onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
              required
            />
            {index === 0 && (
              <input
                className="input input-bordered w-24"
                placeholder="Role"
                value={participant.role || ''}
                onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
              />
            )}
          </div>
        ))}
        {(form.participants || []).length < 4 && (
          <button type="button" className="btn btn-ghost btn-sm w-full" onClick={addParticipant}>
            + Add another person
          </button>
        )}
      </div>

      <input 
        name="website_name" 
        required 
        placeholder="Website Slug (e.g. my-birthday)" 
        className="input input-bordered w-full" 
        value={form.website_name || ''}
        onChange={(e) => setForm({ ...form, website_name: e.target.value })}
      />

      <input 
        name="specialDate" 
        type="date" 
        required 
        className="input input-bordered w-full" 
        value={form.specialDate || ''}
        onChange={(e) => setForm({ ...form, specialDate: e.target.value })}
      />

      <textarea 
        name="message" 
        required 
        placeholder={`Your ${form.occasion === 'birthday' ? 'birthday' : 'love'} message...`} 
        className="textarea textarea-bordered w-full" 
        value={form.message || ''}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <input 
        name="tagline"
        placeholder="Optional tagline (e.g. 'Our Journey Together')" 
        className="input input-bordered w-full" 
        value={form.tagline || ''}
        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
      />

      <input 
        name="song_link"
        placeholder="Optional song link (Spotify/YouTube)" 
        className="input input-bordered w-full" 
        value={form.song_link || ''}
        onChange={(e) => setForm({ ...form, song_link: e.target.value })}
      />

      <input 
        type="file" 
        accept="image/*" 
        multiple 
        className="file-input w-full" 
        onChange={handlePhotos}
      />

      <button 
        type="submit" 
        className="btn btn-primary w-full" 
        disabled={!isValid || loading}
      >
        {loading ? 'Creating...' : `Create ${occasionMeta.label} Website`}
      </button>
    </form>
  );
}
