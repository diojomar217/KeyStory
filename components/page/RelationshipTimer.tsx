'use client';

import { isDarkTheme as checkIsDarkTheme } from '@/lib/theme-color-helpers';

import React, { useEffect, useState, useMemo } from 'react';
import type { ThemeKey } from '@/config/themeConfig';

import { useTheme } from '../builder/ThemeWrapper';

interface Props {
  anniversary: string;
  theme?: ThemeKey;
  showSeconds?: boolean;
}

interface DurationParts {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateDuration(anniversary: string): DurationParts | null {
  const start = new Date(anniversary);
  const now = new Date();
  
  if (isNaN(start.getTime())) {
    return null;
  }

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  // Adjust for negative values
  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  if (hours < 0) {
    days--;
    hours += 24;
  }
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days, hours, minutes, seconds };
}

function formatDuration(parts: DurationParts, includeSeconds: boolean): string {
  const { years, months, days, hours, minutes, seconds } = parts;
  
  // Build main display parts (larger units)
  const mainParts: string[] = [];
  
  if (years > 0) {
    mainParts.push(`${years} year${years !== 1 ? 's' : ''}`);
  }
  if (months > 0) {
    mainParts.push(`${months} month${months !== 1 ? 's' : ''}`);
  }
  if (days > 0 || years > 0 || months > 0) {
    mainParts.push(`${days} day${days !== 1 ? 's' : ''}`);
  }
  if (hours > 0 || days > 0 || years > 0 || months > 0) {
    mainParts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  
  // Add minutes to main display if no larger units
  if (mainParts.length === 0 || (years === 0 && months === 0 && days === 0)) {
    mainParts.push(`${minutes} min${minutes !== 1 ? 's' : ''}`);
  }
  
  // Build result
  let result = mainParts.join(' • ');
  
  // Add seconds as secondary detail if requested
  if (includeSeconds && (years === 0 && months === 0 && days === 0 && hours === 0)) {
    result += ` • ${seconds}s`;
  }
  
  return result || 'Just started!';
}

export default function RelationshipTimer({ 
  anniversary, 
  theme = 'romantic_classic',
  showSeconds = false 
}: Props) {
  const [duration, setDuration] = useState<DurationParts | null>(null);
  const styles = useTheme(theme);

  useEffect(() => {
    // Initial calculation
    setDuration(calculateDuration(anniversary));

    // Update every second for real-time ticker effect
    const interval = setInterval(() => {
      setDuration(calculateDuration(anniversary));
    }, 1000);

    return () => clearInterval(interval);
  }, [anniversary]);

  // Heart icon based on theme
  const heartIcon = checkIsDarkTheme(theme) ? '💛' : '💕';

  // Format duration string
  const durationText = useMemo(() => {
    if (!duration) return 'Calculating...';
    return formatDuration(duration, showSeconds);
  }, [duration, showSeconds]);

  // Show live seconds for short relationships (optional)
  const showLiveSeconds = showSeconds && duration && 
    duration.years === 0 && duration.months === 0 && duration.days === 0 && duration.hours === 0;

  return (
    <div 
      className={`
        ${styles.timerBg}
        ${styles.timerBorder}
        border
        rounded-full 
        px-5 py-2.5 
        md:px-7 md:py-3
        inline-flex 
        items-center 
        gap-2 md:gap-3
        shadow-lg 
        hover:shadow-xl 
        transition-all 
        duration-300
        backdrop-blur-sm
      `}
    >
      {/* Left heart */}
      <span className="text-base md:text-lg animate-pulse hidden sm:inline">
        {heartIcon}
      </span>
      
      {/* Duration text */}
      <div className="text-center">
        <span 
          className={`
            ${styles.text} 
            font-medium 
            text-sm md:text-base
            whitespace-nowrap
          `}
        >
          {duration ? `${durationText} together` : 'Calculating...'}
        </span>
        
        {/* Live seconds for very new relationships */}
        {showLiveSeconds && duration && (
          <span className="block text-xs opacity-70 mt-0.5">
            {duration.minutes}m {duration.seconds}s
          </span>
        )}
      </div>
      
      {/* Right heart */}
      <span className="text-base md:text-lg animate-pulse hidden sm:inline" style={{ animationDelay: '0.5s' }}>
        {heartIcon}
      </span>
    </div>
  );
}

