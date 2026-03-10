'use client';

import { Theme, TimelineTemplate, TimelineEvent } from '@/lib/types';
import { useTheme } from './ThemeWrapper';

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

  const renderVerticalTimeline = () => (
    <div className="relative px-4 md:px-8">
      {/* Vertical Line */}
      <div className={`absolute left-8 top-0 bottom-0 w-0.5 ${theme === 'dark_elegant' ? 'bg-amber-500/50' : 'bg-rose-300'}`} />

      <div className="space-y-8">
        {sortedEvents.map((event, idx) => (
          <div key={idx} className="relative flex items-start gap-6">
            {/* Circle on timeline */}
            <div className={`absolute left-6 w-5 h-5 rounded-full ${styles.accentBg} border-4 ${styles.bg.split(' ')[0]} z-10`} />
            
            {/* Content Card */}
            <div className={`ml-12 ${styles.card} rounded-xl ${styles.cardBorder} border p-5 shadow-lg hover:shadow-xl transition-shadow w-full`}>
              <div className={`text-sm font-semibold ${styles.accent} mb-1`}>
                {new Date(event.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <h3 className={`text-xl font-bold ${styles.text} mb-2`}>{event.title}</h3>
              <p className={styles.textMuted}>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMilestoneCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedEvents.map((event, idx) => (
        <div
          key={idx}
          className={`${styles.card} rounded-2xl ${styles.cardBorder} border p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
        >
          {/* Milestone Icon */}
          <div className={`w-12 h-12 rounded-full ${styles.accentBg} flex items-center justify-center mb-4`}>
            <span className="text-2xl">
              {idx === 0 ? '💍' : idx === 1 ? '🏠' : idx === 2 ? '🌍' : '❤️'}
            </span>
          </div>
          
          <div className={`text-sm font-semibold ${styles.accent} mb-2`}>
            {new Date(event.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <h3 className={`text-xl font-bold ${styles.text} mb-3`}>{event.title}</h3>
          <p className={styles.textMuted}>{event.description}</p>
        </div>
      ))}
    </div>
  );

  const renderStoryChapters = () => (
    <div className="max-w-3xl mx-auto">
      {sortedEvents.map((event, idx) => (
        <div 
          key={idx} 
          className={`relative pl-8 pb-12 border-l-2 ${theme === 'dark_elegant' ? 'border-amber-500/50' : 'border-rose-300'} last:pb-0`}
        >
          {/* Chapter Marker */}
          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${styles.accentBg} border-4 ${styles.bg.split(' ')[0]}`} />
          
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
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className={`${styles.heading} text-3xl md:text-4xl font-bold ${styles.text} mb-3`}>
          📖 Our Love Story
        </h2>
        <p className={`${styles.textMuted} text-lg`}>
          The journey of our love
        </p>
      </div>
      
      {/* Timeline Content */}
      {template === 'vertical_timeline' && renderVerticalTimeline()}
      {template === 'milestone_cards' && renderMilestoneCards()}
      {template === 'story_chapters' && renderStoryChapters()}
    </div>
  );
}

