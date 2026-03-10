'use client';

import { useState, useCallback } from 'react';

// Romantic taglines preset
const ROMANTIC_TAGLINES = [
  "Every memory with you is my favorite.",
  "Our story written in moments.",
  "Forever started with you.",
  "A love story still being written.",
  "From our first hello to forever.",
  "You are my today and all of my tomorrows.",
  "Love is not about how many days we've been together, but how much we love each other.",
  "In your arms is where I belong.",
  "Every moment with you is a treasure.",
  "To love and be loved is the greatest happiness of all.",
  "You are my sunshine on rainy days.",
  "My heart beats for you.",
  "Love knows not its own depth until the hour of separation.",
  "You are the reason I smile every day.",
  "Together is my favorite place to be.",
  "Every love story is beautiful, but ours is my favorite.",
  "Found my forever in you.",
  "Loving you is easy, it's living without you that's hard.",
  "You make my heart smile.",
  "The best is yet to come with you.",
];

interface TaglineGeneratorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TaglineGenerator({ value, onChange }: TaglineGeneratorProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomTagline = useCallback(() => {
    const availableTaglines = ROMANTIC_TAGLINES.filter(t => t !== value);
    const randomIndex = Math.floor(Math.random() * availableTaglines.length);
    return availableTaglines[randomIndex];
  }, [value]);

  const handleSuggest = () => {
    setIsAnimating(true);
    const newTagline = getRandomTagline();
    onChange(newTagline);
    
    // Animation feedback
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-semibold text-slate-700">
          ✨ Hero Tagline <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <button
          type="button"
          onClick={handleSuggest}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
            bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600
            hover:from-rose-200 hover:to-pink-200
            transition-all duration-200 hover:scale-105 active:scale-95
            shadow-sm hover:shadow
            ${isAnimating ? 'animate-pulse' : ''}
          `}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Suggest Tagline
        </button>
      </div>
      
      <div className="relative">
        <input
          type="text"
          name="tagline"
          maxLength={120}
          placeholder="Every love story is beautiful, but ours is my favorite."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 
            placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 
            transition-all
            ${isAnimating ? 'ring-2 ring-rose-300 bg-rose-50' : ''}
          `}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
            title="Clear tagline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          A short romantic line shown in the hero section
        </p>
        <span className={`text-xs ${value.length > 100 ? 'text-amber-500' : 'text-slate-400'}`}>
          {value.length}/120
        </span>
      </div>

      {/* Quick suggestions chips */}
      {ROMANTIC_TAGLINES.slice(0, 5).map((tagline) => (
        <button
          key={tagline}
          type="button"
          onClick={() => onChange(tagline)}
          className={`
            text-xs px-2 py-1 rounded-full border transition-all
            ${value === tagline 
              ? 'bg-rose-100 border-rose-300 text-rose-700' 
              : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500'
            }
          `}
        >
          {tagline.length > 40 ? tagline.substring(0, 40) + '...' : tagline}
        </button>
      ))}
    </div>
  );
}

export { ROMANTIC_TAGLINES };

