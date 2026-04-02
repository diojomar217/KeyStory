'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';
import { getCardStyleClasses, getShadowClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';

interface FutureDream {
  id: string;
  title: string;
  description: string;
  targetYear?: string;
}

interface FutureDreamsSectionProps {
  theme: ThemeKey;
  dreams?: FutureDream[];
  variant?: 'default' | 'alt';
}

const defaultDreams: FutureDream[] = [
  { id: '1', title: 'Dream Home', description: 'Building our perfect home together', targetYear: '2025' },
  { id: '2', title: 'Travel the World', description: 'Exploring new countries and cultures', targetYear: '2026' },
  { id: '3', title: 'Start a Family', description: 'Beginning the next chapter', targetYear: '2027' },
  { id: '4', title: 'Grow Old Together', description: 'Living a lifetime of adventures', targetYear: 'Forever' },
];

export default function FutureDreamsSection({ 
  theme, 
  dreams,
  variant = 'default'
}: FutureDreamsSectionProps) {
  const displayDreams = dreams && dreams.length > 0 ? dreams : defaultDreams;
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);

  return (
    <section className={`relative ${spacingClass}`} id="future-dreams">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="💭"
            title="Future Dreams"
            subtitle="Our hopes and dreams together"
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="grid gap-8 lg:gap-12 max-w-6xl mx-auto">
            {displayDreams.map((dream: FutureDream, index: number) => (
              <ScrollReveal key={dream.id} animation="fade-up" delay={index * 100}>
                <div 
                  className={`
                    group backdrop-blur-xl border rounded-3xl
                    p-8 lg:p-10 transition-all duration-500 ease-out
                    relative overflow-hidden
                    hover:-translate-y-3 hover:scale-[1.02]
                  `}
                  style={{
                    backgroundColor: themeUtils.colors.card,
                    borderColor: themeUtils.colors.border,
                    boxShadow: `0 10px 30px ${themeUtils.colors.accent}15`
                  }}
                >
                  {/* Gradient background glow on hover */}
                  <div 
                    className="absolute inset-0 rounded-3xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${themeUtils.colors.secondary}60, transparent)`
                    }}
                  />
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 
                        className={`text-2xl lg:text-3xl font-bold mb-3 ${themeUtils.headingFontClass}`}
                        style={{ color: themeUtils.colors.primary }}
                      >
                        {dream.title}
                      </h3>
                      <p 
                        className="text-lg leading-relaxed"
                        style={{ color: themeUtils.colors.text }}
                      >
                        {dream.description}
                      </p>
                    </div>
                    {dream.targetYear && (
                      <span 
                        className={`${cardStyle} text-lg font-semibold ml-6 flex-shrink-0 px-4 py-2 shadow-lg`}
                        style={{
                          backgroundColor: themeUtils.colors.accent + '20',
                          color: themeUtils.colors.accent,
                          borderColor: themeUtils.colors.accent
                        }}
                      >
                        {dream.targetYear}
                      </span>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
