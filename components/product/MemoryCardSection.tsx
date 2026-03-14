'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toPng } from 'html-to-image';
import { Theme } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';
import ScrollReveal from '../ui/ScrollReveal';

type Props = {
  theme: Theme;
  customerName: string;
  partnerName: string;
  qrCodeUrl?: string;
  qrDataUrl?: string;
  slug?: string;
};

export default function MemoryCardSection({
  theme,
  customerName,
  partnerName,
  qrCodeUrl,
  qrDataUrl,
  slug,
}: Props) {
  const styles = useTheme(theme);
  const coupleNames = `${customerName} & ${partnerName}`;
  
  const qrRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Generate the love page URL from slug
  const lovePageUrl = slug ? `/site/${slug}` : currentUrl;
  
  // Save card state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentUrl(window.location.href);
  }, []);

  // Generate styled QR code
  useEffect(() => {
    if (!qrRef.current || !qrDataUrl) return;

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

  }, [qrDataUrl]);

  // Handle save card - capture the full card and download as PNG
  const handleSaveCard = async () => {
    if (!cardRef.current || isSaving) return;

    setIsSaving(true);
    setSaveError(false);
    setSaveSuccess(false);

    try {
      // Wait for QR code to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate filename
      const filename = slug 
        ? `${slug}-card` 
        : `love-story-card-${customerName.replace(/\s+/g, '-').toLowerCase()}-${partnerName.replace(/\s+/g, '-').toLowerCase()}`;

      // Capture the card as PNG
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save card:', error);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const url = encodeURIComponent(currentUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  // Share to Messenger
  const shareToMessenger = () => {
    const url = encodeURIComponent(currentUrl);
    window.open(`fb-messenger://share?link=${url}`, '_blank');
  };

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out our love story! ${coupleNames} 💕\n\n${currentUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!qrCodeUrl) return null;

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

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`}>
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Section Title */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <div className="text-4xl mb-4">💝</div>
            <h2 className={`${styles.heading} text-2xl md:text-3xl ${styles.text} font-semibold`}>
              Keep Our Story Close
            </h2>
            <p className={`${styles.textMuted} mt-2 max-w-lg mx-auto`}>
              A little code that leads to a lot of memories
            </p>
          </div>
        </ScrollReveal>

        {/* Premium Memory Card */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div 
            ref={cardRef}
            className={`
            relative 
            bg-gradient-to-br from-white to-rose-50
            dark:from-zinc-800 dark:to-zinc-900
            rounded-3xl 
            shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            border border-rose-100/50 dark:border-zinc-700/50
            p-6 md:p-10
            max-w-2xl mx-auto
            overflow-hidden
          `}>
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-16 h-16 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
                <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M10,30 Q30,10 50,30 T90,30" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10 rotate-180">
              <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
                <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M10,30 Q30,10 50,30 T90,30" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>

            {/* Card Content */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              
              {/* QR Code Card - Clickable link to love page */}
              <div className="flex-shrink-0">
                <a 
                  href={lovePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  title={`Visit ${lovePageUrl}`}
                >
                  <div className={`
                    relative 
                    bg-white 
                    rounded-2xl 
                    shadow-lg 
                    p-4
                    border-2 
                    ${accentColor === 'amber' ? 'border-amber-200' : accentColor === 'purple' ? 'border-purple-200' : accentColor === 'slate' ? 'border-slate-200' : 'border-rose-200'}
                    group-hover:shadow-xl 
                    transition-all 
                    duration-300
                    group-hover:scale-105
                  `}>
                  {/* Decorative frame effect */}
                  <div className={`
                    absolute -inset-2 
                    rounded-2xl 
                    opacity-30
                    bg-gradient-to-br 
                    ${accentColor === 'amber' ? 'from-amber-300 to-orange-400' : accentColor === 'purple' ? 'from-purple-300 to-pink-400' : accentColor === 'slate' ? 'from-slate-300 to-gray-400' : 'from-rose-300 to-pink-400'}
                    -z-10
                  `} />
                  
                  {qrDataUrl && isClient ? (
                    <div 
                      ref={qrRef} 
                      className="w-[200px] h-[200px]"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center">
                      <div className="w-40 h-40 bg-rose-100 rounded-lg animate-pulse" />
                    </div>
                  )}
                  
                  {/* Heart icon below QR */}
                  <div className="text-center mt-2">
                    <span className="text-2xl">💕</span>
                  </div>
                  </div>
                </a>
              </div>

              {/* Card Details */}
              <div className="flex-1 text-center md:text-left">
                {/* Couple Names */}
                <h3 className={`${styles.heading} text-xl md:text-2xl font-bold ${styles.text} mb-2`}>
                  {coupleNames}
                </h3>
                
                {/* Tagline */}
                <p className={`${styles.textMuted} text-sm mb-6 italic`}>
                  "Every memory with you is my favorite."
                </p>

                {/* Save This Card Button */}
                {isClient && (
                  <button
                    onClick={handleSaveCard}
                    disabled={isSaving}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 
                      rounded-full font-medium text-sm
                      ${accentColor === 'amber' ? 'bg-amber-400 hover:bg-amber-500' : accentColor === 'purple' ? 'bg-purple-400 hover:bg-purple-500' : accentColor === 'slate' ? 'bg-slate-400 hover:bg-slate-500' : 'bg-rose-400 hover:bg-rose-500'}
                      text-white 
                      transition-all 
                      duration-200
                      hover:scale-105
                      shadow-md hover:shadow-lg
                      mb-6
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
                    ) : saveError ? (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Failed</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Save This Card</span>
                      </>
                    )}
                  </button>
                )}

                {/* Share Section */}
                <div className="space-y-3">
                  <p className={`text-xs font-medium ${styles.textMuted} uppercase tracking-wider`}>
                    Share with loved ones
                  </p>
                  
                  {/* Copy Link */}
                  <button
                    onClick={copyLink}
                    className={`
                      w-full flex items-center justify-center gap-2 px-4 py-2.5 
                      rounded-full font-medium text-sm
                      transition-all duration-300
                      ${copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-zinc-100 dark:bg-zinc-600 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-500'
                      }
                    `}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  {/* Social Share Buttons */}
                  <div className="flex justify-center gap-2">
                    {/* Facebook */}
                    <button
                      onClick={shareToFacebook}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>

                    {/* Messenger */}
                    <button
                      onClick={shareToMessenger}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110"
                      aria-label="Share on Messenger"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                      </svg>
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={shareToWhatsApp}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-110"
                      aria-label="Share on WhatsApp"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Romantic Closing Message */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="text-center mt-12">
            <p className={`
              text-lg md:text-xl 
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
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-rose-300">💕</span>
              <span className={`text-sm ${styles.textMuted}`}>With love, forever & always</span>
              <span className="text-rose-300">💕</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Decorative bottom hearts */}
        <div className="flex justify-center items-center gap-1 mt-8 opacity-30">
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

