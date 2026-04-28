"use client";

import { motion } from "framer-motion";
import type { ThemeKey } from "@/config/themeConfig";
import type { SectionAsset } from "@/lib/types";
import { useThemeUtils } from "../../builder/ThemeWrapper";
import ScrollReveal from "../../ui/ScrollReveal";

interface InvitationSectionProps {
  theme: ThemeKey;
  guestName?: string;
  invitationMessage?: string;
  godparentMessage?: string;
  invitation?: {
    greeting?: string;
    intro?: string;
    body?: string;
    supportMessage?: string;
    closingText?: string;
    signoff?: string;
    signedBy?: string;
    godparentMessage?: string;
  };
  assets?: SectionAsset;
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function InvitationSection({
  theme,
  guestName,
  invitationMessage,
  godparentMessage,
  invitation,
  assets,
}: InvitationSectionProps) {
  const { colors } = useThemeUtils(theme);

  const safeGuestName = guestName?.trim();

  const greeting = safeGuestName
    ? `Dear ${safeGuestName
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())},`
    : invitation?.greeting || "Dear Family,";

  const intro =
    invitation?.intro ||
    "As we prepare for Anya’s baptism and birthday, we’ve been thinking about the people we trust and look up to—those who can help guide and support her as she grows.";

  const body =
    invitation?.body ||
    invitationMessage ||
    "With that, we would be deeply honored to have you as one of her godparents.";

  const support =
    invitation?.supportMessage ||
    invitation?.godparentMessage ||
    godparentMessage ||
    "";

  const closing =
    invitation?.closingText ||
    "We sincerely hope you can be part of this blessed and meaningful occasion.";

  const signoff = invitation?.signoff || "With love and blessings,";
  const signedBy = invitation?.signedBy || "Jen & Adrian";

  const textColor = colors?.text || "#6a2f39";
  const accentColor = "#c98a96";
  const goldAccent = "#d8b16c";

  return (
    <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-24 lg:py-28">
      {/* Decorative background image (behind content) */}
      {assets?.backgroundImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none -z-10"
          style={{ backgroundImage: `url(${assets.backgroundImage})` }}
        />
      )}

      <div className="relative mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <p
              className="text-[11px] uppercase tracking-[0.32em]"
              style={{
                color: accentColor,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              A HEARTFELT MESSAGE
            </p>

            <h2
              className="mt-4 text-3xl font-semibold md:text-5xl"
              style={{
                color: textColor,
                fontFamily: '"Cormorant Garamond", serif',
              }}
            >
              You&apos;re Invited
            </h2>

            <p
              className="mt-3 text-sm md:text-base"
              style={{
                color: accentColor,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              A special note from the family
            </p>

            <div className="mt-4 flex justify-center">
              <div
                className="h-px w-24"
                style={{
                  background: `linear-gradient(90deg, transparent, ${goldAccent}, transparent)`,
                }}
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="relative mt-10">
            {/* Glow */}
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-pink-200/20 blur-3xl" />

            {/* Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-[2rem] border px-5 py-9 sm:px-7 sm:py-10 md:px-12 md:py-14"
              style={{
                borderColor: "#f0d9de",
                background:
                  "linear-gradient(180deg, rgba(255,250,251,0.98) 0%, rgba(253,239,243,0.94) 100%)",
                boxShadow:
                  "0 40px 90px rgba(106,47,57,0.18), 0 12px 30px rgba(106,47,57,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {/* Paper texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />

              {/* Inner border */}
              <div
                className="pointer-events-none absolute inset-4 rounded-[1.6rem] border"
                style={{ borderColor: `${accentColor}18` }}
              />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.12 }}
                className="relative mx-auto max-w-[540px]"
              >
                {/* Greeting */}
                <motion.div variants={fadeUp} className="mb-8">
                  <span
                    className="block text-[20px] md:text-[24px]"
                    style={{
                      color: "#8f4a58" ,
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {greeting}
                  </span>

                  <span
                    className="mt-1 block text-[11px] tracking-[0.25em]"
                    style={{
                      color: `${textColor}80`,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                  </span>
                </motion.div>

                {/* Intro */}
                <motion.p
                  variants={fadeUp}
                  className="text-[20px] leading-[2.1]"
                  style={{
                    color: textColor,
                    fontFamily: '"Cormorant Garamond", serif',
                  }}
                >
                  {intro}
                </motion.p>

                {/* Body */}
                <motion.p
                  variants={fadeUp}
                  className="mt-7 text-[20px] leading-[2.1]"
                  style={{
                    color: textColor,
                    fontFamily: '"Cormorant Garamond", serif',
                  }}
                >
                  {body}
                </motion.p>

                {/* Divider */}
                <motion.div variants={fadeUp} className="my-2 flex justify-center">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-80" />
                </motion.div>

                {/* Highlight */}
                <motion.p
                  variants={fadeUp}
                  className="my-12 text-center text-[20px] italic leading-[1.9] md:text-[24px]"
                  style={{
                    color: "#7a2f3c",
                    fontFamily: '"Cormorant Garamond", serif',
                    fontWeight: 600,
                  }}
                >
                  {support}
                </motion.p>

                {/* Closing */}
                {/* <motion.p
                  variants={fadeUp}
                  className="text-[15.5px] leading-[2.1]"
                  style={{
                    color: textColor,
                    fontFamily: '"Cormorant Garamond", serif',
                  }}
                >
                  {closing}
                </motion.p> */}

                {/* Signature */}
                <motion.div variants={fadeUp} className="mt-20 text-center">
                  <div className="mb-5 flex justify-center">
                    <div
                      className="h-px w-20"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${goldAccent}, transparent)`,
                      }}
                    />
                  </div>

                  <p
                    className="text-[20px] md:text-[26px]"
                    style={{
                      color: "#b88992",
                      fontFamily: '"Allura", cursive',
                    }}
                  >
                    {signoff}
                  </p>

                  <p
                    className="mt-2 text-[16px] md:text-[20px]"
                    style={{
                      color: textColor,
                      letterSpacing: "0.03em",
                      fontFamily: '"Cormorant Garamond", serif',
                    }}
                  >
                    {signedBy}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </ScrollReveal>

          {/* Decorative left/right images (non-interactive, hidden on small screens) */}
          {assets?.leftImage && (
            <img
              src={assets.leftImage}
              alt=""
              aria-hidden="true"
              className="hidden md:block absolute left-6 bottom-6 w-20 md:w-28 lg:w-32 opacity-90 pointer-events-none select-none"
            />
          )}

          {assets?.rightImage && (
            <img
              src={assets.rightImage}
              alt=""
              aria-hidden="true"
              className="hidden md:block absolute right-6 bottom-6 w-20 md:w-28 lg:w-32 opacity-90 pointer-events-none select-none"
            />
          )}
      </div>
    </section>
  );
}