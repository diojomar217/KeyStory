'use client';

import { useState } from 'react';
import { Theme } from '@/lib/types';
import { CardSectionLayout } from '../love/SectionLayouts';

interface LetterToFutureSectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  letter?: string;
  openDate?: string;
}

// Default fallback letter
const defaultLetter = `My love,

By the time you read this, I hope we've created even more beautiful memories together. I want you to know that every moment we've shared has been precious to me.

{customerName} loves {partnerName} more than words can express. Here's to our forever and beyond! 💕

With all my love,
Your {partnerName}`;

export default function LetterToFutureSection({ 
  theme, 
  customerName,
  partnerName,
  letter,
  openDate
}: LetterToFutureSectionProps) {
  // Use provided letter or build default with names
  const displayLetter = letter || defaultLetter.replace(/{customerName}/g, customerName).replace(/{partnerName}/g, partnerName);
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <CardSectionLayout
      title="Letter to Our Future"
      subtitle="A message for the future us"
      icon="📮"
      theme={theme}
      variant="default"
      id="letter-future"
    >
      <div className="max-w-3xl mx-auto">
        <div 
          className="p-8 rounded-2xl text-center bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700"
        >
          {!isRevealed ? (
            <div>
              <div className="text-6xl mb-6">💌</div>
              <h3 className="text-2xl font-bold mb-4 text-rose-900 dark:text-zinc-100">
                A Message for the Future
              </h3>
              <p className="mb-6 text-rose-600 dark:text-zinc-400">
                Click below to reveal your letter to each other
              </p>
              <button
                onClick={() => setIsRevealed(true)}
                className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105 bg-rose-500 text-white hover:bg-rose-600"
              >
                Open Letter 💕
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-rose-900 dark:text-zinc-100">
                Dear Future Us,
              </h3>
              <div className="prose max-w-none text-left whitespace-pre-wrap text-rose-700 dark:text-zinc-300">
                {displayLetter}
              </div>
              <button
                onClick={() => setIsRevealed(false)}
                className="mt-6 text-sm text-rose-500 hover:text-rose-600 underline"
              >
                Close letter
              </button>
            </div>
          )}
        </div>
      </div>
    </CardSectionLayout>
  );
}

