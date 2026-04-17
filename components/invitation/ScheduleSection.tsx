import React from 'react';
import type { InvitationData } from '@/lib/invitationData';

export default function ScheduleSection({ data }: { data: InvitationData }) {
  if (!data.schedule || data.schedule.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-4">
          {data.schedule.map((it, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/80 shadow-sm border border-white/20 flex items-start gap-4">
              <div className="w-20 text-sm text-[#e5989b] font-semibold">{it.time}</div>
              <div>
                <div className="font-serif text-[#6a2f39] text-lg">{it.title}</div>
                {it.description && <div className="text-sm text-slate-500 mt-1">{it.description}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
