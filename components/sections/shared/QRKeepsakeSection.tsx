'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { getThemeStyles } from '@/config/themeStyles';
import ScrollReveal from '../../ui/ScrollReveal';

interface Props {
  theme: ThemeKey;
  slug?: string;
  coupleNames: string;
  qrCodeUrl?: string;
  qrDataUrl?: string;
}

export default function QRKeepsakeSection({ theme, slug, coupleNames, qrCodeUrl, qrDataUrl }: Props) {
  const styles = getThemeStyles(theme);
  const destination = qrDataUrl || (slug ? `/r/${slug}` : '#');

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBgAlt}`} id="qr-keepsake">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <div className={`${styles.card} border ${styles.cardBorder} rounded-3xl p-8 shadow-xl text-center`}>
            <div className="text-5xl mb-4">🎴</div>
            <h2 className={`text-2xl font-bold mb-2 ${styles.text}`}>A Keepsake You Can Carry</h2>
            <p className={`${styles.textMuted} mb-6`}>
              Scan this QR code anytime to revisit {coupleNames || 'this story'}.
            </p>

            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR keepsake" className="mx-auto w-48 h-48 rounded-2xl shadow-md bg-white p-3" />
            ) : (
              <div className="mx-auto w-48 h-48 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white">
                QR preview unavailable
              </div>
            )}

            <div className="mt-6">
              <a
                href={destination}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white ${styles.accentBg}`}
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
