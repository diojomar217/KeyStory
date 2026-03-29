'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  theme: ThemeKey;
  message: string;
};

export default function BirthdayMessageSection({ theme, message }: Props) {
  const styles = useTheme(theme);

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="birthday-message">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="🎉"
            title="Birthday Message"
            subtitle="A special message for the celebrant"
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150}>
          <div className={`${styles.glassCard} ${styles.glassBorder} border rounded-2xl shadow-xl p-6 md:p-8`}>
            <p className="text-center text-lg md:text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
              {message || 'Wishing you the most magical birthday filled with laughter, love, and unforgettable moments.'}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
