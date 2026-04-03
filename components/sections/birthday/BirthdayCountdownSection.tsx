'use client';

import { useState, useEffect } from 'react';
import { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';

interface Props {
  theme: ThemeKey;
  birthdayDate: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function BirthdayCountdownSection({ theme, birthdayDate }: Props) {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const date = new Date(birthdayDate);
      if (!birthdayDate || Number.isNaN(date.getTime())) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date();
      let nextBirthday = new Date(now.getFullYear(), date.getMonth(), date.getDate());
      if (now > nextBirthday) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }

      const diff = nextBirthday.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [birthdayDate]);

  return (
    <section className={`${spacingClass} ${styles.sectionBg}`} id="birthday-countdown">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('birthday_countdown');
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

        <div className="mt-6 grid grid-cols-4 gap-3 text-center">
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
