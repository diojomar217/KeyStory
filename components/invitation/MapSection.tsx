import React from 'react';
import type { InvitationData } from '@/lib/invitationData';

export default function MapSection({ data }: { data: InvitationData }) {
  if (!data.mapUrl && !data.address) return null;

  return (
    <section className="py-12 bg-[#fffaf8]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="text-lg font-serif text-[#6a2f39]">Venue</div>
        <div className="mt-3 text-slate-600">{data.venue}{data.address ? ` — ${data.address}` : ''}</div>
        <div className="mt-4">
          <a
            href={data.mapUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/90 shadow-sm text-[#6a2f39]"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
