'use client';

import { Theme } from '@/lib/types';
import ScrollReveal from '../ScrollReveal';

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
  const content = letter || `${defaultLetter}${customerName} & ${partnerName}`;
  const date = openDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 3).toLocaleDateString();

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-rose-50/80 to-pink-50/60 backdrop-blur-lg" id="letter-future">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16 lg:mb-24 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center mb-6 p-2 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl ring-2 ring-offset-4 ring-rose-100/50">
              <span className="text-3xl md:text-4xl drop-shadow-2xl ring-2 ring-offset-2 ring-white/50 shadow-lg text-rose-400">💌</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Letter to Our Future
            </h2>
            <div className="w-24 h-1.5 mx-auto mt-4 bg-gradient-to-r from-transparent via-white/90 to-transparent bg-[length:200% 100%] animate-shimmer rounded-full shadow-xl border border-white/50 p-1 backdrop-blur-sm" />
            <p className="mt-6 text-lg md:text-xl font-medium max-w-xl mx-auto text-rose-700">
              Open on {date}
            </p>
          </div>
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

