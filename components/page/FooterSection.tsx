'use client';

import { SiteConfig } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { useTheme, useThemeUtils } from '../builder/ThemeWrapper';
import { OccasionType } from '@/lib/occasion-registry';
import { resolveFooterConfig, resolveDisplayName } from '@/lib/site-type-utils';

type SiteType = OccasionType;

type Props = {
  theme: ThemeKey;
  siteType?: SiteType;
  config?: SiteConfig;
  customerName?: string;
  partnerName?: string;
};

export default function FooterSection({
  theme,
  siteType = 'couple',
  config,
  customerName = '',
  partnerName = '',
}: Props) {
  const styles = useTheme(theme);
  const themeUtils = useThemeUtils(theme);
  const resolvedSiteType: SiteType = siteType || 'couple';

  const displayName = resolveDisplayName(
    resolvedSiteType,
    config?.participants || [],
    customerName,
    partnerName,
  );

  const activeFooter = resolveFooterConfig(resolvedSiteType, displayName);

  const footerColors = {
    title: theme === 'dark_elegant' ? themeUtils.colors.text : '#FFFFFF',
    body: theme === 'dark_elegant' ? `${themeUtils.colors.text}D9` : 'rgba(255, 255, 255, 0.84)',
    faint: theme === 'dark_elegant' ? `${themeUtils.colors.text}99` : 'rgba(255, 255, 255, 0.62)',
    divider: themeUtils.colors.accent,
    decoration: themeUtils.colors.accent,
  };

  return (
    <footer className={`${styles.footerBg} ${themeUtils.bodyFontClass}`}>
      {/* Footer Content - Occasion-aware closing */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 text-center">
        {/* Decorative motif */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {activeFooter.decorations.map((icon, idx) => (
            <span
              key={idx}
              className="text-lg md:text-xl"
              style={{ color: footerColors.decoration, opacity: 0.92 }}
            >
              {icon}
            </span>
          ))}
        </div>

        {/* Person name */}
        <h3 className={`${styles.heading} text-2xl md:text-3xl mb-3 tracking-wide`} style={{ color: footerColors.title }}>
          {displayName}
        </h3>

        {/* Closing tagline */}
        <p className="mb-6 font-light italic" style={{ color: footerColors.body }}>{activeFooter.tagline}</p>

        {/* Decorative divider - use accent color */}
        <div 
          className="w-24 h-px mx-auto mb-6" 
          style={{
            backgroundImage: `linear-gradient(to right, transparent, ${footerColors.divider}, transparent)`,
            opacity: 0.5
          }}
        />

        {/* Year */}
        <p className="text-xs mt-3" style={{ color: footerColors.faint }}>
          © {new Date().getFullYear()} {displayName}
        </p>
      </div>
    </footer>
  );
}


