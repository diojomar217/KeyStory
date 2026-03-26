'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMouseParallax } from './useMouseParallax';
import ParticlesCanvas from './ParticlesCanvas';
import { useTypewriter } from './useTypewriter';
import Image from 'next/image';
import { Theme, HomeTemplate } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';
import RelationshipTimer from './RelationshipTimer';
import { HeroDecorations, PremiumDualCTAs } from './HeroOverlay';
import { resolveHeroConfig, resolveHeroCoverPhoto } from '@/lib/site-type-utils';

type Props = {
  theme: Theme;
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
};

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
}: Props) {
  const styles = useTheme(theme);
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

  const sectionRef = useRef<HTMLDivElement>(null!);
  useMouseParallax(sectionRef, 25);

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

  const renderHeroCentered = () => {
    const displayCustomerName = customerName || 'Your Name';
    const displayPartnerName = partnerName || 'Partner Name';
    const hasValidNames = customerName && partnerName;

    return (
      <div
        ref={sectionRef}
        className={`${styles.heroBg} parallax-bg min-h-[85vh] flex flex-col items-center justify-center py-8 w-full relative`}
      >
        <ParticlesCanvas theme={theme} />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gradient-to-b from-rose-500/18 via-pink-500/10 to-transparent rounded-full blur-3xl opacity-55 animate-drift" />
        </div>

        <HeroDecorations theme={theme} siteType={siteType} variant="centered" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center w-full relative z-10">
          <div
            className={`mb-4 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
          >
            <span
              className={`
                inline-flex items-center gap-1.5
                px-3 py-1.5 rounded-full
                text-[10px] font-semibold uppercase tracking-widest
                ${accentColor === 'amber'
                  ? 'bg-amber-400/20 text-amber-300'
                  : accentColor === 'purple'
                    ? 'bg-purple-100 text-purple-600'
                    : accentColor === 'slate'
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-rose-100 text-rose-600'
                }
              `}
            >
              <span className="animate-pulse">{heroConfig.decorations.badge}</span>
              <span>{heroConfig.title}</span>
              <span className="animate-pulse">{heroConfig.cta.endIcon}</span>
            </span>
          </div>

          <div
            className={`relative mx-auto mb-5 transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
          >
            <div
              className={`
                absolute -inset-3 rounded-full blur-lg opacity-30
                ${accentColor === 'amber'
                  ? 'bg-amber-400'
                  : accentColor === 'purple'
                    ? 'bg-purple-400'
                    : accentColor === 'slate'
                      ? 'bg-slate-400'
                      : 'bg-rose-400'
                }
              `}
            />

            <div
              className={`
                relative w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52
                mx-auto rounded-full overflow-hidden
                shadow-[0_15px_40px_rgba(0,0,0,0.25)]
                ring-3 ring-white/40
                transform transition-all duration-300
                hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                group
              `}
            >
              <Image
                src={heroImage}
                alt={`${displayCustomerName} and ${displayPartnerName}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5 pointer-events-none" />
              <div className="absolute inset-0 rounded-full ring-1 ring-white/20 pointer-events-none" />
            </div>
          </div>

          <div
            className={`mb-3 transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
          >
            <h1
              className={`
                ${styles.heading}
                text-3xl md:text-4xl lg:text-5xl
                font-bold
                ${styles.text}
                leading-tight
                tracking-tight
                drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]
                flex flex-wrap items-center justify-center gap-x-3 gap-y-1
              `}
            >
              {isBirthday ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block"
                  transition={{ delay: 0.5 }}
                >
                  {celebrantName}
                </motion.span>
              ) : (
                <>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-block typewriter-text"
                    transition={{ delay: 0.6 }}
                  >
                    {customerTypewriter.isComplete ? customerName : customerTypewriter.displayText}
                    <span className="blinking-cursor">|</span>
                  </motion.span>
                  <span
                    className={`text-xl md:text-2xl lg:text-3xl ${theme === 'dark_elegant'
                        ? 'text-amber-400/80'
                        : theme === 'cute_pastel'
                          ? 'text-purple-400'
                          : theme === 'minimal_modern'
                            ? 'text-slate-400'
                            : 'text-rose-400'
                      } font-light italic`}
                  >
                    <span className="inline-block animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
                      &
                    </span>
                  </span>
                  <span className="inline-block">
                    {partnerTypewriter.isComplete ? partnerName : partnerTypewriter.displayText}
                    {!partnerTypewriter.isComplete && <span className="blinking-cursor">|</span>}
                  </span>
                </>
              )}
            </h1>
          </div>

          {(normalizedDate || (isBirthday && celebrantName) || hasValidNames) && (
            <p
              className={`
                text-sm md:text-base
                ${styles.textMuted}
                mb-2
                font-light
                tracking-wide
                transition-all duration-500 delay-300
                ${isLoaded ? 'opacity-75 translate-y-0' : 'opacity-0 translate-y-2'}
              `}
            >
              {isBirthday ? (
                birthdayStats ? (
                  <>
                    Turning <span className={`font-semibold ${styles.text}`}>{birthdayStats.ageTurning}</span> on{' '}
                    <span className={`font-semibold ${styles.text}`}>{birthdayStats.eventDate}</span>
                  </>
                ) : (
                  <span className="opacity-60">Let’s celebrate your special day</span>
                )
              ) : normalizedDate ? (
                <>
                  Together since <span className={`font-semibold ${styles.text}`}>{normalizedDate}</span>
                </>
              ) : (
                <span className="opacity-60">Started our journey</span>
              )}
            </p>
          )}

          <p
            className={`text-xs md:text-sm mb-4 italic transition-all duration-500 delay-350 ${isLoaded ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-2'
              } ${theme === 'dark_elegant' ? 'text-white/70' : 'text-white/80'}`}
          >
            {isBirthday ? 'A page made to celebrate your special day ✨' : 'A little space on the internet made just for us 💕'}
          </p>

          {isBirthday ? (
            birthdayStats && (
              <div
                className={`
                  mb-4
                  transition-all duration-500 delay-400
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                `}
              >
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
                  <span className="text-xl">🎉</span>
                </div>
              </div>
            )
          ) : (
            normalizedDate && (
              <div
                className={`
                  mb-4 transition-all duration-500 delay-400
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                `}
              >
                <div className="scale-95 opacity-90">
                  <RelationshipTimer anniversary={normalizedDate} theme={theme} />
                </div>
              </div>
            )
          )}

          {tagline && (
            <div
              className={`
                mb-5 max-w-xl mx-auto
                transition-all duration-500 delay-500
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
              `}
            >
              <p
                className={`
                  text-sm md:text-base lg:text-lg
                  leading-relaxed
                  ${theme === 'dark_elegant' ? 'text-white/70' : 'text-gray-200'}
                  font-light italic
                `}
              >
                &ldquo;{taglineTypewriter.isComplete ? tagline : taglineTypewriter.displayText}&rdquo;
                <span className="ml-1 blinking-cursor">|</span>
              </p>
            </div>
          )}

          <div
            className={`
              flex flex-col sm:flex-row items-center justify-center gap-3
              transition-all duration-500 delay-600
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <a
              href="#love-letter"
              className="
                group
                flex items-center justify-center gap-2
                min-w-[160px]
                px-6 py-2.5
                bg-gradient-to-r from-rose-500 to-pink-500
                hover:from-rose-400 hover:to-pink-400
                text-white
                font-medium text-xs
                rounded-full
                transition-all duration-300
                hover:scale-105 hover:shadow-lg hover:shadow-rose-500/25
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
                  min-w-[160px]
                  px-6 py-2.5
                  bg-white/10 backdrop-blur-sm
                  border border-white/20
                  hover:bg-white/20 hover:border-white/35
                  text-white
                  font-medium text-xs
                  rounded-full
                  transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                  active:scale-95
                  no-underline
                "
                style={{
                  backgroundColor: theme === 'dark_elegant' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.16)',
                  borderColor: theme === 'dark_elegant' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.24)',
                  color: 'white',
                }}
              >
                <span>{heroConfig.cta.endIcon}</span>
                {heroConfig.cta.secondary}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            )}
          </div>

          <div className="mt-4 animate-bounce-subtle">
            <span className="text-lg opacity-30">{isBirthday ? '🎉' : '💕'}</span>
          </div>
        </div>
      </div>
    );
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
      return renderHeroCentered();
    case 'particles_fullscreen':
      return renderFullscreenBanner();
    case 'hero_centered':
    default:
      return renderHeroCentered();
  }
}