"use client";

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface MapSectionProps {
  theme: ThemeKey;
  mapLink?: string;
}

export default function MapSection({ theme, mapLink }: MapSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const { colors } = themeUtils;

  if (!mapLink) return null;

  const isEmbed = mapLink.includes('google') && mapLink.includes('/maps');

  return (
    <section id="map-section" className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <SectionHeader icon="🗺️" title="Location" subtitle="Find us on the map" theme={theme} />
        </ScrollReveal>

        <div className="mt-6">
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: colors.border, backgroundColor: colors.card }}>
            {isEmbed ? (
              // Show an iframe if it's a Google Maps embed link
              <iframe src={mapLink} className="w-full h-80" loading="lazy" />
            ) : (
              <div className="p-6 flex flex-col items-center gap-4">
                <p style={{ color: colors.text }}>Open the location in Google Maps for directions.</p>
                <a href={mapLink} target="_blank" rel="noreferrer" className="btn btn-outline">View in Google Maps</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
