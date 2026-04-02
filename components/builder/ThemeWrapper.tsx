'use client';


import type { ReactNode } from 'react';
import { ThemeKey } from '@/config/themeConfig';
import { ThemeStyles, getThemeStyles } from '@/config/themeStyles';

type Props = {
  theme: ThemeKey;
  children: ReactNode;
  className?: string;
};


export default function ThemeWrapper({ theme, children, className = '' }: Props) {
  const styles: ThemeStyles = getThemeStyles(theme);
  return (
    <div className={`${styles.bg} ${styles.text} min-h-screen w-full ${className}`}>
      {children}
    </div>
  );
}

export function useTheme(theme: ThemeKey): ThemeStyles {
  return getThemeStyles(theme);
}

