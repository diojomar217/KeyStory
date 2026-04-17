"use client";

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface EventDetailsProps {
  theme: ThemeKey;
  eventDate?: string;
  eventTime?: string;
  churchName?: string;
  churchAddress?: string;
  receptionName?: string;
  receptionAddress?: string;
}

export default function EventDetailsSection({ theme, eventDate, eventTime, churchName, churchAddress, receptionName, receptionAddress }: EventDetailsProps) {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;

  return (
    <section id="event-details" className={`${styles.sectionBg} py-12`}>
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <SectionHeader icon="⛪" title="Event Details" subtitle="Ceremony and reception information" theme={theme} />
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-2 mt-8">
          <ScrollReveal>
            <div className={`p-5 rounded-xl border ${styles.card}`} style={{ borderColor: colors.border }}>
              <h4 className="text-sm font-semibold" style={{ color: colors.primary }}>Ceremony</h4>
              <p className="mt-2 font-medium" style={{ color: colors.text }}>{churchName || 'To be announced'}</p>
              <p className="text-sm mt-1" style={{ color: colors.text }}>{churchAddress || ''}</p>
              <p className="text-sm mt-2 text-muted" style={{ color: colors.text }}>{eventDate || ''} {eventTime ? `• ${eventTime}` : ''}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className={`p-5 rounded-xl border ${styles.card}`} style={{ borderColor: colors.border }}>
              <h4 className="text-sm font-semibold" style={{ color: colors.primary }}>Reception</h4>
              <p className="mt-2 font-medium" style={{ color: colors.text }}>{receptionName || 'To be announced'}</p>
              <p className="text-sm mt-1" style={{ color: colors.text }}>{receptionAddress || ''}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
