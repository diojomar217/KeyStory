'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Theme, TimelineTemplate, TimelineEvent } from '@/lib/types';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';
import Lightbox from '../../ui/Lightbox';

type Props = {
  theme: Theme;
  template: TimelineTemplate;
  events: TimelineEvent[];
};

export default function TimelineSection({ theme, template, events }: Props) {
  const styles = useTheme(theme);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  if (!events || events.length === 0) {
    return null;
  }

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get accent colors based on theme - refined for more elegant, romantic look
  const getAccentColors = () => {
    switch (theme) {
      case 'dark_elegant':
        return { 
          line: 'bg-gradient-to-b from-amber-400/20 via-amber-500/40 to-amber-400/20', 
          dot: 'bg-gradient-to-br from-amber-400 to-amber-600',
          dotGlow: 'shadow-[0_0_16px_rgba(245,158,11,0.6)]',
          heart: 'text-amber-400',
          special: 'from-amber-400 to-rose-500',
          specialGlow: 'shadow-[0_0_24px_rgba(245,158,11,0.5)]',
          cardGlow: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]'
        };
      case 'cute_pastel':
        return { 
          line: 'bg-gradient-to-b from-purple-400/20 via-purple-500/40 to-pink-400/20', 
          dot: 'bg-gradient-to-br from-purple-400 to-pink-500',
          dotGlow: 'shadow-[0_0_16px_rgba(168,85,247,0.6)]',
          heart: 'text-purple-400',
          special: 'from-purple-400 to-pink-500',
          specialGlow: 'shadow-[0_0_24px_rgba(168,85,247,0.5)]',
          cardGlow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]'
        };
      case 'minimal_modern':
        return { 
          line: 'bg-gradient-to-b from-slate-400/20 via-slate-500/40 to-slate-400/20', 
          dot: 'bg-gradient-to-br from-slate-400 to-slate-600',
          dotGlow: 'shadow-[0_0_16px_rgba(100,116,139,0.6)]',
          heart: 'text-slate-400',
          special: 'from-slate-400 to-slate-600',
          specialGlow: 'shadow-[0_0_24px_rgba(100,116,139,0.5)]',
          cardGlow: 'hover:shadow-[0_8px_30px_rgba(100,116,139,0.1)]'
        };
      default:
        return { 
          line: 'bg-gradient-to-b from-rose-300/30 via-rose-400/50 to-pink-300/30', 
          dot: 'bg-gradient-to-br from-rose-400 to-pink-500',
          dotGlow: 'shadow-[0_0_16px_rgba(244,63,94,0.6)]',
          heart: 'text-rose-400',
          special: 'from-rose-400 to-pink-500',
          specialGlow: 'shadow-[0_0_24px_rgba(244,63,94,0.5)]',
          cardGlow: 'hover:shadow-[0_8px_30px_rgba(244,63,94,0.12)]'
        };
    }
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
          <div className={`
            w-7 h-7 rounded-full flex items-center justify-center
            ${styles.bg.split(' ')[0]} border-4 border-white/20 ${accents.dot}
            ${isSpecial ? accents.dotGlow : 'shadow-lg'}
            transition-all duration-300
            ${isSpecial ? 'scale-115' : 'hover:scale-115'}
          `}>
            <span className={`text-sm ${accents.heart} animate-gentle-pulse`}>
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
                relative rounded-2xl overflow-hidden cursor-pointer group
                ${showSidePhoto ? 'md:w-1/3 md:flex-shrink-0 md:h-auto h-48 mb-4 md:mb-0' : 'h-48 mb-5'}
                transition-all duration-300
              `}
              onClick={() => openLightbox(event.photo!, idx)}
            >
              <Image
                src={event.photo}
                alt={event.title}
                fill
                className="object-cover gallery-zoom-hover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">🔍</span>
              </div>
            </div>
          )}
          
          {/* Card Content */}
          <div className={`
            ${styles.card} rounded-3xl ${styles.cardBorder} border 
            p-6 md:p-8
            ${isSpecial 
              ? `shadow-xl ${accents.specialGlow} ring-1 ring-${accents.dot.split(' ')[0].replace('bg-', '')}/30` 
              : `shadow-lg hover:shadow-2xl ${accents.cardGlow || ''}`
            }
            transition-all duration-300 
            hover:-translate-y-1.5 hover:scale-[1.01]
            ${showSidePhoto ? 'md:flex-1' : ''}
          `}>
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
                <span className={`
                  text-xs font-semibold px-3 py-1 rounded-full
                  bg-gradient-to-r ${accents.special}
                  text-white shadow-lg animate-gentle-pulse
                  flex items-center gap-1
                `}>
                  ✨ Special Moment
                </span>
              )}
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
            <h3 className={`
              text-xl md:text-2xl font-bold 
              ${styles.text} 
              mb-3 
              ${styles.heading}
              ${isSpecial ? 'bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent' : ''}
            `}>
              {event.title}
            </h3>
            
            {/* Description */}
            <p className={`text-base leading-relaxed ${styles.textMuted}`}>
              {event.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderVerticalTimeline = () => (
    <div className="relative px-4 md:px-8" id="timeline">
      {/* Enhanced Vertical Line with gradient and glow */}
      <div className="absolute left-8 top-0 bottom-0">
        <div className={`w-0.5 h-full ${accents.line}`} />
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
              ${styles.card} rounded-3xl ${styles.cardBorder} border 
              p-6 shadow-lg hover:shadow-2xl 
              hover:-translate-y-2 hover:scale-[1.02]
              transition-all duration-300
              ${event.isSpecial ? accents.specialGlow : accents.cardGlow || ''}
              ${event.isSpecial ? 'ring-1 ring-rose-400/30' : ''}
            `}
          >
            {/* Optional Photo */}
            {event.photo && (
              <div 
                className="relative h-40 mb-5 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(event.photo!, idx)}
              >
                <Image
                  src={event.photo}
                  alt={event.title}
                  fill
                  className="object-cover gallery-zoom-hover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            )}
            
            {/* Milestone Icon with glow for special */}
            <div className={`
              w-14 h-14 rounded-2xl 
              ${styles.accentBg} 
              flex items-center justify-center mb-4
              ${event.isSpecial ? accents.dotGlow : ''}
              transition-all duration-300
            `}>
              <span className="text-3xl">
                {event.icon || (event.isSpecial ? '💖' : getDefaultIcons(idx))}
              </span>
            </div>
            
            {/* Special Badge */}
            {event.isSpecial && (
              <div className={`
                inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r ${accents.special}
                text-white mb-3
              `}>
                ✨ Special
              </div>
            )}
            
            {/* Date Badge */}
            <div className={`
              inline-block px-3 py-1 rounded-full text-xs font-semibold 
              ${styles.accentLight} ${styles.accent} mb-3
            `}>
              📅 {new Date(event.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <h3 className={`text-xl font-bold ${styles.text} mb-3 ${styles.heading}`}>
              {event.title}
            </h3>
            <p className={`text-base leading-relaxed ${styles.textMuted}`}>
              {event.description}
            </p>
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
            <div className="relative pl-10 pb-12 last:pb-0 border-l-2 border-rose-200/30">
              {/* Chapter Marker with enhanced styling */}
              <div className="absolute -left-[14px] top-0">
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center
                  ${styles.bg.split(' ')[0]} border-4 border-white/20 ${accents.dot}
                  ${event.isSpecial ? accents.dotGlow : 'shadow-lg'}
                  transition-all duration-300
                  ${event.isSpecial ? 'scale-115' : 'hover:scale-115'}
                `}>
                  <span className={`text-sm ${accents.heart} animate-gentle-pulse`}>
                    {event.isSpecial ? '💖' : '❤️'}
                  </span>
                </div>
              </div>
              
              <div className={`
                ${styles.card} rounded-3xl ${styles.cardBorder} border 
                p-6 md:p-8 
                shadow-lg hover:shadow-2xl
                transition-all duration-300 hover:-translate-y-1.5
                ${event.isSpecial ? accents.specialGlow : accents.cardGlow || ''}
                ${event.isSpecial ? 'ring-1 ring-rose-400/30' : ''}
              `}>
              {/* Optional Photo */}
              {event.photo && (
                <div 
                  className="relative h-56 mb-6 rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(event.photo!, idx)}
                >
                  <Image
                    src={event.photo}
                    alt={event.title}
                    fill
                    className="object-cover gallery-zoom-hover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}
              
              {/* Chapter Header */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`
                  text-sm font-bold uppercase tracking-widest
                  px-4 py-1.5 rounded-full
                  ${styles.accentLight} ${styles.accent}
                `}>
                  {event.icon || getDefaultIcons(idx)} Chapter {idx + 1}
                </span>
                
                {event.isSpecial && (
                  <span className={`
                    text-xs font-semibold px-3 py-1 rounded-full
                    bg-gradient-to-r ${accents.special}
                    text-white shadow-lg
                  `}>
                    ✨ Special Moment
                  </span>
                )}
              </div>
              
              {/* Date */}
              <div className={`flex items-center gap-2 text-sm mb-4 ${styles.textMuted}`}>
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
              <h3 className={`
                text-2xl md:text-3xl font-bold 
                ${styles.text} 
                mb-4 
                ${styles.heading}
                ${event.isSpecial ? 'bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent' : ''}
              `}>
                {event.title}
              </h3>
              
              {/* Description */}
              <p className={`text-lg leading-relaxed ${styles.textMuted}`}>
                {event.description}
              </p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
    </div>
  );

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`} id="timeline">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="📖"
            title="Our Love Story"
            subtitle="The beautiful journey of us"
            theme={theme}
          />
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

