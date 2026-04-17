"use client";

import React from 'react';
import type { RsvpRecord } from '@/lib/db/rsvps';

function AttendanceBadge({ attendance }: { attendance: string }) {
  const map = {
    yes: 'bg-emerald-100 text-emerald-700',
    no: 'bg-red-100 text-red-700',
    maybe: 'bg-amber-100 text-amber-700',
  } as Record<string, string>;
  const cls = map[attendance] || 'bg-slate-100 text-slate-700';
  const label = attendance?.toUpperCase() || '—';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

export default function GuestCard({ rsvp }: { rsvp: RsvpRecord }) {
  const created = rsvp.created_at ? new Date(rsvp.created_at) : null;
  const isRecent = created ? Date.now() - created.getTime() < 24 * 60 * 60 * 1000 : false;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-slate-800">{rsvp.name}</div>
          {isRecent && <div className="text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">New</div>}
        </div>
        <div className="mt-2 text-xs text-slate-500">
          {rsvp.message ? <span className="block truncate">{rsvp.message}</span> : <span className="text-xs text-slate-400">No message</span>}
        </div>
      </div>

      <div className="ml-4 flex flex-col items-end gap-2">
        <AttendanceBadge attendance={rsvp.attendance} />
        <div className="text-xs text-slate-500">Companions: <span className="font-medium text-slate-700">{rsvp.companions || 0}</span></div>
        {rsvp.godparent_confirmation === 'yes' && (
          <div className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">Godparent</div>
        )}
      </div>
    </div>
  );
}
