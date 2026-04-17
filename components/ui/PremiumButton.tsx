"use client";

import React from 'react';
import { motion } from 'framer-motion';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export default function PremiumButton({ variant = 'primary', className = '', children, ...props }: Props) {
  const base = 'rounded-2xl py-3 px-5 font-semibold shadow-md inline-block';
  const style =
    variant === 'primary'
      ? { backgroundColor: 'var(--color-primary)', color: 'white', border: 'none' }
      : { backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-border)' };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} className={`inline-block ${className}`}>
      <button style={style} className={base} {...props}>
        {children}
      </button>
    </motion.div>
  );
}
