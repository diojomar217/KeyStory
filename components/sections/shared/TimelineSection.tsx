'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { TimelineTemplate, TimelineEvent } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { useTheme, useThemeUtils } from '../../builder/ThemeWrapper';
import { getCardStyleClasses, getShadowClass, getColorStyle } from '@/lib/theme-color-helpers';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import type { SiteTypeKey } from '@/config/siteTypeConfig';
import ScrollReveal from '../../ui/ScrollReveal';
import Lightbox from '../../ui/Lightbox';


type Props = {
  theme: ThemeKey;
  template: TimelineTemplate;
  events: TimelineEvent[];
  variant?: 'default' | 'alt';
  siteType?: string;
};

export default function TimelineSection({ theme, template, events, variant = 'default', siteType }: Props) {
  const styles = useTheme(theme);
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  if (!events || events.length === 0) {
    return null;
  }

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get accent colors based on theme utilities
  const getAccentColors = () => {
    return {
      primaryColor: themeUtils.colors.primary,
      secondaryColor: themeUtils.colors.secondary,
      accentColor: themeUtils.colors.accent,
      textColor: themeUtils.colors.text,
      cardColor: themeUtils.colors.card,
      borderColor: themeUtils.colors.border,
    };
  };

  // Get default icons for chapters
  const getDefaultIcons = (index: number) => {
    const icons = ['💕', '💌', '🌹', '💍', '🏠', '🌍', '✨', '🎉', '💝', '❤️'];
    return icons[index % icons.length];
  };

  const accents = getAccentColors();

  const openLightbox = (photo: string, index: number) => {
    setSelectedPhoto(photo);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Enhanced Timeline Card with premium styling
  const renderTimelineCard = (event: TimelineEvent, idx: number, isSpecial: boolean) => {
    const icon = event.icon || getDefaultIcons(idx);
    const showSidePhoto = event.photo && event.photoPosition === 'side';
    
    return (
      <div 
        className={`
          relative flex items-start gap-6
          ${showSidePhoto ? 'md:items-stretch' : ''}
        `}
      >
        {/* Circle on timeline with enhanced marker */}
        <div className="absolute left-5 top-5 z-10">
          <div 
            className={`
              w-7 h-7 rounded-full flex items-center justify-center
              border-4 border-white/20
              ${isSpecial ? 'shadow-lg drop-shadow-lg' : 'shadow-lg'}
              transition-all duration-300
              ${isSpecial ? 'scale-115' : 'hover:scale-115'}
            `}
            style={{
              backgroundImage: `linear-gradient(135deg, ${accents.primaryColor}, ${accents.secondaryColor})`,
              boxShadow: isSpecial ? `0 0 24px ${accents.accentColor}80` : `0 0 16px ${accents.primaryColor}60`,
            }}
          >
            <span className={`text-sm animate-gentle-pulse`} style={{ color: accents.accentColor }}>
              {isSpecial ? '💖' : '❤️'}
            </span>
          </div>
        </div>
        
        {/* Content Card - Premium styling */}
        <div className={`
          ml-16 flex-1
          ${showSidePhoto ? 'md:flex md:gap-6' : ''}
        `}>
          {/* Photo - Top or Side */}
          {event.photo && (
            <div 
              className={`
                relative rounded-2xl overflow-hidden cursor-pointer group hero-media-frame
                ${showSidePhoto ? 'md:w-1/3 md:flex-shrink-0 md:h-auto h-48 mb-4 md:mb-0' : 'h-48 mb-5'}
                transition-all duration-300
              `}
              onClick={() => openLightbox(event.photo!, idx)}
            >
              <Image
                src={event.photo}
                alt={event.title}
                fill
                className="object-cover gallery-zoom-hover group-hover:scale-105 transition-transform duration-500 hero-media-premium"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">🔍</span>
              </div>
              <div className="hero-media-focus" />
            </div>
          )}
          
          {/* Card Content */}
          <div 
            className={`
              rounded-3xl border 
              p-6 md:p-8
              transition-all duration-300 
              hover:-translate-y-1.5 hover:scale-[1.01]
              ${showSidePhoto ? 'md:flex-1' : ''}
            `}
            style={{
              backgroundColor: accents.cardColor,
              borderColor: accents.borderColor,
              boxShadow: isSpecial 
                ? `0 20px 25px -5px ${accents.accentColor}30` 
                : '0 10px 15px -3px rgba(0,0,0,0.1)',
            }}
          >
            {/* Header: Chapter + Date + Special Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Chapter Label */}
              <span className={`
                text-xs font-bold uppercase tracking-widest
                px-3 py-1 rounded-full
                ${styles.accentLight} ${styles.accent}
              `}>
                {icon} Chapter {idx + 1}
              </span>
              
              {/* Special Moment Badge */}
              {isSpecial && (
                <span 
                  className={`
                    text-xs font-semibold px-3 py-1 rounded-full
                    text-white shadow-lg animate-gentle-pulse
                    flex items-center gap-1
                  `}
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${accents.primaryColor}, ${accents.accentColor})`,
                  }}
                >
                  ✨ Special Moment
                </span>
              )}

              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${accents.secondaryColor}55`,
                  color: accents.primaryColor,
                }}
              >
                Story Highlight
              </span>
            </div>
            
            {/* Date */}
            <div className={`flex items-center gap-2 text-sm mb-3 ${styles.textMuted}`}>
              <span className="opacity-70">📅</span>
              {new Date(event.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            {/* Title */}
            <h3 
              className={`
                text-xl md:text-2xl font-bold 
                mb-3 
                ${styles.heading}
              `}
              style={{
                color: isSpecial ? accents.accentColor : accents.textColor,
              }}
            >
              {event.title}
            </h3>
            
            {/* Description */}
            <p className={`text-base leading-relaxed ${styles.textMuted}`}>
              {event.description}
            </p>

            <div className="mt-4 pt-4 border-t" style={{ borderColor: `${accents.borderColor}90` }}>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: accents.textColor }}>
                Captured Memory
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVerticalTimeline = () => (
    <div className="relative px-4 md:px-8" id="timeline">
      {/* Enhanced Vertical Line with gradient and glow */}
      <div className="absolute left-8 top-0 bottom-0">
        <div 
          className="w-0.5 h-full"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${accents.primaryColor}30, ${accents.accentColor}50, ${accents.primaryColor}30)`,
          }}
        />
      </div>

      <div className="space-y-12">
        {sortedEvents.map((event, idx) => (
          <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
            {renderTimelineCard(event, idx, event.isSpecial || false)}
          </ScrollReveal>
        ))}
      </div>
    </div>
  );

  const renderMilestoneCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4" id="timeline">
      {sortedEvents.map((event, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
          <div
            className={`
              rounded-3xl border 
              p-6 
              hover:-translate-y-2 hover:scale-[1.02]
              transition-all duration-300
              ${event.isSpecial ? 'ring-1' : ''}
            `}
            style={{
              backgroundColor: accents.cardColor,
              borderColor: accents.borderColor,
              boxShadow: event.isSpecial 
                ? `0 20px 25px -5px ${accents.accentColor}30` 
                : '0 10px 15px -3px rgba(0,0,0,0.1)',
            }}
          >
            {event.photo && (
              <div 
                className="relative h-40 mb-5 rounded-xl overflow-hidden cursor-pointer group hero-media-frame"
                onClick={() => openLightbox(event.photo!, idx)}
              >
                <Image
                  src={event.photo}
                  alt={event.title}
                  fill
                  className="object-cover gallery-zoom-hover group-hover:scale-110 transition-transform duration-500 hero-media-premium"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="hero-media-focus" />
              </div>
            )}
            
            {/* Milestone Icon with glow for special */}
            <div 
              className={`
                w-14 h-14 rounded-2xl 
                flex items-center justify-center mb-4
                transition-all duration-300
              `}
              style={{
                backgroundColor: accents.primaryColor,
                boxShadow: event.isSpecial ? `0 0 24px ${accents.accentColor}60` : 'none',
              }}
            >
              <span className="text-3xl">
                {event.icon || (event.isSpecial ? '💖' : getDefaultIcons(idx))}
              </span>
            </div>
            
            {/* Special Badge */}
            {event.isSpecial && (
              <div 
                className={`
                  inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                  text-white mb-3
                `}
                style={{
                  backgroundImage: `linear-gradient(90deg, ${accents.primaryColor}, ${accents.accentColor})`,
                }}
              >
                ✨ Special
              </div>
            )}
            
            {/* Date Badge */}
            <div 
              className={`
                inline-block px-3 py-1 rounded-full text-xs font-semibold  mb-3
              `}
              style={{
                backgroundColor: accents.primaryColor,
                color: 'white',
              }}
            >
              📅 {new Date(event.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <h3 
              className={`text-xl font-bold mb-3 ${styles.heading}`}
              style={{ color: accents.textColor }}
            >
              {event.title}
            </h3>
            <p 
              className={`text-base leading-relaxed`}
              style={{ color: accents.textColor }}
            >
              {event.description}
            </p>

            <div className="mt-4 pt-3 border-t" style={{ borderColor: `${accents.borderColor}90` }}>
              <span
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: accents.textColor }}
              >
                Milestone Entry
              </span>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  const renderStoryChapters = () => (
    <div className="max-w-3xl mx-auto px-4" id="timeline">
      <div className="space-y-12">
        {sortedEvents.map((event, idx) => (
          <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
            <div 
              className="relative pl-10 pb-12 last:pb-0 border-l-2"
              style={{ borderColor: accents.borderColor }}
            >
              {/* Chapter Marker with enhanced styling */}
              <div className="absolute -left-[14px] top-0">
                <div 
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center
                    border-4 border-white/20
                    transition-all duration-300
                    ${event.isSpecial ? 'scale-115' : 'hover:scale-115'}
                    shadow-lg
                  `}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${accents.primaryColor}, ${accents.secondaryColor})`,
                    boxShadow: event.isSpecial ? `0 0 24px ${accents.accentColor}80` : `0 0 16px ${accents.primaryColor}60`,
                  }}
                >
                  <span className={`text-sm animate-gentle-pulse`} style={{ color: accents.accentColor }}>
                    {event.isSpecial ? '💖' : '❤️'}
                  </span>
                </div>
              </div>
              
              <div 
                className={`
                  rounded-3xl border 
                  p-6 md:p-8 
                  transition-all duration-300 hover:-translate-y-1.5
                  ${event.isSpecial ? 'ring-1' : ''}
                `}
                style={{
                  backgroundColor: accents.cardColor,
                  borderColor: accents.borderColor,
                  boxShadow: event.isSpecial 
                    ? `0 20px 25px -5px ${accents.accentColor}30` 
                    : '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
              >
              {/* Optional Photo */}
              {event.photo && (
                <div 
                  className="relative h-56 mb-6 rounded-2xl overflow-hidden cursor-pointer group hero-media-frame"
                  onClick={() => openLightbox(event.photo!, idx)}
                >
                  <Image
                    src={event.photo}
                    alt={event.title}
                    fill
                    className="object-cover gallery-zoom-hover group-hover:scale-105 transition-transform duration-500 hero-media-premium"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="hero-media-focus" />
                </div>
              )}
              
              {/* Chapter Header */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span 
                  className={`
                    text-sm font-bold uppercase tracking-widest
                    px-4 py-1.5 rounded-full
                    text-white
                  `}
                  style={{ backgroundColor: accents.primaryColor }}
                >
                  {event.icon || getDefaultIcons(idx)} Chapter {idx + 1}
                </span>
                
                {event.isSpecial && (
                  <span 
                    className={`
                      text-xs font-semibold px-3 py-1 rounded-full
                      text-white shadow-lg
                    `}
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${accents.primaryColor}, ${accents.accentColor})`,
                    }}
                  >
                    ✨ Special Moment
                  </span>
                )}
              </div>
              
              {/* Date */}
              <div className={`flex items-center gap-2 text-sm mb-4`} style={{ color: accents.textColor }}>
                <span>📅</span>
                <span className="font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              {/* Title */}
              <h3 
                className={`
                  text-2xl md:text-3xl font-bold 
                  mb-4 
                  ${styles.heading}
                `}
                style={{
                  color: event.isSpecial ? accents.accentColor : accents.textColor,
                }}
              >
                {event.title}
              </h3>
              
              {/* Description */}
              <p 
                className={`text-lg leading-relaxed`}
                style={{ color: accents.textColor }}
              >
                {event.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: `${accents.borderColor}90` }}>
                <span className="text-xs uppercase tracking-[0.18em]" style={{ color: accents.textColor }}>
                  Chapter Highlight
                </span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: `${accents.secondaryColor}55`,
                    color: accents.primaryColor,
                  }}
                >
                  #{idx + 1}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
    </div>
  );

  return (
    <section className="relative py-16 md:py-24" id="timeline">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('timeline', siteType as SiteTypeKey | undefined);
            return (
              <SectionHeader
                icon={copy.icon}
                title={copy.title}
                subtitle={copy.subtitle}
                theme={theme}
              />
            );
          })()}
        </ScrollReveal>
        
        {/* Timeline Content */}
        {template === 'vertical_timeline' && renderVerticalTimeline()}
        {template === 'milestone_cards' && renderMilestoneCards()}
        {template === 'story_chapters' && renderStoryChapters()}

        {/* Lightbox for event photos */}
        <Lightbox
          photos={sortedEvents.filter(e => e.photo).map(e => e.photo!)}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </section>
  );
}

