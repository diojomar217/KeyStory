'use client';

import { SiteConfig, SectionContentMap } from '@/lib/types';
import {
  TextContentInput,
  ReasonsILoveYouInput,
  FutureDreamsInput,
  VideoMemoriesInput,
  SpecialMomentsInput,
  MilestonesInput,
  PlaylistInput,
  FirstDateInput,
  LetterToFutureInput,
  SurpriseMessageInput,
  GiftSectionInput,
  QuotesInput,
  MemoryMapInput,
  GuestMessagesInput,
} from './ContentInputComponents';

interface SectionContentInputsProps {
  config: SiteConfig;
  onSectionContentChange: <K extends keyof SectionContentMap>(
    section: K,
    content: SectionContentMap[K]
  ) => void;
}

export default function SectionContentInputs({
  config,
  onSectionContentChange,
}: SectionContentInputsProps) {
  const { sections = [], section_content = {} } = config;

  return (
    <>
      {/* Text Content Sections */}
      {sections.includes('love_letter') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💌</span>
            <h3 className="font-semibold text-slate-700">Love Letter</h3>
          </div>
          <TextContentInput
            label="Your Love Letter"
            value={section_content?.love_letter?.content || ''}
            onChange={(content) => onSectionContentChange('love_letter', { content })}
            placeholder="Write your heartfelt love letter here..."
            rows={6}
          />
        </div>
      )}

      {sections.includes('our_story') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📖</span>
            <h3 className="font-semibold text-slate-700">Our Story</h3>
          </div>
          <TextContentInput
            label="Your Love Story"
            value={section_content?.our_story?.content || ''}
            onChange={(content) => onSectionContentChange('our_story', { content })}
            placeholder="Share your relationship story..."
            rows={6}
          />
        </div>
      )}

      {sections.includes('first_date') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌹</span>
            <h3 className="font-semibold text-slate-700">First Date</h3>
          </div>
          <FirstDateInput
            value={section_content?.first_date}
            onChange={(content) => onSectionContentChange('first_date', content)}
          />
        </div>
      )}

      {/* List/Repeater Sections */}
      {sections.includes('reasons_love_you') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💖</span>
            <h3 className="font-semibold text-slate-700">Reasons I Love You</h3>
            <span className="text-rose-500">*</span>
          </div>
          <ReasonsILoveYouInput
            value={section_content?.reasons_love_you}
            onChange={(content) => onSectionContentChange('reasons_love_you', content)}
          />
        </div>
      )}

      {sections.includes('future_dreams') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💭</span>
            <h3 className="font-semibold text-slate-700">Future Dreams</h3>
            <span className="text-rose-500">*</span>
          </div>
          <FutureDreamsInput
            value={section_content?.future_dreams}
            onChange={(content) => onSectionContentChange('future_dreams', content)}
          />
        </div>
      )}

      {sections.includes('special_moments') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⭐</span>
            <h3 className="font-semibold text-slate-700">Special Moments</h3>
          </div>
          <SpecialMomentsInput
            value={section_content?.special_moments}
            onChange={(content) => onSectionContentChange('special_moments', content)}
          />
        </div>
      )}

      {sections.includes('milestones') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏆</span>
            <h3 className="font-semibold text-slate-700">Milestones</h3>
          </div>
          <MilestonesInput
            value={section_content?.milestones}
            onChange={(content) => onSectionContentChange('milestones', content)}
          />
        </div>
      )}

      {sections.includes('video_memories') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎬</span>
            <h3 className="font-semibold text-slate-700">Video Memories</h3>
            <span className="text-rose-500">*</span>
          </div>
          <VideoMemoriesInput
            value={section_content?.video_memories}
            onChange={(content) => onSectionContentChange('video_memories', content)}
          />
        </div>
      )}

      {/* Media Links */}
      {sections.includes('playlist') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎶</span>
            <h3 className="font-semibold text-slate-700">Playlist</h3>
            <span className="text-rose-500">*</span>
          </div>
          <PlaylistInput
            value={section_content?.playlist}
            onChange={(content) => onSectionContentChange('playlist', content)}
          />
        </div>
      )}

      {/* Interactive Sections */}
      {sections.includes('quotes') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💕</span>
            <h3 className="font-semibold text-slate-700">Love Quotes</h3>
          </div>
          <QuotesInput
            value={section_content?.quotes}
            onChange={(content) => onSectionContentChange('quotes', content)}
          />
        </div>
      )}

      {sections.includes('memory_map') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🗺️</span>
            <h3 className="font-semibold text-slate-700">Memory Map</h3>
          </div>
          <MemoryMapInput
            value={section_content?.memory_map}
            onChange={(content) => onSectionContentChange('memory_map', content)}
          />
        </div>
      )}

      {sections.includes('letter_future') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📮</span>
            <h3 className="font-semibold text-slate-700">Letter to the Future</h3>
          </div>
          <LetterToFutureInput
            value={section_content?.letter_future}
            onChange={(content) => onSectionContentChange('letter_future', content)}
          />
        </div>
      )}

      {sections.includes('surprise_message') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎉</span>
            <h3 className="font-semibold text-slate-700">Surprise Message</h3>
          </div>
          <SurpriseMessageInput
            value={section_content?.surprise_message}
            onChange={(content) => onSectionContentChange('surprise_message', content)}
          />
        </div>
      )}

      {sections.includes('gift_section') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎁</span>
            <h3 className="font-semibold text-slate-700">Gift Section</h3>
          </div>
          <GiftSectionInput
            value={section_content?.gift_section}
            onChange={(content) => onSectionContentChange('gift_section', content)}
          />
        </div>
      )}

      {sections.includes('guest_messages') && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💬</span>
            <h3 className="font-semibold text-slate-700">Guest Messages</h3>
          </div>
          <GuestMessagesInput
            value={section_content?.guest_messages}
          />
        </div>
      )}
    </>
  );
}
