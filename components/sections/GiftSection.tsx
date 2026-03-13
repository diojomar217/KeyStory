'use client';

import type { Theme } from '@/lib/types';
import SectionHeader from '../SectionHeader';
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
  const displayGifts = gifts && gifts.length > 0 ? gifts : defaultGifts;

  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-rose-50/80 to-pink-50/60 backdrop-blur-lg" id="gifts">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="🎁"
            title="Digital Gifts for You"
            subtitle={`${partnerName}, these are just for you 💕`}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="grid gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {displayGifts.map((gift, index) => (
              <ScrollReveal key={gift.id} animation="fade-up" delay={index * 100}>
                <div className="
                  group bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl lg:shadow-2xl
                  p-10 lg:p-12 text-center h-full flex flex-col items-center hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-rose-100/50
                  hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 ease-out hover:border-rose-200/60
                  before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-rose-50/60 before:to-transparent before:blur-md before:-z-10 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-500
                  relative overflow-hidden
                ">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl bg-rose-100 mb-6 shadow-xl">
                    🎁
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-rose-900">
                    {gift.title}
                  </h3>
                  <p className="text-rose-700 text-lg leading-relaxed flex-grow">
                    {gift.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
