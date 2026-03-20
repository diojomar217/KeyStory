 'use client';

import { Theme } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';
import { useTheme } from '../../builder/ThemeWrapper';

interface LetterToFutureSectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  letter?: string;
  openDate?: string;
}

const defaultLetter = `Dear Future Us,

Today we took a moment to dream about what our life will be like in the years ahead. We imagine mornings filled with laughter, adventures that take our breath away, and quiet moments where just being together is enough.

We can't wait to see the family we'll build, the memories we'll make, and the love that will only grow stronger with time.

Sealed with love today for the beautiful future we'll share,
`;

export default function LetterToFutureSection({
  theme,
  customerName,
  partnerName,
  letter,
  openDate
}: LetterToFutureSectionProps) {
  const styles = useTheme(theme);
  const content = letter || `${defaultLetter}${customerName} & ${partnerName}`;

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
    <section className="relative py-24 lg:py-32" id="letter-future">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="💌"
            title="Letter to Our Future"
            subtitle={isLocked ? `Available on ${displayDate}` : `Open on ${displayDate}`}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="
            bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl lg:rounded-[3rem] shadow-2xl lg:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] p-12 lg:p-16 xl:p-20
            hover:shadow-[0_35px_60px_-15px_rgba(244,114,182,0.15)] hover:border-rose-200/50 hover:-translate-y-2
            transition-all duration-500 ease-out relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-rose-50/50 before:to-transparent before:blur-xl before:-z-10
            max-w-3xl mx-auto
          ">
            {isLocked ? (
              <div className="text-center text-rose-700 text-lg font-medium p-10">
                Your letter is locked until {displayDate}. Come back then to see your message to the future.
              </div>
            ) : (
              <div className="prose prose-lg text-rose-800 leading-relaxed">
                <p className="text-2xl italic mb-8 font-light text-center">"</p>
                <div className="whitespace-pre-wrap text-lg leading-8">
                  {content}
                </div>
                <p className="text-2xl italic mt-8 font-light text-center">"</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

