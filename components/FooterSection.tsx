'use client';

import { Theme } from '@/lib/types';
import { useTheme } from './ThemeWrapper';
import QRSection from './QRSection';
import ShareSection from './ShareSection';

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

  return (
    <footer className={`${styles.footerBg} text-white`}>
      {/* Share Section */}
      <div className={theme === 'dark_elegant' ? 'bg-zinc-800/50' : 'bg-white/50'}>
        <ShareSection 
          theme={theme} 
          customerName={customerName}
          partnerName={partnerName}
        />
      </div>

      {/* QR Code Section */}
      {qrCodeUrl && (
        <div className={theme === 'dark_elegant' ? 'bg-zinc-800/50' : 'bg-white/50'}>
          <QRSection 
            theme={theme} 
            qrCodeUrl={qrCodeUrl}
            qrDataUrl={qrDataUrl}
            coupleNames={coupleNames}
          />
        </div>
      )}
      
      {/* Footer Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 text-center">
        {/* Decorative hearts */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-rose-300">💕</span>
          <span className="text-2xl">💕</span>
          <span className="text-rose-300">💕</span>
        </div>
        
        {/* Couple Names */}
        <h3 className="font-serif text-2xl md:text-3xl mb-2">
          {coupleNames}
        </h3>
        
        {/* Tagline */}
        <p className="text-white/70 mb-4">
          Forever & Always 💍
        </p>
        
        {/* Made with love */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/50 text-sm">
            Made with 💕 especially for you
          </p>
        </div>
        
        {/* Year */}
        <p className="text-white/30 text-xs mt-2">
          © {new Date().getFullYear()} {coupleNames}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

