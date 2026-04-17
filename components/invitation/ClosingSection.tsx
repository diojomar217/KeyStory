import React from 'react';
import type { InvitationData } from '@/lib/invitationData';

export default function ClosingSection({ data }: { data: InvitationData }) {
  return (
    <section className="py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-lg font-serif text-[#6a2f39] leading-relaxed">With gratitude and love,</p>
        <div className="mt-4 text-xl text-[#6a2f39] font-semibold">{data.parents}</div>
        <div className="mt-6 text-sm text-slate-500">We look forward to celebrating together.</div>
      </div>
    </section>
  );
}
