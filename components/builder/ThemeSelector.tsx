'use client';
import type { ThemeKey } from '@/config/themeConfig';
import { THEME_CONFIG } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import { getOccasionThemeRecommendations } from '@/lib/theme-recommendations';

type Props = {
  value?: ThemeKey;
  onChange: (theme: ThemeKey) => void;
  occasion?: OccasionType;
};

export default function ThemeSelector({ value, onChange, occasion }: Props) {
  const themeKeys = Object.keys(THEME_CONFIG) as ThemeKey[];
  const { defaultTheme, supportedThemes, occasionLabel } = getOccasionThemeRecommendations(occasion);
  const supportedSet = new Set(supportedThemes);
  const selectedTheme = value ? THEME_CONFIG[value] : undefined;
  const isSelectedThemeRecommended = !value || supportedSet.size === 0 || supportedSet.has(value);
  const occasionAltThemes = supportedThemes.filter((themeKey) => themeKey !== defaultTheme).slice(0, 2);

  const sortedThemeKeys = [...themeKeys].sort((a, b) => {
    const rank = (key: ThemeKey) => {
      if (defaultTheme && key === defaultTheme) return 0;
      if (supportedSet.has(key)) return 1;
      return 2;
    };
    return rank(a) - rank(b);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">1</span>
        <h3 className="text-lg font-semibold text-slate-800">Choose Theme</h3>
      </div>
      {occasion && defaultTheme && occasionLabel && (
        <div className="space-y-2">
          <p className="text-sm text-slate-500">
            Recommended for {occasionLabel}: <span className="font-semibold text-slate-700">{THEME_CONFIG[defaultTheme].label}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex text-[11px] px-2 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
              Default: {THEME_CONFIG[defaultTheme].label}
            </span>
            {occasionAltThemes.map((themeKey) => (
              <span
                key={themeKey}
                className="inline-flex text-[11px] px-2 py-1 rounded-full border bg-sky-50 text-sky-700 border-sky-200"
              >
                Also fits: {THEME_CONFIG[themeKey].label}
              </span>
            ))}
            <span className="inline-flex text-[11px] px-2 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
              You can still pick any theme
            </span>
          </div>
          {!isSelectedThemeRecommended && selectedTheme && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <span className="font-semibold">Heads up:</span> {selectedTheme.label} is outside the usual recommendations for {occasionLabel}. You can keep it for a unique style.
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedThemeKeys.map((themeKey, index) => {
          const theme = THEME_CONFIG[themeKey];
          const isSelected = value === themeKey;
          const isDefaultForOccasion = !!defaultTheme && themeKey === defaultTheme;
          const isRecommended = supportedSet.has(themeKey);
          return (
            <button
              key={themeKey}
              type="button"
              onClick={() => onChange(themeKey)}
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
                {theme.preview.map((color: string, idx: number) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full shadow-sm border border-slate-200/50 transform group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {(isDefaultForOccasion || isRecommended) && (
                <div className="mb-2">
                  <span
                    className={`inline-flex text-[11px] px-2 py-0.5 rounded-full border ${
                      isDefaultForOccasion
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}
                  >
                    {isDefaultForOccasion ? 'Recommended' : 'Occasion fit'}
                  </span>
                </div>
              )}

              {/* Theme Name */}
              <h4 className={`font-semibold text-base mb-1 transition-colors duration-300 ${isSelected ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>
                {theme.label}
              </h4>
              
              {/* Description */}
              <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                {theme.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

