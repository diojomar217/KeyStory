'use client';

import { Theme } from '@/lib/types';
import { CardSectionLayout, GridSectionLayout } from '../love/SectionLayouts';
import ScrollReveal from '../ScrollReveal';

interface Gift {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface GiftSectionProps {
  theme: Theme;
  partnerName: string;
  gifts?: Gift[];
}

// Use provided gifts or fallback to defaults - but only when gifts is undefined/empty
const defaultGifts: Gift[] = [
  { id: '1', title: 'Digital Love Letter', description: 'A personalized love letter just for you' },
  { id: '2', title: 'Memory Collage', description: 'Our best moments together in one place' },
  { id: '3', title: 'Playlist of Us', description: 'Songs that remind me of you' },
];

export default function GiftSection({ 
  theme, 
  partnerName,
  gifts
}: GiftSectionProps) {
  // Use provided gifts or fallback to defaults
  const displayGifts = gifts && gifts.length > 0 ? gifts : defaultGifts;

  return (
    <CardSectionLayout
      title="Digital Gifts for You"
      subtitle={`${partnerName}, these are just for you 💕`}
      icon="🎁"
      theme={theme}
      variant="default"
      id="gifts"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {displayGifts.map((gift, index) => (
          <ScrollReveal key={gift.id} animation="fade-up" delay={index * 100}>
            <div
              className="bg-white dark:bg-zinc-800 rounded-2xl border border-rose-100 dark:border-zinc-700 p-6 text-center hover:scale-105 hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-rose-100 dark:bg-zinc-700 mb-4">
                🎁
              </div>
              <h3 className="text-xl font-bold mb-2 text-rose-900 dark:text-zinc-100">
                {gift.title}
              </h3>
              <p className="text-rose-600 dark:text-zinc-400">{gift.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </CardSectionLayout>
  );
}

