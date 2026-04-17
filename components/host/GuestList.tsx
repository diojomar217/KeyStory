"use client";

import React from 'react';
import type { RsvpRecord } from '@/lib/db/rsvps';
import GuestCard from './GuestCard';

export default function GuestList({ rsvps }: { rsvps: RsvpRecord[] }) {
  if (!rsvps || rsvps.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-slate-700">No responses yet.</p>
        <p className="mt-2 text-sm text-slate-500">Once guests RSVP, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile: cards */}
      <div className="block md:hidden space-y-3">
        {rsvps.map((r) => (
          <GuestCard key={r.id} rsvp={r} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Attendance</th>
              <th className="text-left px-4 py-3">Companions</th>
              <th className="text-left px-4 py-3">Godparent</th>
              <th className="text-left px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium text-slate-800">{r.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      r.attendance === 'yes' ? 'bg-emerald-100 text-emerald-700' : r.attendance === 'no' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {r.attendance?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">{r.companions || 0}</td>
                <td className="px-4 py-3">{(r.godparent_confirmation || '—').toString()}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
