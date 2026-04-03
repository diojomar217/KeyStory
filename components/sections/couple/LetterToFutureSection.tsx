 'use client';

import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import { formatOccasionDisplayName } from '@/lib/public-site-copy';

interface LetterToFutureSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  customerName: string;
  partnerName: string;
  letter?: string;
  openDate?: string;
}

export default function LetterToFutureSection({
  theme,
  siteType = 'couple',
  customerName,
  partnerName,
  letter,
  openDate
}: LetterToFutureSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const displayName = formatOccasionDisplayName(siteType, customerName, partnerName);
  const copy = getSectionCopy('letter_future', siteType);
  const defaultLetter = (() => {
    switch (siteType) {
      case 'graduation':
        return `Dear Future Me,\n\nToday marks a milestone worth remembering. I hope the version of me reading this is proud of how far I came and still brave enough to keep growing.\n\nI hope I stayed curious, kind, and bold about what comes next.\n\nWith belief in what is ahead,\n${displayName}`;
      case 'travel':
        return `Dear Future Traveler,\n\nI hope the journeys ahead are just as meaningful as the ones that brought me here. I hope I keep saying yes to wonder, to unfamiliar places, and to stories worth carrying home.\n\nMay I never stop exploring what the world can teach me.\n\nUntil the next destination,\n${displayName}`;
      case 'family':
        return `Dear Future Family,\n\nI hope the years ahead bring more shared meals, more laughter, and more moments that become stories we tell again and again.\n\nMay the love at the center of this family keep growing stronger with time.\n\nWith love,\n${displayName}`;
      default:
        return `Dear Future Us,\n\nToday we took a moment to dream about what our life will be like in the years ahead. We imagine mornings filled with laughter, adventures that take our breath away, and quiet moments where just being together is enough.\n\nWe can't wait to see the memories we'll make and the life that will keep unfolding with time.\n\nSealed with love today for the future we'll share,\n${displayName}`;
    }
  })();
  const content = letter || defaultLetter;

  const now = new Date();

  const getDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const parseDateInput = (value: string) => {
    if (!value) return null;

    // Accept ISO date strings, timezone-aware datetimes, or date-only values.
    // Examples:
    //  - 2026-03-20
    //  - 2026-03-20T00:00:00.000Z
    //  - 2026-03-20 00:00:00
    //  - 03/20/2026 (fallback)
    const dateOnlyCandidate = value.split('T')[0].split(' ')[0];

    const parts = dateOnlyCandidate.split('-').map(Number);
    if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
      const [y, m, d] = parts;
      if (y && m && d) {
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
    }

    const fallback = new Date(value);
    if (!Number.isNaN(fallback.getTime())) {
      const y = fallback.getFullYear();
      const m = fallback.getMonth() + 1;
      const d = fallback.getDate();
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    return null;
  };

  const todayKey = getDateKey(now);
  const openDateKey = parseDateInput(openDate || '');

  const isLocked = openDateKey ? todayKey < openDateKey : false;
  const displayDate = openDateKey
    ? openDateKey
    : getDateKey(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 3));

  return (
    <section className={`relative ${spacingClass}`} id="letter-future">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon={copy.icon}
            title={copy.title}
            subtitle={isLocked ? `Available on ${displayDate}` : `Open on ${displayDate}`}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div
            className={`
              ${cardStyle} ${shadowClass} border backdrop-blur-xl p-12 lg:p-16 xl:p-20
              transition-all duration-500 ease-out relative overflow-hidden max-w-3xl mx-auto hover:-translate-y-2
            `}
            style={{
              backgroundColor: `${themeUtils.colors.card}F2`,
              borderColor: `${themeUtils.colors.border}B3`,
              boxShadow: `0 35px 60px -15px ${themeUtils.colors.primary}22`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(135deg, ${themeUtils.colors.secondary}44, transparent)`,
              }}
            />
            {isLocked ? (
              <div className={`text-center text-lg font-medium p-10 ${headingFontClass}`} style={{ color: themeUtils.colors.text }}>
                Your letter is locked until {displayDate}. Come back then to see your message to the future.
              </div>
            ) : (
              <div className="prose prose-lg leading-relaxed" style={{ color: themeUtils.colors.text }}>
                <p className={`text-2xl italic mb-8 font-light text-center ${headingFontClass}`} style={{ color: themeUtils.colors.primary }}>
                  "
                </p>
                <div className="whitespace-pre-wrap text-lg leading-8">
                  {content}
                </div>
                <p className={`text-2xl italic mt-8 font-light text-center ${headingFontClass}`} style={{ color: themeUtils.colors.primary }}>
                  "
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

