'use client';

import { useState, useEffect } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import { getCardStyleClasses, getShadowClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface RelationshipStatsSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  anniversaryDate: string;
}

interface Stats {
  days: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
}

export default function RelationshipStatsSection({ theme, siteType = 'couple', anniversaryDate }: RelationshipStatsSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  
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
      
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const months = Math.max(0, Math.floor(days / 30));
      const years = Math.max(0, Math.floor(days / 365));
      const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor(diff / (1000 * 60)));
      
      setStats({ days, months, years, hours, minutes });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 60000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const statPrefix = siteType === 'travel'
    ? 'On The Journey'
    : siteType === 'friendship'
      ? 'Connected'
      : siteType === 'family'
        ? 'Shared'
        : 'Together';
  const statItems = [
    { label: `Days ${statPrefix}`, value: stats.days, icon: '📅' },
    { label: `Months ${statPrefix}`, value: stats.months, icon: '🗓️' },
    { label: `Years ${statPrefix}`, value: stats.years, icon: '🎉' },
    { label: `Hours ${statPrefix}`, value: stats.hours, icon: '⏰' },
  ];

  return (
    <section 
      id="relationship-stats"
      className={`px-4 ${spacingClass}`}
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('relationship_stats', siteType);
            return (
              <SectionHeader
                icon={copy.icon}
                title={copy.title}
                subtitle={copy.subtitle}
                theme={theme}
              />
            );
          })()}
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, index) => (
            <ScrollReveal key={item.label} animation="fade-up" delay={index * 50}>
              <div
                className={`p-6 text-center ${cardStyle} ${shadowClass} transition-all duration-300 hover:scale-105 hover:-translate-y-1`}
                style={{ 
                  backgroundColor: themeUtils.colors.card,
                  borderColor: themeUtils.colors.border,
                  borderWidth: '1px'
                }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: themeUtils.colors.primary }}
                >
                  {item.value.toLocaleString()}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: themeUtils.colors.text }}
                >
                  {item.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
