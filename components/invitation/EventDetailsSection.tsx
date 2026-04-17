import React from 'react';
import type { InvitationData } from '@/lib/invitationData';

function Card({ title, value, subtitle }: { title: string; value?: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl p-6 bg-white/80 shadow-sm border border-white/20">
      <div className="text-xs text-[#e5989b] uppercase tracking-wide font-semibold">{title}</div>
      <div className="mt-2 text-lg font-serif text-[#6a2f39]">{value}</div>
      {subtitle && <div className="mt-1 text-sm text-slate-500">{subtitle}</div>}
    </div>
  );
}

export default function EventDetailsSection({ data }: { data: InvitationData }) {
  return (
    <section className="py-12 bg-[#fffafa]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card title="Date" value={data.date} subtitle={data.time} />
          <Card title="Church" value={data.venue} subtitle={data.address} />
          <Card title="Reception" value={data.reception} subtitle="All welcome" />
          <Card title="Hosts" value={data.parents} subtitle="Family" />
        </div>
      </div>
    </section>
  );
}
