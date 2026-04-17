"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { InvitationData } from '@/lib/invitationData';

export default function GallerySection({ data }: { data: InvitationData }) {
  if (!data.gallery || data.gallery.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6 text-[#6a2f39] font-serif text-2xl">Gallery</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.gallery.map((src, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} className="overflow-hidden rounded-2xl shadow-sm bg-white/60">
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-48 object-cover rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
