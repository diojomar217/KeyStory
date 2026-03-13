'use client';

import type { Theme } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface OurStorySectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  story?: string;
  variant?: 'default' | 'alt';
}

export default function OurStorySection({ 
  theme, 
  customerName, 
  partnerName,
  story,
  variant = 'default'
}: OurStorySectionProps) {
  const defaultStory = `This is the story of ${customerName} and ${partnerName}...

Every love story is beautiful, but theirs is their favorite. From the moment they met, something special began. It was like finding the missing piece of a puzzle they didn't know was incomplete.

Through sunny days and rainy afternoons, through laughter and tears, their bond grew stronger with each passing moment. They learned that love isn't about perfection—it's about choosing each other every single day.

This is just the beginning of their forever.`;

  return (
    <section className={`py-20 md:py-24 ${variant === 'alt' ? 'bg-gradient-to-b from-slate-50/80 to-white/60' : 'bg-gradient-to-b from-rose-50/80 to-pink-50/60'} backdrop-blur-lg`} id="our-story">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="📖"
            title="Our Story"
            subtitle="The beautiful journey of us"
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="
              bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl lg:rounded-[3rem] 
              shadow-2xl lg:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)]
              p-12 lg:p-16 xl:p-20 hover:shadow-[0_35px_60px_-15px_rgba(244,114,182,0.15)] hover:border-rose-200/50 hover:-translate-y-2
              transition-all duration-500 ease-out relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-rose-50/50 before:to-transparent before:blur-xl before:-z-10
            ">
              <div className="max-w-3xl mx-auto text-rose-700 leading-relaxed text-lg">
                {(story || defaultStory).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-8">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
