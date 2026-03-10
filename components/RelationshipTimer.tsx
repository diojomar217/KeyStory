'use client';

import React, { useEffect, useState } from 'react';
import { Theme } from '@/lib/types';
import { useTheme } from './ThemeWrapper';

type Props = {
  anniversary: string;
  theme?: Theme;
};

export default function RelationshipTimer({ anniversary, theme = 'romantic_classic' }: Props) {
  const [duration, setDuration] = useState('');
  const styles = useTheme(theme);

  useEffect(() => {
    const calculateDuration = () => {
      const start = new Date(anniversary);
      const now = new Date();
      
      if (isNaN(start.getTime())) {
        return 'Invalid date';
      }

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      let hours = now.getHours() - start.getHours();
      let minutes = now.getMinutes() - start.getMinutes();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      if (hours < 0) {
        days--;
        hours += 24;
      }
      if (minutes < 0) {
        hours--;
        minutes += 60;
      }

      const parts = [];
      if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
      if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
      if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
      if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
      
      return parts.length > 0 ? `${parts.join(', ')} together` : 'Just started!';
    };

    // Initial calculation
    setDuration(calculateDuration());

    // Update every minute
    const interval = setInterval(() => {
      setDuration(calculateDuration());
    }, 60000);

    return () => clearInterval(interval);
  }, [anniversary]);

  // Heart icon based on theme
  const heartIcon = theme === 'dark_elegant' ? '💛' : '💕';

  return (
    <div 
      className={`
        ${styles.timerBg}
        ${styles.timerBorder}
        border
        rounded-full 
        px-6 py-3 
        md:px-8 md:py-4
        inline-flex 
        items-center 
        gap-3 
        md:gap-4
        shadow-lg 
        hover:shadow-xl 
        transition-all 
        duration-300
        backdrop-blur-sm
      `}
    >
      {/* Left heart */}
      <span className="text-lg md:text-xl animate-pulse">
        {heartIcon}
      </span>
      
      {/* Duration text */}
      <div className="text-center">
        <span 
          className={`
            ${styles.text} 
            font-medium 
            text-base 
            md:text-lg
            whitespace-nowrap
          `}
        >
          {duration}
        </span>
      </div>
      
      {/* Right heart */}
      <span className="text-lg md:text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>
        {heartIcon}
      </span>
    </div>
  );
}

