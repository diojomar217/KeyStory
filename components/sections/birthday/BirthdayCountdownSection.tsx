'use client';

import { useState, useEffect } from 'react';
import { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';

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
  const styles = useTheme(theme);
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
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="birthday-countdown">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
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

        <div className="mt-6 grid grid-cols-4 gap-3 text-center">
          {['Days','Hours','Minutes','Seconds'].map((label, idx) => {
            const value = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds][idx];
            return (
              <div key={label} className={`${styles.card} p-4 rounded-xl border ${styles.border} shadow-md`}>
                <div className={`text-3xl font-bold ${styles.accent}`}>{value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
