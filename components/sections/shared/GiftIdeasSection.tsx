'use client';

import React from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  theme: ThemeKey;
  giftIdeas?: string[];
  title?: string;
  subtitle?: string;
};

export default function GiftIdeasSection({
  theme,
  giftIdeas = [],
  title = 'Gift Ideas',
  subtitle = 'Your presence and prayers are all that we request, but if you desire to give nonetheless, these are the things that we would appreciate.',
}: Props) {
  const themeUtils = useThemeUtils(theme);

  const hasItems = Array.isArray(giftIdeas) && giftIdeas.length > 0;

  const normalizedItems = hasItems
    ? giftIdeas
        .map((item) => item?.trim())
        .filter(Boolean)
    : [];

  const isMonetaryGift = (item: string) => {
    const value = item.toLowerCase();
    return (
      value.includes('monetary') ||
      value.includes('savings account') ||
      value.includes('cash') ||
      value.includes('gcash') ||
      value.includes('bank')
    );
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24" id="gift-ideas">
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background: `linear-gradient(180deg, ${themeUtils.colors.card}, ${themeUtils.colors.secondary}10 45%, ${themeUtils.colors.card})`,
        }}
      />

      <div
        aria-hidden
        className="absolute left-1/2 top-12 -z-10 h-56 w-[32rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${themeUtils.colors.secondary}20 0%, transparent 70%)`,
        }}
      />

      <div
        aria-hidden
        className="absolute left-[-4rem] top-24 -z-10 h-40 w-40 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${themeUtils.colors.secondary}16 0%, transparent 72%)`,
        }}
      />

      <div
        aria-hidden
        className="absolute bottom-10 right-[-3rem] -z-10 h-44 w-44 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${themeUtils.colors.secondary}14 0%, transparent 72%)`,
        }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader icon="🎁" title={title} subtitle={subtitle} theme={theme} />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={80}>
          <div className="relative mx-auto mt-8 max-w-3xl md:mt-10">
            <div
              aria-hidden
              className="absolute inset-x-8 top-8 h-40 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${themeUtils.colors.secondary}18 0%, transparent 72%)`,
              }}
            />

            <div
              className="relative overflow-hidden rounded-[28px] border shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:rounded-[32px]"
              style={{
                background: `linear-gradient(180deg, ${themeUtils.colors.card}, ${themeUtils.colors.card}f2)`,
                borderColor: `${themeUtils.colors.border}b8`,
              }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${themeUtils.colors.secondary}, transparent)`,
                  opacity: 0.8,
                }}
              />

              <div
                aria-hidden
                className="absolute left-1/2 top-0 h-28 w-[78%] -translate-x-1/2 blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${themeUtils.colors.secondary}18 0%, transparent 72%)`,
                }}
              />

              <div className="relative px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
                <div className="mx-auto max-w-2xl text-center">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.28em] sm:text-[11px]"
                    style={{ color: themeUtils.colors.primary }}
                  >
                    With love and gratitude
                  </p>

                  <h3
                    className="mt-3 text-xl font-semibold sm:text-2xl md:text-[1.8rem]"
                    style={{ color: themeUtils.colors.text }}
                  >
                    A Gentle Guide for Gift Giving
                  </h3>

                  <p
                    className="mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:text-[15px]"
                    style={{ color: `${themeUtils.colors.text}cc` }}
                  >
                    Your prayers, love, and presence mean the most to us. Should you wish to bless our little one with a gift, these are a few thoughtful ideas we would truly appreciate.
                  </p>
                </div>

                <div className="mt-8 sm:mt-10">
                  {normalizedItems.length > 0 ? (
                    <div className="mx-auto max-w-2xl space-y-3 sm:space-y-4">
                      {normalizedItems.map((item, idx) => {
                        const highlighted = isMonetaryGift(item);

                        return (
                          <div
                            key={`${item}-${idx}`}
                            className={`relative overflow-hidden rounded-2xl border px-4 py-4 text-center transition-all sm:px-6 sm:py-5 ${
                              highlighted ? 'shadow-[0_12px_30px_rgba(15,23,42,0.08)]' : ''
                            }`}
                            style={{
                              background: highlighted
                                ? `linear-gradient(180deg, ${themeUtils.colors.secondary}18, ${themeUtils.colors.card})`
                                : `linear-gradient(180deg, ${themeUtils.colors.card}, ${themeUtils.colors.card}f4)`,
                              borderColor: highlighted
                                ? `${themeUtils.colors.secondary}55`
                                : `${themeUtils.colors.border}90`,
                            }}
                          >
                            {highlighted && (
                              <div
                                aria-hidden
                                className="absolute inset-x-6 top-0 h-px"
                                style={{
                                  background: `linear-gradient(90deg, transparent, ${themeUtils.colors.secondary}, transparent)`,
                                }}
                              />
                            )}

                            <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5">
                              <div
                                className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]"
                                style={{
                                  backgroundColor: highlighted
                                    ? `${themeUtils.colors.secondary}25`
                                    : `${themeUtils.colors.secondary}12`,
                                  color: themeUtils.colors.primary,
                                }}
                              >
                                {highlighted ? 'Special Gift Option' : `Gift Idea ${idx + 1}`}
                              </div>

                              <p
                                className="max-w-xl text-sm font-medium leading-relaxed sm:text-base"
                                style={{ color: themeUtils.colors.text }}
                              >
                                {item}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mx-auto max-w-xl">
                      <div
                        className="rounded-2xl border px-6 py-8 text-center"
                        style={{
                          background: `linear-gradient(180deg, ${themeUtils.colors.secondary}12, ${themeUtils.colors.card})`,
                          borderColor: `${themeUtils.colors.border}90`,
                        }}
                      >
                        <p
                          className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                          style={{ color: themeUtils.colors.primary }}
                        >
                          With heartfelt thanks
                        </p>
                        <p
                          className="mt-3 text-sm leading-relaxed sm:text-base"
                          style={{ color: `${themeUtils.colors.text}d6` }}
                        >
                          Your presence is the greatest gift, and celebrating this special day with you already means so much to us. 💕
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-center sm:mt-10">
                  <div
                    className="h-[3px] w-16 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${themeUtils.colors.secondary}, ${themeUtils.colors.primary})`,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}