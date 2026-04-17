"use client";

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface DressCodeProps {
  theme: ThemeKey;
  dressCode?: string;
  themeColor?: string;
}

export default function DressCodeSection({ theme, dressCode, themeColor }: DressCodeProps) {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;

  return (
    <section id="dress-code" className={`${styles.sectionBg} py-12`}>
      <div className="max-w-3xl mx-auto px-4">
        <ScrollReveal>
          <SectionHeader icon="👗" title="Dress Code" subtitle="What to wear for the celebration" theme={theme} />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="mt-6 rounded-xl p-6 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <p className="text-lg font-medium" style={{ color: colors.text }}>{dressCode || 'Smart casual'}</p>
            {themeColor && (
              <div className="mt-4 flex items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 8, background: themeColor, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }} />
                <p className="text-sm" style={{ color: colors.text }}>Suggested palette</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
