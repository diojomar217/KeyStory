'use client';

import { Theme } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';

type Props = {
  theme: Theme;
  customerName: string;
  partnerName: string;
  qrCodeUrl?: string;
  qrDataUrl?: string;
};

export default function FooterSection({ 
  theme, 
  customerName, 
  partnerName, 
  qrCodeUrl,
  qrDataUrl,
}: Props) {
  const styles = useTheme(theme);
  const coupleNames = `${customerName} & ${partnerName}`;

  // Only show the QR section if MemoryCardSection is not shown (no QR URL)
  const showLegacyQR = qrCodeUrl && !qrDataUrl;

  return (
    <footer className={`${styles.footerBg} text-white`}>
      {/* Legacy QR Section (only if Memory Card is not shown) */}
      {showLegacyQR && (
        <div className={theme === 'dark_elegant' ? 'bg-zinc-800/50' : 'bg-white/50'}>
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 text-center">
            <h3 className={`${styles.heading} text-lg font-semibold mb-3`}>
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
      
      {/* Footer Content - Romantic Closing */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 text-center">
        {/* Decorative hearts with animation */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-rose-300/60 text-lg">💗</span>
          <span className="text-rose-300 animate-pulse">💕</span>
          <span className="text-2xl">💖</span>
          <span className="text-rose-300 animate-pulse">💕</span>
          <span className="text-rose-300/60 text-lg">💗</span>
        </div>
        
        {/* Couple Names - Elegant typography */}
        <h3 className="font-serif text-2xl md:text-3xl mb-3 tracking-wide">
          {coupleNames}
        </h3>
        
        {/* Romantic tagline */}
        <p className="text-white/80 mb-6 font-light italic">
          Forever & Always 💍
        </p>
        
        {/* Decorative divider */}
        <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-rose-400/50 to-transparent mb-6" />
        
        {/* Made with love */}
        <div className="pt-4">
          <p className="text-white/50 text-sm flex items-center justify-center gap-2">
            <span>Made with</span>
            <span className="text-rose-300">💕</span>
            <span>especially for you</span>
          </p>
        </div>
        
        {/* Year */}
        <p className="text-white/30 text-xs mt-3">
          © {new Date().getFullYear()} {coupleNames}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

