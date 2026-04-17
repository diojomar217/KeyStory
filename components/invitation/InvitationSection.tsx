import React from 'react';
import type { InvitationData } from '@/lib/invitationData';

export default function InvitationSection({ data }: { data: InvitationData }) {
  return (
    <section id="details" className="py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="font-serif text-xl text-[#6a2f39] leading-relaxed">{data.message}</p>
        {data.godparentMessage && (
          <blockquote className="mt-6 p-4 bg-white/60 rounded-2xl shadow-sm text-sm text-slate-700">{data.godparentMessage}</blockquote>
        )}
      </div>
    </section>
  );
}
