'use client';

import { ReactNode } from 'react';

interface PrintableCardLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PrintableCardLayout({ 
  children, 
  className = '' 
}: PrintableCardLayoutProps) {
  return (
    <div className={`printable-card-layout ${className}`}>
      {/* Centered Card Container */}
      <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-white print:bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

