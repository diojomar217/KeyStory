'use client';

import { ReactNode } from 'react';

interface PrintableCardLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PrintableCardLayout({
  children,
  className = '',
}: PrintableCardLayoutProps) {
  return (
    <div className={`printable-card-layout ${className}`}>
      <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm">
        <div className="flex min-h-[420px] items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-white print:bg-white rounded-3xl">
          <div className="w-full max-w-lg flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}