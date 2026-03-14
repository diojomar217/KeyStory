'use client';

import { Theme } from '@/lib/types';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';

type Props = {
  theme: Theme;
  location?: string;
  date?: string;
  time?: string;
  dressCode?: string;
};

export default function PartyDetailsSection({ theme, location, date, time, dressCode }: Props) {
  const styles = useTheme(theme);

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="party-details">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <SectionHeader
          icon="📍"
          title="Party Details"
          subtitle="Everything guests need for the celebration"
          theme={theme}
        />

        <div className="grid gap-4 md:grid-cols-2 mt-8">
          {['Location', 'Date', 'Time', 'Dress Code'].map((label, idx) => {
            const value = [location, date, time, dressCode][idx] || 'To be announced';
            return (
              <div key={label} className={`${styles.card} p-5 rounded-xl border ${styles.border}`}>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-200 mb-1">{label}</h3>
                <p className="text-base font-medium text-slate-800 dark:text-slate-100">{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
