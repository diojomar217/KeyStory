// components/TimelineEditor.tsx
'use client';
import { useState } from 'react';
import { TimelineEvent } from '@/lib/types';

const MAX_TIMELINE_EVENTS = 15;

// Default relationship milestones to generate (without date)
const DEFAULT_MILESTONES: Omit<TimelineEvent, 'date'>[] = [
  { title: 'First Meeting', description: 'The moment we first met and our eyes connected.' },
  { title: 'First Chat', description: 'Our first real conversation that made us want to know more.' },
  { title: 'First Date', description: 'The official first date that started it all.' },
  { title: 'First Trip', description: 'Our first adventure together away from home.' },
  { title: 'First "I Love You"', description: 'The magical moment we first said those three words.' },
  { title: 'Anniversary', description: 'Celebrating our journey together.' },
];

// Icons for each milestone
const MILESTONE_ICONS = ['👋', '💬', '🌹', '✈️', '💕', '🎉'];

type Props = {
  events: TimelineEvent[];
  onChange: (events: TimelineEvent[]) => void;
};

export default function TimelineEditor({ events, onChange }: Props) {
  const currentCount = events.length;
  const isAtLimit = currentCount >= MAX_TIMELINE_EVENTS;
  const [showGenerateMenu, setShowGenerateMenu] = useState(false);

  // Calculate how many more events can be added
  const remainingSlots = MAX_TIMELINE_EVENTS - currentCount;

  const addEvent = () => {
    if (!isAtLimit) {
      onChange([...events, { title: '', date: '', description: '' }]);
    }
  };

  const generateTimeline = () => {
    // Determine how many milestones to add based on remaining slots
    const milestonesToAdd = DEFAULT_MILESTONES.slice(0, remainingSlots);
    
    if (milestonesToAdd.length === 0) {
      return;
    }

    // Get current year for default dates (subtracting months for each milestone)
    const currentDate = new Date();
    const newEvents = milestonesToAdd.map((milestone, index) => {
      // Create dates going back in time (each milestone 2 months apart)
      const eventDate = new Date(currentDate);
      eventDate.setMonth(eventDate.getMonth() - (milestonesToAdd.length - 1 - index) * 2);
      
      return {
        ...milestone,
        date: eventDate.toISOString().split('T')[0],
      };
    });

    onChange([...events, ...newEvents]);
    setShowGenerateMenu(false);
  };

  const updateEvent = (index: number, e: Partial<TimelineEvent>) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], ...e };
    onChange(newEvents);
  };

  const removeEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    onChange(newEvents);
  };

  return (
    <div className="space-y-6">
      {/* Header with Counter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Timeline Events
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Create beautiful memories for your love story
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
          isAtLimit 
            ? 'bg-red-100 text-red-600' 
            : currentCount > 0 
              ? 'bg-rose-100 text-rose-600'
              : 'bg-slate-100 text-slate-600'
        }`}>
          {currentCount} / {MAX_TIMELINE_EVENTS}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Generate Timeline Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowGenerateMenu(!showGenerateMenu)}
            disabled={isAtLimit || remainingSlots < 2}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${
              isAtLimit || remainingSlots < 2
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 hover:shadow-md'
            }`}
          >
            <span>✨</span>
            Generate Timeline
            <svg className={`w-4 h-4 transition-transform ${showGenerateMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showGenerateMenu && !isAtLimit && remainingSlots >= 2 && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden">
              <div className="p-3 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700">Quick Generate</p>
                <p className="text-xs text-slate-500">Add common relationship milestones</p>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={generateTimeline}
                  className="w-full p-3 text-left rounded-lg hover:bg-rose-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-lg">
                      💕
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-rose-600">
                        Romantic Milestones
                      </p>
                      <p className="text-xs text-slate-500">
                        {DEFAULT_MILESTONES.length} events • {remainingSlots < DEFAULT_MILESTONES.length ? `${remainingSlots} slots left` : 'Ready to add'}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-500">Events: {DEFAULT_MILESTONES.map(m => m.title).join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Add Single Event Button */}
        <button
          type="button"
          onClick={addEvent}
          disabled={isAtLimit}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${
            isAtLimit
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
        >
          <span className="text-lg">+</span>
          Add Event
        </button>
      </div>

      {/* Limit Warning */}
      {isAtLimit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <p className="text-sm text-red-600">You've reached the maximum of {MAX_TIMELINE_EVENTS} events. Remove some to add more.</p>
        </div>
      )}

      {/* Timeline Events Cards */}
      {events.length === 0 ? (
        <div className="text-center py-12 px-6 bg-gradient-to-br from-slate-50 to-rose-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-5xl mb-4">💝</div>
          <h4 className="text-lg font-semibold text-slate-700 mb-2">No Timeline Events Yet</h4>
          <p className="text-slate-500 mb-4">Add your special moments or generate them automatically</p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={generateTimeline}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
            >
              ✨ Generate Timeline
            </button>
            <button
              type="button"
              onClick={addEvent}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              + Add Manually
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev, i) => (
            <div 
              key={i} 
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-lg shadow-sm">
                  {MILESTONE_ICONS[i % MILESTONE_ICONS.length]}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Event {i + 1}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors flex items-center justify-center"
                  onClick={() => removeEvent(i)}
                  aria-label="Remove event"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Card Body - Form Inputs */}
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event title..."
                    value={ev.title}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 focus:bg-white transition-all"
                    onChange={(e) => updateEvent(i, { title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={ev.date}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 focus:bg-white transition-all"
                    onChange={(e) => updateEvent(i, { date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe this special moment..."
                    value={ev.description}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-800 px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 focus:bg-white transition-all resize-none"
                    rows={3}
                    onChange={(e) => updateEvent(i, { description: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Add Button */}
      {events.length > 0 && !isAtLimit && (
        <button 
          type="button" 
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 font-medium"
          onClick={addEvent}
        >
          <span className="text-xl">+</span>
          Add Another Event
        </button>
      )}

      {/* Click outside to close dropdown */}
      {showGenerateMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowGenerateMenu(false)}
        />
      )}
    </div>
  );
}

