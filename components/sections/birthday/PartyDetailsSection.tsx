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
  location?: string;
  date?: string;
  time?: string;
  dressCode?: string;
};

export default function PartyDetailsSection({ theme, location, date, time, dressCode }: Props) {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

  return (
    <section className={`${spacingClass} ${styles.sectionBg}`} id="party-details">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="📍"
            title="Party Details"
            subtitle="Everything guests need for the celebration"
            theme={theme}
          />
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-2 mt-8">
          {['Location', 'Date', 'Time', 'Dress Code'].map((label, idx) => {
            const value = [location, date, time, dressCode][idx] || 'To be announced';
            return (
              <ScrollReveal key={label} animation="fade-up" delay={80 + idx * 70}>
                <div
                  className={`${styles.card} ${cardStyle} ${shadowClass} p-5 border`}
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                >
                  <h3 className="text-sm font-semibold mb-1" style={{ color: colors.primary }}>{label}</h3>
                  <p className={`text-base font-medium ${headingFontClass}`} style={{ color: colors.text }}>{value}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
