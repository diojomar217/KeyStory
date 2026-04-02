'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';

type Props = {
  theme: ThemeKey;
  items?: string[];
};

export default function GiftRegistrySection({ theme, items = [] }: Props) {
  const styles = useTheme(theme);

  const registryItems = items.length > 0 ? items : [
    'Cash gift contribution',
    'Home essentials',
    'Honeymoon fund',
    'Kitchen starter set',
  ];

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="gift-registry">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <SectionHeader
          icon="\ud83c\udf81"
          title="Gift Registry"
          subtitle="A curated list of gifts for your celebration"
          theme={theme}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {registryItems.map((item, index) => (
            <div key={index} className={`${styles.card} p-4 rounded-xl border ${styles.border}`}>
              <span className="text-lg">\ud83c\udf81</span>
              <p className="ml-3 inline text-base font-medium text-slate-700 dark:text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
