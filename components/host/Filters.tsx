"use client";

import React from 'react';

type FilterKey = 'all' | 'yes' | 'no' | 'godparent';

export default function Filters({ active, onChange }: { active?: FilterKey; onChange: (f: FilterKey) => void }) {
  const options: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'yes', label: 'Attending' },
    { key: 'no', label: 'Not Attending' },
    { key: 'godparent', label: 'Godparents' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none ${
              isActive
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
