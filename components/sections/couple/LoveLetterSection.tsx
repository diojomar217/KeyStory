'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import TypingText from '../../ui/TypingText';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  message: string;
  theme: ThemeKey;
  variant?: 'default' | 'alt';
};

export default function LoveLetterSection({ message, theme, variant = 'default' }: Props) {
  const styles = useTheme(theme);

  const getAccentClasses = () => {
    switch (theme) {
      case 'dark_elegant':
        return {
          text: 'text-amber-400',
          softText: 'text-amber-300/30',
          line: 'via-amber-400/30',
          paperBg: 'rgba(255, 250, 240, 0.06)',
          paperBorder: 'rgba(251, 191, 36, 0.15)',
          signature: 'text-amber-300',
        };
      case 'cute_pastel':
        return {
          text: 'text-purple-400',
          softText: 'text-purple-300/25',
          line: 'via-purple-300/30',
          paperBg: 'rgba(255, 255, 255, 0.72)',
          paperBorder: 'rgba(196, 181, 253, 0.35)',
          signature: 'text-purple-500',
        };
      case 'minimal_modern':
        return {
          text: 'text-slate-400',
          softText: 'text-slate-300/25',
          line: 'via-slate-300/30',
          paperBg: 'rgba(255, 255, 255, 0.82)',
          paperBorder: 'rgba(203, 213, 225, 0.45)',
          signature: 'text-slate-500',
        };
      default:
        return {
          text: 'text-rose-400',
          softText: 'text-rose-300/25',
          line: 'via-rose-300/35',
          paperBg: 'rgba(255, 255, 255, 0.76)',
          paperBorder: 'rgba(251, 182, 206, 0.42)',
          signature: 'text-rose-500',
        };
    }
  };

  const accent = getAccentClasses();

  return (
    <section className="relative py-12 md:py-20 overflow-hidden" id="love-letter">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="💕"
            title="Love Letter"
            subtitle="A little piece of my heart, written for you"
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
                background: accent.paperBg,
                border: `1px solid ${accent.paperBorder}`,
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
                className={`absolute left-6 top-4 text-4xl md:text-5xl font-serif ${accent.softText}`}
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <span
                className={`absolute right-6 bottom-4 text-4xl md:text-5xl font-serif ${accent.softText}`}
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
                    ${styles.text}
                    font-light
                    italic
                  `}
                >
                  <TypingText text={message} speed={40} />
                </div>

                {/* decorative line */}
                <div
                  className={`
                    mt-8
                    h-px
                    w-28
                    mx-auto
                    bg-gradient-to-r
                    from-transparent
                    ${accent.line}
                    to-transparent
                  `}
                />

                {/* closing */}
                <div className="mt-6 space-y-1">
                  <p className={`text-sm md:text-base opacity-70 ${styles.text}`}>
                    Forever yours,
                  </p>
                  <p
                    className={`text-lg md:text-xl italic font-semibold ${accent.signature}`}
                    style={{
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
          <span className={`text-lg opacity-20 ${accent.text}`}>💕</span>
        </div>
      </div>
    </section>
  );
}