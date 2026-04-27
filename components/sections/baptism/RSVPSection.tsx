"use client";

import { useState, FormEvent } from "react";
import type { ThemeKey } from "@/config/themeConfig";
import type { SectionAsset } from '@/lib/types';
import { useThemeUtils } from "../../builder/ThemeWrapper";
import ScrollReveal from "../../ui/ScrollReveal";

interface RSVPProps {
  theme: ThemeKey;
  rsvpEnabled?: boolean;
  siteId?: string;
  assets?: SectionAsset;
}

function MailIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function FieldLabel({
  children,
  accentColor,
}: {
  children: React.ReactNode;
  accentColor: string;
}) {
  return (
    <label
      className="mb-2 block text-[10px] uppercase tracking-[0.32em]"
      style={{
        color: accentColor,
        opacity: 0.82,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {children}
    </label>
  );
}

function PremiumInputField({
  label,
  value,
  onChange,
  placeholder,
  accentColor,
  textColor,
  type = "text",
  min,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accentColor: string;
  textColor: string;
  type?: string;
  min?: number;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel accentColor={accentColor}>{label}</FieldLabel>
      <input
        type={type}
        min={min}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[1.2rem] border px-4 py-3.5 text-[15px] outline-none transition-all duration-300 placeholder:text-[#bba7ab] focus:bg-white/80 focus:shadow-[0_0_0_4px_rgba(201,138,150,0.12)]"
        style={{
          color: textColor,
          borderColor: `${accentColor}24`,
          background: "rgba(255,255,255,0.48)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.035)",
          fontFamily: '"Georgia", "Times New Roman", serif',
        }}
      />
    </div>
  );
}

function PremiumSelectField({
  label,
  value,
  onChange,
  accentColor,
  textColor,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accentColor: string;
  textColor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel accentColor={accentColor}>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[1.2rem] border px-4 py-3.5 text-[15px] outline-none transition-all duration-300 focus:bg-white/80 focus:shadow-[0_0_0_4px_rgba(201,138,150,0.12)]"
        style={{
          color: textColor,
          borderColor: `${accentColor}24`,
          background: "rgba(255,255,255,0.48)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.035)",
          fontFamily: '"Georgia", "Times New Roman", serif',
        }}
      >
        {children}
      </select>
    </div>
  );
}

function PremiumTextareaField({
  label,
  value,
  onChange,
  placeholder,
  accentColor,
  textColor,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accentColor: string;
  textColor: string;
}) {
  return (
    <div>
      <FieldLabel accentColor={accentColor}>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-[1.2rem] border px-4 py-3.5 text-[15px] outline-none transition-all duration-300 placeholder:text-[#bba7ab] focus:bg-white/80 focus:shadow-[0_0_0_4px_rgba(201,138,150,0.12)]"
        style={{
          color: textColor,
          borderColor: `${accentColor}24`,
          background: "rgba(255,255,255,0.48)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.035)",
          fontFamily: '"Georgia", "Times New Roman", serif',
        }}
      />
    </div>
  );
}

export default function RSVPSection({
  theme,
  rsvpEnabled = true,
  siteId,
}: RSVPProps) {
  const { colors } = useThemeUtils(theme);

  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no" | "maybe">("yes");
  const [godparentConfirmation, setGodparentConfirmation] = useState<"yes" | "no">("no");
  const [companions, setCompanions] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const textColor = colors?.text || "#6a2f39";
  const accentColor = "#c98a96";
  const goldAccent = "#d8b16c";

  const isAttending = attendance === "yes" || attendance === "maybe";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !attendance) {
      setFeedback("Please enter your name and attendance.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const payload: any = {
        name: fullName.trim(),
        contact_number: contactNumber.trim() || undefined,
        attendance,
        godparent_confirmation: isAttending ? godparentConfirmation : "no",
        companions: isAttending ? companions || 0 : 0,
        message: message.trim() || undefined,
      };

      if (siteId) payload.site_id = siteId;
      else if (typeof window !== "undefined") {
        const path = window.location.pathname || "";
        const parts = path.split("/").filter(Boolean);
        const siteIndex = parts.indexOf("site");
        const hostIndex = parts.indexOf("host");

        if (siteIndex >= 0 && parts[siteIndex + 1]) {
          payload.slug = parts[siteIndex + 1];
        } else if (hostIndex >= 0 && parts[hostIndex + 1]) {
          payload.slug = parts[hostIndex + 1];
        }
      }

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.error) {
        setStatus("error");
        setFeedback(json?.error || "Failed to submit RSVP.");
        return;
      }

      setFullName("");
      setContactNumber("");
      setAttendance("yes");
      setGodparentConfirmation("no");
      setCompanions(0);
      setMessage("");
      setStatus("success");
      setFeedback(
        json?.duplicate
          ? "We already received your RSVP. Thank you 💌"
          : "Thank you for your response 💖 We’re excited to celebrate with you!"
      );
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFeedback("Failed to submit RSVP. Please try again later.");
    }
  };

  if (!rsvpEnabled) return null;

  return (
    <section
      id="rsvp"
      className="relative overflow-hidden px-4 py-16 md:px-6 md:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-3rem] top-10 h-40 w-40 rounded-full blur-3xl opacity-[0.10]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute right-[-2rem] top-20 h-48 w-48 rounded-full blur-3xl opacity-[0.08]"
          style={{ backgroundColor: "#ffd6df" }}
        />
        <div
          className="absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 rounded-full blur-3xl opacity-[0.08]"
          style={{ backgroundColor: goldAccent }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-8 text-center md:mb-10">
            <div
              className="inline-flex items-center justify-center rounded-full border bg-white/80 px-4 py-2 shadow-sm"
              style={{ borderColor: `${accentColor}22` }}
            >
              <MailIcon color={accentColor} />
            </div>

            <p
              className="mt-5 text-[11px] uppercase tracking-[0.32em] md:text-xs"
              style={{
                color: accentColor,
                fontFamily: "system-ui, sans-serif",
                opacity: 0.82,
              }}
            >
              RSVP
            </p>

            <h2
              className="mt-4 text-3xl font-semibold md:text-5xl"
              style={{
                color: textColor,
                fontFamily: '"Georgia", "Times New Roman", serif',
              }}
            >
              Kindly Let Us Know
            </h2>

            <p
              className="mx-auto mt-3 max-w-2xl text-sm leading-6 md:text-base"
              style={{
                color: `${textColor}B3`,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Please share your response so we can prepare for this special day.
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
          <div className="relative mt-8">
            <div
              className="absolute inset-0 translate-y-2 scale-[0.99] rounded-[2rem]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,221,229,0.45), rgba(244,219,224,0.30))",
              }}
            />

            <div
              className="relative rounded-[2rem] border px-5 py-7 md:px-10 md:py-10"
              style={{
                borderColor: "#f1d8de",
                background:
                  "linear-gradient(180deg, rgba(255,250,251,0.96) 0%, rgba(253,238,242,0.92) 100%)",
                boxShadow:
                  "0 30px 80px rgba(106,47,57,0.12), 0 10px 25px rgba(106,47,57,0.04)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(106,47,57,0.18) 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div
                className="pointer-events-none absolute inset-4 rounded-[1.6rem] border"
                style={{ borderColor: `${accentColor}18` }}
              />

              <form onSubmit={onSubmit} className="relative">
                <div className="grid gap-5 md:grid-cols-2">
                  <PremiumInputField
                    label="Full Name"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Your full name"
                    accentColor={accentColor}
                    textColor={textColor}
                    required
                  />

                  <PremiumSelectField
                    label="Attendance"
                    value={attendance}
                    onChange={(value) => setAttendance(value as any)}
                    accentColor={accentColor}
                    textColor={textColor}
                  >
                    <option value="yes">Yes, I will attend</option>
                    <option value="no">Sorry, I cannot attend</option>
                    <option value="maybe">Maybe</option>
                  </PremiumSelectField>
                </div>

                <p
                  className="mt-3 text-sm leading-6"
                  style={{
                    color: `${textColor}99`,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {attendance === "yes" &&
                    "We can’t wait to celebrate this blessing with you 💖"}
                  {attendance === "maybe" &&
                    "No worries — just let us know for now so we can plan gently 💌"}
                  {attendance === "no" &&
                    "Thank you for letting us know. We’ll miss you on this special day 💌"}
                </p>

                {isAttending ? (
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <PremiumInputField
                      label="Companions"
                      type="number"
                      min={0}
                      value={String(companions)}
                      onChange={(value) => setCompanions(Number(value || 0))}
                      placeholder="0"
                      accentColor={accentColor}
                      textColor={textColor}
                    />

                    <PremiumSelectField
                      label="Godparent"
                      value={godparentConfirmation}
                      onChange={(value) => setGodparentConfirmation(value as any)}
                      accentColor={accentColor}
                      textColor={textColor}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </PremiumSelectField>
                  </div>
                ) : null}

                <div className="mt-5">
                  <PremiumTextareaField
                    label="Message"
                    value={message}
                    onChange={setMessage}
                    placeholder="Leave a short message for the family"
                    accentColor={accentColor}
                    textColor={textColor}
                  />
                </div>

                <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex min-w-[210px] items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(193,100,118,0.28)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, #c16476 0%, #b4586a 100%)",
                    }}
                  >
                    {status === "loading"
                      ? "Sending..."
                      : "Confirm Attendance 💌"}
                  </button>

                  <div className="md:max-w-[340px]">
                    {feedback ? (
                      <div
                        className="rounded-[1rem] border px-4 py-3 text-sm leading-6"
                        style={{
                          borderColor:
                            status === "success"
                              ? "rgba(34,197,94,0.22)"
                              : "rgba(239,68,68,0.18)",
                          background:
                            status === "success"
                              ? "rgba(240,253,244,0.85)"
                              : "rgba(254,242,242,0.85)",
                          color:
                            status === "success" ? "#15803d" : "#b91c1c",
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {feedback}
                      </div>
                    ) : (
                      <p
                        className="text-sm leading-6"
                        style={{
                          color: `${textColor}99`,
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        Your response helps us prepare everything with care.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}