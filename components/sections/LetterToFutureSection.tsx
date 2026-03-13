 'use client';

import { Theme } from '@/lib/types';
import SectionHeader from '../SectionHeader';
import ScrollReveal from '../ScrollReveal';
import { useTheme } from '../ThemeWrapper';

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
  const date = openDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 3).toLocaleDateString();

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-rose-50/80 to-pink-50/60 backdrop-blur-lg" id="letter-future">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="💌"
            title="Letter to Our Future"
            subtitle={'Open on ' + date}
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
            <div className="prose prose-lg text-rose-800 leading-relaxed">
              <p className="text-2xl italic mb-8 font-light text-center">"</p>
              <div className="whitespace-pre-wrap text-lg leading-8">
                {content}
              </div>
              <p className="text-2xl italic mt-8 font-light text-center">"</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

