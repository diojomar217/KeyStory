// Unique Parallax Immersive Layout

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import type { OccasionType, HomeTemplate } from "@/lib/types";
import { getOccasionHeroSpec } from "../../config/occasionHeroConfig";
import type { ThemeKey } from "@/config/themeConfig";
import { isDarkTheme as checkIsDarkTheme } from "@/lib/theme-color-helpers";

interface ParallaxImmersiveProps {
  heroImage: string;
  tagline?: string;
  normalizedDate?: string;
  theme: ThemeKey;
  siteType?: OccasionType;
  customerName: string;
  partnerName: string;
}

interface HomeSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
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
  const [hearts, setHearts] = useState<
    Array<{
      left: number;
      size: number;
      delay: number;
      duration: number;
    }>
  >([]);

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
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.7, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
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
  partnerName,
}: ParallaxImmersiveProps) {
  const occasionHero = getOccasionHeroSpec(siteType || "couple");
  const hasPartnerName = Boolean(partnerName?.trim());
  const parallaxHeading = hasPartnerName
    ? `${customerName} & ${partnerName}`
    : customerName;
  const formattedDate = normalizedDate
    ? new Date(normalizedDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Parallax scroll effect
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade-in for text
  const fgInView = useInView(fgRef, { once: true, margin: "-100px" });
  const fgControls = useAnimation();
  useEffect(() => {
    if (fgInView) fgControls.start("visible");
  }, [fgInView, fgControls]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200">
      {/* Background Layer: Floating Hearts */}
      <motion.div
        ref={bgRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        <FloatingHearts />
      </motion.div>

      {/* Mid Layer: Couple Image with Glow and Parallax */}
      <motion.div
        ref={midRef}
        className="relative z-10 flex items-center justify-center w-full mt-24 mb-8"
        style={{
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      >
        <motion.div
          className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-3xl overflow-hidden shadow-2xl bg-white/40 flex items-center justify-center aspect-square group"
          whileHover={{ scale: 1.045, rotate: -3 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <img
            src={heroImage}
            alt="Jomar & Aki"
            className="object-cover w-full h-full rounded-3xl shadow-xl group-hover:shadow-2xl"
            style={{ boxShadow: "0 8px 40px 0 rgba(255, 0, 128, 0.10)" }}
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
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }}
      >
        <p className="mb-3 rounded-full border border-white/40 bg-white/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-gray-700 backdrop-blur-md">
          {occasionHero.intro}
        </p>
        {/* Names with gradient text */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-center bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg">
          {parallaxHeading}
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
          transition={{
            duration: 1.2,
            delay: 0.3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <span className="text-xl text-pink-400 animate-pulse">💕</span>
          <div className="text-center">
            <div className="font-medium text-base text-gray-800">
              {formattedDate
                ? `${occasionHero.datePrefix} ${formattedDate}`
                : "Special moment captured forever"}
            </div>
            <div className="text-xs text-gray-600">
              A keepsake made for this occasion
            </div>
          </div>
          <span className="text-xl text-pink-400 animate-pulse">💕</span>
        </motion.div>
        {/* CTA Button */}
        <motion.a
          href={`#${occasionHero.primaryTarget}`}
          className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-base shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          whileHover={{ scale: 1.07 }}
        >
          {occasionHero.primaryLabel}
        </motion.a>
      </motion.div>
    </div>
  );
}

// Removed duplicate React import
import ParticlesCanvas from "./ParticlesCanvas";
import Image from "next/image";
import DedicatedOccasionHero from "./DedicatedOccasionHeroes";
import SharedOccasionHero, { type HeroHighlight } from "./SharedOccasionHeroes";
// HomeTemplate imported above
import { useTheme } from "../builder/ThemeWrapper";
import RelationshipTimer from "./RelationshipTimer";
import { HeroDecorations, PremiumDualCTAs } from "./HeroOverlay";
import {
  resolveHeroConfig,
  resolveHeroCoverPhoto,
  resolveParticipantNames,
} from "@/lib/site-type-utils";

export default function HomeSection({
  theme,
  siteType = "couple",
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
  const occasionHero = getOccasionHeroSpec(siteType);
  const resolvedNames = resolveParticipantNames(
    siteType,
    config?.participants || [],
    customerName,
    partnerName,
  );
  const primaryName = resolvedNames.primaryName;
  const secondaryName = resolvedNames.secondaryName;
  const [isLoaded, setIsLoaded] = useState(false);
  const premiumImageRef = useRef<HTMLDivElement>(null);
  const premiumCardRef = useRef<HTMLDivElement>(null);
  const isBirthday = siteType === "birthday";
  const hasSecondaryName = Boolean(secondaryName?.trim());
  const showDualNames = !isBirthday && hasSecondaryName;

  const celebrantName = isBirthday
    ? config?.people?.celebrant || primaryName || "Birthday Star"
    : primaryName || "Your Name";

  const birthdayDate = isBirthday
    ? config?.dates?.birthday || config?.specialDate || anniversaryDate
    : anniversaryDate;

  const normalizedDate =
    birthdayDate && !Number.isNaN(new Date(birthdayDate).getTime())
      ? birthdayDate
      : undefined;

  const formattedSpecialDate = normalizedDate
    ? new Date(normalizedDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : anniversaryDate;

  const shouldUseRelationshipTimer = showDualNames && Boolean(anniversaryDate);

  const heroConfig = resolveHeroConfig(
    siteType,
    isBirthday
      ? [{ id: "celebrant", name: celebrantName }]
      : [
          { id: "customer", name: primaryName || "Your Name" },
          { id: "partner", name: secondaryName || "Partner Name" },
        ],
    normalizedDate,
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
          const hours = Math.floor(
            (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );

          return {
            ageTurning,
            eventDate: nextBirth.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            countdown: `${months} months • ${remDays} days • ${hours} hours remaining`,
          };
        })()
      : null;

  const heroImage =
    heroCoverPhotoUrl ||
    resolveHeroCoverPhoto(
      { hero: config?.hero, cover_photo_index: coverPhotoIndex },
      photos,
    ) ||
    "/vercel.svg";

  // Crop settings from config
  const crop = config?.hero?.crop;

  const getAccentColor = () => {
    switch (theme) {
      case "dark_elegant":
        return "amber";
      case "cute_pastel":
        return "purple";
      case "minimal_modern":
        return "slate";
      default:
        return "rose";
    }
  };

  const accentColor = getAccentColor();
  const cinematicStageClass = "animate-fade-in-up motion-reduce:animate-none";
  const cinematicStageStyle = (delayMs: number) => ({
    animationDelay: `${delayMs}ms`,
    animationDuration: "760ms",
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Parallax effect removed for stability

  const displayHeadline = isBirthday
    ? celebrantName
    : showDualNames
      ? `${primaryName || "Your Name"} & ${secondaryName || "Partner Name"}`
      : primaryName || "Your Name";
  const supportingNarrative = (
    tagline ||
    message ||
    heroConfig.description
  ).trim();

  const heroHighlights = useMemo<HeroHighlight[]>(() => {
    const dateValue = formattedSpecialDate || "Date to be announced";
    const fallbackStory = message || tagline || heroConfig.description;

    switch (occasionHero.archetype) {
      case "ceremony_cinematic":
        return [
          { icon: "🗓️", label: occasionHero.datePrefix, value: dateValue },
          {
            icon: "💌",
            label: "Primary moment",
            value: occasionHero.primaryLabel,
          },
          {
            icon: "✨",
            label: "Experience",
            value: occasionHero.secondaryLabel,
          },
        ];
      case "celebration_stage":
        return [
          {
            icon: occasionHero.badge,
            label: "Occasion",
            value: occasionHero.intro,
          },
          { icon: "📅", label: occasionHero.timerLabel, value: dateValue },
          {
            icon: "🎊",
            label: "Spotlight",
            value: birthdayStats
              ? `Turning ${birthdayStats.ageTurning}`
              : "Celebration-ready",
          },
        ];
      case "scrapbook_story":
        return [
          {
            icon: "📸",
            label: "Memory board",
            value: "Photos, notes, and highlights",
          },
          {
            icon: "💬",
            label: "Story note",
            value:
              fallbackStory.slice(0, 36) || "A page filled with warm memories",
          },
          { icon: "🗓️", label: occasionHero.datePrefix, value: dateValue },
        ];
      case "tribute_minimal":
        return [
          {
            icon: "🕊️",
            label: "Tribute",
            value: "A quiet space for remembrance",
          },
          { icon: "🗓️", label: occasionHero.datePrefix, value: dateValue },
          {
            icon: "🤍",
            label: "Dedication",
            value:
              fallbackStory.slice(0, 36) || "Stories, photos, and tributes",
          },
        ];
      case "travel_journal":
        return [
          { icon: "🧭", label: "Journey", value: occasionHero.intro },
          {
            icon: "📍",
            label: "Trip note",
            value: fallbackStory.slice(0, 36) || "A route worth remembering",
          },
          { icon: "🗓️", label: occasionHero.datePrefix, value: dateValue },
        ];
      case "romantic_editorial":
      default:
        return [
          {
            icon: occasionHero.badge,
            label: "Chapter",
            value: occasionHero.intro,
          },
          { icon: "🗓️", label: occasionHero.datePrefix, value: dateValue },
          {
            icon: "💞",
            label: "Keepsake",
            value:
              fallbackStory.slice(0, 36) || "A story designed to be revisited",
          },
        ];
    }
  }, [
    birthdayStats,
    formattedSpecialDate,
    heroConfig.description,
    message,
    occasionHero,
    tagline,
  ]);

  const normalizedTemplate = useMemo(() => {
    const raw = String(template || "")
      .trim()
      .toLowerCase()
      .replace(/[-\s]+/g, "_");

    const templateAliases: Record<string, string> = {
      hero_centered: "hero_centered",
      split_layout: "split_layout",
      fullscreen_banner: "fullscreen_banner",
      parallax_immersive: "parallax_immersive",
      particles_fullscreen: "particles_fullscreen",

      hero_centered_layout: "hero_centered",
      split_layout_layout: "split_layout",
      fullscreen_banner_layout: "fullscreen_banner",
    };

    return templateAliases[raw] || "hero_centered";
  }, [template]);

  const renderHeroCentered = () => {
    const primaryButtonClass =
      occasionHero.archetype === "tribute_minimal"
        ? "bg-white/95 text-slate-900 hover:bg-white shadow-[0_10px_30px_rgba(255,255,255,0.16)]"
        : occasionHero.archetype === "ceremony_cinematic"
          ? "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-slate-900 hover:brightness-105 shadow-[0_10px_30px_rgba(251,191,36,0.28)]"
          : occasionHero.archetype === "celebration_stage"
            ? "bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-400 text-white hover:brightness-110 shadow-[0_10px_30px_rgba(236,72,153,0.30)]"
            : "bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 text-white hover:brightness-110 shadow-[0_10px_30px_rgba(244,63,94,0.25)]";

    const secondaryButtonClass =
      occasionHero.archetype === "tribute_minimal" ||
      occasionHero.archetype === "ceremony_cinematic"
        ? "border border-white/20 bg-white/10 text-white hover:bg-white/15"
        : "border border-rose-200/80 bg-white/90 text-rose-700 hover:bg-white hover:border-rose-300 shadow-sm";

    const sharedActions = (
      <div
        className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center ${cinematicStageClass}`}
        style={cinematicStageStyle(380)}
      >
        <a
          href={`#${occasionHero.primaryTarget}`}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide shadow-xl transition-all duration-300 hover:scale-[1.02] no-underline premium-cta-shell premium-cta-primary ${primaryButtonClass}`}
        >
          <span>{heroConfig.cta.startIcon}</span>
          {occasionHero.primaryLabel}
        </a>
        {occasionHero.showSecondaryCta && (
          <a
            href={`#${occasionHero.secondaryTarget}`}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide backdrop-blur-md transition-all duration-300 hover:scale-[1.02] no-underline premium-cta-shell premium-cta-secondary ${secondaryButtonClass}`}
          >
            <span>{heroConfig.cta.endIcon}</span>
            {occasionHero.secondaryLabel}
          </a>
        )}
      </div>
    );

    const sharedHighlightCards = (
      <div
        className={`grid gap-3 sm:grid-cols-3 ${cinematicStageClass}`}
        style={cinematicStageStyle(320)}
      >
        {heroHighlights.map((item, idx) => (
          <div
            key={`${item.label}-${item.value}`}
            className={`rounded-[1.5rem] border ${styles.glassBorder} ${styles.glassCard} p-4 shadow-lg min-h-[120px] flex flex-col justify-between premium-interactive-card ${cinematicStageClass}`}
            style={cinematicStageStyle(360 + idx * 80)}
          >
            <div className="mb-2 text-lg">{item.icon}</div>
            <div
              className={`text-[11px] uppercase tracking-[0.24em] font-semibold ${styles.textMuted}`}
            >
              {item.label}
            </div>
            <div
              className={`mt-2 text-sm font-semibold ${styles.text} line-clamp-2`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    );

    const isDarkEyebrow =
      occasionHero.archetype === "ceremony_cinematic" ||
      occasionHero.archetype === "tribute_minimal";

    const sharedEyebrow = (
      <div
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 shadow-sm ${cinematicStageClass} ${
          isDarkEyebrow
            ? "border border-white/30 bg-white/20 backdrop-blur-md"
            : "border border-rose-200/90 bg-white/90"
        }`}
        style={cinematicStageStyle(120)}
      >
        <span>{occasionHero.badge}</span>
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${isDarkEyebrow ? "text-white/90" : "text-rose-700"}`}
        >
          {occasionHero.intro}
        </span>
      </div>
    );

    if (occasionHero.renderStrategy === "dedicated") {
      return (
        <DedicatedOccasionHero
          siteType={siteType}
          styles={styles}
          heroImage={heroImage}
          displayHeadline={displayHeadline}
          formattedSpecialDate={formattedSpecialDate || "Date to be announced"}
          supportingNarrative={supportingNarrative}
          occasionHero={occasionHero}
          heroHighlights={heroHighlights}
          actions={sharedActions}
        />
      );
    }

    return (
      <SharedOccasionHero
        siteType={siteType}
        archetype={occasionHero.archetype}
        styles={styles}
        occasionHero={occasionHero}
        heroImage={heroImage}
        displayHeadline={displayHeadline}
        formattedSpecialDate={formattedSpecialDate || "Date to be announced"}
        supportingNarrative={supportingNarrative}
        headlineText={displayHeadline}
        supportingText={supportingNarrative}
        heroHighlights={heroHighlights}
        sharedActions={sharedActions}
        sharedHighlightCards={sharedHighlightCards}
        sharedEyebrow={sharedEyebrow}
        premiumImageRef={premiumImageRef}
        premiumCardRef={premiumCardRef}
        isLoaded={isLoaded}
        message={message}
        isBirthday={isBirthday}
        birthdayStats={birthdayStats}
      />
    );
  };

  const renderSplitLayout = () => {
    const isDark = checkIsDarkTheme(theme);
    const isPastel = theme === "cute_pastel";
    const isMinimal = theme === "minimal_modern";

    const getAccentColor = () => {
      switch (theme) {
        case "dark_elegant":
          return "amber";
        case "cute_pastel":
          return "purple";
        case "minimal_modern":
          return "slate";
        default:
          return "rose";
      }
    };
    const accentColor = getAccentColor();

    return (
      <div className={`${styles.heroBg} min-h-screen relative`}>
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="relative h-[40vh] lg:h-auto min-h-[50vh] lg:min-h-screen overflow-hidden order-1 lg:order-1 hero-media-frame">
            <Image
              src={heroImage}
              alt={`${primaryName} and ${secondaryName || "Partner"}`}
              fill
              className="object-cover brightness-[0.85] lg:brightness-100 hero-media-premium"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={88}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 hidden lg:block" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
              }}
            />
            <div className="hero-media-focus" />

            <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
              <span
                className={`text-3xl lg:text-4xl animate-pulse motion-reduce:animate-none ${cinematicStageClass}`}
                style={cinematicStageStyle(140)}
              >
                {heroConfig.decorations.badge}
              </span>
            </div>

            {/* <HeroDecorations theme={theme} siteType={siteType} variant="full" /> */}
          </div>

          <div
            className={`
              flex flex-col justify-center
              p-6 md:p-10 lg:p-12 xl:p-16
              ${isDark ? "bg-zinc-900" : isPastel ? "bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50" : isMinimal ? "bg-slate-50" : "bg-white"}
              relative
              order-2 lg:order-2
            `}
            style={{
              paddingTop: "max(1.5rem, env(safe-area-inset-top, 0px))",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
            }}
          >
            <div className="max-w-lg mx-auto lg:mx-0 w-full">
              <div
                className={`mb-6 lg:mb-8 ${cinematicStageClass}`}
                style={cinematicStageStyle(80)}
              >
                <span
                  className={`text-4xl lg:text-5xl ${
                    accentColor === "amber"
                      ? "text-amber-300"
                      : accentColor === "purple"
                        ? "text-purple-400"
                        : accentColor === "slate"
                          ? "text-slate-400"
                          : "text-rose-400"
                  }`}
                >
                  {occasionHero.badge}
                </span>
              </div>

              <p
                className={`uppercase tracking-[0.24em] text-xs ${styles.textMuted} mb-4 font-semibold ${cinematicStageClass}`}
                style={cinematicStageStyle(150)}
              >
                {occasionHero.intro}
              </p>

              <div
                className={`space-y-2 mb-6 ${cinematicStageClass}`}
                style={cinematicStageStyle(220)}
              >
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
                  {isBirthday ? celebrantName : primaryName}
                </h1>

                {showDualNames && (
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
                      {secondaryName}
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
                ${cinematicStageClass}`}
                style={cinematicStageStyle(300)}
              >
                {isBirthday ? (
                  birthdayStats ? (
                    <>
                      Turning{" "}
                      <span className={`font-medium ${styles.text}`}>
                        {birthdayStats.ageTurning}
                      </span>{" "}
                      on{" "}
                      <span className={`font-medium ${styles.text}`}>
                        {birthdayStats.eventDate}
                      </span>
                    </>
                  ) : (
                    <span className="opacity-70">
                      Prime birthday celebration coming soon
                    </span>
                  )
                ) : (
                  <>
                    {occasionHero.datePrefix}{" "}
                    <span className={`font-medium ${styles.text}`}>
                      {formattedSpecialDate || "Date to be announced"}
                    </span>
                  </>
                )}
              </p>

              <div
                className={`mb-8 ${cinematicStageClass}`}
                style={cinematicStageStyle(360)}
              >
                {isBirthday ? (
                  birthdayStats ? (
                    <div
                      className={`
                        ${styles.timerBg} ${styles.timerBorder} border rounded-full px-5 py-2.5 md:px-7 md:py-3 inline-flex items-center gap-2 md:gap-3 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm
                      `}
                    >
                      <span className="text-xl">✨</span>
                      <div className="text-center">
                        <div
                          className={`${styles.text} font-medium text-sm md:text-base`}
                        >
                          Countdown to the celebration
                        </div>
                        <div className="text-xs md:text-sm text-white/80">
                          {birthdayStats.countdown}
                        </div>
                      </div>
                      <span className="text-xl">🎈</span>
                    </div>
                  ) : null
                ) : shouldUseRelationshipTimer ? (
                  <RelationshipTimer
                    anniversary={anniversaryDate}
                    theme={theme}
                  />
                ) : (
                  <div
                    className={`
                      ${styles.timerBg} ${styles.timerBorder} border rounded-full px-5 py-2.5 md:px-7 md:py-3 inline-flex items-center gap-2 md:gap-3 shadow-lg backdrop-blur-sm
                    `}
                  >
                    <span className="text-xl">{occasionHero.badge}</span>
                    <div className="text-center">
                      <div
                        className={`${styles.text} font-medium text-sm md:text-base`}
                      >
                        {occasionHero.timerLabel}
                      </div>
                      <div className="text-xs md:text-sm text-white/80">
                        {formattedSpecialDate || "Date to be announced"}
                      </div>
                    </div>
                    <span className="text-xl">✨</span>
                  </div>
                )}
              </div>

              {tagline && (
                <div
                  className={`mb-8 ${cinematicStageClass}`}
                  style={cinematicStageStyle(420)}
                >
                  <p
                    className={`
                      text-base md:text-lg lg:text-xl
                      leading-relaxed
                      ${isDark ? "text-white/70" : "text-gray-600"}
                      font-light
                      italic
                      max-w-md
                      relative
                      pl-4
                      line-clamp-4 sm:line-clamp-none
                    `}
                  >
                    <span
                      className={`absolute left-0 top-0 text-2xl leading-none ${
                        accentColor === "amber"
                          ? "text-amber-300/50"
                          : accentColor === "purple"
                            ? "text-purple-400/50"
                            : accentColor === "slate"
                              ? "text-slate-400/50"
                              : "text-rose-400/50"
                      }`}
                    >
                      &ldquo;
                    </span>
                    {tagline}
                    <span
                      className={`absolute -bottom-1 text-2xl leading-none ${
                        accentColor === "amber"
                          ? "text-amber-300/50"
                          : accentColor === "purple"
                            ? "text-purple-400/50"
                            : accentColor === "slate"
                              ? "text-slate-400/50"
                              : "text-rose-400/50"
                      }`}
                    >
                      &rdquo;
                    </span>
                  </p>
                </div>
              )}

              <div
                className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 ${cinematicStageClass}`}
                style={cinematicStageStyle(500)}
              >
                <a
                  href={`#${occasionHero.primaryTarget}`}
                  className="
                    group
                    flex items-center justify-center gap-2
                    px-6 py-3.5 min-h-12
                    bg-gradient-to-r from-rose-500 to-pink-500
                    hover:from-rose-400 hover:to-pink-400
                    text-white
                    font-medium text-sm
                    rounded-full
                    transition-all duration-300
                    hover:scale-105 hover:shadow-lg hover:shadow-rose-500/30
                    active:scale-95
                    no-underline
                    premium-cta-shell premium-cta-primary
                  "
                >
                  <span className="transition-transform group-hover:animate-pulse">
                    {heroConfig.cta.startIcon}
                  </span>
                  {occasionHero.primaryLabel}
                  <span className="transition-transform group-hover:translate-y-0.5">
                    {heroConfig.cta.endIcon}
                  </span>
                </a>

                {occasionHero.showSecondaryCta && (
                  <a
                    href={`#${occasionHero.secondaryTarget}`}
                    className="
                      group
                      flex items-center justify-center gap-2
                      px-6 py-3.5 min-h-12
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
                      premium-cta-shell premium-cta-secondary
                    "
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.6)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.1)",
                      color: isDark
                        ? "white"
                        : isPastel
                          ? "#be185d"
                          : isMinimal
                            ? "#475569"
                            : "#be185d",
                    }}
                  >
                    <span>{heroConfig.cta.endIcon}</span>
                    {occasionHero.secondaryLabel}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 lg:bottom-8 ${cinematicStageClass}`}
          style={cinematicStageStyle(600)}
        >
          <a
            href={`#${occasionHero.primaryTarget}`}
            className="
              flex flex-col items-center gap-1
              text-white/60 hover:text-white/80
              transition-colors duration-300
              cursor-pointer
              no-underline
            "
          >
            <span className="text-xs uppercase tracking-widest opacity-70">
              Explore
            </span>
            <span className="animate-bounce text-lg">↓</span>
          </a>
        </div>
      </div>
    );
  };
  
  const effectiveTagline = supportingNarrative;

  const renderFullscreenBanner = () => {
    return (
      <section className="relative min-h-screen isolate overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroImage}
            alt="Hero background"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover object-center"
          />

          {/* Softer overlays */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/55" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.42) 100%)",
            }}
          />
        </div>

        {/* Decorations */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-70">
          <HeroDecorations theme={theme} siteType={siteType} variant="full" />
        </div>

        {/* Main content */}
        <div
          className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center text-white"
          style={{
            paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div
            className={`mb-6 ${cinematicStageClass}`}
            style={cinematicStageStyle(80)}
          >
            <span className="inline-block animate-pulse text-5xl md:text-6xl motion-reduce:animate-none">
              {occasionHero.badge}
            </span>
          </div>

          <p
            className={`mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/75 md:text-sm ${cinematicStageClass}`}
            style={cinematicStageStyle(150)}
          >
            {occasionHero.intro}
          </p>

          <h1
            className={`${styles.heading} ${cinematicStageClass} mb-5 text-4xl font-semibold leading-tight tracking-wide text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)] md:text-6xl lg:text-7xl`}
            style={cinematicStageStyle(220)}
          >
            {isBirthday ? (
              celebrantName
            ) : (
              <>
                {primaryName || "Your Name"}
                {showDualNames && (
                  <>
                    <span className="mx-0 block text-3xl font-light text-rose-300/90 md:mx-4 md:inline md:text-4xl">
                      &
                    </span>
                    {secondaryName || "Partner Name"}
                  </>
                )}
              </>
            )}
          </h1>

          <p
            className={`mb-4 text-base font-light tracking-wide text-white/95 drop-shadow-md md:text-lg ${cinematicStageClass}`}
            style={cinematicStageStyle(300)}
          >
            {isBirthday ? (
              birthdayStats ? (
                <>
                  Turning {birthdayStats.ageTurning} on{" "}
                  <span className="font-normal text-white/95">
                    {birthdayStats.eventDate}
                  </span>
                </>
              ) : (
                <span className="font-normal text-white/90">
                  Let’s celebrate your special day
                </span>
              )
            ) : (
              <>
                {occasionHero.datePrefix}{" "}
                <span className="font-normal text-white/95">
                  {formattedSpecialDate || "Date to be announced"}
                </span>
              </>
            )}
          </p>

          {effectiveTagline && (
            <p
              className={`text-base md:text-lg mb-6 text-white/90 font-light italic tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${cinematicStageClass}`}
              style={cinematicStageStyle(360)}
            >
              &ldquo;{effectiveTagline}&rdquo;
            </p>
          )}

          <div
            className={`mb-7 ${cinematicStageClass}`}
            style={cinematicStageStyle(430)}
          >
            {isBirthday ? (
              birthdayStats ? (
                <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md md:px-7 md:py-3.5">
                  <span className="text-xl">✨</span>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white md:text-base">
                      Countdown to the celebration
                    </div>
                    <div className="text-xs text-white/80 md:text-sm">
                      {birthdayStats.countdown}
                    </div>
                  </div>
                  <span className="text-xl">🎈</span>
                </div>
              ) : null
            ) : shouldUseRelationshipTimer ? (
              <div className="scale-[0.96] opacity-95">
                <RelationshipTimer
                  anniversary={anniversaryDate}
                  theme={theme}
                />
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.18)] md:px-7 md:py-3.5">
                <span className="text-xl">{occasionHero.badge}</span>
                <div className="text-center">
                  <div className="text-sm font-medium text-white md:text-base">
                    {occasionHero.timerLabel}
                  </div>
                  <div className="text-xs text-white/80 md:text-sm">
                    {formattedSpecialDate || "Date to be announced"}
                  </div>
                </div>
                <span className="text-xl">✨</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA area */}
        <div
          className={`absolute left-1/2 z-10 -translate-x-1/2 ${cinematicStageClass}`}
          style={{
            ...cinematicStageStyle(520),
            bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="scale-[0.98]">
            <PremiumDualCTAs
              siteType={siteType}
              primaryTarget={occasionHero.primaryTarget}
              secondaryTarget={occasionHero.secondaryTarget}
            />
          </div>
        </div>
      </section>
    );
  };

  switch (normalizedTemplate) {
    case "split_layout":
      return renderSplitLayout();
    case "fullscreen_banner":
      return renderFullscreenBanner();
    case "parallax_immersive":
      return renderParallaxImmersive({
        heroImage,
        tagline,
        normalizedDate,
        theme,
        siteType,
        customerName: primaryName,
        partnerName: secondaryName,
      });
    case "particles_fullscreen":
      return renderFullscreenBanner();
    case "hero_centered":
    default:
      return renderHeroCentered();
  }
}
