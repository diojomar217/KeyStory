// Unique Parallax Immersive Layout

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import type { OccasionType, HomeTemplate } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';

interface ParallaxImmersiveProps {
  heroImage: string;
  tagline?: string;
  normalizedDate?: string;
  theme: ThemeKey;
  siteType?: string;
  customerName: string;
  partnerName: string;
}

interface HomeSectionProps {
  theme: ThemeKey;
  siteType?: 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary';
  config?: any;
  template: HomeTemplate | string;
  customerName: string;
  partnerName: string;
  anniversaryDate: string;
  message: string;
  tagline?: string;
  photos: string[];
  coverPhotoIndex?: number;
  songLink?: string;
  heroCoverPhotoUrl?: string | null;
}
function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{
    left: number;
    size: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Only run on client
    const generated = Array.from({ length: 10 }).map(() => ({
      left: Math.random() * 90 + 2, // 2% - 92%
      size: Math.random() * 32 + 24, // 24px - 56px
      delay: Math.random() * 6,
      duration: Math.random() * 8 + 10, // 10s - 18s
    }));
    setHearts(generated);
  }, []);

  return (
    <>
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.7, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="absolute text-pink-300/60 select-none pointer-events-none"
          style={{ left: `${h.left}%`, fontSize: h.size }}
        >
          ♥
        </motion.span>
      ))}
    </>
  );
}

