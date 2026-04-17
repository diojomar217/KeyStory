"use client";

import React from 'react';
import { motion } from 'framer-motion';

type Totals = {
  total: number;
  yes: number;
  no: number;
  maybe: number;
  companions: number;
};

export default function StatsCards({ totals }: { totals: Totals }) {
  const items = [
    { key: 'total', label: 'Total Guests', value: totals.total, bg: 'bg-rose-50', text: 'text-rose-700' },
    { key: 'attending', label: 'Attending', value: totals.yes, bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { key: 'not_attending', label: 'Not Attending', value: totals.no, bg: 'bg-red-50', text: 'text-red-600' },
    { key: 'maybe', label: 'Maybe', value: totals.maybe, bg: 'bg-amber-50', text: 'text-amber-700' },
    { key: 'companions', label: 'Total Companions', value: totals.companions, bg: 'bg-pink-50', text: 'text-pink-700' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {items.map((it) => (
        <motion.div
          key={it.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className={`rounded-2xl p-4 ${it.bg} shadow-sm border border-white/30`}
        >
          <div className="text-xs text-slate-500">{it.label}</div>
          <div className={`mt-2 ${it.text} text-2xl md:text-3xl font-bold`}>{it.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
