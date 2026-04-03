'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';
import { getCardStyleClasses, getShadowClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';

type Props = {
  theme: ThemeKey;
  wishes?: string[];
};

export default function BirthdayWishesSection({ theme, wishes = [] }: Props) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);

  return (
    <section className={`${spacingClass}`} id="birthday-wishes">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('birthday_wishes');
            return (
              <SectionHeader
                icon={copy.icon}
                title={copy.title}
                subtitle={copy.subtitle}
                theme={theme}
              />
            );
          })()}
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(wishes.length ? wishes : [
            'Happy Birthday! May your day be as wonderful as you are.',
            'Cheers to you! Wishing you a year filled with success and joy.',
            'Enjoy every moment of your special day – you deserve it!',
          ]).map((wish, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={70 * index}>
              <blockquote
                className={`${cardStyle} ${shadowClass} border p-5`}
                style={{
                  backgroundColor: themeUtils.colors.card,
                  borderColor: themeUtils.colors.border,
                }}
              >
                <p className="text-sm md:text-base leading-relaxed" style={{ color: themeUtils.colors.text }}>
                  “{wish}”
                </p>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
