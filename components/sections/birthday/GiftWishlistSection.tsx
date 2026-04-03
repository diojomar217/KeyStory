'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';
import { getSectionCopy } from '@/lib/section-copy';
import { getCardStyleClasses, getShadowClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';

type Props = {
  theme: ThemeKey;
  items?: string[];
};

export default function GiftWishlistSection({ theme, items = [] }: Props) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);

  const wishlist = items.length > 0 ? items : [
    'Collective gift fund for dream vacation',
    'Vintage watch styling workshop',
    'Custom monogrammed journal',
    'Charitable donation in their name',
  ];

  return (
    <section className={`${spacingClass}`} id="gift-wishlist">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('gift_wishlist');
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {wishlist.map((item, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={70 * index}>
              <div
                className={`${cardStyle} ${shadowClass} p-4 border`}
                style={{
                  backgroundColor: themeUtils.colors.card,
                  borderColor: themeUtils.colors.border,
                }}
              >
                <span className="text-lg">🎁</span>
                <p className="ml-3 inline text-base font-medium" style={{ color: themeUtils.colors.text }}>
                  {item}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
