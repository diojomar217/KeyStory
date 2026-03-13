'use client';

import type { Theme } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface QuotesSectionProps {
  theme: Theme;
  quotes?: { id: string; text: string; author?: string }[];
  variant?: 'default' | 'alt';
}

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
  const displayQuotes = quotes && quotes.length > 0 ? quotes : defaultQuotes;

  return (
    <section className={`py-20 md:py-24 ${variant === 'alt' ? 'bg-gradient-to-b from-slate-50/80 to-white/60' : 'bg-gradient-to-b from-rose-50/80 to-pink-50/60'} backdrop-blur-lg`} id="quotes">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="💕"
            title="Love Quotes"
            subtitle="Words that capture our feelings"
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="grid gap-8 lg:gap-12 max-w-4xl mx-auto">
            {displayQuotes.map((quote, index) => (
              <ScrollReveal key={quote.id} animation="fade-up" delay={index * 100}>
                <div className="
                  group bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl lg:shadow-2xl
                  p-10 lg:p-12 text-center hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-rose-100/50
                  hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 ease-out hover:border-rose-200/60
                  before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-rose-50/60 before:to-transparent before:blur-md before:-z-10 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-500
                  relative overflow-hidden
                ">
                  <blockquote className="text-2xl lg:text-3xl mb-6 italic font-light text-rose-800 leading-relaxed">
                    "{quote.text}"
                  </blockquote>
                  {quote.author && (
                    <cite className="text-lg font-semibold text-rose-700 not-italic">
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
