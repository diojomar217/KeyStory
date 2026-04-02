'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  theme: ThemeKey;
  items?: string[];
};

export default function GiftRegistrySection({ theme, items = [] }: Props) {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

  const registryItems = items.length > 0 ? items : [
    'Cash gift contribution',
    'Home essentials',
    'Honeymoon fund',
    'Kitchen starter set',
  ];

  return (
    <section className={`${spacingClass} ${styles.sectionBg}`} id="gift-registry">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="\ud83c\udf81"
            title="Gift Registry"
            subtitle="A curated list of gifts for your celebration"
            theme={theme}
          />
        </ScrollReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {registryItems.map((item, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={120 + index * 80}>
              <div
                className={`${styles.card} ${cardStyle} ${shadowClass} p-4 border`}
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <span className="text-lg" style={{ color: colors.primary }}>\ud83c\udf81</span>
                <p className={`ml-3 inline text-base font-medium ${headingFontClass}`} style={{ color: colors.text }}>
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
