'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface QuotesSectionProps {
  theme: Theme;
  quotes?: { id: string; text: string; author?: string }[];
}

// Default romantic quotes
const defaultQuotes = [
  { id: '1', text: 'Love is composed of two souls protecting each other.', author: 'Thich Nhat Hanh' },
  { id: '2', text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn' },
  { id: '3', text: 'To love and be loved is to feel the sun from both sides.', author: 'David Viscott' },
  { id: '4', text: 'Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.', author: 'Unknown' },
];

export default function QuotesSection({ theme, quotes = defaultQuotes }: QuotesSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-12"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          💕 Love Quotes
        </h2>
        
        <div className="grid gap-6">
          {quotes.map((quote, index) => (
            <div
              key={quote.id}
              className="p-8 rounded-2xl text-center"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <blockquote 
                className="text-xl mb-4 italic"
                style={{ 
                  color: colors.text,
                  fontFamily: typography.bodyFont
                }}
              >
                "{quote.text}"
              </blockquote>
              {quote.author && (
                <cite 
                  className="text-sm not-italic"
                  style={{ color: colors.accent }}
                >
                  — {quote.author}
                </cite>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

