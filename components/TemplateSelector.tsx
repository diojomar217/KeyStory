// components/TemplateSelector.tsx
'use client';
import {
  HomeTemplate,
  GalleryTemplate,
  TimelineTemplate,
  Section,
} from '@/lib/types';

type Props = {
  section: Section;
  value?: string;
  onChange: (template: string) => void;
};

const templates: Record<Section, { key: string; label: string }[]> = {
  home: [
    { key: 'hero_centered', label: 'Hero Centered' },
    { key: 'split_layout', label: 'Split Layout' },
    { key: 'fullscreen_banner', label: 'Fullscreen Banner' },
  ],
  gallery: [
    { key: 'grid', label: 'Grid' },
    { key: 'carousel', label: 'Carousel' },
    { key: 'polaroid', label: 'Polaroid' },
  ],
  timeline: [
    { key: 'vertical_timeline', label: 'Vertical Timeline' },
    { key: 'milestone_cards', label: 'Milestone Cards' },
    { key: 'story_chapters', label: 'Story Chapters' },
  ],
};

export default function TemplateSelector({ section, value, onChange }: Props) {
  const list = templates[section] || [];
  return (
    <div className="grid grid-cols-3 gap-4">
      {list.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`p-3 border rounded-lg hover:bg-gray-50 transition text-slate-800 ${
            value === t.key ? 'bg-pink-50 border-pink-600' : 'border-gray-200'
          }`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
