import { useState, type ReactNode, type RefObject } from 'react';
import Image from 'next/image';
import type { OccasionHeroSpec } from '../../config/occasionHeroConfig';
import type { ThemeStyles } from '../../config/themeStyles';
import type { OccasionType } from '../../lib/types';
import { useTypewriter } from './useTypewriter';

export type HeroHighlight = {
  icon: string;
  label: string;
  value: string;
};

type SharedOccasionHeroProps = {
  siteType: OccasionType;
  archetype: OccasionHeroSpec['archetype'];
  styles: ThemeStyles;
  occasionHero: OccasionHeroSpec;
  heroImage: string;
  displayHeadline: string;
  formattedSpecialDate: string;
  supportingNarrative: string;
  headlineText: string;
  supportingText: string;
  heroHighlights: HeroHighlight[];
  sharedActions: ReactNode;
  sharedHighlightCards: ReactNode;
  sharedEyebrow: ReactNode;
  premiumImageRef: RefObject<HTMLDivElement | null>;
  premiumCardRef: RefObject<HTMLDivElement | null>;
  isLoaded: boolean;
  message?: string;
  isBirthday?: boolean;
  birthdayStats?: {
    ageTurning: number;
    eventDate: string;
    countdown: string;
  } | null;
};

function SafeHeroImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (hasImageError || !src) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-200/80 via-white/75 to-rose-100/70">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-rose-200/45 blur-3xl" />
        <div className="absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-fuchsia-200/40 blur-3xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-white/70 bg-white/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm">
            KeyStory Moments
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isImageLoaded && (
        <div className="absolute inset-0 premium-loading-shell premium-skeleton" aria-hidden="true">
          <div className="premium-skeleton-overlay" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={86}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 60vw"
        className={`absolute inset-0 h-full w-full hero-media-premium transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'} ${className} [transform:translateZ(0)] [backface-visibility:hidden]`}
        draggable={false}
        onError={() => setHasImageError(true)}
        onLoad={() => setIsImageLoaded(true)}
      />
    </>
  );
}

function TypewriterValue({
  text,
  speed,
}: {
  text: string;
  speed: number;
}) {
  const { displayText } = useTypewriter(text, speed);
  return <>{displayText || text}</>;
}

