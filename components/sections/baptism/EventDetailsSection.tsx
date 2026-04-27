"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { ThemeKey } from "@/config/themeConfig";
import { useThemeUtils } from "../../builder/ThemeWrapper";
import SectionHeader from "../../page/SectionHeader";
import ScrollReveal from "../../ui/ScrollReveal";
import type { MemoryMapLocation, SectionAsset } from "@/lib/types";

const MemoryMap = dynamic(() => import("../shared/MemoryMap"), { ssr: false });

interface EventDetailsProps {
  theme: ThemeKey;
  locations?: MemoryMapLocation[];
  assets?: SectionAsset;
  eventDetails?: any;
}

function formatDisplayDate(date?: string) {
  if (!date) return "To Be Announced";

  try {
    const parsed = new Date(date);
    return new Intl.DateTimeFormat("en-PH", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(parsed);
  } catch {
    return date;
  }
}

function formatDisplayTime(time?: string) {
  if (!time) return "Time To Be Announced";

  try {
    const [hours, minutes] = (time || "").split(":").map(Number);
    const dt = new Date();
    if (!Number.isFinite(hours)) return time || "Time To Be Announced";
    dt.setHours(hours || 0, minutes || 0, 0, 0);

    return new Intl.DateTimeFormat("en-PH", {
      hour: "numeric",
      minute: "2-digit",
    }).format(dt);
  } catch {
    return time;
  }
}

function getEventLabel(location: MemoryMapLocation, index: number) {
  const haystack = `${location.name ?? ""} ${location.description ?? ""}`.toLowerCase();

  if (
    haystack.includes("church") ||
    haystack.includes("parish") ||
    haystack.includes("ceremony") ||
    haystack.includes("baptism")
  ) {
    return "Ceremony";
  }

  if (
    haystack.includes("reception") ||
    haystack.includes("mcdonald") ||
    haystack.includes("venue") ||
    haystack.includes("restaurant")
  ) {
    return "Reception";
  }

  return index === 0 ? "Ceremony" : index === 1 ? "Reception" : "Event";
}

function getEventIcon(label: string) {
  if (label === "Ceremony") return "⛪";
  if (label === "Reception") return "🎉";
  return "📍";
}

function getMapsLink(location: MemoryMapLocation) {
  if (location.googleMapsUrl && location.googleMapsUrl.trim()) {
    return location.googleMapsUrl.trim();
  }

  if (
    typeof location.lat === "number" &&
    typeof location.lng === "number" &&
    location.lat !== 0 &&
    location.lng !== 0
  ) {
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  }

  const query = encodeURIComponent(location.address || location.name || "");
  return query ? `https://www.google.com/maps/search/?api=1&query=${query}` : "";
}

function colorNameToValue(color: string) {
  const normalized = color.trim().toLowerCase();

  const map: Record<string, string> = {
    white: "#ffffff",
    cream: "#fff7e6",
    beige: "#ead8c0",
    "soft beige": "#ead8c0",
    blush: "#f8c9d4",
    "blush pink": "#f8c9d4",
    "baby pink": "#ffd6e8",
    pink: "#f7b7c8",
    "soft peach": "#ffd8c2",
    peach: "#ffd8c2",
    ivory: "#fffaf0",
    lavender: "#e9d5ff",
    sage: "#c9d8c5",
    mint: "#d8f3dc",
  };

  return map[normalized] || color;
}

function AttireGuideCard({
  eventDetails,
  colors,
}: {
  eventDetails: any;
  colors: any;
}) {
  const themeColors =
    Array.isArray(eventDetails.themeColors) && eventDetails.themeColors.length > 0
      ? eventDetails.themeColors
      : ["White", "Cream", "Blush Pink", "Baby Pink"];

  return (
    <ScrollReveal animation="fade-up" delay={90}>
      <div className="mx-auto mt-14 max-w-6xl">
        <div
          className="relative overflow-hidden rounded-[32px] border px-6 py-8 text-center shadow-[0_34px_90px_rgba(106,47,57,0.12)] sm:px-10 sm:py-10"
          style={{
            background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f5)`,
            borderColor: `${colors.border}b8`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-8 h-32 w-32 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.secondary}22` }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-6 h-36 w-36 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.secondary}18` }}
          />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-white/70 shadow-sm">
              <span className="text-2xl">🎀</span>
            </div>

            <p
              className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: colors.primary }}
            >
              Attire Guide
            </p>

            <h3
              className="mt-2 font-serif text-2xl font-semibold sm:text-3xl"
              style={{ color: colors.text }}
            >
              Soft, Light & Elegant
            </h3>

            <div className="mt-4 flex justify-center">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d8b16c] to-transparent opacity-90" />
            </div>

            <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-[24px] border bg-white/55 px-4 py-5 shadow-sm"
                style={{ borderColor: `${colors.border}99` }}
              >
                <div className="text-3xl">👗</div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
                  Guests
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: `${colors.text}d6` }}>
                  {eventDetails.dressCode ||
                    "Guests are encouraged to wear light, comfortable attire in soft pastel or neutral tones."}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-[24px] border bg-white/55 px-4 py-5 shadow-sm"
                style={{ borderColor: `${colors.border}99` }}
              >
                <div className="text-3xl">🤵</div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
                  Gentlemen
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: `${colors.text}d6` }}>
                  Polo, long sleeves, or smart casual pieces in neutral colors are recommended.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-[24px] border bg-white/55 px-4 py-5 shadow-sm"
                style={{ borderColor: `${colors.border}99` }}
              >
                <div className="text-3xl">🕊️</div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
                  Godparents
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: `${colors.text}d6` }}>
                  {eventDetails.godparentAttire ||
                    "Godparents are encouraged to wear white or cream for a coordinated and elegant look."}
                </p>
              </motion.div>
            </div>

            <div className="mx-auto mt-8 max-w-4xl rounded-[26px] border bg-white/45 px-5 py-5" style={{ borderColor: `${colors.border}99` }}>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.26em]"
                style={{ color: colors.primary }}
              >
                Suggested Palette
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {themeColors.map((c: string, i: number) => {
                  const colorValue = colorNameToValue(c);

                  return (
                    <motion.div
                      key={`${c}-${i}`}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ y: -3, scale: 1.04 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                      className="flex items-center gap-2 rounded-full border bg-white/80 px-3 py-2 text-xs shadow-[0_8px_20px_rgba(106,47,57,0.06)]"
                      style={{ borderColor: `${colors.border}aa` }}
                    >
                      <span
                        className="h-4 w-4 rounded-full border shadow-inner"
                        style={{
                          backgroundColor: colorValue,
                          borderColor: "rgba(106,47,57,0.18)",
                        }}
                      />
                      <span style={{ color: `${colors.text}cc` }}>{c}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
              {themeColors.slice(0, 4).map((c: string, i: number) => (
                <motion.div
                  key={`mood-${c}-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="h-16 rounded-2xl border shadow-sm sm:h-20"
                  style={{
                    background: `linear-gradient(135deg, ${colorNameToValue(c)}, rgba(255,255,255,0.75))`,
                    borderColor: `${colors.border}aa`,
                  }}
                  aria-label={c}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function EventDetailsSection({
  theme,
  locations = [],
  eventDetails = {},
  assets,
}: EventDetailsProps) {
  const themeUtils = useThemeUtils(theme);
  const { colors } = themeUtils;

  const validLocations = (locations || []).filter(Boolean);
  const hasLocations = validLocations.length > 0;
  const hasMapLocations = validLocations.some(
    (loc) =>
      typeof loc.lat === "number" &&
      typeof loc.lng === "number" &&
      loc.lat !== 0 &&
      loc.lng !== 0,
  );

  const primaryDate = validLocations[0]?.date;
  const displayDate = formatDisplayDate(primaryDate);

  const showAttire = Boolean(
    eventDetails &&
      (eventDetails.dressCode ||
        eventDetails.godparentAttire ||
        (Array.isArray(eventDetails.themeColors) &&
          eventDetails.themeColors.length > 0)),
  );

  return (
    <section id="event-details" className="relative overflow-hidden py-16 md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-75"
        style={{
          background: `
          radial-gradient(circle at 12% 18%, ${colors.secondary}16 0%, transparent 16%),
          radial-gradient(circle at 84% 12%, ${colors.secondary}14 0%, transparent 18%),
          radial-gradient(circle at 86% 82%, ${colors.secondary}12 0%, transparent 16%),
          radial-gradient(circle at 14% 78%, ${colors.secondary}10 0%, transparent 16%)`,
        }}
      />

      <div
        aria-hidden
        className="absolute left-1/2 top-20 -z-10 h-64 w-[42rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}14 0%, transparent 72%)`,
        }}
      />

      {assets?.enabled && assets.backgroundImage && (
        <div className="absolute inset-0 -z-30 opacity-40">
          <img src={assets.backgroundImage} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {assets?.enabled && assets.leftImage && (
        <img
          src={assets.leftImage}
          alt=""
          aria-hidden
          className="absolute left-6 top-1/2 -z-10 hidden w-48 -translate-y-1/2 opacity-90 md:block"
        />
      )}

      {assets?.enabled && assets.rightImage && (
        <img
          src={assets.rightImage}
          alt=""
          aria-hidden
          className="absolute right-6 top-1/2 -z-10 hidden w-48 -translate-y-1/2 opacity-90 md:block"
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="⛪"
            title="Event Details"
            subtitle="Ceremony and reception information"
            theme={theme}
          />
        </ScrollReveal>

        {!hasLocations ? (
          <ScrollReveal animation="fade-up" delay={80}>
            <div
              className="mx-auto mt-10 max-w-3xl rounded-[28px] border px-6 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              style={{
                background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f2)`,
                borderColor: `${colors.border}b8`,
              }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.24em]"
                style={{ color: colors.primary }}
              >
                Event Schedule
              </p>
              <h3
                className="mt-3 text-xl font-semibold sm:text-2xl"
                style={{ color: colors.text }}
              >
                Details will be shared soon
              </h3>
              <p
                className="mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:text-base"
                style={{ color: `${colors.text}cc` }}
              >
                We’re preparing the final event details and will update this
                section once everything is confirmed.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <>
            <ScrollReveal animation="fade-up" delay={60}>
              <div className="mx-auto mb-10 mt-8 max-w-3xl text-center">
                <div
                  className="inline-flex flex-col items-center rounded-[24px] border px-6 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
                  style={{
                    background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f6)`,
                    borderColor: `${colors.border}b8`,
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                    style={{ color: colors.primary }}
                  >
                    Save the Date
                  </p>
                  <p
                    className="mt-2 text-lg font-semibold sm:text-2xl"
                    style={{ color: colors.text }}
                  >
                    {displayDate}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="mx-auto max-w-6xl space-y-10">
              {validLocations.map((loc, index) => {
                const label = getEventLabel(loc, index);
                const icon = getEventIcon(label);
                const mapsLink = getMapsLink(loc);
                const isReverse = index % 2 === 1;

                return (
                  <ScrollReveal
                    key={loc.id || `loc-${index}`}
                    animation="fade-up"
                    delay={index * 70}
                  >
                    <div
                      className={`grid items-center gap-5 lg:grid-cols-2 lg:gap-10 ${
                        isReverse ? "lg:[&>div:first-child]:order-2" : ""
                      }`}
                    >
                      <div className={`${isReverse ? "lg:pl-8" : "lg:pr-8"}`}>
                        <div
                          className="relative overflow-hidden rounded-[28px] border shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
                          style={{
                            background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f2)`,
                            borderColor: `${colors.border}b8`,
                          }}
                        >
                          <div
                            aria-hidden
                            className="absolute inset-0 opacity-80"
                            style={{
                              background: `radial-gradient(circle at top left, ${colors.secondary}12 0%, transparent 30%)`,
                            }}
                          />

                          <div className="relative aspect-[16/10] w-full overflow-hidden">
                            {loc.imageUrl ? (
                              <Image
                                src={loc.imageUrl}
                                alt={loc.name || "Event location"}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                              />
                            ) : (
                              <div
                                className="flex h-full w-full items-center justify-center"
                                style={{
                                  background: `linear-gradient(180deg, ${colors.secondary}12, ${colors.card})`,
                                }}
                              >
                                <div className="text-center">
                                  <div className="text-3xl">{icon}</div>
                                  <p
                                    className="mt-2 text-sm font-medium"
                                    style={{ color: `${colors.text}aa` }}
                                  >
                                    Event image coming soon
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={`${isReverse ? "lg:pr-8" : "lg:pl-8"}`}>
                        <div
                          className="relative rounded-[28px] border px-5 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-7 sm:py-8"
                          style={{
                            background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f5)`,
                            borderColor: `${colors.border}b8`,
                          }}
                        >
                          <div
                            aria-hidden
                            className="absolute inset-x-8 top-0 h-px"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
                              opacity: 0.85,
                            }}
                          />

                          <div className="flex flex-wrap items-center gap-3">
                            <div
                              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]"
                              style={{
                                backgroundColor: `${colors.secondary}18`,
                                color: colors.primary,
                              }}
                            >
                              <span aria-hidden="true">{icon}</span>
                              {label}
                            </div>

                            <div
                              className="inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.20em]"
                              style={{
                                backgroundColor: `${colors.secondary}10`,
                                color: `${colors.text}cc`,
                              }}
                            >
                             
                            </div>
                          </div>

                          <h3
                            className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl"
                            style={{ color: colors.text }}
                          >
                            {loc.name || "Event Location"}
                          </h3>

                          <p
                            className="mt-3 text-sm leading-relaxed sm:text-base"
                            style={{ color: `${colors.text}d6` }}
                          >
                            {loc.address || loc.description || "To be announced"}
                          </p>

                          {(loc.date || loc.time) && (
                            <div
                              className="mt-5 rounded-2xl border px-4 py-3"
                              style={{
                                backgroundColor: `${colors.secondary}0d`,
                                borderColor: `${colors.border}88`,
                              }}
                            >
                              <p
                                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                                style={{ color: colors.primary }}
                              >
                                Schedule
                              </p>
                              <p
                                className="mt-1 text-sm font-medium sm:text-base"
                                style={{ color: colors.text }}
                              >
                                {formatDisplayDate(loc.date)}
                                {loc.time ? ` • ${formatDisplayTime(loc.time)}` : ""}
                              </p>
                            </div>
                          )}

                          {mapsLink && (
                            <div className="mt-6">
                              <a
                                href={mapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-transform duration-200 hover:scale-[1.01]"
                                style={{
                                  backgroundColor: colors.primary,
                                  color: "#ffffff",
                                }}
                              >
                                Open in Maps
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>


            {hasMapLocations && (
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="mx-auto mt-12 max-w-6xl">
                  <div
                    className="overflow-hidden rounded-[30px] border shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
                    style={{
                      background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f4)`,
                      borderColor: `${colors.border}b8`,
                    }}
                  >
                    <div className="px-5 py-5 sm:px-7 sm:py-6">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p
                            className="text-[10px] font-semibold uppercase tracking-[0.26em]"
                            style={{ color: colors.primary }}
                          >
                            Location Guide
                          </p>
                          <h3
                            className="mt-2 text-xl font-semibold sm:text-2xl"
                            style={{ color: colors.text }}
                          >
                            Find the celebration venues easily
                          </h3>
                        </div>

                        <p
                          className="max-w-md text-sm leading-relaxed"
                          style={{ color: `${colors.text}c8` }}
                        >
                          Explore the map below for the ceremony and reception venues.
                        </p>
                      </div>
                    </div>

                    <div
                      className="border-t"
                      style={{ borderTopColor: `${colors.border}88` }}
                    >
                      <MemoryMap
                        locations={validLocations.map((loc, index) => ({
                          id: loc.id || `loc-${index}`,
                          name: loc.name || "",
                          lat: loc.lat || 0,
                          lng: loc.lng || 0,
                          description: loc.description || getEventLabel(loc, index),
                          date: loc.date,
                          address: loc.address,
                        }))}
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            
            {showAttire && (
              <AttireGuideCard eventDetails={eventDetails} colors={colors} />
            )}
          </>
        )}
      </div>
    </section>
  );
}