"use client";

import { motion } from "framer-motion";
import type { ThemeKey } from "@/config/themeConfig";
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
}: InvitationSectionProps) {
  const { colors } = useThemeUtils(theme);

  const data = invitation || {
    invitationMessage,
    godparentMessage,
  };

  const safeGuestName = guestName?.trim();
  const greeting = safeGuestName
    ? `Hi ${safeGuestName
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())},`
    : data.greeting || "Dear Family,";

  const intro =
    data.intro ||
    "As we prepare for Anya’s baptism and birthday, we’ve been thinking about the people we trust and look up to—those who can help guide and support her as she grows.";

  const body =
    data.body ||
    data.invitationMessage ||
    "With that, we would be deeply honored to have you as one of her godparents.";

  const support =
    data.supportMessage ||
    data.godparentMessage ||
    godparentMessage ||
    "Your faith, guidance, and love would mean so much as she grows and learns in her journey.";

  const closing =
    data.closingText ||
    "We sincerely hope you can be part of this blessed and meaningful occasion.";

  const signoff = data.signoff || "With love and blessings,";
  const signedBy = data.signedBy || "Adrian & Jenica";

  const textColor = colors?.text || "#6a2f39";
  const accentColor = "#c98a96";
  const goldAccent = "#d8b16c";

  return (
    <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-4rem] top-10 h-44 w-44 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}10` }}
        />
        <div
          className="absolute right-[-3rem] top-24 h-52 w-52 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}08` }}
        />
        <div
          className="absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${goldAccent}10` }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <h2
              className="mt-5 text-3xl font-semibold md:text-5xl"
              style={{
                color: textColor,
                fontFamily: '"Georgia", serif',
              }}
            >
              You&apos;re Invited
            </h2>

            <p
              className="mt-3 text-sm md:text-base"
              style={{
                color: accentColor,
                letterSpacing: "0.04em",
              }}
            >
              A heartfelt message from the family
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
            <div
              className="absolute inset-0 translate-y-2 scale-[0.99] rounded-[2rem]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(233,220,215,0.78), rgba(226,210,205,0.56))",
              }}
            />

            <motion.div
              whileHover={{ rotate: 0.15, y: -2 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative rounded-[2rem] border px-7 py-10 md:px-12 md:py-14"
              style={{
                borderColor: "#e8dede",
                background:
                  "linear-gradient(180deg, #fffaf8 0%, #f3e8e5 100%)",
                boxShadow:
                  "0 30px 80px rgba(106,47,57,0.18), 0 10px 25px rgba(106,47,57,0.08)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              />

              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-[0.18]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.55), transparent 35%, transparent 65%, rgba(255,255,255,0.18))",
                }}
              />

              <div
                className="pointer-events-none absolute inset-4 rounded-[1.6rem] border"
                style={{ borderColor: `${accentColor}18` }}
              />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.12 }}
                className="relative mx-auto max-w-[460px] text-left"
              >
                <motion.div
                  variants={fadeUp}
                  className="mb-6 flex justify-start"
                >
                  <div
                    className="h-px w-16"
                    style={{
                      background: `linear-gradient(90deg, ${goldAccent}, transparent)`,
                    }}
                  />
                </motion.div>

                <motion.p
                  variants={fadeUp}
                  className="mb-6 text-[15px] italic tracking-wide"
                  style={{
                    color: "#b8828d",
                    fontFamily: '"Georgia", serif',
                  }}
                >
                  {greeting}
                </motion.p>

                <motion.p
                  variants={fadeUp}
                  className="text-[15px] leading-[1.9] md:text-[17px]"
                  style={{
                    color: textColor,
                    fontFamily: '"Georgia", serif',
                  }}
                >
                  {intro}
                </motion.p>

                <motion.p
                  variants={fadeUp}
                  className="mt-7 text-[15px] leading-[1.9] md:text-[17px]"
                  style={{
                    color: textColor,
                    fontFamily: '"Georgia", serif',
                  }}
                >
                  {body}
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="my-8 h-px w-12"
                  style={{
                    background: `linear-gradient(90deg, ${accentColor}60, transparent)`,
                  }}
                />

                <motion.p
                  variants={fadeUp}
                  className="my-10 text-center text-[18px] italic leading-[1.8] md:text-[22px]"
                  style={{
                    color: `${textColor}CC`,
                    fontFamily: '"Georgia", serif',
                    fontWeight: 600,
                  }}
                >
                  {support}
                </motion.p>

                <motion.p
                  variants={fadeUp}
                  className="text-[15px] leading-[1.9] md:text-[17px]"
                  style={{
                    color: textColor,
                    fontFamily: '"Georgia", serif',
                  }}
                >
                  {closing}
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="mt-16 text-center"
                >
                  <div className="mb-5 flex justify-center">
                    <div
                      className="h-px w-20"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${goldAccent}, transparent)`,
                      }}
                    />
                  </div>

                  <p
                    className="text-[26px] md:text-[32px]"
                    style={{
                      color: "#b07a86",
                      fontFamily:
                        '"Great Vibes", "Snell Roundhand", "Segoe Script", cursive',
                    }}
                  >
                    {signoff}
                  </p>

                  <p
                    className="mt-3 text-[17px] md:text-[20px]"
                    style={{
                      color: textColor,
                      letterSpacing: "0.03em",
                      fontFamily: '"Georgia", serif',
                    }}
                  >
                    {signedBy}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}