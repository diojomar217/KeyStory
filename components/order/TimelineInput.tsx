export interface TimelineEventInput {
  id: string;
  title: string;
  date: string;
  description: string;
}

type TimelineInputProps = {
  value: TimelineEventInput[];
  onChange: (events: TimelineEventInput[]) => void;
};

const createTimelineEvent = (): TimelineEventInput => ({
  id: crypto.randomUUID(),
  title: '',
  date: '',
  description: '',
});

export default function TimelineInput({ value, onChange }: TimelineInputProps) {
  const addEvent = () => {
    onChange([...value, createTimelineEvent()]);
  };

  const updateEvent = (id: string, key: keyof TimelineEventInput, nextValue: string) => {
    onChange(value.map((event) => (event.id === id ? { ...event, [key]: nextValue } : event)));
  };

  const removeEvent = (id: string) => {
    onChange(value.filter((event) => event.id !== id));
  };

  return (
    <div className="space-y-3">
      {value.map((event, index) => (
        <div key={event.id} className="rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-[#0f172a]">Event {index + 1}</p>
            <button
              type="button"
              onClick={() => removeEvent(event.id)}
              className="rounded-full border border-[#ef4444]/30 px-3 py-1 text-xs font-semibold text-[#b91c1c]"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={event.title}
              onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
              placeholder="Event title"
              className="rounded-xl border border-[#0f172a]/15 bg-white px-3 py-2.5 text-sm"
            />
            <input
              type="date"
              value={event.date}
              onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
              className="rounded-xl border border-[#0f172a]/15 bg-white px-3 py-2.5 text-sm"
            />
          </div>

          <textarea
            value={event.description}
            onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
            placeholder="Short memory from this moment"
            className="mt-3 min-h-[90px] w-full rounded-xl border border-[#0f172a]/15 bg-white px-3 py-2.5 text-sm"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addEvent}
        className="w-full rounded-xl border border-[#0f172a]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a]"
      >
        + Add Timeline Event
      </button>
    </div>
  );
}
