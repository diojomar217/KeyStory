// components/ThemeSelector.tsx
'use client';
import { Theme } from '@/lib/types';

const themes: { key: Theme; label: string }[] = [
  { key: 'romantic_classic', label: 'Romantic Classic' },
  { key: 'cute_pastel', label: 'Cute Pastel' },
  { key: 'minimal_modern', label: 'Minimal Modern' },
  { key: 'dark_elegant', label: 'Dark Elegant' },
];

type Props = {
  value?: Theme;
  onChange: (theme: Theme) => void;
};

export default function ThemeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {themes.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`p-4 border rounded-lg text-center hover:shadow-md transition text-slate-800 ${
            value === t.key ? 'border-pink-600 bg-pink-50' : 'border-gray-200'
          }`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
