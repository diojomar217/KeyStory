'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toPng } from 'html-to-image';
import { Theme } from '@/lib/types';
import { useTheme } from '../../builder/ThemeWrapper';
import ScrollReveal from '../../ui/ScrollReveal';
import Link from 'next/link';

type Props = {
  theme: Theme;
  slug?: string;
  coupleNames: string;
  qrCodeUrl?: string;
  qrDataUrl?: string;
};

export default function QRKeepsakeSection({
  theme,
  slug,
  coupleNames,
  qrCodeUrl,
  qrDataUrl,
}: Props) {
  const styles = useTheme(theme);
  const qrRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate styled QR code using qrDataUrl if available
  useEffect(() => {
    if (!qrRef.current) return;

    // If we have qrDataUrl, use the styled QR generator
    if (qrDataUrl) {
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        type: 'canvas',
        data: qrDataUrl,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 6,
        },
        dotsOptions: {
          color: '#E11D48',
          type: 'rounded',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        cornersSquareOptions: {
          color: '#E11D48',
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: '#E11D48',
          type: 'dot',
        },
        image: '/heart-icon.svg',
        qrOptions: {
          errorCorrectionLevel: 'H',
        },
      });

      qrCodeInstanceRef.current = qrCode;
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrDataUrl]);

  // Get the link URL for the QR code
  const getQRLinkUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin + '/site/' + slug;
    }
    return '/site/' + slug;
  };

  // Handle download of the QR card
  const handleDownloadCard = async () => {
    if (!cardRef.current || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const filename = slug 
        ? `${slug}-qr-keepsake` 
        : `love-story-qr-${coupleNames.replace(/\s+/g, '-').toLowerCase()}`;

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to download card:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get accent color based on theme
  const getAccentColor = () => {
    switch (theme) {
      case 'dark_elegant': return 'amber';
      case 'cute_pastel': return 'purple';
      case 'minimal_modern': return 'slate';
      default: return 'rose';
    }
  };

  const accentColor = getAccentColor();
  const qrLinkUrl = getQRLinkUrl();

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`}>
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Section Title - Premium Ending */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <div className="text-4xl mb-4">💝</div>
            <h2 className={`${styles.heading} text-section-title font-semibold ${styles.text}`}>
              A Keepsake for Your Heart
            </h2>
            <p className={`${styles.textMuted} mt-3 text-subtitle max-w-lg mx-auto`}>
              Scan to revisit our story, anytime
            </p>
          </div>
        </ScrollReveal>

        {/* QR Keepsake Card - Premium styling */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div 
            ref={cardRef}
            className={`
              relative 
              bg-gradient-to-br from-white to-rose-50
              dark:from-zinc-800 dark:to-zinc-900
              rounded-2xl 
              shadow-[0_20px_60px_rgba(0,0,0,0.15)]
              border border-rose-100/50 dark:border-zinc-700/50
              p-8 md:p-12
              max-w-2xl mx-auto
              overflow-hidden
            `}
          >
            {/* Decorative corner elements - Subtle premium */}
            <div className="absolute top-0 left-0 w-20 h-20 opacity-8">
              <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
                <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M10,30 Q30,10 50,30 T90,30" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-8 rotate-180">
              <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
                <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M10,30 Q30,10 50,30 T90,30" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>

            {/* Card Content */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
              
              {/* QR Code Card - Premium frame */}
              <div className="flex-shrink-0">
                <Link 
                  href={qrLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    relative 
                    bg-white 
                    rounded-2xl 
                    shadow-lg 
                    p-5
                    border-2 
                    ${accentColor === 'amber' ? 'border-amber-200' : accentColor === 'purple' ? 'border-purple-200' : accentColor === 'slate' ? 'border-slate-200' : 'border-rose-200'}
                    hover:shadow-xl 
                    transition-all 
                    duration-300
                    hover:-translate-y-1
                    block
                  `}
                >
                  {/* Decorative frame effect */}
                  <div className={`
                    absolute -inset-2 
                    rounded-2xl 
                    opacity-20
                    bg-gradient-to-br 
                    ${accentColor === 'amber' ? 'from-amber-300 to-orange-400' : accentColor === 'purple' ? 'from-purple-300 to-pink-400' : accentColor === 'slate' ? 'from-slate-300 to-gray-400' : 'from-rose-300 to-pink-400'}
                    -z-10
                  `} />
                  
                  {qrDataUrl && isClient ? (
                    <div 
                      ref={qrRef} 
                      className="w-[180px] h-[180px]"
                    />
                  ) : qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code to visit our love story"
                      className="w-[180px] h-[180px] object-contain"
                    />
                  ) : (
                    <div className="w-[180px] h-[180px] flex items-center justify-center">
                      <div className="w-36 h-36 bg-rose-100 rounded-lg animate-pulse" />
                    </div>
                  )}
                  
                  {/* Heart icon below QR */}
                  <div className="text-center mt-3">
                    <span className="text-2xl">💕</span>
                  </div>
                </Link>
              </div>

              {/* Card Details - Premium typography */}
              <div className="flex-1 text-center md:text-left">
                {/* Couple Names */}
                <h3 className={`${styles.heading} text-2xl md:text-3xl font-bold ${styles.text} mb-3`}>
                  {coupleNames}
                </h3>
                
                {/* Tagline - Elegant */}
                <p className={`${styles.textMuted} text-base mb-8 italic leading-relaxed`}>
                  "Every moment with you is my favorite memory."
                </p>

                {/* Download QR Card Button - Premium styling */}
                {isClient && (
                  <button
                    onClick={handleDownloadCard}
                    disabled={isSaving}
                    className={`
                      inline-flex items-center gap-2.5 px-6 py-3 
                      rounded-full font-medium text-sm
                      ${accentColor === 'amber' ? 'bg-amber-400 hover:bg-amber-500' : accentColor === 'purple' ? 'bg-purple-400 hover:bg-purple-500' : accentColor === 'slate' ? 'bg-slate-400 hover:bg-slate-500' : 'bg-rose-400 hover:bg-rose-500'}
                      text-white 
                      transition-all 
                      duration-200
                      hover:scale-105
                      shadow-md hover:shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    `}
                  >
                    {isSaving ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Save to Photos</span>
                      </>
                    )}
                  </button>
                )}

                {/* Link hint */}
                {slug && (
                  <p className={`mt-5 text-xs ${styles.textMuted}`}>
                    or visit: yourdomain.com/site/{slug}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Romantic Closing Message - Premium ending */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="text-center mt-14">
            <p className={`
              text-quote
              ${styles.text} 
              font-light 
              italic 
              max-w-xl 
              mx-auto
              leading-relaxed
            `}>
              &ldquo;Love is not about how many days, months, or years we have been together. 
              Love is about how much we love each other every single day.&rdquo;
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="text-rose-300/60">💕</span>
              <span className={`text-sm ${styles.textMuted} font-light`}>Forever & Always 💍</span>
              <span className="text-rose-300/60">💕</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Decorative bottom hearts - Elegant ending */}
        <div className="flex justify-center items-center gap-2 mt-10 opacity-25">
          <span className="text-lg">💗</span>
          <span className="text-xl">💖</span>
          <span className="text-2xl">💕</span>
          <span className="text-xl">💖</span>
          <span className="text-lg">💗</span>
        </div>
      </div>
    </section>
  );
}

