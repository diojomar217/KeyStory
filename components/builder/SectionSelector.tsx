'use client';

import { Section } from '@/lib/types';
import { SECTION_TOGGLES } from '@/lib/builder-constants';
import { getSectionMetadata } from '@/lib/section-registry';
import { OccasionType } from '@/lib/occasion-registry';
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ============================================
// SECTION PREVIEW ILLUSTRATIONS
// ============================================

const SectionPreviewIllustration = ({ sectionId, isEnabled }: { sectionId: string; isEnabled: boolean }) => {
  const baseClasses = "w-full h-16 rounded-lg flex items-center justify-center transition-all duration-300";
  const enabledClasses = "bg-gradient-to-br from-rose-100 to-pink-100 shadow-inner";
  const disabledClasses = "bg-slate-100";
  
  const getIcon = () => {
    switch (sectionId) {
      case 'home':
        return (
          <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'gallery':
        return (
          <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'timeline':
        return (
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'song':
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      case 'love_letter':
        return (
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'our_story':
        return (
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
    }
  };

  return (
    <div className={`${baseClasses} ${isEnabled ? enabledClasses : disabledClasses}`}>
      {getIcon()}
    </div>
  );
};

// ============================================
// SORTABLE SECTION CARD
// ============================================

interface SortableSectionCardProps {
  section: Section;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

function SortableSectionCard({ section, isEnabled, onToggle }: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sectionInfo = SECTION_TOGGLES.find(t => t.id === section);
  const isRequired = sectionInfo?.required || false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white rounded-2xl border-2 overflow-hidden
        transition-all duration-200
        ${isDragging ? 'shadow-xl ring-2 ring-rose-400 z-50 opacity-90' : 'shadow-md hover:shadow-lg'}
        ${isEnabled 
          ? 'border-rose-300 bg-gradient-to-br from-white to-rose-50/30' 
          : 'border-slate-200 opacity-60 hover:opacity-80'
        }
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={`
          absolute top-3 left-3 cursor-grab active:cursor-grabbing
          p-2 rounded-lg transition-colors z-10
          ${isDragging ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500'}
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Enable/Disable Toggle */}
      <button
        type="button"
        onClick={() => !isRequired && onToggle(!isEnabled)}
        disabled={isRequired}
        className={`
          absolute top-3 right-3 z-10
          w-12 h-6 rounded-full transition-all duration-200
          ${isEnabled 
            ? 'bg-rose-500 shadow-inner' 
            : 'bg-slate-200'
          }
          ${isRequired ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        <div
          className={`
            w-5 h-5 rounded-full bg-white shadow-md
            transform transition-transform duration-200
            flex items-center justify-center
            ${isEnabled ? 'translate-x-6' : 'translate-x-0.5'}
          `}
        >
          {isEnabled && (
            <svg className="w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>

      {/* Preview Illustration */}
      <div className="pt-12 px-4 pb-3">
        <SectionPreviewIllustration sectionId={section} isEnabled={isEnabled} />
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{sectionInfo?.icon}</span>
          <h4 className={`font-semibold text-sm ${isEnabled ? 'text-slate-800' : 'text-slate-500'}`}>
            {sectionInfo?.label}
          </h4>
        </div>
        <p className={`text-xs leading-relaxed ${isEnabled ? 'text-slate-600' : 'text-slate-400'}`}>
          {sectionInfo?.description}
        </p>
        
        {isRequired && (
          <span className="inline-block mt-2 text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
            Required
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// LAYOUT PREVIEW COMPONENT
// ============================================

interface LayoutPreviewProps {
  sections: Section[];
}

function LayoutPreview({ sections }: LayoutPreviewProps) {
  const enabledSections = sections.filter(s => {
    const info = SECTION_TOGGLES.find(t => t.id === s);
    return info && !info.required;
  });

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
        <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Live Preview</span>
      </div>
      
      <div className="space-y-1">
        {sections.map((section, index) => {
          const info = SECTION_TOGGLES.find(t => t.id === section);
          const isRequired = info?.required;
          
          return (
            <div key={section} className="relative">
              {/* Connection Line */}
              {index > 0 && (
                <div className="absolute -top-3 left-4 w-0.5 h-3 bg-slate-600"></div>
              )}
              
              {/* Section Bar */}
              <div
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                  ${isRequired 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                  }
                `}
              >
                <span className="w-4 h-4 flex items-center justify-center text-[10px] bg-slate-800 rounded">
                  {index + 1}
                </span>
                <span className="text-lg">{info?.icon}</span>
                <span className="flex-1 truncate">{info?.label}</span>
                {isRequired && (
                  <span className="text-[10px] bg-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded">
                    Required
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {sections.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          No sections enabled
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN SECTION SELECTOR COMPONENT
// ============================================

type Props = {
  value: Section[];
  onChange: (sections: Section[]) => void;
  occasion?: OccasionType;
};

export default function SectionSelector({ value, onChange, occasion = 'couple' }: Props) {
  const [showAllSections, setShowAllSections] = useState(false);

  // Get all available sections by occasion
  const allSections = SECTION_TOGGLES
    .map((t) => t.id)
    .filter((section) => {
      const metadata = getSectionMetadata(section);
      return metadata?.supportedOccasions?.includes(occasion);
    });
  
  // Get currently enabled sections (with required sections first)
  const requiredSections = allSections.filter(id => {
    const info = SECTION_TOGGLES.find(t => t.id === id);
    return info?.required && (value.includes(id) || info.defaultEnabled);
  });
  
  const optionalSections = allSections.filter(id => {
    const info = SECTION_TOGGLES.find(t => t.id === id);
    return !info?.required;
  });

  // Get enabled optional sections from value
  const enabledOptionalSections = value.filter(s => 
    optionalSections.includes(s)
  );

  // Combine for display: required + enabled optional (in order)
  const displaySections = [
    ...requiredSections.filter(r => value.includes(r)),
    ...enabledOptionalSections
  ];

  // Setup dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = displaySections.indexOf(active.id as Section);
      const newIndex = displaySections.indexOf(over.id as Section);
      
      const newOrder = arrayMove(displaySections, oldIndex, newIndex);
      
      // Keep required sections at the top, only reorder optional ones
      const requiredInValue = requiredSections.filter(r => value.includes(r));
      const optionalInValue = newOrder.filter(s => !requiredSections.includes(s));
      
      onChange([...requiredInValue, ...optionalInValue]);
    }
  };

  const toggleSection = (section: Section, enabled: boolean) => {
    const sectionInfo = SECTION_TOGGLES.find(t => t.id === section);
    if (sectionInfo?.required) return;

    if (enabled) {
      // Add to end of optional sections
      onChange([...value, section]);
    } else {
      // Remove from value
      onChange(value.filter(s => s !== section));
    }
  };

  const isEnabled = (section: Section) => value.includes(section);

  const handleSelectPopular = () => {
    const popular = SECTION_TOGGLES
      .filter((t) => {
        const meta = getSectionMetadata(t.id);
        return t.defaultEnabled && meta?.supportedOccasions?.includes(occasion);
      })
      .map((t) => t.id);

    // Keep in-app valid sections only (matching current occasion)
    const sanitized = popular.filter((section) => allSections.includes(section));
    onChange(sanitized);
  };

  const handleSelectAll = () => {
    onChange(allSections);
  };

  const handleClearAll = () => {
    const required = SECTION_TOGGLES
      .filter(t => t.required)
      .map(t => t.id);
    onChange(required);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">4</span>
          <h3 className="text-lg font-bold text-slate-800">Page Layout</h3>
        </div>
        <span className="text-sm text-slate-500">
          {value.length} section{value.length !== 1 ? 's' : ''} active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Cards - Main Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSelectPopular}
              className="text-xs px-3 py-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors font-medium"
            >
              ✨ Popular
            </button>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium"
            >
              Clear Optional
            </button>
            <button
              type="button"
              onClick={() => setShowAllSections(!showAllSections)}
              className="text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors font-medium"
            >
              {showAllSections ? 'Show Less' : 'Show All Sections'}
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div className="bg-slate-50/50 rounded-2xl p-4 border-2 border-dashed border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Drag to reorder • Toggle to enable/disable
              </span>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={displaySections}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {displaySections.map((section) => (
                    <SortableSectionCard
                      key={section}
                      section={section}
                      isEnabled={isEnabled(section)}
                      onToggle={(enabled) => toggleSection(section, enabled)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {displaySections.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm">No sections enabled</p>
                <p className="text-xs mt-1">Click the buttons above to add sections</p>
              </div>
            )}
          </div>

          {/* Available Sections (when expanded) */}
          {showAllSections && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Available Sections</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {optionalSections.filter(s => !value.includes(s)).map((section) => {
                  const info = SECTION_TOGGLES.find(t => t.id === section);
                  return (
                    <button
                      key={section}
                      type="button"
                      onClick={() => toggleSection(section, true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 transition-all text-left"
                    >
                      <span className="text-base">{info?.icon}</span>
                      <span className="text-xs font-medium text-slate-600 truncate">{info?.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Layout Preview - Sidebar */}
        <div className="lg:sticky lg:top-6 h-fit">
          <LayoutPreview sections={value} />
          
          {/* Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips
            </h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Drag sections to change their order</li>
              <li>• Toggle the switch to enable/disable</li>
              <li>• Required sections cannot be disabled</li>
              <li>• The preview shows your page flow</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {value.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Please enable at least one section for your website
        </p>
      )}
    </div>
  );
}

