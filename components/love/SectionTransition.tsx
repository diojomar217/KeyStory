'use client';

import { useState, useEffect } from 'react';

interface SectionTransitionProps {
  fromSection?: string;
  toSection?: string;
  showHint?: boolean;
}

export default function SectionTransition({
  fromSection,
  toSection,
  showHint = false, // Disabled by default - sidebar shows progress
}: SectionTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Only show subtle decorative hearts - no text on main page
  return (
    <div 
      className={`
        py-6 transition-all duration-700
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="flex justify-center">
        <span className="text-rose-200 text-lg">💕</span>
      </div>
    </div>
  );
}

// Simpler transition for minor section gaps
export function SimpleTransition({ showHint = false }: { showHint?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!showHint) return null;

  return (
    <div 
      className={`
        py-4 transition-all duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="flex justify-center">
        <span className="text-rose-200 text-lg">💕</span>
      </div>
    </div>
  );
}
