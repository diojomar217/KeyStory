"use client";

import React from "react";
import { motion } from "framer-motion";
import type { OccasionType, HomeTemplate } from "@/lib/types";
import type { ThemeKey } from "@/config/themeConfig";
import { useTheme } from "../builder/ThemeWrapper";
import { resolveParticipantNames } from "@/lib/site-type-utils";

interface Props {
  theme: ThemeKey;
  siteType?: OccasionType;
  config?: any;
  template?: HomeTemplate | string;
  customerName: string;
  partnerName: string;
  specialDate: string;
  message: string;
  tagline?: string;
  photos: string[];
  coverPhotoIndex?: number;
  heroCoverPhotoUrl?: string | null;
}

function formatDisplayDate(dateStr?: string, timeStr?: string) {
  if (!dateStr && !timeStr) return "";

  let formattedDate = dateStr || "";
  if (dateStr) {
    const parsed = new Date(dateStr);
    if (!Number.isNaN(parsed.getTime())) {
      formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(parsed);
    }
  }

  let formattedTime = timeStr || "";
  if (timeStr) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr.trim());
    if (match) {
      const hour = Number(match[1]);
      const minute = match[2];
      const period = hour >= 12 ? "PM" : "AM";
      const normalizedHour = hour % 12 || 12;
      formattedTime = `${normalizedHour}:${minute} ${period}`;
    }
  }

  return [formattedDate, formattedTime].filter(Boolean).join(" • ");
}

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#bb7d88]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#bb7d88]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function SparkleAccent() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M60 8c3 22 7 26 29 29-22 3-26 7-29 29-3-22-7-26-29-29 22-3 26-7 29-29Z"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.45"
      />
      <path
        d="M90 58c1.8 13 4.2 15.4 17 17-12.8 1.6-15.2 4-17 17-1.8-13-4.2-15.4-17-17 12.8-1.6 15.2-4 17-17Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M26 66c1.5 11 3.8 13.3 14.8 14.8-11 1.5-13.3 3.8-14.8 14.8-1.5-11-3.8-13.3-14.8-14.8 11-1.5 13.3-3.8 14.8-14.8Z"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.28"
      />
    </svg>
  );
}

