import React from 'react';
import type { InvitationData } from '@/lib/invitationData';

function Swatch({ color }: { color: string }) {
  return <div className="w-14 h-14 rounded-lg shadow-sm" style={{ background: color }} />;
}

export default function DressCodeSection({ data }: { data: InvitationData }) {
  if (!data.dressCode || data.dressCode.length === 0) return null;

  return (
    <section className="py-12 bg-[#fff8f8]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="mb-6 text-[#6a2f39] font-serif text-2xl">Dress Code</div>
        <div className="space-y-6">
          {data.dressCode.map((d, i) => (
            <div key={i} className="rounded-2xl p-6 bg-white/80 shadow-sm border border-white/20 inline-block">
              <div className="text-sm text-[#e5989b] font-semibold">{d.label}</div>
              <div className="mt-3 flex items-center gap-3 justify-center">
                {d.colors.map((c, idx) => (
                  <Swatch key={idx} color={c} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
