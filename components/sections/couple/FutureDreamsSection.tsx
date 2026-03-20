'use client';

import type { Theme } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface FutureDream {
  id: string;
  title: string;
  description: string;
  targetYear?: string;
}

interface FutureDreamsSectionProps {
  theme: Theme;
  dreams?: FutureDream[];
  variant?: 'default' | 'alt';
}

const defaultDreams: FutureDream[] = [
  { id: '1', title: 'Dream Home', description: 'Building our perfect home together', targetYear: '2025' },
  { id: '2', title: 'Travel the World', description: 'Exploring new countries and cultures', targetYear: '2026' },
  { id: '3', title: 'Start a Family', description: 'Beginning the next chapter', targetYear: '2027' },
  { id: '4', title: 'Grow Old Together', description: 'Living a lifetime of adventures', targetYear: 'Forever' },
];

export default function FutureDreamsSection({ 
  theme, 
  dreams,
  variant = 'default'
}: FutureDreamsSectionProps) {
  const displayDreams = dreams && dreams.length > 0 ? dreams : defaultDreams;

  return (
    <section className="relative py-20 md:py-24" id="future-dreams">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="💭"
            title="Future Dreams"
            subtitle="Our hopes and dreams together"
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="grid gap-8 lg:gap-12 max-w-6xl mx-auto">
            {displayDreams.map((dream, index) => (
              <ScrollReveal key={dream.id} animation="fade-up" delay={index * 100}>
                <div className="
                  group bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl lg:shadow-2xl
                  p-8 lg:p-10 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-rose-100/50
                  hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 ease-out hover:border-rose-200/60
                  before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-rose-50/60 before:to-transparent before:blur-md before:-z-10 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-500
                  relative overflow-hidden
                ">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-rose-900">
                        {dream.title}
                      </h3>
                      <p className="text-rose-700 text-lg leading-relaxed">
                        {dream.description}
                      </p>
                    </div>
                    {dream.targetYear && (
                      <span className="bg-rose-100 text-rose-700 px-4 py-2 rounded-2xl text-lg font-semibold ml-6 flex-shrink-0 shadow-lg">
                        {dream.targetYear}
                      </span>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