export default function BaptismHomeSection({
  theme,
  siteType = "baptism",
  config,
  customerName,
  partnerName,
  specialDate,
  message,
  tagline,
  photos,
  heroCoverPhotoUrl,
}: Props) {
  const styles = useTheme(theme);

  const resolved = resolveParticipantNames(
    siteType,
    config?.participants || [],
    customerName,
    partnerName
  );

  const home = config?.section_content?.home || {};
  const eventDetails =
    config?.section_content?.event_details || config?.eventDetails || {};

  const celebrant = resolved.primaryName || customerName || "Your Child";

  const label = home.label || "You’re Invited";
  const eventTitle = home.eventTitle || "Baptism and Birthday Celebration";

  const subtitle =
    home.subtitle ??
    tagline ??
    "A day filled with love, blessings, and joy";

  const shortMessage =
    home.shortMessage ??
    message ??
    "Join us as we celebrate a meaningful milestone in our child’s life.";

  const heroImg =
    home.heroImage || heroCoverPhotoUrl || photos?.[0] || "/vercel.svg";

  const bgImg = home.backgroundImage || heroImg;

  const overlayOpacity =
    typeof home.overlayOpacity === "number"
      ? Math.max(0, Math.min(100, home.overlayOpacity)) / 100
      : 0.9;

  const ctaPrimaryLabel = home.ctaPrimaryLabel || "RSVP";
  const ctaPrimaryLink = home.ctaPrimaryLink || "#rsvp";
  const ctaSecondaryLabel = home.ctaSecondaryLabel || "View Details";
  const ctaSecondaryLink = home.ctaSecondaryLink || "#details";

  const eventDate = eventDetails?.eventDate || eventDetails?.date || specialDate || "";
  const eventTime = eventDetails?.eventTime || eventDetails?.time || config?.eventTime || "";
  const venue =
    eventDetails?.churchName ||
    eventDetails?.location ||
    config?.venue ||
    config?.churchName ||
    "";

  const parentsFromParticipants = Array.isArray(config?.participants)
    ? [config.participants[1]?.name, config.participants[2]?.name]
        .filter(Boolean)
        .join(" & ")
    : "";

  const parentNames =
    config?.parentsNames ||
    config?.hostNames ||
    parentsFromParticipants ||
    [customerName, partnerName].filter(Boolean).join(" & ");

  const formattedDateTime = formatDisplayDate(eventDate, eventTime);

  const showShortMessage =
    !!shortMessage &&
    shortMessage.trim().toLowerCase() !== subtitle.trim().toLowerCase();

  return (
    <section
      className={`relative isolate overflow-hidden ${styles.bg} ${styles.text}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.02]"
        style={{ backgroundImage: `url(${bgImg})` }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,247,248,0.97), rgba(255,241,243,0.935), rgba(255,246,243,0.955))",
          opacity: overlayOpacity,
        }}
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[5px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(106,47,57,0.24) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="pointer-events-none absolute -left-12 top-14 h-56 w-56 rounded-full bg-rose-200/28 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-0 h-40 w-40 rounded-full bg-pink-100/22 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-16 h-72 w-72 rounded-full bg-[#f2dbe1]/28 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-orange-100/18 blur-3xl" />

      <div className="pointer-events-none absolute right-[12%] top-[14%] hidden h-24 w-24 text-[#d8b0b8] lg:block">
        <SparkleAccent />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
        <div className="grid min-h-[auto] items-center gap-6 sm:gap-8 lg:min-h-[88vh] lg:grid-cols-[0.84fr_1.16fr] lg:gap-12">
          {/* Right content on mobile first */}
          <div className="order-1 flex h-full flex-col justify-center text-center lg:order-2 lg:text-left">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
              className="inline-flex w-fit self-center rounded-full border border-[#ead0d5] bg-white/84 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b16d78] shadow-sm backdrop-blur lg:self-start"
            >
              {label}
            </motion.div>

            {eventTitle ? (
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
                className="mx-auto mt-5 max-w-[18rem] text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b07a83] sm:max-w-none sm:text-xs md:text-sm lg:mx-0"
              >
                {eventTitle}
              </motion.p>
            ) : null}

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
              className="mx-auto mt-3 max-w-[10ch] font-serif text-[3rem] leading-[0.95] text-[#6a2f39] sm:text-[3.5rem] md:text-6xl xl:text-[5rem] lg:mx-0"
            >
              {celebrant}
            </motion.h1>

            {subtitle ? (
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
                className="mx-auto mt-4 max-w-[22rem] text-base leading-7 text-[#76565d] sm:max-w-[30rem] md:text-lg md:leading-8 lg:mx-0 lg:max-w-[36rem] lg:text-[1.08rem]"
              >
                {subtitle}
              </motion.p>
            ) : null}

            {showShortMessage ? (
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="mx-auto mt-3 max-w-[22rem] text-sm leading-6 text-[#8b6c72] sm:max-w-[32rem] md:text-base lg:mx-0 lg:max-w-[38rem]"
              >
                {shortMessage}
              </motion.p>
            ) : null}

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.36, ease: "easeOut" }}
              className="mt-5 flex flex-col items-center gap-3 sm:mt-6 sm:flex-wrap sm:flex-row sm:justify-center lg:justify-start lg:items-start"
            >
              {formattedDateTime ? (
                <div className="inline-flex w-full max-w-[320px] items-center justify-center rounded-full border border-white/75 bg-white/86 px-4 py-3 text-sm font-medium text-[#7d5c64] shadow-[0_8px_18px_rgba(122,86,96,0.08)] backdrop-blur sm:w-auto sm:max-w-none sm:justify-start sm:px-4 sm:py-2.5">
                  <span className="mr-2 flex items-center justify-center">
                    <CalendarIcon />
                  </span>
                  <span className="truncate">{formattedDateTime}</span>
                </div>
              ) : null}

              {venue ? (
                <div className="inline-flex w-full max-w-[320px] items-center justify-center rounded-full border border-white/75 bg-white/86 px-4 py-3 text-sm font-medium text-[#7d5c64] shadow-[0_8px_18px_rgba(122,86,96,0.08)] backdrop-blur sm:w-auto sm:max-w-none sm:justify-start sm:px-4 sm:py-2.5">
                  <span className="mr-2 flex items-center justify-center">
                    <PinIcon />
                  </span>
                  <span className="truncate">{venue}</span>
                </div>
              ) : null}
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.44, ease: "easeOut" }}
              className="mt-5 flex flex-col items-center gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
            >
              <a
                href={ctaPrimaryLink}
                className="inline-flex w-full max-w-[160px] items-center justify-center rounded-full bg-[#c16476] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(193,100,118,0.30)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b4586a] sm:w-auto sm:min-w-[156px]"
              >
                {ctaPrimaryLabel}
              </a>

              {ctaSecondaryLabel ? (
                <a
                  href={ctaSecondaryLink}
                  className="inline-flex w-full max-w-[160px] items-center justify-center rounded-full border border-[#e4c2c8] bg-white/92 px-6 py-3 text-sm font-semibold text-[#8b4d58] shadow-[0_8px_18px_rgba(122,86,96,0.06)] backdrop-blur transition duration-300 hover:bg-white sm:w-auto sm:min-w-[156px]"
                >
                  {ctaSecondaryLabel}
                </a>
              ) : null}
            </motion.div>

            {parentNames ? (
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.52, ease: "easeOut" }}
                className="mx-auto mt-5 w-full max-w-[340px] rounded-[1.2rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,252,252,0.82),rgba(248,243,243,0.76))] px-5 py-3 shadow-[0_10px_26px_rgba(110,77,86,0.06)] backdrop-blur sm:mt-6 sm:max-w-[26rem] md:px-5 md:py-3.5 lg:mx-0 lg:max-w-[42rem]"
              >
                <p
                  className="text-[10px] tracking-[0.28em] text-[#b27b83] md:text-[11px]"
                  style={{
                    fontFamily:
                      '"Snell Roundhand", "Segoe Script", "Apple Chancery", cursive',
                  }}
                >
                  Hosted with love by
                </p>
                <p className="mt-1 font-serif text-[1.05rem] text-[#6a2f39] sm:text-[1.2rem] md:text-[1.5rem]">
                  {parentNames}
                </p>
              </motion.div>
            ) : null}
          </div>

          {/* Left visual */}
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.986 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto max-w-[320px] sm:max-w-sm lg:max-w-[448px]">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-rose-200/30 via-pink-100/14 to-orange-100/18 blur-2xl" />
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
              <div className="absolute -right-4 bottom-8 h-16 w-16 rounded-full bg-rose-100/30 blur-xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-white/58 p-3 shadow-[0_26px_70px_rgba(124,79,87,0.15)] backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-[1.55rem]">
                  <img
                    src={heroImg}
                    alt={celebrant}
                    className="h-[250px] w-full object-cover transition duration-700 hover:scale-[1.02] sm:h-[300px] md:h-[360px] lg:h-[430px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6a2f39]/12 via-transparent to-white/6" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
                </div>

                {/* <div className="absolute inset-x-4 bottom-4 rounded-[1.1rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,252,252,0.88),rgba(249,244,244,0.86))] p-3 shadow-[0_10px_28px_rgba(91,56,65,0.09)] backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-4">
                  <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#b27b83] sm:text-[10px] sm:tracking-[0.34em]">
                    Blessed Celebration
                  </p>

                  <h2 className="mt-2 font-serif text-lg leading-tight text-[#6a2f39] sm:text-xl md:text-2xl">
                    {celebrant}
                  </h2>
                </div> */}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}