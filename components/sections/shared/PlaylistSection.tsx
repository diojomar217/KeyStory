"use client";

import type { CSSProperties } from "react";
import type { ThemeKey } from "@/config/themeConfig";
import type { OccasionType, SectionAsset } from "@/lib/types";
import { getMusicEmbedInfo } from "@/lib/musicEmbed";
import SectionHeader from "../../page/SectionHeader";
import { useThemeUtils } from "../../builder/ThemeWrapper";
import {
  getShadowClass,
  getSectionSpacingClass,
} from "@/lib/theme-color-helpers";
import ScrollReveal from "../../ui/ScrollReveal";

type PlaylistTemplate = "minimal" | "visual" | "lyrics";

interface PlaylistSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  songLink?: string;
  autoplay?: boolean;
  sectionId?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
  playlistTemplate?: PlaylistTemplate;
  songTitle?: string;
  artistName?: string;
  coverImageUrl?: string;
  description?: string;
  lyricsExcerpt?: string;

  // NEW
  ambientMode?: boolean; // if true + minimal template, music loads without visible section
  assets?: SectionAsset;
}

interface OccasionPlaylistCopy {
  sectionTitle: string;
  sectionSubtitle: string;
  songTitle: string;
  description: string;
  icon: string;
  pillLabel: string;
  moodLabel: string;
  helperText: string;
}

const DEFAULT_OCCASION_COPY: OccasionPlaylistCopy = {
  sectionTitle: "Our Playlist",
  sectionSubtitle: "Songs that define this story",
  songTitle: "Our Song",
  description: "A song that makes this story feel even more unforgettable.",
  icon: "🎶",
  pillLabel: "Our Soundtrack",
  moodLabel: "Music Mood",
  helperText: "A playlist made for this moment",
};