export default function SharedOccasionHero({
  siteType,
  archetype,
  styles,
  occasionHero,
  heroImage,
  displayHeadline,
  formattedSpecialDate,
  supportingNarrative,
  headlineText,
  supportingText,
  heroHighlights,
  sharedActions,
  sharedHighlightCards,
  sharedEyebrow,
  premiumImageRef,
  premiumCardRef,
  isLoaded,
  message,
  isBirthday = false,
  birthdayStats = null,
}: SharedOccasionHeroProps) {
  switch (archetype) {
    case 'ceremony_cinematic':
      return (
        <section className="relative min-h-screen overflow-hidden text-white">
          <div className="absolute inset-0 hero-media-frame">
            <SafeHeroImage src={heroImage} alt={displayHeadline} className="object-cover" priority />
            <div className="absolute inset-0 bg-black/45" />
            <div className={`absolute inset-0 bg-gradient-to-br ${styles.heroGradient}`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_35%)]" />
            <div className="hero-media-focus" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-10 md:px-10 lg:px-14">
            <div className="flex justify-center lg:justify-start">{sharedEyebrow}</div>

            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_340px]">
              <div className="max-w-4xl">
                <div className="mb-6 h-px w-28 bg-gradient-to-r from-white/80 to-transparent" />
                <h1 className={`${styles.heading} mb-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl ui-title-balance`}>
                  {headlineText}
                </h1>
                <p className="mb-4 max-w-2xl text-base font-light tracking-[0.16em] text-white/70 md:text-lg uppercase ui-kicker">
                  {occasionHero.datePrefix} {formattedSpecialDate || 'Date to be announced'}
                </p>
                <p className="mb-8 max-w-2xl text-base leading-8 text-white/85 md:text-lg ui-body-measure">
                  {supportingText}
                </p>
                {sharedActions}
              </div>

              <div ref={premiumCardRef} className="rounded-[2rem] border border-white/15 bg-black/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl premium-interactive-card">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.3em] text-white/60">Ceremony Notes</span>
                  <span className="text-2xl">{occasionHero.badge}</span>
                </div>
                <div className="space-y-4">
                  {heroHighlights.map((item) => (
                    <div key={`${item.label}-ceremony`} className="rounded-2xl border border-white/10 bg-white/5 p-4 premium-interactive-card">
                      <div className="mb-2 text-lg">{item.icon}</div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-white/50">{item.label}</div>
                      <div className="mt-2 text-sm text-white/90">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'celebration_stage':
      const celebrationVariant =
        siteType === 'graduation'
          ? {
            glowA: 'bg-sky-400/25',
            glowB: 'bg-indigo-300/25',
            glowC: 'bg-amber-300/25',
            stageLabel: 'Achievement Spotlight',
            chips: ['🎓', '🏅', '📚'],
          }
          : siteType === 'debut'
            ? {
              glowA: 'bg-rose-400/25',
              glowB: 'bg-fuchsia-300/25',
              glowC: 'bg-amber-300/25',
              stageLabel: 'Debut Spotlight',
              chips: ['👑', '💫', '🎉'],
            }
            : {
              glowA: 'bg-fuchsia-400/25',
              glowB: 'bg-rose-300/25',
              glowC: 'bg-amber-300/25',
              stageLabel: 'Birthday Spotlight',
              chips: ['🎂', '🎈', '🥳'],
            };

      return (
        <section className={`relative min-h-screen overflow-hidden ${styles.heroBg}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_32%)]" />
          <div className={`absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full ${celebrationVariant.glowA} blur-3xl`} />
          <div className={`absolute bottom-12 left-12 h-40 w-40 rounded-full ${celebrationVariant.glowC} blur-3xl`} />
          <div className={`absolute right-12 top-24 h-48 w-48 rounded-full ${celebrationVariant.glowB} blur-3xl`} />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center md:px-10">
            {sharedEyebrow}
            <div className="mt-8 rounded-[2rem] border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg backdrop-blur-md">
              {celebrationVariant.stageLabel}
            </div>

            <div className="mt-4 flex items-center gap-2">
              {celebrationVariant.chips.map((chip) => (
                <span key={`${siteType}-${chip}`} className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs shadow-md backdrop-blur-md">
                  {chip}
                </span>
              ))}
            </div>

            <div ref={premiumImageRef} className={`relative mt-8 h-44 w-44 overflow-hidden rounded-[2rem] border border-white/40 bg-white/30 p-2 shadow-[0_24px_80px_rgba(244,114,182,0.28)] backdrop-blur-md transition-all duration-700 hero-media-frame premium-interactive-card md:h-56 md:w-56 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/30 to-transparent" />
              <SafeHeroImage src={heroImage} alt={displayHeadline} className="rounded-[1.4rem] object-cover" priority />
              <div className="hero-media-focus rounded-[2rem]" />
            </div>

            <h1 className={`${styles.heading} mt-8 max-w-4xl text-5xl font-black leading-[0.94] tracking-tight ${styles.text} md:text-7xl ui-title-balance`}>
              {headlineText}
            </h1>
            <p className={`mt-4 max-w-2xl text-lg ${styles.text} opacity-85`}>
              {isBirthday && birthdayStats
                ? `Turning ${birthdayStats.ageTurning} on ${birthdayStats.eventDate}`
                : `${occasionHero.datePrefix} ${formattedSpecialDate || 'Date to be announced'}`}
            </p>
            <p className={`mt-5 max-w-2xl text-base leading-8 ${styles.text} opacity-80`}>
              {supportingText}
            </p>

            <div className="mt-8 w-full max-w-4xl">{sharedHighlightCards}</div>
            <div className="mt-8">{sharedActions}</div>
          </div>
        </section>
      );

    case 'scrapbook_story':
      const scrapbookVariant =
        siteType === 'baby_shower'
          ? {
            stickerA: '🍼',
            stickerB: '🌙',
            cardLabel: 'Nursery Note',
            accentBubble: 'bg-sky-200/35',
          }
          : siteType === 'family'
            ? {
              stickerA: '🏡',
              stickerB: '📸',
              cardLabel: 'Family Note',
              accentBubble: 'bg-emerald-200/35',
            }
            : siteType === 'friendship'
              ? {
                stickerA: '🫶',
                stickerB: '🎧',
                cardLabel: 'Friendship Note',
                accentBubble: 'bg-amber-200/35',
              }
              : siteType === 'mothers_day'
                ? {
                  stickerA: '💐',
                  stickerB: '💌',
                  cardLabel: "Mother's Note",
                  accentBubble: 'bg-pink-200/35',
                }
                : siteType === 'fathers_day'
                  ? {
                    stickerA: '🛠️',
                    stickerB: '📜',
                    cardLabel: "Father's Note",
                    accentBubble: 'bg-slate-200/35',
                  }
                  : {
                    stickerA: '📖',
                    stickerB: '✨',
                    cardLabel: 'Highlight note',
                    accentBubble: 'bg-pink-200/35',
                  };

      return (
        <section className={`relative min-h-screen overflow-hidden ${styles.heroBg}`}>
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.6)_1px,transparent_0)] [background-size:26px_26px]" />
          <div className="absolute -top-12 left-12 h-36 w-36 rounded-full bg-amber-200/50 blur-3xl" />
          <div className={`absolute bottom-0 right-0 h-64 w-64 rounded-full ${scrapbookVariant.accentBubble} blur-3xl`} />

          <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-14 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              {sharedEyebrow}
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs shadow-md">{scrapbookVariant.stickerA}</span>
                  <span className="rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs shadow-md">{scrapbookVariant.stickerB}</span>
                </div>
              <h1 className={`${styles.heading} mt-8 max-w-3xl text-5xl font-bold leading-[0.96] ${styles.text} md:text-7xl ui-title-balance`}>
                {displayHeadline}
              </h1>
              <p className={`mt-4 max-w-2xl text-base font-semibold uppercase tracking-[0.18em] ${styles.text} opacity-85`}>
                {occasionHero.datePrefix} {formattedSpecialDate || 'Date to be announced'}
              </p>
              <div className={`mt-6 max-w-2xl rounded-[1.75rem] border ${styles.cardBorder} ${styles.card} p-6 shadow-xl`}>
                <p className={`text-lg leading-8 ${styles.text} opacity-85 ui-body-measure`}>
                  {supportingNarrative}
                </p>
              </div>
              <div className="mt-8">{sharedActions}</div>
            </div>

            <div className="relative min-h-[480px]">
              <div ref={premiumImageRef} className="absolute left-0 top-10 h-64 w-52 rotate-[-6deg] rounded-[1.75rem] border border-white/50 bg-white p-3 shadow-2xl premium-interactive-card md:h-72 md:w-56">
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] hero-media-frame">
                  <SafeHeroImage src={heroImage} alt={displayHeadline} className="object-cover" priority />
                  <div className="hero-media-focus rounded-[1.25rem]" />
                </div>
              </div>
              <div className={`absolute right-0 top-0 w-64 rotate-[7deg] rounded-[1.75rem] border ${styles.cardBorder} bg-white/90 p-5 shadow-xl backdrop-blur-sm premium-interactive-card hidden md:block`}>
                <div className="mb-2 text-2xl">{occasionHero.badge}</div>
                <div className={`text-xs uppercase tracking-[0.24em] font-semibold ${styles.text} opacity-75`}>{scrapbookVariant.cardLabel}</div>
                <p className={`mt-3 text-sm leading-7 ${styles.text}`}>{message || 'A warm page stitched together with photos, notes, and moments worth keeping.'}</p>
              </div>
              <div ref={premiumCardRef} className={`absolute bottom-0 right-8 w-72 -rotate-[4deg] rounded-[1.75rem] border ${styles.cardBorder} ${styles.glassCard} p-5 shadow-2xl premium-interactive-card hidden md:block`}>
                <div className={`mb-4 text-xs font-semibold uppercase tracking-[0.24em] ${styles.textMuted}`}>Memory Snippets</div>
                <div className="space-y-3">
                  {heroHighlights.map((item) => (
                    <div key={`${item.label}-scrapbook`} className="rounded-2xl bg-white/55 px-4 py-3 premium-interactive-card">
                      <div className="text-sm">{item.icon} <span className="ml-2 text-[11px] uppercase tracking-[0.18em] text-gray-500">{item.label}</span></div>
                      <div className="mt-2 text-sm text-slate-700">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'tribute_minimal':
      return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-zinc-900 to-black text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center md:px-10">
            {sharedEyebrow}
            <div ref={premiumImageRef} className="relative mt-10 h-56 w-48 overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] hero-media-frame premium-interactive-card md:h-72 md:w-60">
              <SafeHeroImage src={heroImage} alt={displayHeadline} className="rounded-[1.5rem] object-cover opacity-95" priority />
              <div className="hero-media-focus rounded-[2rem]" />
            </div>
            <h1 className={`${styles.heading} mt-10 text-5xl font-semibold leading-tight md:text-7xl ui-title-balance`}>
              {displayHeadline}
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.28em] text-white/60">
              {occasionHero.datePrefix} {formattedSpecialDate || 'Date to be announced'}
            </p>
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
              <p className="text-lg leading-8 text-white/80">
                {supportingNarrative || 'A quiet page created for remembrance, gratitude, and shared stories.'}
              </p>
            </div>
            <div className="mt-8 w-full">{sharedHighlightCards}</div>
            <div className="mt-8">{sharedActions}</div>
          </div>
        </section>
      );

    case 'travel_journal':
      return (
        <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_42%,#e2e8f0_100%)]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-14 md:px-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-sm">
                <span>{occasionHero.badge}</span>
                {occasionHero.intro}
              </div>
              <h1 className={`mt-8 max-w-3xl text-5xl font-black leading-[0.94] tracking-tight text-slate-900 md:text-7xl ${styles.heading} ui-title-balance`}>
                {displayHeadline}
              </h1>
              <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">
                {occasionHero.datePrefix} {formattedSpecialDate || 'Date to be announced'}
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                {supportingNarrative}
              </p>
              <div className="mt-8">{sharedActions}</div>
              <div className="mt-8">{sharedHighlightCards}</div>
            </div>

            <div className="order-1 lg:order-2">
              <div ref={premiumImageRef} className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.14)] hero-media-frame premium-interactive-card">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] hero-media-frame">
                  <SafeHeroImage src={heroImage} alt={displayHeadline} className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
                  <div className="hero-media-focus rounded-[1.7rem]" />
                </div>
                <div className="pointer-events-none absolute inset-x-10 top-10 h-px bg-dashed border-t border-slate-300/80" />
                <div className="absolute bottom-10 left-10 rounded-2xl bg-white/88 px-4 py-3 shadow-lg backdrop-blur-md">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Journey Card</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">{occasionHero.secondaryLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'romantic_editorial':
    default:
      return (
        <section className={`relative min-h-screen overflow-hidden ${styles.heroBg}`}>
          <div className="absolute inset-0 opacity-80">
            <div className="absolute -left-10 top-20 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-pink-200/25 blur-3xl" />
            <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-12 md:px-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-12">
            <div className="max-w-3xl">
              {sharedEyebrow}
              <h1 className={`${styles.heading} mt-8 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-tight ${styles.text} md:text-7xl xl:text-8xl ui-title-balance`}>
                <TypewriterValue text={headlineText} speed={45} />
              </h1>
              <p className={`mt-6 text-sm uppercase tracking-[0.24em] font-semibold ${styles.text} opacity-75`}>
                {occasionHero.datePrefix} {formattedSpecialDate || 'Date to be announced'}
              </p>
              <p className={`mt-7 max-w-xl text-lg leading-8 ${styles.text} opacity-82`}>
                <TypewriterValue text={supportingText} speed={18} />
              </p>
              <div className="mt-9">{sharedActions}</div>
              <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
                {heroHighlights
                  .filter((item) => item.label !== occasionHero.datePrefix)
                  .slice(0, 2)
                  .map((item) => (
                    <div key={`${item.label}-romance-compact`} className={`rounded-2xl border ${styles.glassBorder} bg-white/88 px-4 py-3.5 shadow-md`}>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-base leading-none">{item.icon}</span>
                        <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${styles.text} opacity-70`}>{item.label}</span>
                      </div>
                      <div className={`mt-2 text-[15px] font-semibold leading-6 ${styles.text} line-clamp-2`}>{item.value}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="relative flex min-h-[420px] flex-col items-center justify-center md:min-h-[500px] md:items-end lg:pt-4">
              <div className={`relative h-[410px] w-full max-w-[320px] overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/85 p-3 shadow-[0_24px_80px_rgba(236,72,153,0.14)] transition-opacity duration-500 motion-reduce:transition-none premium-interactive-card [transform:translateZ(0)] [backface-visibility:hidden] md:h-[480px] md:w-[330px] ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] hero-media-frame">
                  <SafeHeroImage src={heroImage} alt={displayHeadline} className="object-cover [object-position:center_32%]" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                  <div className="hero-media-focus rounded-[2rem]" />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-white/25" />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
  }
}