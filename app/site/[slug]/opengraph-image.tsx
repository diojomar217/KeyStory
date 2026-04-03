import { ImageResponse } from 'next/og';
import { DEFAULT_THEME } from '@/config/defaults';
import { THEME_CONFIG, type ThemeKey } from '@/config/themeConfig';
import { getOccasionMetadata } from '@/lib/occasion-registry';
import { getPublicSiteBySlug } from '@/lib/site-data';
import type { OccasionType } from '@/lib/types';
import { resolveDisplayName } from '@/lib/site-type-utils';
import {
  buildOccasionDescription,
  buildOccasionTitle,
  humanizeSlug,
} from '@/lib/public-site-metadata';

export const runtime = 'nodejs';
export const alt = 'KeyStory social preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const data = await getPublicSiteBySlug(slug);
  const fallbackName = humanizeSlug(slug);

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #111827, #1f2937)',
            color: '#ffffff',
            fontSize: 48,
            padding: 64,
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.72, marginBottom: 20 }}>KeyStory</div>
          <div style={{ fontWeight: 700 }}>Page Not Found</div>
          <div style={{ fontSize: 24, opacity: 0.8, marginTop: 24 }}>{fallbackName}</div>
        </div>
      ),
      size,
    );
  }

  const siteType = (data.site_type as OccasionType) || 'couple';
  const config = data.config || {};
  const customerName = config?.people?.primary || data.customer_name || config?.customer_name || '';
  const partnerName = config?.people?.secondary || data.partner_name || config?.partner_name || '';
  const displayName = resolveDisplayName(siteType, config?.participants || [], customerName, partnerName) || fallbackName;
  const specialDate = config?.dates?.special_date || data.specialDate || '';
  const tagline = config?.tagline || data.tagline || '';
  const title = buildOccasionTitle(siteType, displayName, fallbackName);
  const description = buildOccasionDescription(siteType, displayName, tagline, specialDate);
  const occasionMeta = getOccasionMetadata(siteType);
  const theme = ((config?.theme as ThemeKey) || DEFAULT_THEME) as ThemeKey;
  const themeDef = THEME_CONFIG[theme] || THEME_CONFIG[DEFAULT_THEME as ThemeKey];
  const colors = themeDef.colors;
  const textColor = theme === 'dark_elegant' ? '#FAFAFA' : colors.text;
  const mutedText = theme === 'dark_elegant' ? 'rgba(250,250,250,0.82)' : `${colors.text}CC`;
  const faintText = theme === 'dark_elegant' ? 'rgba(250,250,250,0.58)' : `${colors.text}99`;
  const gradient = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 45%, ${colors.secondary} 100%)`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: colors.background,
          color: textColor,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: gradient,
            opacity: theme === 'dark_elegant' ? 0.28 : 0.18,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: colors.secondary,
            opacity: 0.28,
            filter: 'blur(22px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: -60,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: colors.accent,
            opacity: 0.18,
            filter: 'blur(26px)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '56px 64px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 22px',
                borderRadius: 9999,
                background: theme === 'dark_elegant' ? 'rgba(24,24,27,0.5)' : 'rgba(255,255,255,0.62)',
                border: `1px solid ${colors.border}`,
                fontSize: 24,
              }}
            >
              <div style={{ fontSize: 32 }}>{occasionMeta.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 18, color: faintText, textTransform: 'uppercase', letterSpacing: 3 }}>KeyStory</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{occasionMeta.label}</div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                padding: '12px 18px',
                borderRadius: 9999,
                background: theme === 'dark_elegant' ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.56)',
                border: `1px solid ${colors.border}`,
                fontSize: 18,
                color: mutedText,
              }}
            >
              {themeDef.label}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 860 }}>
            <div style={{ fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: mutedText, marginBottom: 18 }}>
              {specialDate ? `${occasionMeta.specialDateLabel} • ${specialDate}` : occasionMeta.description}
            </div>
            <div style={{ fontSize: 72, lineHeight: 1.04, fontWeight: 800, marginBottom: 20 }}>
              {title.replace(/\s-\s[^-]+$/, '')}
            </div>
            <div style={{ fontSize: 28, lineHeight: 1.4, color: mutedText, maxWidth: 920 }}>
              {description}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '22px 24px',
                borderRadius: 28,
                background: theme === 'dark_elegant' ? 'rgba(24,24,27,0.62)' : 'rgba(255,255,255,0.72)',
                border: `1px solid ${colors.border}`,
                minWidth: 340,
              }}
            >
              <div style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: 3, color: faintText, marginBottom: 10 }}>
                Shareable Keepsake
              </div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{displayName}</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`accent-dot-${index}`}
                  style={{
                    width: 16 + index * 4,
                    height: 16 + index * 4,
                    borderRadius: 9999,
                    background: index % 2 === 0 ? colors.primary : colors.accent,
                    opacity: 0.9 - index * 0.12,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}