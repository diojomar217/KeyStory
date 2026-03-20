'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/lib/types';

interface MobileQuickNavProps {
  sections: Section[];
  currentSection: string;
}

export default function MobileQuickNav({ sections, currentSection }: MobileQuickNavProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Only show on iOS/mobile by default; hide on desktop
  useEffect(() => {
    const checkSize = () => {
      setIsVisible(window.innerWidth < 768);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  if (!isVisible || sections.length === 0) {
    return null;
  }

  // Key sections to show in quick nav (first 5 main ones)
  const keySecIndices = [0, 1, 2, 3, 4].filter(i => i < sections.length);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/85 backdrop-blur-xl border-t border-slate-200 shadow-2xl"
      aria-label="Mobile section quick nav"
    >
      <div className="flex justify-center items-center gap-2 px-4 py-3">
        {keySecIndices.map((idx) => {
          const section = sections[idx];
          const isActive = currentSection === section;

          return (
            <a
              key={`mobile-nav-${section}`}
              href={`#${section}`}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0
                ${isActive 
                  ? 'bg-teal-500 scale-110 shadow-lg ring-2 ring-teal-300' 
                  : 'bg-slate-200 hover:bg-slate-300 scale-100'
                }
              `}
              aria-label={`Go to ${section}`}
              aria-current={isActive ? 'page' : undefined}
              title={section}
            >
              <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {(idx + 1).toString()}
              </span>
            </a>
          );
        })}

        {sections.length > 5 && (
          <div className="text-xs text-slate-500 ml-2 px-2 py-1 bg-slate-100 rounded-full">
            +{sections.length - 5}
          </div>
        )}
      </div>
    </nav>
  );
}
