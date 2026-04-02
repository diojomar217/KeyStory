'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface SpecialMoment {
  id: string;
  title: string;
  date: string;
  description: string;
  photo?: string;
}

interface SpecialMomentsSectionProps {
  theme: ThemeKey;
  moments?: SpecialMoment[];
}

const defaultMoments: SpecialMoment[] = [
  { id: '1', title: 'First Trip Together', date: '', description: 'Our first adventure as a couple' },
  { id: '2', title: 'Meeting the Family', date: '', description: 'The moment everything felt real' },
  { id: '3', title: 'First Holiday Together', date: '', description: 'Celebrating our first season of love' },
  { id: '4', title: 'Moving In Together', date: '', description: 'Starting our life under one roof' },
];

export default function SpecialMomentsSection({ theme, moments = defaultMoments }: SpecialMomentsSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

  return (
    <section className={`px-4 ${spacingClass}`}>
      <div className="max-w-4xl mx-auto">
        <ScrollReveal animation="fade-up">
          <h2
            className={`text-4xl font-bold text-center mb-12 ${headingFontClass}`}
            style={{ color: themeUtils.colors.primary }}
          >
            ⭐ Special Moments
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {moments.map((moment, index) => (
            <ScrollReveal key={moment.id} animation="fade-up" delay={index * 50}>
              <div
                className={`flex items-start gap-4 p-6 ${cardStyle} ${shadowClass} transition-all hover:scale-105 duration-300`}
                style={{
                  backgroundColor: themeUtils.colors.card,
                  borderColor: themeUtils.colors.border,
                }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{
                    backgroundColor: themeUtils.colors.secondary,
                    color: themeUtils.colors.primary,
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1" style={{ color: themeUtils.colors.primary }}>
                    {moment.title}
                  </h3>
                  <p style={{ color: themeUtils.colors.text }}>{moment.description}</p>
                  {moment.date && (
                    <p className="text-sm mt-1" style={{ color: themeUtils.colors.accent }}>
                      {moment.date}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

