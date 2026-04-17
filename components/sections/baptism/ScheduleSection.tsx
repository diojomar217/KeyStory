"use client";

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface ScheduleItem {
  title: string;
  time: string;
}

interface ScheduleSectionProps {
  theme: ThemeKey;
  schedule?: ScheduleItem[];
}

export default function ScheduleSection({ theme, schedule = [] }: ScheduleSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const { colors } = themeUtils;

  return (
    <section id="schedule" className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <ScrollReveal>
          <SectionHeader icon="🗓️" title="Schedule" subtitle="Order of events for the day" theme={theme} />
        </ScrollReveal>

        <div className="mt-8 space-y-4">
          {schedule.length === 0 ? (
            <p style={{ color: colors.text }}>Schedule will be posted soon.</p>
          ) : (
            schedule.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 60}>
                <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: colors.border, backgroundColor: colors.card }}>
                  <div>
                    <p className="font-semibold" style={{ color: colors.text }}>{item.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted" style={{ color: colors.text }}>{item.time}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
