'use client';

import { Theme } from '@/lib/types';
import { useTheme } from '../../builder/ThemeWrapper';
import TypingText from '../../ui/TypingText';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  message: string;
  theme: Theme;
};

export default function LoveLetterSection({ message, theme }: Props) {
  const styles = useTheme(theme);

  // Get accent color based on theme
  const getAccentColor = () => {
    switch (theme) {
      case 'dark_elegant': return 'amber';
      case 'cute_pastel': return 'purple';
      case 'minimal_modern': return 'slate';
      default: return 'rose';
    }
  };

  const accentColor = getAccentColor();

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="love-letter">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="💕"
            title="Love Letter"
            subtitle="A message from my heart to yours"
            theme={theme}
          />
        </ScrollReveal>

        {/* Love Letter Card */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className={`
            ${styles.glassCard}
            ${styles.glassBorder}
            border
            rounded-2xl
            shadow-xl
            p-6
            md:p-8
            max-w-2xl
            mx-auto
            hover:shadow-2xl
            transition-all
            duration-500
          `}>
            {/* Subtle decorative quotes */}
            <div className="relative">
              <span 
                className={`
                  absolute -top-2 -left-1 
                  text-3xl md:text-4xl 
                  opacity-15
                  ${accentColor === 'amber' ? 'text-amber-400' : accentColor === 'purple' ? 'text-purple-400' : accentColor === 'slate' ? 'text-slate-400' : 'text-rose-400'}
                `}
              >
                &ldquo;
              </span>
              
              <div className={`
                text-base md:text-lg lg:text-xl
                leading-relaxed 
                text-center
                px-2
                ${styles.text}
                font-light
                italic
              `}>
                <TypingText 
                  text={message} 
                  speed={40}
                />
              </div>
              
              <span 
                className={`
                  absolute -bottom-3 -right-1 
                  text-3xl md:text-4xl 
                  opacity-15
                  ${accentColor === 'amber' ? 'text-amber-400' : accentColor === 'purple' ? 'text-purple-400' : accentColor === 'slate' ? 'text-slate-400' : 'text-rose-400'}
                `}
              >
                &rdquo;
              </span>
            </div>
            
            {/* Subtle decorative line */}
            <div className={`
              mt-6 
              h-px 
              w-24 
              mx-auto
              bg-gradient-to-r from-transparent via-rose-300/40 to-transparent
              ${theme === 'dark_elegant' ? 'via-amber-400/20' : ''}
            `} />
          </div>
        </ScrollReveal>

        {/* Bottom decorative element */}
        <div className="text-center mt-6">
          <span className={`text-lg opacity-25 ${accentColor === 'amber' ? 'text-amber-400' : accentColor === 'purple' ? 'text-purple-400' : accentColor === 'slate' ? 'text-slate-400' : 'text-rose-400'}`}>
            💕
          </span>
        </div>
      </div>
    </section>
  );
}

