'use client';

import type { TimelineEvent } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { getSectionCopy } from '@/lib/section-copy';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import TimelineSection from '../shared/TimelineSection';
import ScrollReveal from '../../ui/ScrollReveal';
import { getSectionSpacingClass } from '@/lib/theme-color-helpers';


type Props = {
  theme: ThemeKey;
  template: string;
  events: TimelineEvent[];
};

export default function BirthdayTimelineSection({ theme, template, events }: Props) {
  useThemeUtils(theme);
  const spacingClass = getSectionSpacingClass(theme);

  return (
    <section className={`${spacingClass}`} id="birthday-timeline">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('birthday_timeline');
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
        <TimelineSection theme={theme} template={template as any} events={events} />
      </div>
    </section>
  );
}
