'use client';

import { Theme } from '@/lib/types';
import { CardSectionLayout } from '../love/SectionLayouts';
import ScrollReveal from '../ScrollReveal';

interface FutureDream {
  id: string;
  title: string;
  description: string;
  targetYear?: string;
}

interface FutureDreamsSectionProps {
  theme: Theme;
  dreams?: FutureDream[];
  sectionContent?: {
    dreams: FutureDream[];
  };
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
  // Use provided dreams or fallback to defaults
  const displayDreams = dreams && dreams.length > 0 ? dreams : defaultDreams;

  return (
    <CardSectionLayout
      title="Future Dreams"
      subtitle="Our hopes and dreams together"
      icon="💭"
      theme={theme}
      variant={variant}
      id="future-dreams"
    >
      <div className="grid gap-6 max-w-4xl mx-auto">
        {displayDreams.map((dream, index) => (
          <ScrollReveal key={dream.id} animation="fade-up" delay={index * 100}>
            <div
              className="bg-white dark:bg-zinc-800 rounded-2xl border border-rose-100 dark:border-zinc-700 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-rose-900 dark:text-zinc-100">
                    {dream.title}
                  </h3>
                  <p className="text-rose-600 dark:text-zinc-400">
                    {dream.description}
                  </p>
                </div>
                {dream.targetYear && (
                  <span className="bg-rose-100 dark:bg-zinc-700 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-sm font-medium ml-4 flex-shrink-0">
                    {dream.targetYear}
                  </span>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </CardSectionLayout>
  );
}

