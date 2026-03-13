// components/TimelineDisplay.tsx
import { TimelineEvent } from '@/lib/types';

type Props = {
  events: TimelineEvent[];
};

export default function TimelineDisplay({ events }: Props) {
  if (events.length === 0) {
    return <p className="italic text-gray-500">No timeline events added.</p>;
  }
  return (
    <div className="space-y-6">
      {events.map((ev, idx) => (
        <div key={idx} className="border-l-2 pl-4">
          <div className="text-sm text-gray-600">{ev.date}</div>
          <div className="font-semibold text-lg">{ev.title}</div>
          <div className="mt-1 text-gray-700">{ev.description}</div>
        </div>
      ))}
    </div>
  );
}
