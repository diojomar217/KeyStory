'use client';

import { Theme, TimelineEvent } from '@/lib/types';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import TimelineSection from '../shared/TimelineSection';

type Props = {
  theme: Theme;
  template: string;
  events: TimelineEvent[];
};

export default function BirthdayTimelineSection({ theme, template, events }: Props) {
  const styles = useTheme(theme);

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
