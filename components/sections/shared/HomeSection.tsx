'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Theme, HomeTemplate, Participant } from '@/lib/types';
import { useTheme } from '../../builder/ThemeWrapper';
import RelationshipTimer from '../../page/RelationshipTimer';
import { HeroDecorations } from '../../page/HeroOverlay';

interface Props {
  theme: Theme;
  template: HomeTemplate;
  participants: Participant[];
  specialDate: string;
  message: string;
  tagline?: string;
  photos: string[];
  coverPhotoIndex?: number;
}

export default function HomeSection({
  theme,
  template,
  participants,
  specialDate,
  message,
  tagline,
  photos,
  coverPhotoIndex,
}: Props) {
  const styles = useTheme(theme);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Backward compat: extract customerName/partnerName from participants or legacy fields
  const customerName = participants[0]?.name || '';
  const partnerName = participants[1]?.name || '';
  const anniversaryDate = specialDate;
  
  // Use cover photo index if available, otherwise fallback to first photo
  const heroImage = (coverPhotoIndex !== undefined && photos?.[coverPhotoIndex]) 
    ? photos[coverPhotoIndex] 
    : photos?.[0] || '/vercel.svg';

  // Safe fallbacks
  const displayCustomerName = customerName || 'You';
  const displayPartnerName = partnerName || 'Partner';
  
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

  // Trigger animations on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // ... rest of renderHeroCentered, renderSplitLayout, renderFullscreenBanner functions unchanged ...
  // (copy full implementation from existing components/page/HomeSection.tsx)

  const renderHeroCentered = () => (
    <div className={`${styles.heroBg} min-h-[85vh] flex flex-col items-center justify-center py-8 w-full relative`}>
      {/* Full implementation with {displayCustomerName} and {displayPartnerName} */}
      {/* ... (same as previous HomeSection content, using displayCustomerName/displayPartnerName) ... */}
      {/* See existing code for complete JSX */}
    </div>
  );

  const renderSplitLayout = () => (
    <div className={`${styles.heroBg} min-h-screen relative`}>
      {/* Full implementation */}
    </div>
  );

  const renderFullscreenBanner = () => (
    <div className={`relative min-h-screen flex items-center justify-center ${styles.heroBg}`}>
      {/* Full implementation */}
    </div>
  );

  switch (template) {
    case 'split_layout':
      return renderSplitLayout();
    case 'fullscreen_banner':
      return renderFullscreenBanner();
    case 'hero_centered':
    default:
      return renderHeroCentered();
  }
}

