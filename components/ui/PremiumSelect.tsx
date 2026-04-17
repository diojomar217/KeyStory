"use client";

import React from 'react';
import { motion } from 'framer-motion';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
};

export default function PremiumSelect({ label, hint, className = '', children, ...props }: Props) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#6a2f39] mb-1">{label}</label>}
      <motion.div whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 350, damping: 28 }}>
        <select
          className={`w-full px-4 py-3 rounded-2xl bg-white/85 placeholder:text-slate-400 focus:outline-none shadow-sm ${className}`}
          style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border)' }}
          {...props}
        >
          {children}
        </select>
      </motion.div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}
