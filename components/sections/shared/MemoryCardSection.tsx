'use client';

import { isDarkTheme as checkIsDarkTheme } from '@/lib/theme-color-helpers';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toPng } from 'html-to-image';
import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType, SiteAnalyticsEventType } from '@/lib/types';
import type { QrCardStyle } from '@/components/qr/QrKeepsakeCard';
import { useTheme, useThemeUtils } from '../../builder/ThemeWrapper';
import { getCardStyleClasses, getShadowClass } from '@/lib/theme-color-helpers';
import { getThemeVibe } from '@/config/themeConfig';
import { formatOccasionDisplayName, getOccasionPublicCopy } from '@/lib/public-site-copy';

import ScrollReveal from '../../ui/ScrollReveal'; // Fixed import path

interface Props {
  theme: ThemeKey;
  customerName: string;
  partnerName: string;
  heroPhotoUrl?: string;
  specialDate?: string;
  qrCodeUrl?: string;
  qrDataUrl?: string;
  slug?: string;
  siteType?: OccasionType;
  onTrackEvent?: (eventType: SiteAnalyticsEventType, source: string, dedupeKey?: string) => void;
  qrConfig?: {
    color?: string;
    background?: string;
    style?: 'square' | 'dots' | 'rounded';
    cardStyle?: 'none' | 'love_card' | 'birthday_card' | 'minimal_card' | 'polaroid';
    title?: string;
    subtitle?: string;
    showNames?: boolean;
  };
}

