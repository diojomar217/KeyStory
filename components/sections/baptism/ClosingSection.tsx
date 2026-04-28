"use client";

import type { ThemeKey } from "@/config/themeConfig";
import type { SectionAsset } from "@/lib/types";
import { useThemeUtils } from "../../builder/ThemeWrapper";
import ScrollReveal from "../../ui/ScrollReveal";
import { motion } from "framer-motion";

interface ClosingSectionProps {
  theme: ThemeKey;
  title?: string;
  closingMessage?: string;
  parentNames?: string;
  finalLine?: string;
  celebrant?: string;
  sectionId?: string;
  assets?: SectionAsset;
}

const DEFAULT_CLOSING =
  "Thank you for taking the time to be part of this special moment in our lives. Your presence, love, and blessings mean so much to our family as we celebrate this beautiful milestone.";

const DEFAULT_FINAL = "We can’t wait to share this joyful day with you 💖";

function splitClosingMessage(message: string) {
  const sentences = message
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) return { main: message, highlight: "" };

  return {
    main: sentences.slice(0, -1).join(" "),
    highlight: sentences[sentences.length - 1],
  };
}

export default function ClosingSection({
  theme,
  title = "A Final Note",
  closingMessage,
  parentNames,
  finalLine,
  celebrant,
  sectionId,
}: ClosingSectionProps) {
  const { colors } = useThemeUtils(theme);

  const body = closingMessage || DEFAULT_CLOSING;
  const endLine =
    finalLine ||
    (celebrant ? `See you on ${celebrant}'s special day ✨` : DEFAULT_FINAL);

  const { main, highlight } = splitClosingMessage(body);
  const textColor = colors.text || "#6a2f39";

  return (
    <section
      id={sectionId ?? "closing"}
      className="relative overflow-hidden px-4 py-20 md:px-6 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-rose-50/35 to-white" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-44 w-44 -translate-x-1/2 rounded-full bg-pink-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c98a96]">
              With Grateful Hearts
            </p>

            <h2
              className="mt-3 text-3xl font-semibold leading-tight md:text-5xl"
              style={{
                color: textColor,
                fontFamily: '"Cormorant Garamond", "Georgia", serif',
              }}
            >
              {title}
            </h2>

            <div className="mt-5 flex justify-center">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#d8b16c] to-transparent opacity-90" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto mt-10 max-w-3xl"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-pink-200/20 blur-3xl" />

            <div
              className="relative overflow-hidden rounded-[2rem] border px-6 py-10 sm:px-10 md:px-14 md:py-12"
              style={{
                borderColor: "#f0d9de",
                background:
                  "linear-gradient(180deg, rgba(255,250,251,0.98), rgba(253,239,243,0.94))",
                boxShadow: `
                  0 34px 80px rgba(106,47,57,0.13),
                  0 10px 26px rgba(106,47,57,0.05),
                  inset 0 1px 0 rgba(255,255,255,0.68),
                  inset 0 -8px 22px rgba(106,47,57,0.03)
                `,
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.16) 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="pointer-events-none absolute inset-4 rounded-[1.6rem] border border-rose-200/40" />

              <div className="relative mx-auto max-w-[540px]">
                <p
                  className="text-left font-serif text-[1.05rem] leading-[2.05] md:text-[1.18rem]"
                  style={{
                    color: textColor,
                    fontFamily: '"Cormorant Garamond", "Georgia", serif',
                    fontWeight: 500,
                  }}
                >
                  {main}
                </p>

                {highlight ? (
                  <>
                    <div className="my-9 flex justify-center">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-80" />
                    </div>

                    <p
                      className="text-center font-serif text-[1.25rem] italic leading-[1.8] md:text-[1.45rem]"
                      style={{
                        color: "#8f3f50",
                        fontFamily: '"Cormorant Garamond", "Georgia", serif',
                        fontWeight: 600,
                      }}
                    >
                      {highlight}
                    </p>
                  </>
                ) : null}

                <div className="my-9 flex justify-center">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d8b16c] to-transparent opacity-90" />
                </div>

                <div className="text-center">
                  <p
                    className="text-[1.35rem] leading-none md:text-[1.65rem]"
                    style={{
                      color: "#b88992",
                      fontFamily:
                        '"Allura", "Great Vibes", "Snell Roundhand", cursive',
                    }}
                  >
                    With love and gratitude,
                  </p>

                  {parentNames ? (
                    <p
                      className="mt-3 font-serif text-[1rem] font-semibold tracking-wide md:text-[1.15rem]"
                      style={{
                        color: textColor,
                        fontFamily: '"Cormorant Garamond", "Georgia", serif',
                      }}
                    >
                      {parentNames}
                    </p>
                  ) : null}

                  {endLine ? (
                    <p className="mt-4 text-sm leading-6 text-[#8b6c72]">
                      {endLine}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}