'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon?: string;
}

interface MilestonesSectionProps {
  theme: ThemeKey;
  milestones?: Milestone[];
}

const defaultMilestones: Milestone[] = [
  { id: '1', title: 'First Meeting', date: '', description: 'When our eyes first met', icon: '👀' },
  { id: '2', title: 'First Date', date: '', description: 'The beginning of everything', icon: '🌹' },
  { id: '3', title: 'First Kiss', date: '', description: 'A moment to remember forever', icon: '💋' },
  { id: '4', title: 'Making It Official', date: '', description: 'Starting this beautiful journey', icon: '💕' },
  { id: '5', title: 'First Trip Together', date: '', description: 'Adventure begins', icon: '✈️' },
  { id: '6', title: 'Saying "I Love You"', date: '', description: 'Three magical words', icon: '💖' },
];

export default function MilestonesSection({ theme, milestones = defaultMilestones }: MilestonesSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

  return (
    <section className={`px-4 ${spacingClass}`}>
      <div className="max-w-4xl mx-auto">
        <ScrollReveal animation="fade-up">
          <h2
            className={`text-4xl font-bold text-center mb-12 ${headingFontClass}`}
            style={{ color: themeUtils.colors.primary }}
          >
            Our Milestones
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {milestones.map((milestone, index) => (
            <ScrollReveal key={milestone.id} animation="fade-up" delay={index * 50}>
              <div
                className={`flex items-start gap-4 p-6 ${cardStyle} ${shadowClass} transition-all hover:scale-105 duration-300`}
                style={{
                  backgroundColor: themeUtils.colors.card,
                  borderColor: themeUtils.colors.border,
                }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: themeUtils.colors.secondary }}
                >
                  {milestone.icon || '⭐'}
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: themeUtils.colors.primary }}>
                    {milestone.title}
                  </h3>
                  <p className="text-sm" style={{ color: themeUtils.colors.text }}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

