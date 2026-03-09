// components/TimelineEditor.tsx
'use client';
import { useState } from 'react';
import { TimelineEvent } from '@/lib/types';

type Props = {
  events: TimelineEvent[];
  onChange: (events: TimelineEvent[]) => void;
};

export default function TimelineEditor({ events, onChange }: Props) {
  const addEvent = () => {
    onChange([...events, { title: '', date: '', description: '' }]);
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
    <div className="space-y-4">
      {events.map((ev, i) => (
        <div key={i} className="border p-3 rounded-lg relative">
          <button
            type="button"
            className="absolute top-1 right-1 text-red-500"
            onClick={() => removeEvent(i)}
          >
            ×
          </button>
          <input
            type="text"
            placeholder="Title"
            value={ev.title}
            className="input input-bordered w-full mb-2"
            onChange={(e) => updateEvent(i, { title: e.target.value })}
          />
          <input
            type="date"
            value={ev.date}
            className="input input-bordered w-full mb-2"
            onChange={(e) => updateEvent(i, { date: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={ev.description}
            className="textarea textarea-bordered w-full"
            onChange={(e) => updateEvent(i, { description: e.target.value })}
          />
        </div>
      ))}
      <button type="button" className="btn btn-sm" onClick={addEvent}>
        Add Event
      </button>
    </div>
  );
}
