'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon?: string;
}

interface MilestonesSectionProps {
  theme: Theme;
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
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  return (
    <section 
      className="py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-12"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          🏆 Our Milestones
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="flex items-start gap-4 p-6 rounded-2xl"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px'
              }}
            >
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: colors.secondary }}
              >
                {milestone.icon || '⭐'}
              </div>
              <div>
                <h3 
                  className="font-bold mb-1"
                  style={{ 
                    color: colors.primary,
                    fontFamily: typography.headingFont
                  }}
                >
                  {milestone.title}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: colors.text }}
                >
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

