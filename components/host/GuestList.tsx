"use client";

import React from "react";
import type { RsvpRecord } from "@/lib/db/rsvps";
import GuestCard from "./GuestCard";

export default function GuestList({ rsvps }: { rsvps: RsvpRecord[] }) {
  if (!rsvps || rsvps.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 px-6 py-16 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_55%)] pointer-events-none" />
        <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
          <div className="text-xl font-semibold text-slate-700">No RSVPs yet</div>
          <div className="text-sm text-slate-500">Your guests will appear here as they RSVP.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {rsvps.map((r) => (
        <div key={r.id}>
          <GuestCard rsvp={r} />
        </div>
      ))}
    </div>
  );
}