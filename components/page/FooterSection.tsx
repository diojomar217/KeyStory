'use client';

import { SiteConfig, Participant } from '@/lib/types';
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
  qrCodeUrl?: string;
  qrDataUrl?: string;
};

export default function FooterSection({
  theme,
  siteType = 'couple',
  config,
  customerName = '',
  partnerName = '',
  qrCodeUrl,
  qrDataUrl,
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

  // Only show the QR section if MemoryCardSection is not shown (no QR URL)
  const showLegacyQR = qrCodeUrl && !qrDataUrl;

  return (
    <footer className={`${styles.footerBg} ${themeUtils.bodyFontClass}`}>
      {/* Legacy QR Section (only if Memory Card is not shown) */}
      {showLegacyQR && (
        <div className={styles.sectionBgAlt}>
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 text-center">
            <h3 className={`${styles.heading} ${styles.text} text-lg font-semibold mb-3`}>
              Keep Our Story Close
            </h3>
            <p className={`${styles.textMuted} text-sm mb-4`}>
              Scan to revisit our special moments
            </p>
            <div className="inline-block bg-white rounded-xl p-3 shadow-lg">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Content - Occasion-aware closing */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 text-center">
        {/* Decorative motif */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {activeFooter.decorations.map((icon, idx) => (
            <span key={idx} className={activeFooter.decorationClasses || styles.accent}>
              {icon}
            </span>
          ))}
        </div>

        {/* Person name */}
        <h3 className={`${styles.heading} text-2xl md:text-3xl mb-3 tracking-wide`}>
          {displayName}
        </h3>

        {/* Closing tagline */}
        <p className={`${styles.textMuted} mb-6 font-light italic`}>{activeFooter.tagline}</p>

        {/* Decorative divider - use accent color */}
        <div 
          className="w-24 h-px mx-auto mb-6" 
          style={{
            backgroundImage: `linear-gradient(to right, transparent, var(--color-accent), transparent)`,
            opacity: 0.5
          }}
        />

        {/* Made with */}
        <div className="pt-4">
          <p className={`${styles.textMuted} text-opacity-50 text-sm flex items-center justify-center gap-2`}>{activeFooter.madeWith}</p>
        </div>

        {/* Year */}
        <p className={`${styles.textMuted} text-opacity-30 text-xs mt-3`}>
          © {new Date().getFullYear()} {displayName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


