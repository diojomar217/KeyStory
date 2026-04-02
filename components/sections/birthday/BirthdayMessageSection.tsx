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
import { getSectionCopy } from '@/lib/section-copy';

type Props = {
  theme: ThemeKey;
  message: string;
};

export default function BirthdayMessageSection({ theme, message }: Props) {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const copy = getSectionCopy('birthday_message', 'birthday');

  return (
    <section className={`${spacingClass} ${styles.sectionBg}`} id="birthday-message">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon={copy.icon}
            title={copy.title}
            subtitle={copy.subtitle}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150}>
          <div
            className={`${styles.glassCard} ${styles.glassBorder} ${cardStyle} ${shadowClass} border p-6 md:p-8`}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <p
              className={`text-center text-lg md:text-xl font-medium leading-relaxed ${headingFontClass}`}
              style={{ color: colors.text }}
            >
              {message ||
                'Wishing you the most magical birthday filled with laughter, love, and unforgettable moments.'}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}