'use client';

import type { TimelineEvent } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import TimelineSection from '../shared/TimelineSection';


type Props = {
  theme: ThemeKey;
  template: string;
  events: TimelineEvent[];
};

export default function BirthdayTimelineSection({ theme, template, events }: Props) {
  const styles = useTheme(theme);

  return (
    <section className={`${styles.sectionBg}`} id="birthday-timeline">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
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
        <TimelineSection theme={theme} template={template as any} events={events} />
      </div>
    </section>
  );

  return (
    <section className={`${styles.sectionBg}`} id="birthday-timeline">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <SectionHeader
          icon="🎂"
          title="Birthday Milestones"
          subtitle="Highlights from your life journey"
          theme={theme}
        />
        <TimelineSection theme={theme} template={template as any} events={events} />
      </div>
    </section>
  );
}
