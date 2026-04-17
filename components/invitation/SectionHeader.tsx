import React from 'react';

export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-8 px-4">
      <div className="text-sm uppercase tracking-widest text-[#e5989b] font-semibold">{title}</div>
      {subtitle && <p className="mt-2 text-[#6a2f39] text-lg font-serif leading-relaxed">{subtitle}</p>}
    </div>
  );
}
