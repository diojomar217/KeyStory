'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface OurStorySectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  story?: string;
}

export default function OurStorySection({ 
  theme, 
  customerName, 
  partnerName,
  story 
}: OurStorySectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  const defaultStory = `This is the story of ${customerName} and ${partnerName}...
  
  Every love story is beautiful, but theirs is their favorite. From the moment they met, something special began. It was like finding the missing piece of a puzzle they didn't know was incomplete.
  
  Through sunny days and rainy afternoons, through laughter and tears, their bond grew stronger with each passing moment. They learned that love isn't about perfection—it's about choosing each other every single day.
  
  This is just the beginning of their forever.`;

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-8"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          📖 Our Story
        </h2>
        
        <div 
          className="prose prose-lg max-w-none p-8 rounded-2xl"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: '1px',
            color: colors.text,
            fontFamily: typography.bodyFont
          }}
        >
          {(story || defaultStory).split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

