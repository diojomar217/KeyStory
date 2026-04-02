'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface Props {
  theme: ThemeKey;
  slug?: string;
  coupleNames: string;
  qrCodeUrl?: string;
  qrDataUrl?: string;
}

export default function QRKeepsakeSection({ theme, slug, coupleNames, qrCodeUrl, qrDataUrl }: Props) {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const destination = qrDataUrl || (slug ? `/r/${slug}` : '#');

  return (
    <section className={`${spacingClass} ${styles.sectionBgAlt}`} id="qr-keepsake">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <div
            className={`${styles.card} ${cardStyle} ${shadowClass} border p-8 text-center`}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <div className="text-5xl mb-4">🎴</div>
            <h2 className={`text-2xl font-bold mb-2 ${headingFontClass}`} style={{ color: colors.text }}>A Keepsake You Can Carry</h2>
            <p className="mb-6" style={{ color: colors.text }}>
              Scan this QR code anytime to revisit {coupleNames || 'this story'}.
            </p>

            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR keepsake"
                className="mx-auto w-48 h-48 rounded-2xl p-3"
                style={{
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.14)',
                  backgroundColor: colors.background,
                }}
              />
            ) : (
              <div
                className="mx-auto w-48 h-48 rounded-2xl border border-dashed flex items-center justify-center"
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                }}
              >
                QR preview unavailable
              </div>
            )}

            <div className="mt-6">
              <a
                href={destination}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                }}
              >
                Open Link
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
