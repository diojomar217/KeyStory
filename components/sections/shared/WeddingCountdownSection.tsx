'use client';

import { useEffect, useState } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';

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
  const styles = useTheme(theme);
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
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="wedding-countdown">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <SectionHeader
          icon="\ud83d\udc8d"
          title="Wedding Countdown"
          subtitle="Counting down to your big day"
          theme={theme}
        />

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, idx) => {
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
