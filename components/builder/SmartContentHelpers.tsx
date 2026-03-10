'use client';

import { useState, useCallback } from 'react';
import { TimelineEvent } from '@/lib/types';

// Romantic taglines
const ROMANTIC_TAGLINES = [
  "Every memory with you is my favorite.",
  "Our story written in moments.",
  "Forever started with you.",
  "A love story still being written.",
  "From our first hello to forever.",
  "You are my today and all of my tomorrows.",
  "Love is not about how many days we've been together, but how much we love each other.",
  "In your arms is where I belong.",
  "Every moment with you is a treasure.",
  "To love and be loved is the greatest happiness of all.",
  "You are my sunshine on rainy days.",
  "My heart beats for you.",
  "You are the reason I smile every day.",
  "Together is my favorite place to be.",
  "Every love story is beautiful, but ours is my favorite.",
  "Found my forever in you.",
  "You make my heart smile.",
  "The best is yet to come with you.",
];

// Love message templates
const LOVE_MESSAGE_TEMPLATES = [
  "My dearest [partner], every moment spent with you has been the best moment of my life. You are my everything, my rock, and my forever. I love you more than words can express.",
  "To the one who makes my heart skip a beat, thank you for being my constant source of joy and inspiration. With you, every day feels like a blessing. I love you endlessly.",
  "My love, you are the answer to every prayer I've ever made. Being with you is the greatest gift I could ever receive. I promise to love you forever.",
  "You came into my life and turned it upside down in the best way possible. Every day with you is a new adventure. I love you more than yesterday and less than tomorrow.",
  "My heart belongs to you, now and forever. You are my soulmate, my best friend, and my greatest love. Thank you for being you.",
];

// Default timeline milestones
const TIMELINE_MILESTONES = [
  { title: 'First Meeting', description: 'The moment our eyes met and everything changed.' },
  { title: 'First Conversation', description: 'Our first real talk that made me want to know more about you.' },
  { title: 'First Date', description: 'The official start of our beautiful journey together.' },
  { title: 'First Kiss', description: 'That magical moment when our lips first touched.' },
  { title: 'First "I Love You"', description: 'The words that changed everything between us.' },
  { title: 'First Trip Together', description: 'Our first adventure as a couple away from home.' },
  { title: 'First Holiday', description: 'Celebrating our first special occasion together.' },
  { title: 'Meeting the Family', description: 'Introducing you to the most important people in my life.' },
];

interface SmartContentHelpersProps {
  onSuggestTagline: (tagline: string) => void;
  onSuggestLoveMessage: (message: string) => void;
  onGenerateTimeline: (events: TimelineEvent[]) => void;
}

export default function SmartContentHelpers({
  onSuggestTagline,
  onSuggestLoveMessage,
  onGenerateTimeline,
}: SmartContentHelpersProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showTaglineSuggestions, setShowTaglineSuggestions] = useState(false);
  const [showMessageSuggestions, setShowMessageSuggestions] = useState(false);

  const handleSuggestTagline = useCallback(() => {
    setIsGenerating('tagline');
    const randomTagline = ROMANTIC_TAGLINES[Math.floor(Math.random() * ROMANTIC_TAGLINES.length)];
    onSuggestTagline(randomTagline);
    setTimeout(() => setIsGenerating(null), 500);
  }, [onSuggestTagline]);

  const handleSuggestLoveMessage = useCallback(() => {
    setIsGenerating('message');
    const randomMessage = LOVE_MESSAGE_TEMPLATES[Math.floor(Math.random() * LOVE_MESSAGE_TEMPLATES.length)];
    onSuggestLoveMessage(randomMessage);
    setTimeout(() => setIsGenerating(null), 500);
  }, [onSuggestLoveMessage]);

  const handleGenerateTimeline = useCallback(() => {
    setIsGenerating('timeline');
    
    const currentDate = new Date();
    const events: TimelineEvent[] = TIMELINE_MILESTONES.map((milestone, index) => {
      const eventDate = new Date(currentDate);
      eventDate.setMonth(eventDate.getMonth() - (TIMELINE_MILESTONES.length - 1 - index) * 2);
      return {
        title: milestone.title,
        date: eventDate.toISOString().split('T')[0],
        description: milestone.description,
      };
    });

    onGenerateTimeline(events);
    setTimeout(() => setIsGenerating(null), 500);
  }, [onGenerateTimeline]);

  return (
    <div className="space-y-4">
      {/* Helper Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSuggestTagline}
          disabled={isGenerating !== null}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
            bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600
            hover:from-rose-100 hover:to-pink-100
            transition-all duration-200 hover:scale-105 active:scale-95
            shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed
            ${isGenerating === 'tagline' ? 'animate-pulse' : ''}
          `}
        >
          <span>✨</span>
          Suggest Tagline
        </button>

        <button
          type="button"
          onClick={handleSuggestLoveMessage}
          disabled={isGenerating !== null}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
            bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600
            hover:from-purple-100 hover:to-pink-100
            transition-all duration-200 hover:scale-105 active:scale-95
            shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed
            ${isGenerating === 'message' ? 'animate-pulse' : ''}
          `}
        >
          <span>💌</span>
          Suggest Love Message
        </button>

        <button
          type="button"
          onClick={handleGenerateTimeline}
          disabled={isGenerating !== null}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
            bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600
            hover:from-blue-100 hover:to-indigo-100
            transition-all duration-200 hover:scale-105 active:scale-95
            shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed
            ${isGenerating === 'timeline' ? 'animate-pulse' : ''}
          `}
        >
          <span>📅</span>
          Generate Timeline
        </button>
      </div>

      {/* Tagline Quick Select */}
      {showTaglineSuggestions && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-3">Choose a Tagline</h4>
          <div className="space-y-2">
            {ROMANTIC_TAGLINES.slice(0, 6).map((tagline) => (
              <button
                key={tagline}
                type="button"
                onClick={() => {
                  onSuggestTagline(tagline);
                  setShowTaglineSuggestions(false);
                }}
                className="w-full text-left p-2 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
              >
                "{tagline}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Quick Select */}
      {showMessageSuggestions && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-3">Choose a Message Template</h4>
          <div className="space-y-2">
            {LOVE_MESSAGE_TEMPLATES.map((message, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSuggestLoveMessage(message);
                  setShowMessageSuggestions(false);
                }}
                className="w-full text-left p-2 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors line-clamp-2"
              >
                {message.substring(0, 80)}...
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export presets for direct use
export { ROMANTIC_TAGLINES, LOVE_MESSAGE_TEMPLATES, TIMELINE_MILESTONES };

