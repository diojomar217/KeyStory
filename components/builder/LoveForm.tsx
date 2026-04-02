// components/LoveForm.tsx
'use client';
import { useState } from 'react';

type Props = {
  onCreated: (result: { slug: string; coupleUrl: string; qrCodeUrl: string }) => void;
};

export default function LoveForm({ onCreated }: Props) {
  const [form, setForm] = useState({
    customer_name: '',
    partner_name: '',
    specialDate: '',
    message: '',
    photos: [] as File[],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, photos: Array.from(e.target.files).slice(0, 5) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Convert images to base64
    const photosBase64 = await Promise.all(
      form.photos.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    );
    const res = await fetch('/api/order', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        specialDate: form.specialDate,
        photos: photosBase64,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    onCreated(data);
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="customer_name" required placeholder="Your Name" className="input input-bordered w-full" onChange={handleChange} />
      <input name="partner_name" required placeholder="Partner's Name" className="input input-bordered w-full" onChange={handleChange} />
      <input name="specialDate" required type="date" className="input input-bordered w-full" onChange={handleChange} />
      <textarea name="message" required placeholder="Your Love Message" className="textarea textarea-bordered w-full" onChange={handleChange} />
      <input name="photos" type="file" accept="image/*" multiple max={5} className="file-input w-full" onChange={handlePhotos} />
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Website'}</button>
    </form>
  );
}
