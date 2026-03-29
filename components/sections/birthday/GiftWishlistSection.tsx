'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';

type Props = {
  theme: ThemeKey;
  items?: string[];
};

export default function GiftWishlistSection({ theme, items = [] }: Props) {
  const styles = useTheme(theme);

  const wishlist = items.length > 0 ? items : [
    'Collective gift fund for dream vacation',
    'Vintage watch styling workshop',
    'Custom monogrammed journal',
    'Charitable donation in their name',
  ];

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="gift-wishlist">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <SectionHeader
          icon="🎁"
          title="Gift Wishlist"
          subtitle="Gift ideas that make their day unforgettable"
          theme={theme}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {wishlist.map((item, index) => (
            <div key={index} className={`${styles.card} p-4 rounded-xl border ${styles.border}`}>
              <span className="text-lg">🎁</span>
              <p className="ml-3 inline text-base font-medium text-slate-700 dark:text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
