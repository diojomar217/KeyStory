'use client';

import { Theme } from '@/lib/types';
import { useTheme } from './ThemeWrapper';
import TypingText from './TypingText';

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
    <section className={`py-20 md:py-24 ${styles.sectionBg}`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`text-2xl ${accentColor === 'amber' ? 'text-amber-400' : accentColor === 'purple' ? 'text-purple-400' : accentColor === 'slate' ? 'text-slate-400' : 'text-rose-400'}`}>
              💕
            </span>
          </div>
          <h2 className={`${styles.heading} text-3xl md:text-4xl font-bold ${styles.text} mb-4`}>
            Love Letter
          </h2>
          <div className={`w-24 h-1 mx-auto rounded-full bg-gradient-to-r ${
            accentColor === 'amber' ? 'from-amber-300 via-yellow-300 to-amber-300' :
            accentColor === 'purple' ? 'from-purple-300 via-pink-300 to-purple-300' :
            accentColor === 'slate' ? 'from-slate-300 via-gray-300 to-slate-300' :
            'from-rose-300 via-pink-300 to-rose-300'
          }`} />
        </div>

        {/* Love Letter Card */}
        <div className={`
          ${styles.glassCard}
          ${styles.glassBorder}
          border
          rounded-3xl
          p-8 md:p-12
          shadow-[0_10px_40px_rgba(0,0,0,0.1)]
          hover:shadow-[0_15px_50px_rgba(0,0,0,0.15)]
          transition-all
          duration-500
        `}>
          {/* Decorative quotes */}
          <div className="relative">
            <span 
              className={`
                absolute -top-4 -left-2 
                text-5xl md:text-6xl 
                opacity-20
                ${accentColor === 'amber' ? 'text-amber-400' : accentColor === 'purple' ? 'text-purple-400' : accentColor === 'slate' ? 'text-slate-400' : 'text-rose-400'}
              `}
            >
              &ldquo;
            </span>
            
            <div className={`
              text-lg md:text-xl lg:text-2xl
              leading-relaxed 
              md:leading-loose
              text-center
              px-4
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
                absolute -bottom-6 -right-2 
                text-5xl md:text-6xl 
                opacity-20
                ${accentColor === 'amber' ? 'text-amber-400' : accentColor === 'purple' ? 'text-purple-400' : accentColor === 'slate' ? 'text-slate-400' : 'text-rose-400'}
              `}
            >
              &rdquo;
            </span>
          </div>
          
          {/* Decorative line */}
          <div className={`
            mt-8 
            h-px 
            w-32 
            mx-auto
            bg-gradient-to-r from-transparent via-rose-300/50 to-transparent
            ${theme === 'dark_elegant' ? 'via-amber-400/30' : ''}
          `} />
        </div>

        {/* Bottom decorative element */}
        <div className="text-center mt-10">
          <span className={`text-2xl opacity-30 ${accentColor === 'amber' ? 'text-amber-400' : accentColor === 'purple' ? 'text-purple-400' : accentColor === 'slate' ? 'text-slate-400' : 'text-rose-400'}`}>
            💕
          </span>
        </div>
      </div>
    </section>
  );
}

