"use client";

import React, { useState } from 'react';
import type { InvitationData } from '@/lib/invitationData';
import PremiumInput from '@/components/ui/PremiumInput';
import PremiumTextarea from '@/components/ui/PremiumTextarea';
import PremiumSelect from '@/components/ui/PremiumSelect';
import PremiumButton from '@/components/ui/PremiumButton';

type FormState = {
  name: string;
  email: string;
  attendance: 'yes' | 'no' | 'maybe';
  companions: number;
  message: string;
  godparent: boolean;
};

export default function RSVPSection({ data }: { data: InvitationData }) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', attendance: 'yes', companions: 0, message: '', godparent: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        site_id: data.slug || 'baptism-demo',
        name: form.name,
        email: form.email,
        attendance: form.attendance,
        companions: form.companions,
        message: form.message,
        godparent_confirmation: form.godparent ? 'yes' : '',
      };

      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed');
      }

      setSuccess(true);
      setForm({ name: '', email: '', attendance: 'yes', companions: 0, message: '', godparent: false });
    } catch (err: any) {
      setError(err?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div id="rsvp" className="py-12 text-center">
        <div className="max-w-xl mx-auto px-4">
          <div className="inline-block rounded-2xl bg-white/90 p-8 shadow-sm">
            <div className="text-2xl font-serif text-[#6a2f39]">Thank you</div>
            <div className="mt-2 text-slate-600">Your RSVP has been recorded. We look forward to seeing you.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="rsvp" className="py-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="rounded-2xl p-6 bg-white/90 shadow-sm" style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border)' }}>
          <h3 className="text-xl font-serif text-[#6a2f39]">RSVP</h3>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <PremiumInput
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Your full name"
            />

            <PremiumInput
              label="Email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="Email (optional)"
              type="email"
            />

            <PremiumSelect label="Attendance" value={form.attendance} onChange={(e) => setForm((s) => ({ ...s, attendance: e.target.value as any }))}>
              <option value="yes">Attending</option>
              <option value="maybe">Maybe</option>
              <option value="no">Not Attending</option>
            </PremiumSelect>

            <PremiumInput
              label="Companions"
              type="number"
              min={0}
              value={String(form.companions)}
              onChange={(e) => setForm((s) => ({ ...s, companions: Number(e.target.value || 0) }))}
              placeholder="Number of companions"
            />

            <PremiumTextarea
              label="Message"
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              placeholder="Message (optional)"
              rows={3}
            />

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.godparent} onChange={(e) => setForm((s) => ({ ...s, godparent: e.target.checked }))} />
                <span className="text-sm">I am a godparent</span>
              </label>
            </div>

            {error && <div className="text-rose-600 text-sm">{error}</div>}

            <div className="pt-2">
              <PremiumButton type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending…' : 'Send RSVP'}
              </PremiumButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
