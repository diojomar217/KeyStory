'use client';
import { Theme } from '@/lib/types';

const themes: { 
  key: Theme; 
  label: string; 
  description: string;
  colors: string[];
}[] = [
  { 
    key: 'romantic_classic', 
    label: 'Romantic Classic', 
    description: 'Timeless elegance with roses',
    colors: ['#BE185D', '#FBCFE8', '#881337', '#FDF4FF']
  },
  { 
    key: 'cute_pastel', 
    label: 'Cute Pastel', 
    description: 'Soft and dreamy vibes',
    colors: ['#F9A8D4', '#FDE68A', '#A7F3D0', '#E0E7FF']
  },
  { 
    key: 'minimal_modern', 
    label: 'Minimal Modern', 
    description: 'Clean and sophisticated',
    colors: ['#1F2937', '#F3F4F6', '#9CA3AF', '#FFFFFF']
  },
  { 
    key: 'dark_elegant', 
    label: 'Dark Elegant', 
    description: 'Bold and luxurious feel',
    colors: ['#18181B', '#27272A', '#D4AF37', '#FAFAFA']
  },
];

type Props = {
  value?: Theme;
  onChange: (theme: Theme) => void;
};

export default function ThemeSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">1</span>
        <h3 className="text-lg font-semibold text-slate-800">Choose Theme</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {themes.map((t, index) => {
          const isSelected = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={`
                group relative flex flex-col p-4 rounded-2xl border-2 text-left
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-xl
                opacity-0 animate-fade-in-up
                ${isSelected 
                  ? 'border-rose-500 bg-rose-50/70 shadow-lg ring-2 ring-rose-200' 
                  : 'border-slate-200 bg-white hover:border-rose-300 hover:shadow-md'
                }
              `}
              style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white animate-scale-in">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Color Palette Preview */}
              <div className="flex gap-1.5 mb-3">
                {t.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full shadow-sm border border-slate-200/50 transform group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Theme Name */}
              <h4 className={`font-semibold text-base mb-1 transition-colors duration-300 ${isSelected ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>
                {t.label}
              </h4>
              
              {/* Description */}
              <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                {t.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

