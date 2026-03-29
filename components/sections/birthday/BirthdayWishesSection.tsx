'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  theme: ThemeKey;
  wishes?: string[];
};

export default function BirthdayWishesSection({ theme, wishes = [] }: Props) {
  const styles = useTheme(theme);

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="birthday-wishes">
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
              <blockquote className={`${styles.glassCard} ${styles.glassBorder} border rounded-xl p-5`}>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">“{wish}”</p>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
