'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface RelationshipStatsSectionProps {
  theme: Theme;
  anniversaryDate: string;
}

interface Stats {
  days: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
}

export default function RelationshipStatsSection({ theme, anniversaryDate }: RelationshipStatsSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;
  
  const [stats, setStats] = useState<Stats>({
    days: 0,
    months: 0,
    years: 0,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      const start = new Date(anniversaryDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff / (1000 * 60));
      
      setStats({ days, months, years, hours, minutes });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const statItems = [
    { label: 'Days Together', value: stats.days, icon: '📅' },
    { label: 'Months Together', value: stats.months, icon: '🗓️' },
    { label: 'Years Together', value: stats.years, icon: '🎉' },
    { label: 'Hours Together', value: stats.hours, icon: '⏰' },
  ];

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-12"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          📊 Our Journey Together
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="p-6 rounded-2xl text-center"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ 
                  color: colors.primary,
                  fontFamily: typography.headingFont
                }}
              >
                {item.value.toLocaleString()}
              </div>
              <div 
                className="text-sm"
                style={{ color: colors.text }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

