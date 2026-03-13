'use client';

import { Theme } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';

type Props = {
  message: string;
  theme: Theme;
};

export default function LoveMessageCard({ message, theme }: Props) {
  const styles = useTheme(theme);

  return (
    <div 
      className={`
        ${styles.glassCard} 
        ${styles.glassBorder} 
        border 
        rounded-2xl 
        p-6 
        md:p-8 
        lg:p-10
        max-w-2xl 
        mx-auto
        shadow-[0_8px_32px_rgba(0,0,0,0.1)]
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]
        transition-all
        duration-300
        transform
        hover:-translate-y-1
      `}
    >
      {/* Decorative quotes */}
      <div className="relative">
        <span 
          className={`
            absolute -top-2 -left-1 
            text-4xl md:text-5xl 
            opacity-20
            ${theme === 'dark_elegant' ? 'text-amber-400' : 'text-rose-400'}
          `}
        >
          &ldquo;
        </span>
        
        <p 
          className={`
            text-lg md:text-xl lg:text-2xl
            leading-relaxed 
            md:leading-loose
            text-center
            px-4
            ${styles.text}
            font-light
            italic
          `}
        >
          {message}
        </p>
        
        <span 
          className={`
            absolute -bottom-4 -right-1 
            text-4xl md:text-5xl 
            opacity-20
            ${theme === 'dark_elegant' ? 'text-amber-400' : 'text-rose-400'}
          `}
        >
          &rdquo;
        </span>
      </div>
      
      {/* Decorative line */}
      <div className={`
        mt-6 
        h-px 
        w-24 
        mx-auto
        bg-gradient-to-r from-transparent via-rose-300/50 to-transparent
        ${theme === 'dark_elegant' ? 'via-amber-400/30' : ''}
      `} />
    </div>
  );
}

