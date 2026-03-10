'use client';

import { Theme, TimelineTemplate, TimelineEvent } from '@/lib/types';
import { useTheme } from './ThemeWrapper';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';

type Props = {
  theme: Theme;
  template: TimelineTemplate;
  events: TimelineEvent[];
};

export default function TimelineSection({ theme, template, events }: Props) {
  const styles = useTheme(theme);

  if (!events || events.length === 0) {
    return null;
  }

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get accent colors based on theme
  const getAccentColors = () => {
    switch (theme) {
      case 'dark_elegant':
        return { line: 'bg-amber-500/50', dot: 'bg-amber-500', heart: 'text-amber-400' };
      case 'cute_pastel':
        return { line: 'bg-purple-300', dot: 'bg-purple-500', heart: 'text-purple-400' };
      case 'minimal_modern':
        return { line: 'bg-slate-300', dot: 'bg-slate-500', heart: 'text-slate-400' };
      default:
        return { line: 'bg-rose-300', dot: 'bg-rose-500', heart: 'text-rose-400' };
    }
  };

  const accents = getAccentColors();

  const renderVerticalTimeline = () => (
    <div className="relative px-4 md:px-8">
      {/* Vertical Line */}
      <div className={`absolute left-8 top-0 bottom-0 w-0.5 ${accents.line}`} />

      <div className="space-y-8">
        {sortedEvents.map((event, idx) => (
          <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
            <div className="relative flex items-start gap-6">
              {/* Circle on timeline with heart */}
              <div className="absolute left-5 top-4 z-10">
                <div className={`w-5 h-5 rounded-full ${styles.bg.split(' ')[0]} border-4 ${accents.dot} flex items-center justify-center shadow-md`}>
                  <span className={`text-xs ${accents.heart}`}>❤️</span>
                </div>
              </div>
              
              {/* Content Card - More emotional styling */}
              <div className={`ml-14 ${styles.card} rounded-2xl ${styles.cardBorder} border p-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                {/* Date Badge - Refined */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${styles.accentLight} ${styles.accent} mb-3`}>
                  <span className="opacity-70">💕</span>
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <h3 className={`text-lg font-semibold ${styles.text} mb-2`}>{event.title}</h3>
                <p className={`text-sm leading-relaxed ${styles.textMuted}`}>{event.description}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );

  const renderMilestoneCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {sortedEvents.map((event, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
          <div
            className={`${styles.card} rounded-2xl ${styles.cardBorder} border p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
          >
            {/* Milestone Icon */}
            <div className={`w-12 h-12 rounded-full ${styles.accentBg} flex items-center justify-center mb-4`}>
              <span className="text-2xl">
                {idx === 0 ? '💍' : idx === 1 ? '🏠' : idx === 2 ? '🌍' : '❤️'}
              </span>
            </div>
            
            {/* Date Badge */}
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles.accentLight} ${styles.accent} mb-2`}>
              {new Date(event.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <h3 className={`text-xl font-bold ${styles.text} mb-3`}>{event.title}</h3>
            <p className={styles.textMuted}>{event.description}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  const renderStoryChapters = () => (
    <div className="max-w-3xl mx-auto px-4">
      {sortedEvents.map((event, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
          <div 
            className={`relative pl-8 pb-12 border-l-2 ${accents.line} last:pb-0`}
          >
            {/* Chapter Marker with heart */}
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${styles.bg.split(' ')[0]} border-4 ${accents.dot} flex items-center justify-center`}>
              <span className={`text-xs ${accents.heart}`}>❤️</span>
            </div>
            
            <div className={`${styles.card} rounded-xl ${styles.cardBorder} border p-6 shadow-lg`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${styles.accent}`}>
                  Chapter {idx + 1}
                </span>
                <span className={`text-sm ${styles.textMuted}`}>
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <h3 className={`${styles.heading} text-2xl font-bold ${styles.text} mb-3`}>{event.title}</h3>
              <p className={`text-lg leading-relaxed ${styles.textMuted}`}>{event.description}</p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="📖"
            title="Our Love Story"
            subtitle="The journey of our love"
            theme={theme}
          />
        </ScrollReveal>
        
        {/* Timeline Content */}
        {template === 'vertical_timeline' && renderVerticalTimeline()}
        {template === 'milestone_cards' && renderMilestoneCards()}
        {template === 'story_chapters' && renderStoryChapters()}
      </div>
    </section>
  );
}

