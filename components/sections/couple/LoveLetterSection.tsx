'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import TypingText from '../../ui/TypingText';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';
import { getHeadingFontClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';

type Props = {
  message: string;
  theme: ThemeKey;
  variant?: 'default' | 'alt';
};

export default function LoveLetterSection({ message, theme, variant = 'default' }: Props) {
  const copy = getSectionCopy('love_letter');
  const themeUtils = useThemeUtils(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

  return (
    <section className={`relative overflow-hidden ${spacingClass}`} id="love-letter">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon={copy.icon}
            title={copy.title}
            subtitle={copy.subtitle}
            theme={theme}
            className="mb-8"
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150}>
          <div className="max-w-3xl mx-auto">
            <div
              className="
                relative
                rounded-[28px]
                p-7
                md:p-10
                shadow-[0_14px_40px_rgba(0,0,0,0.08)]
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_18px_50px_rgba(0,0,0,0.10)]
                overflow-hidden
              "
              style={{
                backgroundColor: `${themeUtils.colors.card}C2`,
                border: `1px solid ${themeUtils.colors.border}99`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {/* soft paper glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 100%)',
                }}
              />

              {/* corner quotes */}
              <span
                className="absolute left-6 top-4 text-4xl md:text-5xl font-serif"
                style={{ color: themeUtils.colors.accent, opacity: 0.28 }}
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <span
                className="absolute right-6 bottom-4 text-4xl md:text-5xl font-serif"
                style={{ color: themeUtils.colors.accent, opacity: 0.28 }}
                aria-hidden="true"
              >
                &rdquo;
              </span>

              <div className="relative z-10 text-center">
                <div
                  className={`
                    mx-auto
                    max-w-2xl
                    text-lg
                    md:text-xl
                    leading-9
                    md:leading-10
                    px-3
                    ${headingFontClass}
                    font-light
                    italic
                  `}
                  style={{ color: themeUtils.colors.text }}
                >
                  <TypingText text={message} speed={40} />
                </div>

                {/* decorative line */}
                <div
                  className="
                    mt-8
                    h-px
                    w-28
                    mx-auto
                  "
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, ${themeUtils.colors.accent}66, transparent)`,
                  }}
                />

                {/* closing */}
                <div className="mt-6 space-y-1">
                  <p className="text-sm md:text-base opacity-70" style={{ color: themeUtils.colors.text }}>
                    Forever yours,
                  </p>
                  <p
                    className={`text-lg md:text-xl italic font-semibold ${headingFontClass}`}
                    style={{
                      color: themeUtils.colors.primary,
                      fontFamily:
                        '"Brush Script MT", "Lucida Handwriting", "Segoe Script", cursive',
                    }}
                  >
                    My Love
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="text-center mt-6">
          <span className="text-lg opacity-20" style={{ color: themeUtils.colors.primary }}>💕</span>
        </div>
      </div>
    </section>
  );
}