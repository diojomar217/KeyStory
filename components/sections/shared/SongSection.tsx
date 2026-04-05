'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { getSectionCopy } from '@/lib/section-copy';
import type { SiteAnalyticsEventType } from '@/lib/types';
import PlaylistSection from './PlaylistSection';

interface SongSectionProps {
  theme: ThemeKey;
  songLink?: string;
  autoplay?: boolean;
  onTrackEvent?: (eventType: SiteAnalyticsEventType, source: string, dedupeKey?: string) => void;
}

const SongSection = ({ theme, songLink, autoplay }: SongSectionProps) => {
  const copy = getSectionCopy('song');

  return (
    <PlaylistSection
      theme={theme}
      songLink={songLink}
      autoplay={autoplay}
      sectionId="song"
      icon={copy.icon}
      title={copy.title}
      subtitle={copy.subtitle}
    />
  );
};

export default SongSection;

