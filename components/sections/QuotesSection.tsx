'use client';

import { Theme } from '@/lib/types';
import Section from '../Section';
import ScrollReveal from '../ScrollReveal';
import { useTheme } from '../ThemeWrapper';

interface QuotesSectionProps {
  theme: Theme;
  quotes?: { id: string; text: string; author?: string }[];
  variant?: 'default' | 'alt';
}

// Default romantic quotes
const defaultQuotes = [
  { id: '1', text: 'Love is composed of two souls protecting each other.', author: 'Thich Nhat Hanh' },
  { id: '2', text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn' },
  { id: '3', text: 'To love and be loved is to feel the sun from both sides.', author: 'David Viscott' },
  { id: '4', text: 'Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.', author: 'Unknown' },
];

export default function QuotesSection({ 
  theme, 
  quotes,
  variant = 'default'
}: QuotesSectionProps) {
  // Use provided quotes or fallback to defaults
  const displayQuotes = quotes && quotes.length > 0 ? quotes : defaultQuotes;
  const styles = useTheme(theme);

  return (
    <Section
      title="Love Quotes"
      subtitle="Words that capture our feelings"
      icon="💕"
      theme={theme}
      variant={variant}
      id="quotes"
    >
      <div className="grid gap-6">
        {displayQuotes.map((quote, index) => (
          <ScrollReveal key={quote.id} animation="fade-up" delay={index * 100}>
            <div
              className={`${styles.card} rounded-2xl ${styles.cardBorder} border p-8 text-center hover:shadow-lg transition-all`}
            >
              <blockquote className="text-xl mb-4 italic text-gray-700 dark:text-gray-300">
                "{quote.text}"
              </blockquote>
              {quote.author && (
                <cite className="text-sm not-italic text-gray-500 dark:text-gray-400">
                  — {quote.author}
                </cite>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

