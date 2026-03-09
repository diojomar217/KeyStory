// components/SectionSelector.tsx
'use client';
import { Section } from '@/lib/types';

const allSections: { key: Section; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'timeline', label: 'Timeline' },
];

type Props = {
  value: Section[];
  onChange: (sections: Section[]) => void;
};

export default function SectionSelector({ value, onChange }: Props) {
  const toggle = (key: Section) => {
    if (value.includes(key)) {
      onChange(value.filter((s) => s !== key));
    } else {
      onChange([...value, key]);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {allSections.map((s) => (
        <button
          key={s.key}
          type="button"
          className={`p-3 border rounded-lg hover:bg-gray-50 transition text-slate-800 ${
            value.includes(s.key) ? 'bg-pink-50 border-pink-600' : 'border-gray-200'
          }`}
          onClick={() => toggle(s.key)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