const OCCASION_PLAYLIST_COPY: Partial<Record<string, OccasionPlaylistCopy>> = {
  couple: {
    sectionTitle: "Our Playlist",
    sectionSubtitle: "Songs that define our relationship",
    songTitle: "Our Song",
    description: "A song that brings back our sweetest memories together.",
    icon: "🎶",
    pillLabel: "Love Playlist",
    moodLabel: "Relationship Mood",
    helperText: "A playlist made for the two of us",
  },
  birthday: {
    sectionTitle: "Birthday Playlist",
    sectionSubtitle: "Tunes to celebrate the day",
    songTitle: "Birthday Song",
    description: "A song that makes this special day more memorable.",
    icon: "🎵",
    pillLabel: "Birthday Playlist",
    moodLabel: "Celebration Mood",
    helperText: "A soundtrack for the celebration",
  },
  wedding: {
    sectionTitle: "Wedding Playlist",
    sectionSubtitle: "Songs for your celebration of love",
    songTitle: "Wedding Song",
    description:
      "A song that captures the joy, warmth, and beauty of this day.",
    icon: "💍",
    pillLabel: "Wedding Playlist",
    moodLabel: "Ceremony Mood",
    helperText: "A soundtrack for your wedding day",
  },
  anniversary: {
    sectionTitle: "Anniversary Playlist",
    sectionSubtitle: "Songs that celebrate your journey together",
    songTitle: "Anniversary Song",
    description:
      "A song that honors the memories you have built through the years.",
    icon: "🥂",
    pillLabel: "Anniversary Playlist",
    moodLabel: "Milestone Mood",
    helperText: "A soundtrack for another beautiful year",
  },
  graduation: {
    sectionTitle: "Graduation Playlist",
    sectionSubtitle: "Songs for milestones and proud moments",
    songTitle: "Graduation Song",
    description: "A track that celebrates growth, hard work, and achievement.",
    icon: "🎓",
    pillLabel: "Graduation Playlist",
    moodLabel: "Achievement Mood",
    helperText: "A soundtrack for this proud milestone",
  },
  "baby-shower": {
    sectionTitle: "Baby Shower Playlist",
    sectionSubtitle: "Songs for a sweet and joyful celebration",
    songTitle: "Baby Shower Song",
    description:
      "A gentle song that adds warmth and happiness to this special gathering.",
    icon: "🍼",
    pillLabel: "Baby Shower Playlist",
    moodLabel: "Sweet Celebration",
    helperText: "A soft soundtrack for a joyful day",
  },
  baptism: {
    sectionTitle: "Baptism Playlist",
    sectionSubtitle: "Songs for the baptism and celebration",
    songTitle: "Baptism Song",
    description: "A gentle, celebratory song that honors this special ceremony.",
    icon: "👶",
    pillLabel: "Baptism Playlist",
    moodLabel: "Celebration Mood",
    helperText: "A soundtrack for the baptism celebration",
  },
  debut: {
    sectionTitle: "Debut Playlist",
    sectionSubtitle: "Songs for a once-in-a-lifetime celebration",
    songTitle: "Debut Song",
    description:
      "A song that makes this elegant and unforgettable night even more special.",
    icon: "✨",
    pillLabel: "Debut Playlist",
    moodLabel: "Debut Mood",
    helperText: "A soundtrack for a special debut night",
  },
  family: {
    sectionTitle: "Family Playlist",
    sectionSubtitle: "Songs that bring everyone together",
    songTitle: "Family Song",
    description: "A song that feels like home, love, and shared memories.",
    icon: "🏡",
    pillLabel: "Family Playlist",
    moodLabel: "Family Mood",
    helperText: "A soundtrack for togetherness",
  },
  proposal: {
    sectionTitle: "Proposal Playlist",
    sectionSubtitle: "Songs for the most unforgettable question",
    songTitle: "Proposal Song",
    description:
      "A song that adds even more heart to this life-changing moment.",
    icon: "💖",
    pillLabel: "Proposal Playlist",
    moodLabel: "Romantic Mood",
    helperText: "A soundtrack for the big question",
  },
  "valentine's-day": {
    sectionTitle: "Valentine Playlist",
    sectionSubtitle: "Songs for romance, memories, and sweet moments",
    songTitle: "Valentine Song",
    description:
      "A song that makes this Valentine moment feel even more meaningful.",
    icon: "💌",
    pillLabel: "Valentine Playlist",
    moodLabel: "Romantic Mood",
    helperText: "A soundtrack for Valentine memories",
  },
  friendship: {
    sectionTitle: "Friendship Playlist",
    sectionSubtitle: "Songs for fun memories and strong bonds",
    songTitle: "Friendship Song",
    description:
      "A song that reminds you of laughter, adventures, and shared moments.",
    icon: "🤝",
    pillLabel: "Friendship Playlist",
    moodLabel: "Besties Mood",
    helperText: "A soundtrack for friendship memories",
  },
  memorial: {
    sectionTitle: "Memorial Playlist",
    sectionSubtitle: "Songs to remember, honor, and reflect",
    songTitle: "Memorial Song",
    description:
      "A meaningful song that brings comfort, remembrance, and peace.",
    icon: "🕊️",
    pillLabel: "Memorial Playlist",
    moodLabel: "Remembrance Mood",
    helperText: "A soundtrack for remembrance",
  },
  travel: {
    sectionTitle: "Travel Playlist",
    sectionSubtitle: "Songs for the journey and the memories along the way",
    songTitle: "Travel Song",
    description:
      "A song that captures the feeling of adventure and shared experiences.",
    icon: "✈️",
    pillLabel: "Travel Playlist",
    moodLabel: "Adventure Mood",
    helperText: "A soundtrack for the journey",
  },
  "fathers-day": {
    sectionTitle: "Father's Day Playlist",
    sectionSubtitle: "Songs for appreciation, gratitude, and family moments",
    songTitle: "Father's Day Song",
    description: "A song that celebrates strength, guidance, and love.",
    icon: "👔",
    pillLabel: "Father's Playlist",
    moodLabel: "Appreciation Mood",
    helperText: "A soundtrack for gratitude",
  },
  "mothers-day": {
    sectionTitle: "Mother's Day Playlist",
    sectionSubtitle: "Songs for love, warmth, and appreciation",
    songTitle: "Mother's Day Song",
    description:
      "A song that celebrates care, kindness, and unconditional love.",
    icon: "🌷",
    pillLabel: "Mother's Playlist",
    moodLabel: "Warmth Mood",
    helperText: "A soundtrack for appreciation",
  },
};

function getProviderLabel(provider: string | null) {
  switch (provider) {
    case "spotify":
      return "Spotify";
    case "youtube":
      return "YouTube";
    case "soundcloud":
      return "SoundCloud";
    default:
      return "Music";
  }
}

function getOccasionCopy(siteType: OccasionType): OccasionPlaylistCopy {
  return OCCASION_PLAYLIST_COPY[siteType] || DEFAULT_OCCASION_COPY;
}

