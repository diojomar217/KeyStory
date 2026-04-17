"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { InvitationData } from '@/lib/invitationData';

export default function HeroSection({ data }: { data: InvitationData }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf8] via-[#fff5f5] to-[#fffafa]" />

      <div className="absolute -left-24 -top-16 w-96 h-96 rounded-full bg-gradient-to-r from-[#f8d7da]/70 to-[#e5989b]/30 blur-3xl opacity-80" />

      <div className="relative max-w-4xl mx-auto text-center py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif text-[#6a2f39] leading-tight"
        >
          {data.name}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mt-4 text-xl text-[#6a2f39]/90">
          {data.title} · {data.date}
        </motion.p>

        <div className="mt-8 flex justify-center gap-4">
          <a href="#details" className="px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-sm text-[#6a2f39] font-medium shadow">
            View Details
          </a>
          <a href="#rsvp" className="px-6 py-3 rounded-2xl bg-[#f8d7da] text-white font-medium shadow-md">
            RSVP
          </a>
        </div>
      </div>
    </section>
  );
}
