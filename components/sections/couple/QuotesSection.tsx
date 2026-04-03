'use client';

import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import { useThemeUtils } from '@/components/builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';

import ScrollReveal from '../../ui/ScrollReveal'; // Ensure this is a default import

interface QuotesSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  quotes?: { id: string; text: string; author?: string }[];
  variant?: 'default' | 'alt';
}

export default function QuotesSection({ 
  theme, 
  siteType = 'couple',
  quotes,
  variant = 'default'
}: QuotesSectionProps) {
  const displayQuotes = quotes && quotes.length > 0 ? quotes : (() => {
    switch (siteType) {
      case 'baby_shower':
        return [
          { id: '1', text: 'A baby fills a place in your heart that you never knew was empty.', author: 'Unknown' },
          { id: '2', text: 'Sometimes the smallest things take up the most room in your heart.', author: 'A.A. Milne' },
          { id: '3', text: 'There are words in the soul of a newborn baby, wanting and waiting to be written.', author: 'Toba Beta' },
        ];
      case 'memorial':
        return [
          { id: '1', text: 'What we have once enjoyed deeply we can never lose. All that we love deeply becomes a part of us.', author: 'Helen Keller' },
          { id: '2', text: 'Unable are the loved to die, for love is immortality.', author: 'Emily Dickinson' },
          { id: '3', text: 'Those we love and lose are always connected by heartstrings into infinity.', author: 'Terri Guillemets' },
        ];
      case 'graduation':
        return [
          { id: '1', text: 'Go confidently in the direction of your dreams. Live the life you have imagined.', author: 'Henry David Thoreau' },
          { id: '2', text: 'Your education is a dress rehearsal for a life that is yours to lead.', author: 'Nora Ephron' },
          { id: '3', text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
        ];
      case 'travel':
        return [
          { id: '1', text: 'Travel is the only thing you buy that makes you richer.', author: 'Unknown' },
          { id: '2', text: 'Wherever you go becomes a part of you somehow.', author: 'Anita Desai' },
          { id: '3', text: 'The journey, not the arrival, matters.', author: 'T.S. Eliot' },
        ];
      case 'family':
        return [
          { id: '1', text: 'Family is not an important thing. It is everything.', author: 'Michael J. Fox' },
          { id: '2', text: 'The memories we make with our family is everything.', author: 'Candace Cameron Bure' },
          { id: '3', text: 'In time of test, family is best.', author: 'Burmese Proverb' },
        ];
      case 'friendship':
        return [
          { id: '1', text: 'A real friend is one who walks in when the rest of the world walks out.', author: 'Walter Winchell' },
          { id: '2', text: 'Friendship is the only cement that will ever hold the world together.', author: 'Woodrow Wilson' },
          { id: '3', text: 'True friendship comes when the silence between two people is comfortable.', author: 'David Tyson' },
        ];
      default:
        return [
          { id: '1', text: 'Love is composed of two souls protecting each other.', author: 'Thich Nhat Hanh' },
          { id: '2', text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn' },
          { id: '3', text: 'To love and be loved is to feel the sun from both sides.', author: 'David Viscott' },
          { id: '4', text: 'Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.', author: 'Unknown' },
        ];
    }
  })();
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

  return (
    <section className={`px-4 ${spacingClass}`} id="quotes">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('quotes', siteType);
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

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="grid gap-8 lg:gap-12 max-w-4xl mx-auto">
            {displayQuotes.map((quote, index) => (
              <ScrollReveal key={quote.id} animation="fade-up" delay={index * 100}>
                <div
                  className={`
                    group ${cardStyle} ${shadowClass} backdrop-blur-xl border
                    p-10 lg:p-12 text-center lg:shadow-2xl
                    hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]
                    hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 ease-out
                    before:absolute before:inset-0 before:${cardStyle}
                    before:bg-gradient-to-br before:from-[var(--quote-gradient-start)] before:to-[var(--quote-gradient-end)]
                    before:blur-md before:-z-10 before:opacity-0 group-hover:before:opacity-100
                    before:transition-all before:duration-500
                    relative overflow-hidden
                  `}
                  style={{
                    backgroundColor: themeUtils.colors.card,
                    borderColor: themeUtils.colors.border,
                    ['--quote-gradient-start' as string]: `${themeUtils.colors.primary}33`,
                    ['--quote-gradient-end' as string]: `${themeUtils.colors.accent}00`,
                  }}
                >
                  <blockquote
                    className={`text-2xl lg:text-3xl mb-6 italic font-light leading-relaxed ${headingFontClass}`}
                    style={{ color: themeUtils.colors.primary }}
                  >
                    <span className="inline-block mr-2 text-4xl leading-none align-middle">"</span>
                    {quote.text}
                  </blockquote>
                  {quote.author && (
                    <cite
                      className="text-lg font-semibold not-italic"
                      style={{ color: themeUtils.colors.accent }}
                    >
                      — {quote.author}
                    </cite>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
