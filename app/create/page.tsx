// app/create/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const [form, setForm] = useState({
    customer_name: '',
    partner_name: '',
    anniversary_date: '',
    message: '',
    song_link: '',
    photos: [] as File[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ slug: string; coupleUrl: string; qrCodeUrl: string } | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      setResult(data);
      // optionally redirect after a delay or user action
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-center mb-4 text-pink-600">Create Your Love Website</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!result && <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="customer_name" required placeholder="Your Name" className="input input-bordered w-full" onChange={handleChange} />
        <input name="partner_name" required placeholder="Partner's Name" className="input input-bordered w-full" onChange={handleChange} />
        <input name="anniversary_date" required type="date" className="input input-bordered w-full" onChange={handleChange} />
        <textarea name="message" required placeholder="Your Love Message" className="textarea textarea-bordered w-full" onChange={handleChange} />
        <input name="song_link" placeholder="Optional Song Link (Spotify/YouTube)" className="input input-bordered w-full" onChange={handleChange} />
        <input name="photos" type="file" accept="image/*" multiple max={5} className="file-input w-full" onChange={handlePhotos} />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Website'}</button>
      </form>}
      {result && (
        <div className="mt-6 text-center animate-fade-in">
          <p className="mb-2">Your website is ready!</p>
          <a href={result.coupleUrl} className="text-pink-600 underline mb-2 block">View Couple Page</a>
          <div className="mt-2">
            <img src={result.qrCodeUrl} alt="QR Code" className="mx-auto w-32 h-32" />
          </div>
          <a href={result.qrCodeUrl} download className="btn btn-sm btn-outline mt-2">Download QR Code</a>
        </div>
      )}
    </div>
  );
}
