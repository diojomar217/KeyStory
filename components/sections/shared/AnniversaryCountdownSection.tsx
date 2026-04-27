'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import type { SectionAsset } from '@/lib/types';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface AnniversaryCountdownSectionProps {
  theme: ThemeKey;
  anniversaryDate: string;
  yearsTogether?: number;
  variant?: 'default' | 'alt';
  assets?: SectionAsset;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type Mode = 'countdown' | 'together';

export default function AnniversaryCountdownSection({
  theme,
  anniversaryDate,
  yearsTogether = 1,
  variant = 'default',
}: AnniversaryCountdownSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const { colors, typography, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

  const [mode, setMode] = useState<Mode>('countdown');
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [timeTogether, setTimeTogether] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimes = () => {
      if (!anniversaryDate || isNaN(new Date(anniversaryDate).getTime())) {
        const empty = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        setCountdown(empty);
        setTimeTogether(empty);
        return;
      }

      const anniversary = new Date(anniversaryDate);
      const now = new Date();

      // Countdown to next anniversary
      let nextAnniversary = new Date(
        now.getFullYear(),
        anniversary.getMonth(),
        anniversary.getDate()
      );

      if (now > nextAnniversary) {
        nextAnniversary = new Date(
          now.getFullYear() + 1,
          anniversary.getMonth(),
          anniversary.getDate()
        );
      }

      const countdownDiff = nextAnniversary.getTime() - now.getTime();

      setCountdown({
        days: Math.floor(countdownDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((countdownDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((countdownDiff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((countdownDiff % (1000 * 60)) / 1000),
      });

      // Time together since anniversary/start date
      const togetherDiff = Math.max(0, now.getTime() - anniversary.getTime());

      setTimeTogether({
        days: Math.floor(togetherDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((togetherDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((togetherDiff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((togetherDiff % (1000 * 60)) / 1000),
      });
    };

    calculateTimes();
    const interval = setInterval(calculateTimes, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const formatAnniversaryDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid anniversary date';

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const displayItems =
    mode === 'countdown'
      ? [
        { label: 'Days', value: countdown.days },
        { label: 'Hours', value: countdown.hours },
        { label: 'Minutes', value: countdown.minutes },
        { label: 'Seconds', value: countdown.seconds },
      ]
      : [
        { label: 'Days Together', value: timeTogether.days },
        { label: 'Hours', value: timeTogether.hours },
        { label: 'Minutes', value: timeTogether.minutes },
        { label: 'Seconds', value: timeTogether.seconds },
      ];

  const sectionVars = {
    '--countdown-primary': colors.primary,
    '--countdown-text': colors.text,
    '--countdown-card': colors.card,
    '--countdown-border': colors.border,
  } as CSSProperties;

  return (
    <section
      className={`relative overflow-hidden ${styles.sectionBgAlt} ${spacingClass}`}
      style={sectionVars}
    >
      {/* Floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[8%] top-[20%] text-2xl opacity-20 heart-float">💗</span>
        <span className="absolute right-[10%] top-[18%] text-3xl opacity-20 heart-float delay-1">💖</span>
        <span className="absolute left-[14%] bottom-[18%] text-2xl opacity-15 heart-float delay-2">💕</span>
        <span className="absolute right-[14%] bottom-[20%] text-3xl opacity-15 heart-float delay-3">💞</span>
        <span className="absolute left-[25%] top-[38%] text-xl opacity-10 heart-float delay-4">✨</span>
        <span className="absolute right-[24%] top-[45%] text-xl opacity-10 heart-float delay-2">✨</span>
      </div>

      {/* Soft center glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-3xl opacity-10"
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 72%)`,
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="⏰"
            title={mode === 'countdown' ? `Our ${yearsTogether + 1} Year Anniversary` : 'Our Time Together'}
            subtitle={
              mode === 'countdown'
                ? "Every second counts when we're together"
                : 'Every moment with you is special'
            }
            theme={theme}
            className="mb-8"
          />
        </ScrollReveal>

        {/* Toggle */}
        <ScrollReveal animation="fade-up" delay={120}>
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex p-1 rounded-full"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                boxShadow: `0 6px 20px color-mix(in srgb, ${colors.primary} 20%, transparent)`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <button
                type="button"
                onClick={() => setMode('countdown')}
                className="px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300"
                style={{
                  backgroundColor: mode === 'countdown' ? colors.primary : 'transparent',
                  color: mode === 'countdown' ? colors.background : colors.text,
                }}
              >
                Countdown
              </button>
              <button
                type="button"
                onClick={() => setMode('together')}
                className="px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300"
                style={{
                  backgroundColor: mode === 'together' ? colors.primary : 'transparent',
                  color: mode === 'together' ? colors.background : colors.text,
                }}
              >
                Time Together
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Anniversary date */}
        <ScrollReveal animation="fade-up" delay={180}>
          <p
            className="mb-8 text-sm md:text-base font-medium opacity-80"
            style={{ color: colors.text }}
          >
            Our special date: <span style={{ color: colors.primary }}>{formatAnniversaryDate(anniversaryDate)}</span>
          </p>
        </ScrollReveal>

        <div
          className="w-20 h-[2px] mx-auto mb-8 rounded-full opacity-60"
          style={{
            background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)`
          }}
        />

        {/* Cards */}
        <div className="flex justify-center gap-5 md:gap-6 flex-wrap mt-4">
          {displayItems.map((item) => {
            const isSeconds = item.label === 'Seconds';

            return (
              <ScrollReveal key={item.label} animation="scale" delay={220 + displayItems.indexOf(item) * 90}>
                <div
                  className={`group relative ${cardStyle} ${shadowClass} min-w-[120px] md:min-w-[135px] px-7 py-7 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.04] ${isSeconds ? 'seconds-pulse' : ''}`}
                  style={{
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}`,
                    boxShadow: `0 12px 40px color-mix(in srgb, ${colors.primary} 25%, transparent), inset 0 1px 0 color-mix(in srgb, ${colors.background} 70%, transparent)`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    className="absolute inset-x-5 top-0 h-px opacity-70"
                    style={{
                      background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)`,
                    }}
                  />

                  <div
                    className={`text-4xl md:text-5xl font-bold leading-none tracking-tight transition-all duration-300 group-hover:scale-105 ${headingFontClass}`}
                    style={{
                      color: colors.primary,
                      fontFamily: typography.headingFont,
                      letterSpacing: '-0.02em',
                      textShadow: `0 6px 18px color-mix(in srgb, ${colors.primary} 25%, transparent)`,
                    }}
                  >
                    {item.value}
                  </div>

                  <div
                    className="mt-3 text-base font-medium"
                    style={{ color: colors.text }}
                  >
                    {item.label}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .heart-float {
          animation: floatHeart 6s ease-in-out infinite;
        }

        .delay-1 {
          animation-delay: 1s;
        }

        .delay-2 {
          animation-delay: 2s;
        }

        .delay-3 {
          animation-delay: 3s;
        }

        .delay-4 {
          animation-delay: 4s;
        }

        .seconds-pulse {
          animation: softPulse 1.6s ease-in-out infinite;
        }

        @keyframes floatHeart {
          0% {
            transform: translateY(0px);
            opacity: 0.12;
          }
          50% {
            transform: translateY(-12px);
            opacity: 0.28;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.12;
          }
        }

        @keyframes softPulse {
          0% {
            box-shadow:
              0 10px 30px color-mix(in srgb, var(--countdown-text) 12%, transparent),
              inset 0 1px 0 color-mix(in srgb, var(--countdown-card) 72%, transparent),
              0 0 0 0 color-mix(in srgb, var(--countdown-primary) 22%, transparent);
          }
          50% {
            box-shadow:
              0 10px 30px color-mix(in srgb, var(--countdown-text) 12%, transparent),
              inset 0 1px 0 color-mix(in srgb, var(--countdown-card) 72%, transparent),
              0 0 0 10px color-mix(in srgb, var(--countdown-primary) 0%, transparent);
          }
          100% {
            box-shadow:
              0 10px 30px color-mix(in srgb, var(--countdown-text) 12%, transparent),
              inset 0 1px 0 color-mix(in srgb, var(--countdown-card) 72%, transparent),
              0 0 0 0 color-mix(in srgb, var(--countdown-primary) 22%, transparent);
          }
        }
      `}</style>
    </section>
  );
}