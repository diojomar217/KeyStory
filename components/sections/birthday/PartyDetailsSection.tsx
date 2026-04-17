"use client";

import type { ThemeKey } from "@/config/themeConfig";
import { useThemeUtils } from "../../builder/ThemeWrapper";
import ScrollReveal from "../../ui/ScrollReveal";

type Props = {
  theme: ThemeKey;
  location?: string;
  date?: string;
  time?: string;
  dressCode?: string;
};

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
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

function ClockIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function SparklesIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" />
    </svg>
  );
}

export default function PartyDetailsSection({
  theme,
  location,
  date,
  time,
  dressCode,
}: Props) {
  const { colors } = useThemeUtils(theme);

  const textColor = colors?.text || "#6a2f39";
  const accentColor = "#c98a96";
  const goldAccent = "#d8b16c";

  const items = [
    {
      label: "Location",
      value: location || "To be announced",
      icon: <PinIcon color={`${accentColor}CC`} />,
    },
    {
      label: "Date",
      value: date || "To be announced",
      icon: <CalendarIcon color={`${accentColor}CC`} />,
    },
    {
      label: "Time",
      value: time || "To be announced",
      icon: <ClockIcon color={`${accentColor}CC`} />,
    },
    {
      label: "Dress Code",
      value: dressCode || "To be announced",
      icon: <SparklesIcon color={`${accentColor}CC`} />,
    },
  ];

  return (
    <section
      className="relative overflow-hidden px-4 py-20 md:px-6 md:py-24 lg:py-28"
      id="party-details"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-3rem] top-10 h-36 w-36 rounded-full blur-3xl opacity-[0.08]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute right-[-2rem] top-20 h-44 w-44 rounded-full blur-3xl opacity-[0.06]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 rounded-full blur-3xl opacity-[0.05]"
          style={{ backgroundColor: goldAccent }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <p
              className="text-[11px] uppercase tracking-[0.32em] md:text-xs"
              style={{
                color: accentColor,
                fontFamily: "system-ui, sans-serif",
                opacity: 0.8,
              }}
            >
              Event Details
            </p>

            <h2
              className="mt-4 text-3xl font-semibold md:text-5xl"
              style={{
                color: textColor,
                fontFamily: '"Georgia", "Times New Roman", serif',
              }}
            >
              The Day&apos;s Details
            </h2>

            <p
              className="mx-auto mt-3 max-w-2xl text-sm md:text-base"
              style={{
                color: `${textColor}B3`,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Everything your guests need for this special celebration.
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

            <div
              className="relative rounded-[2rem] border px-6 py-8 md:px-10 md:py-10"
              style={{
                borderColor: "#e8dede",
                background:
                  "linear-gradient(180deg, #fffaf8 0%, #f3e8e5 100%)",
                boxShadow:
                  "0 30px 80px rgba(106,47,57,0.14), 0 10px 25px rgba(106,47,57,0.05)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div
                className="pointer-events-none absolute inset-4 rounded-[1.6rem] border"
                style={{ borderColor: `${accentColor}18` }}
              />

              <div className="relative grid gap-4 md:grid-cols-2">
                {items.map((item, idx) => (
                  <ScrollReveal
                    key={item.label}
                    animation="fade-up"
                    delay={120 + idx * 70}
                  >
                    <div
                      className="rounded-[1.35rem] border px-5 py-5 transition-all duration-300 hover:bg-white/50 hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
                      style={{
                        borderColor: `${accentColor}12`,
                        background: "rgba(255,255,255,0.35)",
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/45"
                          style={{
                            borderColor: `${accentColor}16`,
                          }}
                        >
                          {item.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="text-[10px] uppercase tracking-[0.32em]"
                            style={{
                              color: accentColor,
                              fontFamily: "system-ui, sans-serif",
                              opacity: 0.75,
                            }}
                          >
                            {item.label}
                          </p>

                          <p
                            className="mt-2 text-[17px] leading-[1.7] md:text-[18px]"
                            style={{
                              color: textColor,
                              fontFamily:
                                '"Georgia", "Times New Roman", serif',
                            }}
                          >
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}