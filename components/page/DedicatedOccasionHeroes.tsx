import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { ThemeStyles } from '../../config/themeStyles';
import type { OccasionHeroSpec } from '../../config/occasionHeroConfig';
import type { OccasionType } from '../../lib/types';

export type DedicatedHeroHighlight = {
  icon: string;
  label: string;
  value: string;
};

type DedicatedOccasionHeroProps = {
  siteType: OccasionType;
  styles: ThemeStyles;
  heroImage: string;
  displayHeadline: string;
  formattedSpecialDate: string;
  supportingNarrative: string;
  occasionHero: OccasionHeroSpec;
  heroHighlights: DedicatedHeroHighlight[];
  actions: ReactNode;
};

function WeddingHero({
  styles,
  heroImage,
  displayHeadline,
  formattedSpecialDate,
  supportingNarrative,
  occasionHero,
  heroHighlights,
  actions,
}: DedicatedOccasionHeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image src={heroImage} alt={displayHeadline} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/45" />
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.heroGradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,248,220,0.18),transparent_38%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl gap-12 px-6 py-10 md:px-10 lg:grid-cols-[1.12fr_360px] lg:px-14">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span>{occasionHero.badge}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">Wedding Collection</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`${styles.heading} mt-8 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl`}
          >
            {displayHeadline}
          </motion.h1>

          <p className="mt-5 max-w-2xl text-sm uppercase tracking-[0.28em] text-white/70 md:text-base">
            {occasionHero.datePrefix} {formattedSpecialDate || 'Date to be announced'}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
            {supportingNarrative}
          </p>

          <div className="mt-8">{actions}</div>
        </div>

        <div className="flex flex-col justify-center gap-5">
          <div className="rounded-[2rem] border border-white/15 bg-black/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.3em] text-white/60">Event Card</span>
              <span className="text-2xl">{occasionHero.badge}</span>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/50">Ceremony Date</div>
              <div className="mt-2 text-xl font-medium text-white/95">{formattedSpecialDate || 'Date to be announced'}</div>
              <div className="mt-4 h-px w-full bg-white/10" />
              <div className="mt-4 text-sm leading-7 text-white/80">A premium event-style opening designed for RSVPs, details, and celebration flow.</div>
            </div>
          </div>

          <div className="grid gap-3">
            {heroHighlights.map((item) => (
              <div key={`${item.label}-wedding`} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <div className="mb-2 text-lg">{item.icon}</div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/50">{item.label}</div>
                <div className="mt-2 text-sm text-white/90">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MemorialHero({
  heroImage,
  displayHeadline,
  formattedSpecialDate,
  supportingNarrative,
  occasionHero,
  heroHighlights,
  actions,
}: DedicatedOccasionHeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-zinc-900 to-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center md:px-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <span>{occasionHero.badge}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/65">In Loving Memory</span>
        </div>

        <div className="relative mt-10 h-60 w-52 overflow-hidden rounded-[2.1rem] border border-white/10 bg-white/5 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:h-80 md:w-64">
          <Image src={heroImage} alt={displayHeadline} fill className="rounded-[1.6rem] object-cover opacity-95" priority />
        </div>

        <h1 className="mt-10 max-w-3xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
          {displayHeadline}
        </h1>

        <p className="mt-4 text-sm uppercase tracking-[0.28em] text-white/55">
          {occasionHero.datePrefix} {formattedSpecialDate || 'Date to be announced'}
        </p>

        <div className="mt-8 max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
          <p className="text-lg leading-8 text-white/78">
            {supportingNarrative || 'A calm place for remembrance, stories, photos, and tributes from loved ones.'}
          </p>
        </div>

        <div className="mt-8 grid w-full max-w-4xl gap-3 md:grid-cols-3">
          {heroHighlights.map((item) => (
            <div key={`${item.label}-memorial`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-2 text-lg">{item.icon}</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">{item.label}</div>
              <div className="mt-2 text-sm text-white/82">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">{actions}</div>
      </div>
    </section>
  );
}

function TravelHero({
  heroImage,
  displayHeadline,
  formattedSpecialDate,
  supportingNarrative,
  occasionHero,
  heroHighlights,
  actions,
}: DedicatedOccasionHeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_42%,#e2e8f0_100%)]">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-14 md:px-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-sm">
            <span>{occasionHero.badge}</span>
            Travel Journal
          </div>

          <h1 className="mt-8 max-w-3xl font-serif text-5xl font-black leading-[0.94] tracking-tight text-slate-900 md:text-7xl">
            {displayHeadline}
          </h1>

          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">
            {occasionHero.datePrefix} {formattedSpecialDate || 'Date to be announced'}
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            {supportingNarrative}
          </p>

          <div className="mt-8">{actions}</div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {heroHighlights.map((item) => (
              <div key={`${item.label}-travel`} className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-lg">
                <div className="mb-2 text-lg">{item.icon}</div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{item.label}</div>
                <div className="mt-2 text-sm font-medium text-slate-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem]">
              <Image src={heroImage} alt={displayHeadline} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
            </div>
            <div className="pointer-events-none absolute inset-x-10 top-10 border-t border-dashed border-slate-300/80" />
            <div className="absolute bottom-10 left-10 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Route Card</div>
              <div className="mt-1 text-sm font-semibold text-slate-800">{occasionHero.secondaryLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DedicatedOccasionHero(props: DedicatedOccasionHeroProps) {
  switch (props.siteType) {
    case 'wedding':
      return <WeddingHero {...props} />;
    case 'memorial':
      return <MemorialHero {...props} />;
    case 'travel':
      return <TravelHero {...props} />;
    default:
      return null;
  }
}