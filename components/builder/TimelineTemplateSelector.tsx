'use client';

import { TimelineEvent, TimelineTemplate } from '@/lib/types';

// Timeline template presets
export type TimelineTemplateType = 'blank' | 'basic_love_story' | 'relationship_milestones' | 'engagement_journey';

interface TimelineTemplateOption {
  id: TimelineTemplateType;
  label: string;
  description: string;
  icon: string;
  events: Omit<TimelineEvent, 'date'>[];
}

const TIMELINE_TEMPLATES: TimelineTemplateOption[] = [
  {
    id: 'blank',
    label: 'Blank Timeline',
    description: 'Start from scratch with an empty timeline',
    icon: '📝',
    events: [],
  },
  {
    id: 'basic_love_story',
    label: 'Basic Love Story',
    description: 'Classic milestones: first meeting, dates, and more',
    icon: '💕',
    events: [
      { title: 'First Meeting', description: 'The moment our eyes met for the first time.' },
      { title: 'First Chat', description: 'Our first real conversation that sparked something.' },
      { title: 'First Date', description: 'The official first date that started it all.' },
      { title: 'First Trip', description: 'Our first adventure together away from home.' },
      { title: 'First "I Love You"', description: 'The magical moment we said those three words.' },
      { title: 'First Anniversary', description: 'Celebrating our first year together.' },
    ],
  },
  {
    id: 'relationship_milestones',
    label: 'Relationship Milestones',
    description: 'All the special moments that made us who we are',
    icon: '🎉',
    events: [
      { title: 'First Meeting', description: 'When we first saw each other.' },
      { title: 'First Phone Call', description: 'The first time we talked on the phone.' },
      { title: 'First Text', description: 'The beginning of our messaging story.' },
      { title: 'First Date', description: 'Our official first date.' },
      { title: 'First Kiss', description: 'That unforgettable moment.' },
      { title: 'Meeting the Family', description: 'Introducing each other to our loved ones.' },
      { title: 'First Vacation Together', description: 'Our first trip as a couple.' },
      { title: 'Moving In Together', description: 'The day we started living together.' },
      { title: 'Getting a Pet', description: 'Welcoming our furry family member.' },
      { title: 'First Big Fight & Making Up', description: 'Learning to resolve our differences.' },
    ],
  },
  {
    id: 'engagement_journey',
    label: 'Engagement Journey',
    description: 'From proposal to wedding planning',
    icon: '💍',
    events: [
      { title: 'The Proposal', description: 'The moment you asked me to be yours forever.' },
      { title: ' Saying Yes!', description: 'My joyful "Yes!" that changed everything.' },
      { title: 'Engagement Photos', description: 'Our magical photo shoot.' },
      { title: 'Choosing the Venue', description: 'Finding the perfect place to say "I do".' },
      { title: 'Wedding Party', description: 'Asking our closest friends to stand by us.' },
      { title: 'Dress & Suit Shopping', description: 'Finding the perfect wedding attire.' },
      { title: 'Save the Dates', description: 'Sharing our happy news with family and friends.' },
      { title: 'Wedding Registry', description: 'Building our new life together.' },
      { title: 'Bachelor/Bachelorette Party', description: 'Celebrating our last days as singles.' },
      { title: 'Rehearsal Dinner', description: 'The night before our big day.' },
    ],
  },
];

interface TimelineTemplateSelectorProps {
  value: TimelineTemplate | undefined;
  onChange: (template: TimelineTemplate) => void;
  events: TimelineEvent[];
  onEventsChange: (events: TimelineEvent[]) => void;
}

export default function TimelineTemplateSelector({
  value,
  onChange,
  events,
  onEventsChange,
}: TimelineTemplateSelectorProps) {
  const currentTemplate = TIMELINE_TEMPLATES.find(t => 
    t.id === 'blank' && events.length === 0 ? true :
    t.id === 'basic_love_story' && events.length === 6 ? true :
    t.id === 'relationship_milestones' && events.length === 10 ? true :
    t.id === 'engagement_journey' && events.length === 10 ? true : false
  ) || TIMELINE_TEMPLATES[0];

  const handleTemplateSelect = (template: TimelineTemplateOption) => {
    // Generate dates based on the template
    const currentDate = new Date();
    let generatedEvents: TimelineEvent[] = [];

    if (template.events.length > 0) {
      generatedEvents = template.events.map((event, index) => {
        // Create dates going back in time (each event 2-3 months apart)
        const eventDate = new Date(currentDate);
        const monthsAgo = (template.events.length - 1 - index) * (template.id === 'engagement_journey' ? 1 : 2);
        eventDate.setMonth(eventDate.getMonth() - monthsAgo);
        
        return {
          ...event,
          date: eventDate.toISOString().split('T')[0],
        };
      });
    }

    onEventsChange(generatedEvents);
    onChange(template.id as TimelineTemplate);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📅</span>
        <h3 className="text-lg font-semibold text-slate-800">Timeline Template</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TIMELINE_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleTemplateSelect(template)}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all duration-200
              ${currentTemplate?.id === template.id
                ? 'border-rose-500 bg-rose-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-rose-300 hover:shadow-sm'
              }
            `}
          >
            {currentTemplate?.id === template.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{template.icon}</span>
              <span className={`font-semibold ${currentTemplate?.id === template.id ? 'text-rose-700' : 'text-slate-700'}`}>
                {template.label}
              </span>
            </div>
            
            <p className="text-sm text-slate-500">
              {template.description}
            </p>
            
            {template.events.length > 0 && (
              <div className="mt-2 text-xs text-slate-400">
                {template.events.length} events included
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Current template info */}
      {events.length > 0 && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Current timeline:</span> {events.length} events
            {currentTemplate && currentTemplate.id !== 'blank' && (
              <span className="text-rose-600"> • Based on "{currentTemplate.label}"</span>
            )}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            You can still edit individual events after selecting a template.
          </p>
        </div>
      )}
    </div>
  );
}

export { TIMELINE_TEMPLATES };