export default function MemoryCardSection({
  theme,
  customerName,
  partnerName,
  heroPhotoUrl,
  specialDate,
  qrCodeUrl,
  qrDataUrl,
  slug,
  siteType = 'couple',
  onTrackEvent,
  qrConfig = {},
}: Props) {
  const styles = useTheme(theme);
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const themeVibe = getThemeVibe(theme);
  const isDarkTheme = checkIsDarkTheme(theme);
  const displayName = formatOccasionDisplayName(siteType, customerName, partnerName);
  const publicCopy = getOccasionPublicCopy(siteType);
  const isBirthday = siteType === 'birthday';

  // ── Occasion-aware copy ──────────────────────────────────────────────────
  const occasionCopy = (() => {
    switch (siteType) {
      case 'birthday':
        return {
          sectionIcon: '🎂',
          sectionTitle: 'Carry the Celebration',
          sectionSubtitle: 'A little code that leads to the birthday memories',
          badgeText: 'Birthday Pass',
          bearerLabel: 'Honoree',
          sinceLabel: 'Born On',
          quote: '❝ Every birthday with you is a gift I cherish. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'Another year, another chapter of beautiful memories worth celebrating.',
          closingTagline: 'Happy birthday, forever & always',
          shareText: (names: string, url: string) => `🎉 Celebrating ${names}! Check out the birthday story!\n\n${url}`,
        };
      case 'wedding':
        return {
          sectionIcon: '💒',
          sectionTitle: 'Keep This Moment Close',
          sectionSubtitle: 'A little code that leads to forever memories',
          badgeText: 'Wedding Pass',
          bearerLabel: 'Newlyweds',
          sinceLabel: 'Married On',
          quote: '❝ Today I marry my best friend. ❞',
          keepsakeLabel: 'Wedding Card No.',
          closingQuote: 'A wedding is the beginning of forever — and every moment in between.',
          closingTagline: 'Congratulations, forever & always',
          shareText: (names: string, url: string) => `💒 ${names} just got married! See their wedding story!\n\n${url}`,
        };
      case 'proposal':
        return {
          sectionIcon: '💍',
          sectionTitle: 'The Moment We Said Yes',
          sectionSubtitle: 'A little code that leads to where it all began',
          badgeText: 'Engagement Pass',
          bearerLabel: 'Engaged',
          sinceLabel: 'Proposed On',
          quote: '❝ You are my greatest adventure. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'Love is saying yes with everything you have.',
          closingTagline: 'Here\'s to forever & always',
          shareText: (names: string, url: string) => `💍 ${names} are engaged! See the proposal story!\n\n${url}`,
        };
      case 'anniversary':
        return {
          sectionIcon: '🥂',
          sectionTitle: 'Celebrating Our Journey',
          sectionSubtitle: 'A little code that leads to years of memories',
          badgeText: 'Anniversary Pass',
          bearerLabel: 'Celebrating',
          sinceLabel: 'Together Since',
          quote: '❝ Every year with you is my favorite year. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'Love grows more beautiful with every passing year.',
          closingTagline: 'With love, through every year',
          shareText: (names: string, url: string) => `🥂 ${names} are celebrating their anniversary! \n\n${url}`,
        };
      case 'graduation':
        return {
          sectionIcon: '🎓',
          sectionTitle: 'Celebrate This Achievement',
          sectionSubtitle: 'A little code that leads to an inspiring story',
          badgeText: 'Graduate Pass',
          bearerLabel: 'Graduate',
          sinceLabel: 'Graduated On',
          quote: '❝ The tassel was worth the hassle. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'Education is the passport to the future — congratulations on earning yours.',
          closingTagline: 'Congratulations, with pride & always',
          shareText: (names: string, url: string) => `🎓 Congratulations to ${names}! See the graduation story!\n\n${url}`,
        };
      case 'debut':
        return {
          sectionIcon: '👑',
          sectionTitle: 'Her Debut Night',
          sectionSubtitle: 'A little code that leads to a magical memory',
          badgeText: 'Debut Pass',
          bearerLabel: 'Debutante',
          sinceLabel: 'Celebrating',
          quote: '❝ Tonight, the world gets to meet her. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'A debut is not just a party — it is a promise of everything she will become.',
          closingTagline: 'With love, tonight & always',
          shareText: (names: string, url: string) => `👑 ${names}'s Debut is tonight! See the celebration!\n\n${url}`,
        };
      case 'baby_shower':
        return {
          sectionIcon: '🍼',
          sectionTitle: 'Welcome Little One',
          sectionSubtitle: 'A little code that leads to the sweetest memories',
          badgeText: 'Baby Pass',
          bearerLabel: 'Family',
          sinceLabel: 'Expected On',
          quote: '❝ A baby is a little bit of heaven sent down to earth. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'Every child begins the world anew — and fills it with wonder.',
          closingTagline: 'With love, from day one',
          shareText: (names: string, url: string) => `🍼 ${names} are expecting! See the baby shower story!\n\n${url}`,
        };
      case 'memorial':
        return {
          sectionIcon: '🕊️',
          sectionTitle: 'Keeping the Memory Alive',
          sectionSubtitle: 'A little code that leads to a lifetime of love',
          badgeText: 'Memory Pass',
          bearerLabel: 'In Memory Of',
          sinceLabel: 'Remembered Since',
          quote: '❝ Those we love don\'t go away — they walk beside us every day. ❞',
          keepsakeLabel: 'Memorial No.',
          closingQuote: 'Love does not end at goodbye. It carries forward in every memory.',
          closingTagline: 'Forever in our hearts',
          shareText: (names: string, url: string) => `🕊️ In loving memory of ${names}. \n\n${url}`,
        };
      case 'family':
        return {
          sectionIcon: '🏡',
          sectionTitle: 'Our Family Story',
          sectionSubtitle: 'A little code that leads to our shared memories',
          badgeText: 'Family Pass',
          bearerLabel: 'Family',
          sinceLabel: 'Since',
          quote: '❝ Family is not an important thing — it is everything. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'The love of a family is life\'s greatest blessing.',
          closingTagline: 'With love, always & forever',
          shareText: (names: string, url: string) => `🏡 The ${names} family story! \n\n${url}`,
        };
      case 'friendship':
        return {
          sectionIcon: '🤝',
          sectionTitle: 'Our Story Together',
          sectionSubtitle: 'A little code that leads to our shared memories',
          badgeText: 'Friends Pass',
          bearerLabel: 'Friends',
          sinceLabel: 'Friends Since',
          quote: '❝ Good friends are like stars — you don\'t always see them but they\'re always there. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'Friendship is the most beautiful kind of love.',
          closingTagline: 'With love, forever & always',
          shareText: (names: string, url: string) => `🤝 ${names} — see our friendship story! \n\n${url}`,
        };
      case 'valentines':
        return {
          sectionIcon: '💌',
          sectionTitle: 'My Valentine',
          sectionSubtitle: 'A little code that leads straight to my heart',
          badgeText: 'Valentine Pass',
          bearerLabel: 'My Valentine',
          sinceLabel: 'Together Since',
          quote: '❝ You are my favorite reason to lose sleep. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'Love is the whole thing. We are only pieces.',
          closingTagline: 'Be mine, forever & always',
          shareText: (names: string, url: string) => `💌 My Valentine story with ${names}! \n\n${url}`,
        };
      case 'mothers_day':
        return {
          sectionIcon: '🌸',
          sectionTitle: 'For the Heart of Our Home',
          sectionSubtitle: 'A little code that leads to a lifetime of love',
          badgeText: 'Mother\'s Pass',
          bearerLabel: 'Honoree',
          sinceLabel: 'Cherished Since',
          quote: '❝ A mother\'s love is the fuel that enables a normal human being to do the impossible. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'There is no role more beautiful, more powerful, or more necessary than a mother.',
          closingTagline: 'With all our love, always',
          shareText: (names: string, url: string) => `🌸 Happy Mother's Day to ${names}! See the tribute! \n\n${url}`,
        };
      case 'fathers_day':
        return {
          sectionIcon: '🧡',
          sectionTitle: 'For the One Who Leads',
          sectionSubtitle: 'A little code that leads to a lifetime of memories',
          badgeText: 'Father\'s Pass',
          bearerLabel: 'Honoree',
          sinceLabel: 'Cherished Since',
          quote: '❝ A father is someone you look up to no matter how tall you grow. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'The mark of a great father is not just what he builds, but who he raises.',
          closingTagline: 'With all our love, always',
          shareText: (names: string, url: string) => `🧡 Happy Father's Day to ${names}! See the tribute! \n\n${url}`,
        };
      case 'travel':
        return {
          sectionIcon: '✈️',
          sectionTitle: 'Our Adventures Together',
          sectionSubtitle: 'A little code that leads to a world of memories',
          badgeText: 'Travel Pass',
          bearerLabel: 'Traveler(s)',
          sinceLabel: 'Journey Started',
          quote: '❝ Not all those who wander are lost — but they find the best stories. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'The world is a book, and those who do not travel read only one page.',
          closingTagline: 'Adventure on, forever & always',
          shareText: (names: string, url: string) => `✈️ ${names}'s travel story! See our adventures! \n\n${url}`,
        };
      default: // couple
        return {
          sectionIcon: '💝',
          sectionTitle: 'Keep Our Story Close',
          sectionSubtitle: 'A little code that leads to a lot of memories',
          badgeText: 'Love Pass',
          bearerLabel: 'Bearer',
          sinceLabel: 'Since',
          quote: '❝ Every memory with you is my favorite. ❞',
          keepsakeLabel: 'Keepsake No.',
          closingQuote: 'Love is not about how many days, months, or years we have been together. Love is about how much we love each other every single day.',
          closingTagline: 'With love, forever & always',
          shareText: (names: string, url: string) => `Check out our love story! ${names} 💕\n\n${url}`,
        };
    }
  })();

  // ── Theme-aware card colors ──────────────────────────────────────────────
  const cardColors = {
    bg: isDarkTheme ? themeUtils.colors.card : themeVibe === 'minimal' ? '#FFFFFF' : '#FFFAF7',
    bodyText: themeUtils.colors.text,
    subText: isDarkTheme ? `${themeUtils.colors.text}BB` : '#7A5A5A',
    mutedText: isDarkTheme ? `${themeUtils.colors.text}77` : '#B09090',
    idText: isDarkTheme ? `${themeUtils.colors.text}44` : '#C4AAAA',
  };

  const qrStyleConfig = {
    color: themeUtils.colors.primary,
    background: '#ffffff',
    style: 'rounded' as const,
    cardStyle: isBirthday ? 'birthday_card' : 'love_card',
    title: publicCopy.qr.scanLabel,
    subtitle: publicCopy.qr.subtitle,
    showNames: !isBirthday,
    ...qrConfig,
  };

  const isDataImageUrl = (value?: string) => typeof value === 'string' && value.startsWith('data:image');

  const getQrDataUrl = () => {
    if (qrDataUrl && !isDataImageUrl(qrDataUrl)) return qrDataUrl;
    if (qrCodeUrl && !isDataImageUrl(qrCodeUrl) && /^https?:\/\//.test(qrCodeUrl)) return qrCodeUrl;
    if (slug && typeof window !== 'undefined') return `${window.location.origin}/site/${slug}`;
    if (slug) return `/site/${slug}`;
    return undefined;
  };

  const targetQrDataUrl = getQrDataUrl();

  const cardStyleClasses: Record<QrCardStyle, string> = {
    love_card: 'bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-200 text-rose-900',
    birthday_card: 'bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100 border-2 border-orange-200 text-orange-900',
    minimal_card: 'bg-white border border-slate-200 text-slate-900',
    polaroid: 'bg-white border-2 border-slate-300 shadow-xl text-slate-900',
    none: 'bg-white text-slate-900',
  };

  const finalCardStyle = cardStyleClasses[(qrStyleConfig.cardStyle || 'love_card') as QrCardStyle];

  const qrRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [photoLoadError, setPhotoLoadError] = useState(false);
  
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
    if (!qrRef.current || !targetQrDataUrl) return;

    const dotsType = qrStyleConfig.style === 'square' ? 'classy' : qrStyleConfig.style === 'dots' ? 'dots' : 'rounded';
    const cornersType = qrStyleConfig.style === 'rounded' ? 'extra-rounded' : 'square';

    const createQrCode = (width: number, height: number) => new QRCodeStyling({
      width,
      height,
      type: 'canvas',
      data: targetQrDataUrl,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 6,
      },
      dotsOptions: {
        color: qrStyleConfig.color || '#E11D48',
        type: dotsType as any,
      },
      backgroundOptions: {
        color: qrStyleConfig.background || '#ffffff',
      },
      cornersSquareOptions: {
        color: qrStyleConfig.color || '#E11D48',
        type: cornersType as any,
      },
      cornersDotOptions: {
        color: qrStyleConfig.color || '#E11D48',
        type: cornersType as any,
      },
      image: '/heart-icon.svg',
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
    });

    const visibleQrCode = createQrCode(84, 84);
    qrCodeInstanceRef.current = visibleQrCode;
    qrRef.current.innerHTML = '';
    visibleQrCode.append(qrRef.current);

  }, [qrDataUrl, qrStyleConfig, targetQrDataUrl]);

  // Handle save card - capture visible card and exclude interactive controls
  const handleSaveCard = async () => {
    if (!cardRef.current || isSaving) return;

    setIsSaving(true);
    setSaveError(false);
    setSaveSuccess(false);

    try {
      // Ensure QR canvas and styles have fully painted
      await new Promise(resolve => setTimeout(resolve, 200));

      // Generate filename
      const filename = slug 
        ? `${slug}-card` 
        : `story-card-${displayName.replace(/\s+/g, '-').toLowerCase()}`;

      // Capture only non-interactive card content
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
        filter: (node) => {
          return !(node instanceof HTMLElement && node.dataset.exportIgnore === 'true');
        },
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      onTrackEvent?.('download_card', 'keepsake:download');

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
      onTrackEvent?.('share_click', 'copy_link');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const url = encodeURIComponent(currentUrl);
    onTrackEvent?.('share_click', 'facebook');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  // Share to Messenger
  const shareToMessenger = () => {
    const url = encodeURIComponent(currentUrl);
    onTrackEvent?.('share_click', 'messenger');
    window.open(`fb-messenger://share?link=${url}`, '_blank');
  };

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(occasionCopy.shareText(displayName, currentUrl));
    onTrackEvent?.('share_click', 'whatsapp');
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!targetQrDataUrl && !qrCodeUrl && !slug) return null;

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
  const profilePhotoUrl = typeof heroPhotoUrl === 'string' && heroPhotoUrl.trim().length > 0 ? heroPhotoUrl.trim() : null;

  const formattedSpecialDate = (() => {
    if (!specialDate) return null;
    try {
      const d = new Date(specialDate + 'T00:00:00');
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return null;
    }
  })();

  const keepsakeId = (slug || displayName)
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 12)
    .padEnd(12, 'X');

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`}>
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Section Title */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <div className="text-4xl mb-4">{occasionCopy.sectionIcon}</div>
            <h2 className={`${styles.heading} text-2xl md:text-3xl ${styles.text} font-semibold`}>
              {occasionCopy.sectionTitle}
            </h2>
            <p className={`${styles.textMuted} mt-2 max-w-lg mx-auto`}>
              {occasionCopy.sectionSubtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Premium Memory Card - VISIBLE */}
        <ScrollReveal animation="fade-up" delay={150}>
          {/* CR80 standard ID card — 85.6 × 54 mm — premium romantic redesign */}
          <div className="mx-auto" style={{ maxWidth: '580px' }}>
            <div
              ref={cardRef}
              className="overflow-hidden rounded-2xl"
              style={{
                aspectRatio: '85.6 / 54',
                display: 'flex',
                flexDirection: 'column',
                background: cardColors.bg,
                border: `1.5px solid ${themeUtils.colors.primary}28`,
                color: cardColors.bodyText,
                boxShadow: `0 24px 64px -18px ${themeUtils.colors.primary}44, 0 4px 20px rgba(0,0,0,0.07)`,
              }}
            >
              {/* ── Header strip — refined gradient with ornamental badge ── */}
              <div
                className="flex flex-shrink-0 items-center justify-between px-4 py-2"
                style={{
                  background: `linear-gradient(105deg, ${themeUtils.colors.primary} 0%, ${themeUtils.colors.secondary}CC 100%)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/50">✦</span>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white leading-none">KeyStory</p>
                    <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-white/55 leading-none">Keepsake Identity Card</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)' }}
                >
                  <span className="text-[7px] text-white/60">✦</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white">{occasionCopy.badgeText}</span>
                  <span className="text-[7px] text-white/60">✦</span>
                </div>
              </div>

              {/* ── Body ── */}
              <div className="flex" style={{ flex: 1, overflow: 'hidden' }}>

                {/* Photo column — 26% width, blurred fill + sharp cover + right vignette */}
                <div
                  className="relative flex-shrink-0 overflow-hidden"
                  style={{ width: '26%', borderRight: `1px solid ${themeUtils.colors.primary}18` }}
                >
                  {profilePhotoUrl && !photoLoadError ? (
                    <>
                      <img
                        src={profilePhotoUrl}
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full scale-110 object-cover"
                        style={{ filter: 'blur(12px)', opacity: 0.55 }}
                        crossOrigin="anonymous"
                      />
                      <img
                        src={profilePhotoUrl}
                        alt={displayName}
                        className="absolute inset-0 h-full w-full object-cover"
                        crossOrigin="anonymous"
                        onError={() => setPhotoLoadError(true)}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to right, transparent 55%, ${cardColors.bg})` }}
                      />
                    </>
                  ) : (
                    <div
                      className="flex h-full w-full flex-col items-center justify-center gap-1"
                      style={{ background: `linear-gradient(160deg, ${themeUtils.colors.primary}12, ${themeUtils.colors.primary}06)` }}
                    >
                      <span className="text-4xl font-black" style={{ color: `${themeUtils.colors.primary}7A` }}>
                        {(displayName[0] || customerName[0] || 'Y').toUpperCase()}
                      </span>
                      <span className="text-[11px]" style={{ color: `${themeUtils.colors.primary}40` }}>✦</span>
                      {partnerName ? (
                        <span className="text-2xl font-black" style={{ color: `${themeUtils.colors.primary}5A` }}>
                          {(partnerName[0] || 'T').toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-xl" style={{ color: `${themeUtils.colors.primary}5A` }}>{occasionCopy.sectionIcon}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Fields column — centered, naturally spaced */}
                <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-3">
                  {/* Names — hero element */}
                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-[0.32em]" style={{ color: `${themeUtils.colors.primary}66` }}>{occasionCopy.bearerLabel}</p>
                    <h3
                      className="mt-0.5 text-lg font-black leading-tight"
                      style={{ color: themeUtils.colors.primary }}
                    >
                      {displayName}
                    </h3>
                  </div>

                  {/* Date + quote side by side vertically, compact */}
                  <div className="space-y-1.5">
                    {formattedSpecialDate && (
                      <div>
                        <p className="text-[7px] font-bold uppercase tracking-[0.32em]" style={{ color: `${themeUtils.colors.primary}66` }}>{occasionCopy.sinceLabel}</p>
                        <p className="mt-0.5 text-[11px] font-semibold" style={{ color: cardColors.subText }}>{formattedSpecialDate}</p>
                      </div>
                    )}
                    <p className="text-[9px] leading-snug" style={{ color: cardColors.mutedText, fontStyle: 'italic' }}>
                      {occasionCopy.quote}
                    </p>
                  </div>

                  {/* Keepsake number — pinned bottom */}
                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-[0.32em]" style={{ color: `${themeUtils.colors.primary}55` }}>{occasionCopy.keepsakeLabel}</p>
                    <p className="mt-0.5 font-mono text-[9px] tracking-[0.2em]" style={{ color: cardColors.idText }}>{keepsakeId}</p>
                  </div>
                </div>

                {/* QR column — centered group, no artificial spreading */}
                <div
                  className="flex flex-shrink-0 flex-col items-center justify-center gap-2 px-3 py-3"
                  style={{
                    width: '22%',
                    borderLeft: `1px solid ${themeUtils.colors.primary}18`,
                    background: `${themeUtils.colors.primary}05`,
                  }}
                >
                  <p className="text-[7px] font-bold uppercase tracking-[0.24em] text-center" style={{ color: `${themeUtils.colors.primary}66` }}>Private<br/>Access</p>

                  <div
                    className="overflow-hidden rounded-xl bg-white"
                    style={{
                      padding: '4px',
                      border: `1px solid ${themeUtils.colors.primary}22`,
                      boxShadow: `0 2px 8px ${themeUtils.colors.primary}18`,
                    }}
                  >
                    {targetQrDataUrl && isClient ? (
                      <div ref={qrRef} className="h-[84px] w-[84px]" />
                    ) : (
                      <div className="flex h-[84px] w-[84px] items-center justify-center">
                        <div className="h-12 w-12 animate-pulse rounded-lg" style={{ background: `${themeUtils.colors.primary}18` }} />
                      </div>
                    )}
                  </div>

                  <p className="text-[7px] font-bold uppercase tracking-[0.24em] text-center" style={{ color: `${themeUtils.colors.primary}88` }}>Scan to<br/>Relive</p>
                </div>

              </div>

              {/* ── Footer strip — symmetrical ornamental ── */}
              <div
                className="flex flex-shrink-0 items-center justify-between px-4 py-1.5"
                style={{
                  background: `${themeUtils.colors.primary}07`,
                  borderTop: `1px solid ${themeUtils.colors.primary}15`,
                }}
              >
                <p className="text-[7px] font-semibold uppercase tracking-[0.28em]" style={{ color: `${themeUtils.colors.primary}55` }}>
                  Issued by KeyStory
                </p>
                <div className="flex items-center gap-1.5" style={{ color: `${themeUtils.colors.primary}55` }}>
                  <span className="text-[7px]">✦</span>
                  <span className="text-[9px]">♡</span>
                  <span className="text-[7px]">✦</span>
                </div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.28em]" style={{ color: `${themeUtils.colors.primary}55` }}>
                  Forever Valid
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4" data-export-ignore="true">
              {isClient && (
                <button
                  onClick={handleSaveCard}
                  disabled={isSaving}
                  className={`
                    flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.01]
                    ${accentColor === 'amber' ? 'bg-amber-500 hover:bg-amber-600' : accentColor === 'purple' ? 'bg-purple-500 hover:bg-purple-600' : accentColor === 'slate' ? 'bg-slate-500 hover:bg-slate-600' : 'bg-rose-500 hover:bg-rose-600'}
                    disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
                  `}
                >
                  {isSaving ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Preparing Download...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Card Downloaded</span>
                    </>
                  ) : saveError ? (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Try Download Again</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download Keepsake Card</span>
                    </>
                  )}
                </button>
              )}

              <div className="rounded-3xl border bg-white/70 p-5 backdrop-blur-sm" style={{ borderColor: `${themeUtils.colors.border}99` }}>
                <p className={`text-center text-xs font-semibold uppercase tracking-[0.22em] ${styles.textMuted}`}>
                  Share the link
                </p>
                <button
                  onClick={copyLink}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-all duration-300 ${copied ? 'bg-green-500 text-white' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'}`}
                >
                  {copied ? (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>Copy Share Link</span>
                    </>
                  )}
                </button>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={shareToFacebook}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 hover:scale-110 hover:bg-blue-700"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    onClick={shareToMessenger}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-blue-700"
                    aria-label="Share on Messenger"
                    title="Share on Messenger"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                  </button>
                  <button
                    onClick={shareToWhatsApp}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white transition-all duration-300 hover:scale-110 hover:from-green-600 hover:to-green-700"
                    aria-label="Share on WhatsApp"
                    title="Share on WhatsApp"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </button>
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
              &ldquo;{occasionCopy.closingQuote}&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-rose-300">{occasionCopy.sectionIcon}</span>
              <span className={`text-sm ${styles.textMuted}`}>{occasionCopy.closingTagline}</span>
              <span className="text-rose-300">{occasionCopy.sectionIcon}</span>
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

