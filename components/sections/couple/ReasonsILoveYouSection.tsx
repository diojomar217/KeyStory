'use client';

import { useState } from "react";
import { Theme } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { useTheme } from '../../builder/ThemeWrapper';

interface Reason {
  id: string;
  number: number;
  text: string;
}

interface ReasonsILoveYouSectionProps {
  theme: Theme;
  partnerName: string;
  reasons?: Reason[];
  variant?: 'default' | 'alt';
}

const defaultReasons: Reason[] = [
  { id: '1', number: 1, text: 'The way you make me laugh even on my worst days' },
  { id: '2', number: 2, text: 'Your beautiful smile that lights up every room' },
  { id: '3', number: 3, text: 'How caring and compassionate you are to everyone' },
  { id: '4', number: 4, text: 'The way you understand me without words' },
  { id: '5', number: 5, text: 'Your amazing sense of humor' },
  { id: '6', number: 6, text: 'How hard you work for your dreams' },
  { id: '7', number: 7, text: 'The way you support me in everything I do' },
  { id: '8', number: 8, text: 'Your kind heart and gentle soul' },
  { id: '9', number: 9, text: 'The way we can be ourselves around each other' },
  { id: '10', number: 10, text: 'Simply being you' },
];

export default function ReasonsILoveYouSection({ 
  theme, 
  partnerName,
  reasons,
  variant = 'default'
}: ReasonsILoveYouSectionProps) {
  const displayReasons = reasons && reasons.length > 0 ? reasons : defaultReasons;
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section id="reasons-love-you" className={'py-24 lg:py-32 ' + (variant === 'alt' ? 'bg-gradient-to-b from-slate-50/80 to-white/60 backdrop-blur-xl' : 'bg-gradient-to-b from-pink-50/70 to-rose-50/50 backdrop-blur-xl')}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          icon="💖"
          title="10 Things I Love About You"
          subtitle={'❤️ ' + partnerName + ', here are all the reasons I love you'}
          theme={theme}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {displayReasons.map((reason) => (
            <div key={reason.id} className="group relative h-[200px] lg:h-[220px] perspective-[1200px] cursor-pointer overflow-hidden" onClick={() => toggleFlip(reason.id)}>
              <div className={'relative w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] preserve-3d hover:scale-[1.02]' + (flippedCards.has(reason.id) ? ' rotate-y-180' : ' rotate-y-0')}>
                <div className="absolute inset-0 preserve-3d backface-hidden bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl flex items-center justify-center p-6 lg:p-8 ring-2 ring-rose-100/60 hover:ring-rose-200/80 hover:shadow-[0_20px_40px_rgba(244,114,182,0.2)] transition-all duration-500 group-hover:shadow-rose-200/50 before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-rose-50/70 before:to-pink-50/50 before:blur-md before:opacity-0 group-hover:before:opacity-100">
                  <div className="flex items-center gap-4 lg:gap-6 text-center">
                    <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center text-3xl lg:text-4xl font-black bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-2xl ring-4 ring-white/30 hover:scale-110 transition-all duration-300 animate-gentle-pulse">
                      {reason.number}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl lg:text-3xl animate-bounce-slow mb-2">❤️</span>
                      <p className="text-lg lg:text-xl font-semibold text-gray-600 tracking-wide leading-tight">
                        Tap to reveal
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 preserve-3d backface-hidden rotate-y-180 bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-500 rounded-3xl shadow-2xl flex items-center justify-center p-8 lg:p-10 text-center ring-4 ring-white/40 shadow-[0_25px_50px_rgba(236,72,153,0.4)] text-white font-medium leading-relaxed text-lg lg:text-xl tracking-wide hover:shadow-[0_30px_60px_rgba(236,72,153,0.5)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)] before:bg-no-repeat before:opacity-90 before:blur-sm">
                  <p className="max-w-md mx-auto drop-shadow-lg">{reason.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
