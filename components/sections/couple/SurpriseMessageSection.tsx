'use client';

import { useState } from 'react';
import { Theme } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';
import { useTheme } from '../../builder/ThemeWrapper';

interface SurpriseMessageSectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  message?: string;
  hint?: string;
}

const defaultMessage = 'I love you more than words can say! 💖';

export default function SurpriseMessageSection({ 
  theme, 
  customerName,
  partnerName,
  message,
  hint
}: SurpriseMessageSectionProps) {
  const displayMessage = message || defaultMessage;
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-rose-50/80 to-pink-50/60 backdrop-blur-lg" id="surprise">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="🎉"
            title="A Surprise for You"
            subtitle={hint || 'Click the gift to reveal your surprise! 💕'}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="max-w-3xl mx-auto text-center">
            {!isRevealed ? (
              <div className="group cursor-pointer">
                <div className="
                  mx-auto w-36 h-36 rounded-3xl flex items-center justify-center text-6xl
                  bg-gradient-to-br from-rose-400 to-pink-500 shadow-2xl hover:scale-110
                  transition-all duration-500 hover:shadow-[0_20px_40px_rgba(244,63,94,0.4)]
                  relative overflow-hidden animate-pulse
                ">
                  <span className="relative z-10">🎁</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse rounded-3xl" />
                </div>
                <button
                  onClick={() => setIsRevealed(true)}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-3xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Open Surprise
                </button>
              </div>
            ) : (
              <div className="
                bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl lg:rounded-[3rem] shadow-2xl lg:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] p-12 lg:p-16
                hover:shadow-[0_35px_60px_-15px_rgba(244,114,182,0.15)] hover:border-rose-200/50 hover:-translate-y-2
                transition-all duration-500 ease-out relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-rose-50/50 before:to-transparent before:blur-xl before:-z-10
              ">
                <div className="text-6xl mb-8 animate-bounce">💕</div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-rose-900">
                  Hey {partnerName}!
                </h3>
                <p className="text-xl mb-6 text-rose-700">
                  {customerName} wanted to tell you something special...
                </p>
                <p className="text-4xl lg:text-5xl font-bold text-rose-600 mb-8 animate-pulse">
                  {displayMessage}
                </p>
                <button
                  onClick={() => setIsRevealed(false)}
                  className="px-8 py-3 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 rounded-2xl font-semibold hover:from-rose-200 hover:shadow-lg transition-all duration-300"
                >
                  🎁 Hide surprise
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