export default function PlaylistSection({
  theme,
  siteType = "couple",
  songLink,
  autoplay = false,
  sectionId = "playlist",
  icon,
  title,
  subtitle,
  playlistTemplate = "minimal",
  songTitle,
  artistName,
  coverImageUrl,
  description,
  lyricsExcerpt,
  ambientMode = true,
}: PlaylistSectionProps) {
  const themeUtils = useThemeUtils(theme) as any;
  const { colors, typography } = themeUtils;
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);

  if (!songLink) return null;

  const { provider, embedUrl, isValid } = getMusicEmbedInfo(songLink, autoplay);
  if (!isValid || !embedUrl) return null;

  const occasionCopy = getOccasionCopy(siteType);

  const resolvedSectionTitle = title || occasionCopy.sectionTitle;
  const resolvedSectionSubtitle = subtitle || occasionCopy.sectionSubtitle;
  const resolvedSongTitle = songTitle || occasionCopy.songTitle;
  const resolvedDescription = description || occasionCopy.description;
  const resolvedIcon = icon || occasionCopy.icon;
  const providerLabel = getProviderLabel(provider);

  const outerCardStyle: CSSProperties = {
    backgroundColor: colors.card,
    borderColor: `${colors.border}`,
    borderWidth: "1px",
    color: colors.text,
    boxShadow: `0 18px 40px ${colors.primary}10`,
  };

  const panelStyle: CSSProperties = {
    backgroundColor: colors.background,
    borderColor: `${colors.border}`,
  };

  const tinyPillStyle: CSSProperties = {
    color: colors.text,
    borderColor: `${colors.primary}1e`,
    backgroundColor: `${colors.primary}08`,
  };

  const primaryButtonStyle: CSSProperties = {
    backgroundColor: colors.primary,
    color: "#ffffff",
    boxShadow: `0 12px 24px ${colors.primary}20`,
  };

  const secondaryChipStyle: CSSProperties = {
    color: colors.text,
    borderColor: `${colors.primary}1f`,
    backgroundColor: "transparent",
  };

  const textMutedStyle: CSSProperties = {
    color: colors.text,
  };

  const titleStyle: CSSProperties = {
    color: colors.primary,
    fontFamily: typography.headingFont,
  };

  const addAnimations = (
    <style jsx>{`
      @keyframes playlistFloat {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      @keyframes playlistGlow {
        0%,
        100% {
          opacity: 0.55;
          transform: scale(1);
        }
        50% {
          opacity: 0.82;
          transform: scale(1.05);
        }
      }

      @keyframes playlistWave {
        0%,
        100% {
          transform: scaleY(0.45);
          opacity: 0.5;
        }
        50% {
          transform: scaleY(1);
          opacity: 1;
        }
      }

      @keyframes playlistFadeLift {
        from {
          opacity: 0;
          transform: translateY(14px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .playlist-fade-lift {
        animation: playlistFadeLift 0.65s ease-out both;
      }

      .playlist-cover-float {
        animation: playlistFloat 5.4s ease-in-out infinite;
      }

      .playlist-soft-glow {
        animation: playlistGlow 6s ease-in-out infinite;
      }

      .playlist-wave-bar {
        transform-origin: bottom center;
        animation: playlistWave 1.45s ease-in-out infinite;
      }

      .playlist-wave-bar:nth-child(2) {
        animation-delay: 0.1s;
      }
      .playlist-wave-bar:nth-child(3) {
        animation-delay: 0.2s;
      }
      .playlist-wave-bar:nth-child(4) {
        animation-delay: 0.3s;
      }
      .playlist-wave-bar:nth-child(5) {
        animation-delay: 0.4s;
      }
      .playlist-wave-bar:nth-child(6) {
        animation-delay: 0.5s;
      }
      .playlist-wave-bar:nth-child(7) {
        animation-delay: 0.6s;
      }
      .playlist-wave-bar:nth-child(8) {
        animation-delay: 0.7s;
      }
      .playlist-wave-bar:nth-child(9) {
        animation-delay: 0.8s;
      }
      .playlist-wave-bar:nth-child(10) {
        animation-delay: 0.9s;
      }
      .playlist-wave-bar:nth-child(11) {
        animation-delay: 1s;
      }
      .playlist-wave-bar:nth-child(12) {
        animation-delay: 1.1s;
      }
    `}</style>
  );

  const renderAmbientEmbed = () => (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 h-0 w-0 overflow-hidden opacity-0"
    >
      <iframe
        src={embedUrl}
        className="h-[1px] w-[1px]"
        allow={
          provider === "spotify"
            ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        }
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${resolvedSectionTitle} ambient player`}
        tabIndex={-1}
      />
    </div>
  );

  const renderCompactProviderLabel = () => (
    <div className="flex items-center justify-center md:justify-start">
      <span
        className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
        style={tinyPillStyle}
      >
        {providerLabel}
      </span>
    </div>
  );

  const renderCoverArt = (
    sizeClass: string,
    roundedClass = "rounded-[1.6rem]",
    floating = false,
  ) => {
    const content = coverImageUrl ? (
      <div
        className={`overflow-hidden border ${roundedClass} ${sizeClass}`}
        style={panelStyle}
      >
        <img
          src={coverImageUrl}
          alt={resolvedSongTitle}
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <div
        className={`relative overflow-hidden border ${roundedClass} ${sizeClass}`}
        style={{
          ...panelStyle,
          backgroundImage: `linear-gradient(145deg, ${colors.primary}10, ${colors.secondary || colors.primary}08, transparent)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 20%, ${colors.primary}16, transparent 35%),
              radial-gradient(circle at 78% 78%, ${colors.secondary || colors.primary}12, transparent 32%)
            `,
          }}
        />
        <div className="relative flex h-full w-full flex-col items-center justify-center px-4 text-center">
          <div className="text-4xl md:text-5xl">{resolvedIcon}</div>
          <p
            className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={textMutedStyle}
          >
            {providerLabel}
          </p>
        </div>
      </div>
    );

    if (!floating) return content;

    return (
      <div className="relative mx-auto w-full max-w-[250px]">
        <div
          className="playlist-soft-glow absolute inset-4 rounded-[2rem] blur-3xl"
          style={{ backgroundColor: `${colors.primary}18` }}
        />
        <div className="playlist-cover-float relative">{content}</div>
      </div>
    );
  };

  const renderCompactPlayer = (compactRatio = true) => {
    const mediaFrameClass =
      provider === "spotify"
        ? "relative w-full min-h-[88px]"
        : compactRatio
          ? "relative w-full aspect-[16/5.5] md:aspect-[16/5]"
          : "relative w-full aspect-video";

    return (
      <div
        className="overflow-hidden rounded-[1.3rem] border transition-opacity duration-300 hover:opacity-100"
        style={{
          ...panelStyle,
          opacity: 0.92,
        }}
      >
        <div className={mediaFrameClass}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full"
            allow={
              provider === "spotify"
                ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            }
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={resolvedSectionTitle}
          />
        </div>
      </div>
    );
  };

  const renderPrimaryAction = (label: string) => (
    <a
      href={songLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
      style={primaryButtonStyle}
    >
      {label}
    </a>
  );

  const renderSoftHelperChip = (text: string) => (
    <span
      className="inline-flex items-center rounded-full border px-4 py-2 text-xs font-medium md:text-sm"
      style={secondaryChipStyle}
    >
      {text}
    </span>
  );

  const renderVisualWaveform = () => {
    const heights = [14, 24, 18, 32, 22, 36, 18, 28, 20, 30, 16, 24];

    return (
      <div className="flex items-end justify-center gap-2">
        {heights.map((height, index) => (
          <span
            key={index}
            className="playlist-wave-bar inline-block w-1.5 rounded-full md:w-2"
            style={{
              height: `${height}px`,
              background: `linear-gradient(to top, ${colors.primary}, ${colors.secondary || colors.primary})`,
              boxShadow: `0 6px 18px ${colors.primary}18`,
            }}
          />
        ))}
      </div>
    );
  };

  const renderMinimalTemplate = () => {
    return (
      <div className="playlist-fade-lift grid gap-5 md:grid-cols-[112px_1fr] md:items-center">
        <div className="mx-auto w-full max-w-[112px] md:max-w-none">
          {renderCoverArt("aspect-square w-full", "rounded-[1.35rem]", true)}
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-4">
            {renderCompactProviderLabel()}

            <div className="text-center md:text-left">
              <h3
                className="text-2xl font-bold leading-tight md:text-[1.9rem]"
                style={titleStyle}
              >
                {resolvedSongTitle}
              </h3>

              {artistName && (
                <p className="mt-1 text-sm font-medium" style={textMutedStyle}>
                  {artistName}
                </p>
              )}

              <p
                className="mt-3 max-w-2xl text-sm leading-relaxed md:text-base"
                style={{ color: colors.text }}
              >
                {resolvedDescription}
              </p>
            </div>

            <div className="grid gap-4">
              {renderCompactPlayer(true)}

              <div className="flex flex-wrap gap-3">
                {renderPrimaryAction(`Open on ${providerLabel}`)}
                {renderSoftHelperChip(occasionCopy.helperText)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVisualTemplate = () => {
    return (
      <div
        className="playlist-fade-lift relative overflow-hidden rounded-[2rem] border px-6 py-8 md:px-10 md:py-10"
        style={{
          ...panelStyle,
          backgroundImage: `
            radial-gradient(circle at 18% 18%, ${colors.primary}08, transparent 28%),
            radial-gradient(circle at 82% 80%, ${colors.secondary || colors.primary}08, transparent 32%)
          `,
        }}
      >
        <div className="relative z-10 text-center">
          {renderCompactProviderLabel()}

          <div className="mt-6">
            {renderCoverArt(
              "aspect-square w-full max-w-[220px] mx-auto",
              "rounded-[1.8rem]",
              true,
            )}
          </div>

          <div className="mx-auto mt-7 max-w-2xl">
            <h3
              className="text-3xl font-bold leading-tight md:text-[2.5rem]"
              style={titleStyle}
            >
              {resolvedSongTitle}
            </h3>

            {artistName && (
              <p
                className="mt-2 text-sm font-medium md:text-base"
                style={textMutedStyle}
              >
                {artistName}
              </p>
            )}

            <p
              className="mt-4 text-sm leading-relaxed md:text-base"
              style={{ color: colors.text }}
            >
              {resolvedDescription}
            </p>
          </div>

          <div className="mt-7">{renderVisualWaveform()}</div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {renderPrimaryAction(`Listen on ${providerLabel}`)}
            {renderSoftHelperChip(occasionCopy.helperText)}
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            {renderCompactPlayer(true)}
          </div>
        </div>
      </div>
    );
  };

  const renderLyricsTemplate = () => {
    const resolvedLyric = (lyricsExcerpt || "").trim();
    const resolvedBodyText = (resolvedDescription || "").trim();

    const hasRealLyric = resolvedLyric.length > 0;
    const lyricText = hasRealLyric ? resolvedLyric : resolvedBodyText;
    const shouldShowSupportingText =
      resolvedBodyText.length > 0 &&
      lyricText.length > 0 &&
      resolvedBodyText.toLowerCase() !== lyricText.toLowerCase();

    const darkCardStyle: React.CSSProperties = {
      background:
        "linear-gradient(180deg, rgba(18,18,22,0.98) 0%, rgba(10,10,14,0.98) 100%)",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
      color: "#ffffff",
    };

    const darkMutedTextStyle: React.CSSProperties = {
      color: "rgba(255,255,255,0.68)",
    };

    const darkLyricTextStyle: React.CSSProperties = {
      color: "#ffffff",
      fontFamily: typography.bodyFont,
    };

    const miniCoverStyle: React.CSSProperties = coverImageUrl
      ? {}
      : {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.08)",
        };

    return (
      <div className="playlist-fade-lift mx-auto max-w-[420px]">
        <div
          className="overflow-hidden rounded-[1.75rem] p-5 md:p-6 transition-transform duration-300 hover:-translate-y-1"
          style={darkCardStyle}
        >
          <div className="flex items-start gap-4">
            <div
              className="h-[58px] w-[58px] shrink-0 overflow-hidden rounded-xl"
              style={miniCoverStyle}
            >
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt={resolvedSongTitle}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg">
                  {resolvedIcon}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h3
                className="truncate text-base font-semibold leading-tight md:text-lg"
                style={{ color: "#ffffff" }}
              >
                {resolvedSongTitle}
              </h3>

              {artistName && (
                <p
                  className="mt-1 truncate text-xs font-medium uppercase tracking-[0.12em]"
                  style={darkMutedTextStyle}
                >
                  {artistName}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p
              className="text-[1.7rem] font-medium leading-[1.45] md:text-[2rem]"
              style={darkLyricTextStyle}
            >
              {lyricText}
            </p>

            {shouldShowSupportingText && (
              <p
                className="mt-4 text-sm leading-relaxed"
                style={darkMutedTextStyle}
              >
                {resolvedBodyText}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <a
              href={songLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
              }}
            >
              {providerLabel}
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderTemplateContent = () => {
    switch (playlistTemplate) {
      case "visual":
        return renderVisualTemplate();
      case "lyrics":
        return renderLyricsTemplate();
      case "minimal":
      default:
        return renderMinimalTemplate();
    }
  };

  const shouldHideMinimalUI = playlistTemplate === "minimal" && ambientMode;

  if (shouldHideMinimalUI) {
    return (
      <>
        {addAnimations}
        {renderAmbientEmbed()}
      </>
    );
  }

  return (
    <section id={sectionId} className={spacingClass}>
      {addAnimations}

      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <SectionHeader
            icon={resolvedIcon}
            title={resolvedSectionTitle}
            subtitle={resolvedSectionSubtitle}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div
            className={`overflow-hidden rounded-[2.35rem] border ${shadowClass} transition-transform duration-300 hover:-translate-y-0.5`}
            style={outerCardStyle}
          >
            <div className="p-5 md:p-6 lg:p-7">{renderTemplateContent()}</div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}