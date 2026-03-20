'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface AnniversaryCountdownSectionProps {
  theme: Theme;
  anniversaryDate: string;
  yearsTogether?: number;
  variant?: 'default' | 'alt';
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function AnniversaryCountdownSection({ 
  theme, 
  anniversaryDate,
  yearsTogether = 1,
  variant = 'default',
}: AnniversaryCountdownSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;
  const sectionBackground = variant === 'alt' ? colors.secondary : colors.background;
  
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
  const calculateCountdown = () => {
      if (!anniversaryDate || isNaN(new Date(anniversaryDate).getTime())) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const anniversary = new Date(anniversaryDate);
      const now = new Date();
      
      // Get next anniversary
      let nextAnniversary = new Date(now.getFullYear(), anniversary.getMonth(), anniversary.getDate());
      if (now > nextAnniversary) {
        nextAnniversary = new Date(now.getFullYear() + 1, anniversary.getMonth(), anniversary.getDate());
      }
      
      const diff = nextAnniversary.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  return (
    <section 
      className="relative py-16 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className="text-4xl font-bold mb-4"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          ⏰ Counting Down to Our {yearsTogether + 1} Year Anniversary
        </h2>
        
        <p 
          className="text-lg mb-8"
          style={{ color: colors.text }}
        >
          Every second counts when we're together
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <div 
            className="p-6 rounded-2xl min-w-[100px]"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: '1px'
            }}
          >
            <div 
              className="text-4xl font-bold"
              style={{ 
                color: colors.primary,
                fontFamily: typography.headingFont
              }}
            >
              {countdown.days}
            </div>
            <div className="text-sm" style={{ color: colors.text }}>Days</div>
          </div>
          
          <div 
            className="p-6 rounded-2xl min-w-[100px]"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: '1px'
            }}
          >
            <div 
              className="text-4xl font-bold"
              style={{ 
                color: colors.primary,
                fontFamily: typography.headingFont
              }}
            >
              {countdown.hours}
            </div>
            <div className="text-sm" style={{ color: colors.text }}>Hours</div>
          </div>
          
          <div 
            className="p-6 rounded-2xl min-w-[100px]"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: '1px'
            }}
          >
            <div 
              className="text-4xl font-bold"
              style={{ 
                color: colors.primary,
                fontFamily: typography.headingFont
              }}
            >
              {countdown.minutes}
            </div>
            <div className="text-sm" style={{ color: colors.text }}>Minutes</div>
          </div>
          
          <div 
            className="p-6 rounded-2xl min-w-[100px]"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: '1px'
            }}
          >
            <div 
              className="text-4xl font-bold"
              style={{ 
                color: colors.primary,
                fontFamily: typography.headingFont
              }}
            >
              {countdown.seconds}
            </div>
            <div className="text-sm" style={{ color: colors.text }}>Seconds</div>
          </div>
        </div>
      </div>
    </section>
  );
}

