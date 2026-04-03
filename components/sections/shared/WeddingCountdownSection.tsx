'use client';

import { useEffect, useState } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  theme: ThemeKey;
  weddingDate?: string;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function WeddingCountdownSection({ theme, weddingDate }: Props) {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const date = weddingDate ? new Date(weddingDate) : null;
      if (!date || Number.isNaN(date.getTime())) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date();
      const diff = Math.max(0, date.getTime() - now.getTime());

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <section className={`${spacingClass} ${styles.sectionBg}`} id="wedding-countdown">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="\ud83d\udc8d"
            title="Wedding Countdown"
            subtitle="Counting down to your big day"
            theme={theme}
          />
        </ScrollReveal>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, idx) => {
            const value = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds][idx];
            return (
              <ScrollReveal key={label} animation="scale" delay={100 + idx * 80}>
                <div
                  className={`${styles.card} ${cardStyle} ${shadowClass} p-4 border`}
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                >
                  <div className={`text-3xl font-bold ${headingFontClass}`} style={{ color: colors.primary }}>{value}</div>
                  <div className="text-sm" style={{ color: colors.text }}>{label}</div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
