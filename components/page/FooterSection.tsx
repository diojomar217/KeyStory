"use client";

import { SiteConfig } from "@/lib/types";
import type { ThemeKey } from "@/config/themeConfig";
import { useTheme, useThemeUtils } from "../builder/ThemeWrapper";
import { OccasionType } from "@/lib/occasion-registry";
import { resolveFooterConfig, resolveDisplayName } from "@/lib/site-type-utils";
import { getFooterTextColors } from "@/lib/theme-color-helpers";

type SiteType = OccasionType;

type Props = {
  theme: ThemeKey;
  siteType?: SiteType;
  config?: SiteConfig;
  customerName?: string;
  partnerName?: string;
};

export default function FooterSection({
  theme,
  siteType = "couple",
  config,
  customerName = "",
  partnerName = "",
}: Props) {
  const styles = useTheme(theme);
  const themeUtils = useThemeUtils(theme);
  const resolvedSiteType: SiteType = siteType || "couple";

  const displayName = resolveDisplayName(
    resolvedSiteType,
    config?.participants || [],
    customerName,
    partnerName,
  );

  const isBaptism = resolvedSiteType === "baptism";

  const activeFooter = resolveFooterConfig(resolvedSiteType, displayName);

  const footerColors = {
    ...getFooterTextColors(theme),
    divider: themeUtils.colors.accent,
    decoration: themeUtils.colors.accent,
  };

  return (
    <footer className="relative overflow-hidden border-t border-rose-100 bg-gradient-to-b from-white to-rose-50 px-4 py-12 text-center">
      <div className="mx-auto max-w-3xl">
        {/* Label */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-400">
          Created with KeyStory
        </p>

        {/* Headline */}
        <h3
          className="mt-3 text-2xl md:text-3xl"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            color: "#6a2f39",
            fontWeight: 600,
          }}
        >
          Turn your memories into something beautiful
        </h3>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#7d5c64]">
          Personalized digital invitations, QR keepsakes, and memory websites
          for your most special moments.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {/* Order Now */}
          <a
            href="https://key-story.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[#c16476] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(193,100,118,0.28)] transition hover:-translate-y-0.5 hover:bg-[#b4586a]"
          >
            Order Now
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61576650496695&rdid=G5tvjVTc0mOV73kt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17tuVr5CAp%2F#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-[#e4c2c8] bg-white/90 px-6 py-3 text-sm font-semibold text-[#8b4d58] shadow-[0_8px_18px_rgba(122,86,96,0.06)] backdrop-blur transition hover:bg-white"
          >
            Message us on Facebook
          </a>
        </div>

        {/* Divider */}
        <div className="mt-8 flex justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-80" />
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-[#9b7a80]">
          © {new Date().getFullYear()} KeyStory. Made with love 💖
        </p>
      </div>
    </footer>
  );
}
