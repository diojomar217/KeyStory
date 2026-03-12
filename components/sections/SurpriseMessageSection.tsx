'use client';

import { useState } from 'react';
import { Theme } from '@/lib/types';
import { CardSectionLayout } from '../love/SectionLayouts';

interface SurpriseMessageSectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  message?: string;
  hint?: string;
}

// Default fallback values
const defaultMessage = 'I love you more than words can say! 💖';

export default function SurpriseMessageSection({ 
  theme, 
  customerName,
  partnerName,
  message,
  hint
}: SurpriseMessageSectionProps) {
  // Use provided message or fallback to default
  const displayMessage = message || defaultMessage;
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <CardSectionLayout
      title="A Surprise for You"
      subtitle={hint || 'Click the gift to reveal your surprise! 💕'}
      icon="🎉"
      theme={theme}
      variant="default"
      id="surprise"
    >
      <div className="max-w-3xl mx-auto text-center">
        {!isRevealed ? (
          <div>
            <button
              onClick={() => setIsRevealed(true)}
              className="relative group"
            >
              <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl animate-pulse bg-rose-500 text-white">
                🎁
              </div>
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-rose-300 animate-pulse" />
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-2xl animate-fade-in bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700">
            <div className="text-6xl mb-4">💕</div>
            <h3 className="text-2xl font-bold mb-4 text-rose-900 dark:text-zinc-100">
              Hey {partnerName}!
            </h3>
            <p className="text-lg mb-4 text-rose-600 dark:text-zinc-400">
              {customerName} wanted to tell you something special...
            </p>
            <p className="text-3xl font-bold text-rose-600 dark:text-rose-300">
              {displayMessage}
            </p>
            <button
              onClick={() => setIsRevealed(false)}
              className="mt-6 text-sm text-rose-500 hover:text-rose-600 underline"
            >
              Hide surprise
            </button>
          </div>
        )}
      </div>
    </CardSectionLayout>
  );
}