function renderParallaxImmersive({
  heroImage,
  tagline,
  normalizedDate,
  theme,
  siteType,
  customerName,
  partnerName
}: ParallaxImmersiveProps) {
  // Parallax scroll effect
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade-in for text
  const fgInView = useInView(fgRef, { once: true, margin: '-100px' });
  const fgControls = useAnimation();
  useEffect(() => {
    if (fgInView) fgControls.start('visible');
  }, [fgInView, fgControls]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200">
      {/* Background Layer: Floating Hearts */}
      <motion.div
        ref={bgRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`
        }}
      >
        <FloatingHearts />
      </motion.div>

      {/* Mid Layer: Couple Image with Glow and Parallax */}
      <motion.div
        ref={midRef}
        className="relative z-10 flex items-center justify-center w-full mt-24 mb-8"
        style={{
          transform: `translateY(${scrollY * 0.08}px)`
        }}
      >
        <motion.div
          className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-3xl overflow-hidden shadow-2xl bg-white/40 flex items-center justify-center aspect-square group"
          whileHover={{ scale: 1.045, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <img
            src={heroImage}
            alt="Jomar & Aki"
            className="object-cover w-full h-full rounded-3xl shadow-xl group-hover:shadow-2xl"
            style={{ boxShadow: '0 8px 40px 0 rgba(255, 0, 128, 0.10)' }}
            loading="eager"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-pink-200/40 via-transparent to-white/10 pointer-events-none" />
          <div className="absolute -inset-3 rounded-3xl blur-2xl bg-pink-300/30 opacity-60 pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Foreground Layer: Text Content */}
      <motion.div
        ref={fgRef}
        className="relative z-20 flex flex-col items-center justify-center w-full px-4"
        initial="hidden"
        animate={fgControls}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
        }}
      >
        {/* Names with gradient text */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-center bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg">
          {customerName} & {partnerName}
        </h1>
        {/* Subtitle (tagline) */}
        {tagline && (
          <p className="text-lg md:text-xl font-light italic text-gray-700 mb-6 text-center max-w-2xl">
            {tagline}
          </p>
        )}
        {/* Timer Card (glassmorphism) */}
        <motion.div
          className="mb-7 px-7 py-4 rounded-full bg-white/30 backdrop-blur-md shadow-lg flex items-center gap-3 border border-white/40"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: [0.95, 1.03, 1], opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <span className="text-xl text-pink-400 animate-pulse">💕</span>
          <div className="text-center">
            <div className="font-medium text-base text-gray-800">Together since 2022-02-14</div>
            <div className="text-xs text-gray-600">2 years • 1 month • 13 days</div>
          </div>
          <span className="text-xl text-pink-400 animate-pulse">💕</span>
        </motion.div>
        {/* CTA Button */}
        <motion.a
          href="#our-story"
          className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-base shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          whileHover={{ scale: 1.07 }}
        >
          View Our Story
        </motion.a>
      </motion.div>
    </div>
  );
}


// Removed duplicate React import
import { useMouseParallax } from './useMouseParallax';
import ParticlesCanvas from './ParticlesCanvas';
import { useTypewriter } from './useTypewriter';
import Image from 'next/image';
// HomeTemplate imported above
import { useTheme } from '../builder/ThemeWrapper';
import RelationshipTimer from './RelationshipTimer';
import { HeroDecorations, PremiumDualCTAs } from './HeroOverlay';
import { resolveHeroConfig, resolveHeroCoverPhoto } from '@/lib/site-type-utils';

export default function HomeSection({
  theme,
  siteType = 'couple',
  config,
  template,
  customerName,
  partnerName,
  anniversaryDate,
  message,
  tagline,
  photos,
  coverPhotoIndex,
  heroCoverPhotoUrl,
}: HomeSectionProps) {
  const styles = useTheme(theme);
  // DEBUG: Print config.hero to inspect crop values
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('DEBUG: config.hero', config?.hero);
  }, [config]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isBirthday = siteType === 'birthday';

  const celebrantName = isBirthday
    ? config?.people?.celebrant || config?.participants?.[0]?.name || customerName || 'Birthday Star'
    : customerName || 'Your Name';

  const birthdayDate = isBirthday
    ? config?.dates?.birthday || config?.specialDate || anniversaryDate
    : anniversaryDate;

  const normalizedDate =
    birthdayDate && !Number.isNaN(new Date(birthdayDate).getTime())
      ? birthdayDate
      : undefined;

  const heroConfig = resolveHeroConfig(
    siteType,
    isBirthday
      ? [{ id: 'celebrant', name: celebrantName }]
      : [
        { id: 'customer', name: customerName || 'Your Name' },
        { id: 'partner', name: partnerName || 'Partner Name' },
      ],
    normalizedDate
  );

  const birthdayStats =
    isBirthday && normalizedDate
      ? (() => {
        const birth = new Date(normalizedDate);
        if (Number.isNaN(birth.getTime())) return null;

        const now = new Date();
        let nextBirth = new Date(birth);
        nextBirth.setFullYear(now.getFullYear());
        if (nextBirth < now) {
          nextBirth.setFullYear(now.getFullYear() + 1);
        }

        const ageTurning = nextBirth.getFullYear() - birth.getFullYear();
        const diffMs = nextBirth.getTime() - now.getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const remDays = days - months * 30;
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return {
          ageTurning,
          eventDate: nextBirth.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          countdown: `${months} months • ${remDays} days • ${hours} hours remaining`,
        };
      })()
      : null;

  const heroImage =
    heroCoverPhotoUrl ||
    resolveHeroCoverPhoto({ hero: config?.hero, cover_photo_index: coverPhotoIndex }, photos) ||
    '/vercel.svg';

  // Crop settings from config
  const crop = config?.hero?.crop;

  const getAccentColor = () => {
    switch (theme) {
      case 'dark_elegant':
        return 'amber';
      case 'cute_pastel':
        return 'purple';
      case 'minimal_modern':
        return 'slate';
      default:
        return 'rose';
    }
  };

  const accentColor = getAccentColor();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Parallax effect removed for stability

  const customerTypewriter = useTypewriter(customerName || 'Your Name');
  const partnerTypewriter = useTypewriter(partnerName || 'Partner Name');
  const taglineTypewriter = useTypewriter(tagline || '', 80);

  const normalizedTemplate = useMemo(() => {
    const raw = String(template || '')
      .trim()
      .toLowerCase()
      .replace(/[-\s]+/g, '_');

    const templateAliases: Record<string, string> = {
      hero_centered: 'hero_centered',
      split_layout: 'split_layout',
      fullscreen_banner: 'fullscreen_banner',
      parallax_immersive: 'parallax_immersive',
      particles_fullscreen: 'particles_fullscreen',

      hero_centered_layout: 'hero_centered',
      split_layout_layout: 'split_layout',
      fullscreen_banner_layout: 'fullscreen_banner',
    };

    return templateAliases[raw] || 'hero_centered';
  }, [template]);


  // --- Premium Romantic Centered Hero Section (Dynamic, Database-Driven) ---
  interface SiteData {
    website_name?: string;
    coupleNames?: string;
    tagline?: string;
    start_date?: string;
    cover_photo?: string;
    slug: string;
    cta_primary?: { label: string; link: string };
    cta_secondary?: { label: string; link: string };
    theme?: string;
  }

  function RelationshipDuration({ startDate }: { startDate: string }) {
    const [now, setNow] = useState<Date>(() => new Date());
    useEffect(() => {
      const interval = setInterval(() => setNow(new Date()), 1000 * 60); // update every minute
      return () => clearInterval(interval);
    }, []);
    const start = useMemo(() => new Date(startDate), [startDate]);
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const remDays = days - months * 30;
    const hours = now.getHours();
    return (
      <motion.div
        className="px-7 py-3 rounded-full bg-white/30 backdrop-blur-md shadow-lg flex items-center gap-3 border border-white/40 animate-pulse"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: [0.97, 1.03, 1], opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <span className="text-xl text-pink-400">💕</span>
        <div className="text-center">
          <div className="font-medium text-base text-gray-800">
            Together since {start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-xs text-gray-600">
            {months} months • {remDays} days • {hours} hours together
          </div>
        </div>
        <span className="text-xl text-pink-400">💕</span>
      </motion.div>
    );
  }

  function FloatingHearts() {
    const [hearts, setHearts] = useState<Array<{ left: number; size: number; delay: number; duration: number }>>([]);
    useEffect(() => {
      setHearts(Array.from({ length: 8 }).map(() => ({
        left: Math.random() * 90 + 2,
        size: Math.random() * 24 + 18,
        delay: Math.random() * 6,
        duration: Math.random() * 8 + 10,
      })));
    }, []);
    return (
      <>
        {hearts.map((h, i) => (
          <motion.span
            key={i}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.5, 0] }}
            transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
            className="absolute text-pink-200/60 select-none pointer-events-none"
            style={{ left: `${h.left}%`, fontSize: h.size }}
          >
            ♥
          </motion.span>
        ))}
      </>
    );
  }

  function DynamicHeroSection({ site }: { site: SiteData }) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200">
        {/* Background: Floating Hearts */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FloatingHearts />
          <div className="absolute inset-0 bg-gradient-radial from-pink-200/60 via-white/0 to-transparent" />
        </div>
        {/* Hero Image with Glow */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full mt-24 mb-8">
          <motion.div
            className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-2xl bg-white/40 flex items-center justify-center aspect-square group animate-float"
            whileHover={{ scale: 1.045, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <img
              src={site.cover_photo}
              alt={site.website_name || site.coupleNames || 'Couple'}
              className="object-cover w-full h-full rounded-full shadow-xl group-hover:shadow-2xl"
              style={{ boxShadow: '0 8px 40px 0 rgba(255, 0, 128, 0.10)' }}
              loading="eager"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-pink-200/40 via-transparent to-white/10 pointer-events-none" />
            <div className="absolute -inset-3 rounded-full blur-2xl bg-pink-300/30 opacity-60 pointer-events-none" />
          </motion.div>
        </div>
        {/* Names Heading */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-center bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {site.website_name || site.coupleNames}
        </motion.h1>
        {/* Tagline */}
        {site.tagline && (
          <motion.p
            className="text-lg md:text-xl font-light italic text-gray-700 mb-6 text-center max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          >
            {site.tagline}
          </motion.p>
        )}
        {/* Timer Card */}
        {site.start_date && <RelationshipDuration startDate={site.start_date} />}
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
          {site.cta_primary && (
            <motion.a
              href={site.cta_primary.link.replace('[slug]', site.slug)}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-base shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              whileHover={{ scale: 1.07 }}
            >
              {site.cta_primary.label}
            </motion.a>
          )}
          {site.cta_secondary && (
            <motion.a
              href={site.cta_secondary.link.replace('[slug]', site.slug)}
              className="px-8 py-3 rounded-full bg-white/30 text-pink-600 font-semibold text-base shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-pink-200"
              whileHover={{ scale: 1.07 }}
            >
              {site.cta_secondary.label}
            </motion.a>
          )}
        </div>
      </div>
    );
  }

  const renderHeroCentered = () => {
    // Compose site data from props
    const site: SiteData = {
      website_name: config?.website_name,
      coupleNames: customerName && partnerName ? `${customerName} & ${partnerName}` : undefined,
      tagline: tagline,
      start_date: anniversaryDate,
      cover_photo: heroCoverPhotoUrl || (photos && photos[0]),
      slug: config?.slug || '',
      cta_primary: config?.cta_primary || { label: 'View Our Story', link: `/site/[slug]#story` },
      cta_secondary: config?.cta_secondary || { label: 'See Memories', link: `/site/[slug]#memories` },
      theme: theme,
    };
    return <DynamicHeroSection site={site} />;
  };


  const renderSplitLayout = () => {
    const isDark = theme === 'dark_elegant';
    const isPastel = theme === 'cute_pastel';
    const isMinimal = theme === 'minimal_modern';

    const getAccentColor = () => {
      switch (theme) {
        case 'dark_elegant':
          return 'amber';
        case 'cute_pastel':
          return 'purple';
        case 'minimal_modern':
          return 'slate';
        default:
          return 'rose';
      }
    };
    const accentColor = getAccentColor();

    return (
      <div className={`${styles.heroBg} min-h-screen relative`}>
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="relative h-[40vh] lg:h-auto min-h-[50vh] lg:min-h-screen overflow-hidden order-1 lg:order-1">
            <Image
              src={heroImage}
              alt={`${customerName} and ${partnerName}`}
              fill
              className="object-cover brightness-[0.85] lg:brightness-100"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 hidden lg:block" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)' }} />

            <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
              <span className="text-3xl lg:text-4xl animate-pulse">{heroConfig.decorations.badge}</span>
            </div>

            <HeroDecorations theme={theme} siteType={siteType} variant="full" />
          </div>

          <div
            className={`
              flex flex-col justify-center
              p-6 md:p-10 lg:p-12 xl:p-16
              ${isDark ? 'bg-zinc-900' : isPastel ? 'bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50' : isMinimal ? 'bg-slate-50' : 'bg-white'}
              relative
              order-2 lg:order-2
            `}
          >
            <div className="max-w-lg mx-auto lg:mx-0 w-full">
              <div className="mb-6 lg:mb-8">
                <span
                  className={`text-4xl lg:text-5xl ${accentColor === 'amber'
                      ? 'text-amber-300'
                      : accentColor === 'purple'
                        ? 'text-purple-400'
                        : accentColor === 'slate'
                          ? 'text-slate-400'
                          : 'text-rose-400'
                    }`}
                >
                  {isBirthday ? '🎉' : '💕'}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <h1
                  className={`
                    ${styles.heading}
                    text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                    font-bold
                    ${styles.text}
                    leading-[1.1]
                    tracking-tight
                  `}
                >
                  {isBirthday ? celebrantName : customerName}
                </h1>

                {!isBirthday && (
                  <>
                    <p
                      className={`
                        text-2xl md:text-3xl lg:text-4xl
                        ${styles.accent}
                        font-light
                        py-1
                      `}
                    >
                      &
                    </p>
                    <h1
                      className={`
                        ${styles.heading}
                        text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                        font-bold
                        ${styles.text}
                        leading-[1.1]
                        tracking-tight
                      `}
                    >
                      {partnerName}
                    </h1>
                  </>
                )}
              </div>

              <p
                className={`
                  text-base md:text-lg
                  ${styles.textMuted}
                  mb-6
                  font-light
                  tracking-wide
                `}
              >
                {isBirthday ? (
                  birthdayStats ? (
                    <>
                      Turning <span className={`font-medium ${styles.text}`}>{birthdayStats.ageTurning}</span> on{' '}
                      <span className={`font-medium ${styles.text}`}>{birthdayStats.eventDate}</span>
                    </>
                  ) : (
                    <span className="opacity-70">Prime birthday celebration coming soon</span>
                  )
                ) : (
                  <>
                    Together since <span className={`font-medium ${styles.text}`}>{anniversaryDate}</span>
                  </>
                )}
              </p>

              <div className="mb-8">
                {isBirthday ? (
                  birthdayStats ? (
                    <div
                      className={`
                        ${styles.timerBg} ${styles.timerBorder} border rounded-full px-5 py-2.5 md:px-7 md:py-3 inline-flex items-center gap-2 md:gap-3 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm
                      `}
                    >
                      <span className="text-xl">✨</span>
                      <div className="text-center">
                        <div className={`${styles.text} font-medium text-sm md:text-base`}>Countdown to the celebration</div>
                        <div className="text-xs md:text-sm text-white/80">{birthdayStats.countdown}</div>
                      </div>
                      <span className="text-xl">🎈</span>
                    </div>
                  ) : null
                ) : (
                  <RelationshipTimer anniversary={anniversaryDate} theme={theme} />
                )}
              </div>

              {tagline && (
                <div className="mb-8">
                  <p
                    className={`
                      text-base md:text-lg lg:text-xl
                      leading-relaxed
                      ${isDark ? 'text-white/70' : 'text-gray-600'}
                      font-light
                      italic
                      max-w-md
                      relative
                      pl-4
                    `}
                  >
                    <span
                      className={`absolute left-0 top-0 text-2xl leading-none ${accentColor === 'amber'
                          ? 'text-amber-300/50'
                          : accentColor === 'purple'
                            ? 'text-purple-400/50'
                            : accentColor === 'slate'
                              ? 'text-slate-400/50'
                              : 'text-rose-400/50'
                        }`}
                    >
                      &ldquo;
                    </span>
                    {tagline}
                    <span
                      className={`absolute -bottom-1 text-2xl leading-none ${accentColor === 'amber'
                          ? 'text-amber-300/50'
                          : accentColor === 'purple'
                            ? 'text-purple-400/50'
                            : accentColor === 'slate'
                              ? 'text-slate-400/50'
                              : 'text-rose-400/50'
                        }`}
                    >
                      &rdquo;
                    </span>
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
                <a
                  href="#love-letter"
                  className="
                    group
                    flex items-center justify-center gap-2
                    px-6 py-3
                    bg-gradient-to-r from-rose-500 to-pink-500
                    hover:from-rose-400 hover:to-pink-400
                    text-white
                    font-medium text-sm
                    rounded-full
                    transition-all duration-300
                    hover:scale-105 hover:shadow-lg hover:shadow-rose-500/30
                    active:scale-95
                    no-underline
                  "
                >
                  <span className="transition-transform group-hover:animate-pulse">{heroConfig.cta.startIcon}</span>
                  {heroConfig.cta.primary}
                  <span className="transition-transform group-hover:translate-y-0.5">{heroConfig.cta.endIcon}</span>
                </a>

                {!isBirthday && (
                  <a
                    href="#gallery"
                    className="
                      group
                      flex items-center justify-center gap-2
                      px-6 py-3
                      bg-white/20 backdrop-blur-sm
                      border border-white/40
                      hover:bg-white/30 hover:border-white/60
                      text-white
                      font-medium text-sm
                      rounded-full
                      transition-all duration-300
                      hover:scale-105
                      active:scale-95
                      no-underline
                    "
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
                      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      color: isDark ? 'white' : isPastel ? '#be185d' : isMinimal ? '#475569' : '#be185d',
                    }}
                  >
                    <span>{heroConfig.cta.endIcon}</span>
                    {heroConfig.cta.secondary}
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:bottom-8">
          <a
            href="#love-letter"
            className="
              flex flex-col items-center gap-1
              text-white/60 hover:text-white/80
              transition-colors duration-300
              cursor-pointer
              no-underline
            "
          >
            <span className="text-xs uppercase tracking-widest opacity-70">Explore</span>
            <span className="animate-bounce text-lg">↓</span>
          </a>
        </div>
      </div>
    );
  };
  const renderFullscreenBanner = () => {
    return (
      <div className={`relative min-h-screen flex items-center justify-center overflow-hidden ${styles.heroBg}`}>
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Background"
            fill
            className="object-cover scale-[1.02]"
            priority
          />

          {/* Stronger layered overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-black/15" />
          <div className={`absolute inset-0 ${styles.overlay}`} />
          <div className="absolute inset-0" style={{ background: styles.heroVignette }} />

          {/* Soft center focus glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[520px] h-[520px] rounded-full bg-white/8 blur-3xl" />
          </div>
        </div>

        {/* Decorations */}
        <div className="opacity-70">
          <HeroDecorations theme={theme} siteType={siteType} variant="full" />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center text-white px-4 flex flex-col items-center justify-center max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="text-5xl md:text-6xl animate-pulse inline-block">
              {isBirthday ? '🎉' : '💕'}
            </span>
          </div>

          <h1
            className={`
            ${styles.heading}
            text-4xl md:text-6xl lg:text-7xl
            font-semibold
            mb-5
            leading-tight
            tracking-wide
            drop-shadow-[0_6px_30px_rgba(0,0,0,0.5)]
          `}
          >
            {isBirthday ? (
              celebrantName
            ) : (
              <>
                {customerName || 'Your Name'}
                <span className="block md:inline mx-0 md:mx-4 text-3xl md:text-4xl text-rose-300/85 font-light">
                  &
                </span>
                {partnerName || 'Partner Name'}
              </>
            )}
          </h1>

          <p className="text-base md:text-lg mb-4 text-white/75 font-light tracking-wide drop-shadow-md">
            {isBirthday ? (
              birthdayStats ? (
                <>
                  Turning {birthdayStats.ageTurning} on{' '}
                  <span className="font-normal text-white/90">{birthdayStats.eventDate}</span>
                </>
              ) : (
                <span className="font-normal text-white/85">Let’s celebrate your special day</span>
              )
            ) : (
              <>
                Together since{' '}
                <span className="font-normal text-white/90">{anniversaryDate}</span>
              </>
            )}
          </p>


          {!isBirthday && (
            <p className="text-base md:text-lg mb-6 text-white/90 font-light italic tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          <div className="mb-7">
            {isBirthday ? (
              birthdayStats ? (
                <div
                  className="
                  inline-flex items-center gap-3 rounded-full
                  px-5 py-3 md:px-7 md:py-3.5
                  border border-white/20
                  bg-white/10
                  backdrop-blur-md
                  shadow-[0_12px_40px_rgba(0,0,0,0.18)]
                  transition-all duration-300
                "
                >
                  <span className="text-xl">✨</span>
                  <div className="text-center">
                    <div className="text-sm md:text-base font-medium text-white">
                      Countdown to the celebration
                    </div>
                    <div className="text-xs md:text-sm text-white/80">
                      {birthdayStats.countdown}
                    </div>
                  </div>
                  <span className="text-xl">🎈</span>
                </div>
              ) : null
            ) : (
              <div className="scale-[0.96] opacity-95">
                <RelationshipTimer anniversary={anniversaryDate} theme={theme} />
              </div>
            )}
          </div>

        </div>

        {/* CTA area */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="scale-[0.98]">
            <PremiumDualCTAs
              siteType={siteType}
              primaryTarget="love-letter"
              secondaryTarget="gallery"
            />
          </div>
        </div>
      </div>
    );
  };

  switch (normalizedTemplate) {
    case 'split_layout':
      return renderSplitLayout();
    case 'fullscreen_banner':
      return renderFullscreenBanner();
    case 'parallax_immersive':
      return renderParallaxImmersive({
        heroImage,
        tagline,
        normalizedDate,
        theme,
        siteType,
        customerName,
        partnerName
      });
    case 'particles_fullscreen':
      return renderFullscreenBanner();
    case 'hero_centered':
    default:
      return renderHeroCentered();
  }
}