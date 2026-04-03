'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  SectionContentMap, 
  ReasonILoveYou, 
  FutureDream, 
  VideoMemory, 
  SpecialMoment,
  Milestone,
  LoveQuote,
  GiftItem,
  MemoryMapLocation
} from '@/lib/types';
import { searchPlaces, SearchResult, isValidCoordinates } from '@/lib/geocoding';

// ============================================
// TEXT INPUT COMPONENT
// ============================================

interface TextContentInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export function TextContentInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required,
  rows = 4 
}: TextContentInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all resize-none"
      />
    </div>
  );
}

// ============================================
// URL INPUT COMPONENT
// ============================================

interface UrlContentInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export function UrlContentInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required,
  helperText 
}: UrlContentInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
      />
      {helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
}

// ============================================
// REPEATER/LIST INPUT COMPONENT (Generic)
// ============================================

interface ListItem {
  id: string;
  [key: string]: any;
}

interface RepeaterInputProps {
  label: string;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  required?: boolean;
  renderItem: (item: ListItem, index: number, onUpdate: (updates: Partial<ListItem>) => void) => React.ReactNode;
  addButtonText?: string;
  emptyText?: string;
}

export function RepeaterInput({ 
  label, 
  items, 
  onChange, 
  required,
  renderItem,
  addButtonText = 'Add Item',
  emptyText = 'No items yet'
}: RepeaterInputProps) {
  const addItem = () => {
    const newItem: ListItem = { id: `new-${Date.now()}` };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<ListItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      
      {items.length === 0 ? (
        <p className="text-sm text-slate-400 italic mb-4">{emptyText}</p>
      ) : (
        <div className="space-y-4 mb-4">
          {items.map((item, index) => (
            <div key={item.id} className="relative bg-slate-50 rounded-xl p-4 border border-slate-200">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {renderItem(item, index, (updates) => updateItem(index, updates))}
            </div>
          ))}
        </div>
      )}
      
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {addButtonText}
      </button>
    </div>
  );
}

// ============================================
// SPECIFIC CONTENT INPUT COMPONENTS
// ============================================

// Reasons I Love You
interface ReasonsILoveYouInputProps {
  value?: SectionContentMap['reasons_love_you'];
  onChange: (value: SectionContentMap['reasons_love_you']) => void;
}

export function ReasonsILoveYouInput({ value, onChange }: ReasonsILoveYouInputProps) {
  const reasons = value?.reasons || [];

  const syncReasons = (items: any[]) =>
    onChange({
      reasons: items.map((item, index) => ({
        ...item,
        id: item.id || `reason-${index + 1}`,
        number: index + 1,
      })) as ReasonILoveYou[],
    });

  return (
    <RepeaterInput
      label="Reasons Why I Love You"
      items={reasons}
      onChange={syncReasons}
      required
      addButtonText="Add Reason"
      emptyText="Add reasons why you love your partner"
      renderItem={(item, index, onUpdate) => (
        <div className="space-y-3 pr-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm">
              {index + 1}
            </span>
            <input
              type="text"
              value={item.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Reason why you love them..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
            />
          </div>
        </div>
      )}
    />
  );
}

// Future Dreams
interface FutureDreamsInputProps {
  value?: SectionContentMap['future_dreams'];
  onChange: (value: SectionContentMap['future_dreams']) => void;
}

export function FutureDreamsInput({ value, onChange }: FutureDreamsInputProps) {
  const dreams = value?.dreams || [];

  return (
    <RepeaterInput
      label="Future Dreams"
      items={dreams}
      onChange={(items) => onChange({ dreams: items as FutureDream[] })}
      required
      addButtonText="Add Dream"
      emptyText="Share your dreams for the future"
      renderItem={(item, _, onUpdate) => (
        <div className="space-y-3 pr-6">
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Dream title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe this dream..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
          />
          <input
            type="text"
            value={item.targetYear || ''}
            onChange={(e) => onUpdate({ targetYear: e.target.value })}
            placeholder="Target year (optional)"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
        </div>
      )}
    />
  );
}

// Video Memories
interface VideoMemoriesInputProps {
  value?: SectionContentMap['video_memories'];
  onChange: (value: SectionContentMap['video_memories']) => void;
}

export function VideoMemoriesInput({ value, onChange }: VideoMemoriesInputProps) {
  const videos = value?.videos || [];

  return (
    <RepeaterInput
      label="Video Memories"
      items={videos}
      onChange={(items) => onChange({ videos: items as VideoMemory[] })}
      required
      addButtonText="Add Video"
      emptyText="Add your favorite video memories"
      renderItem={(item, _, onUpdate) => (
        <div className="space-y-3 pr-6">
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Video title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <input
            type="url"
            value={item.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="YouTube or Vimeo URL..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Description (optional)..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
          />
        </div>
      )}
    />
  );
}

// Special Moments
interface SpecialMomentsInputProps {
  value?: SectionContentMap['special_moments'];
  onChange: (value: SectionContentMap['special_moments']) => void;
}

export function SpecialMomentsInput({ value, onChange }: SpecialMomentsInputProps) {
  const moments = value?.moments || [];

  return (
    <RepeaterInput
      label="Special Moments"
      items={moments}
      onChange={(items) => onChange({ moments: items as SpecialMoment[] })}
      required={false}
      addButtonText="Add Moment"
      emptyText="Add special moments you've shared"
      renderItem={(item, _, onUpdate) => (
        <div className="space-y-3 pr-6">
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Moment title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <input
            type="date"
            value={item.date || ''}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe this moment..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
          />
        </div>
      )}
    />
  );
}

// Milestones
interface MilestonesInputProps {
  value?: SectionContentMap['milestones'];
  onChange: (value: SectionContentMap['milestones']) => void;
}

export function MilestonesInput({ value, onChange }: MilestonesInputProps) {
  const milestones = value?.milestones || [];

  return (
    <RepeaterInput
      label="Milestones"
      items={milestones}
      onChange={(items) => onChange({ milestones: items as Milestone[] })}
      required={false}
      addButtonText="Add Milestone"
      emptyText="Add relationship milestones"
      renderItem={(item, _, onUpdate) => (
        <div className="space-y-3 pr-6">
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Milestone title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <input
            type="date"
            value={item.date || ''}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe this milestone..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
          />
        </div>
      )}
    />
  );
}

// Playlist
interface PlaylistInputProps {
  value?: SectionContentMap['playlist'];
  onChange: (value: SectionContentMap['playlist']) => void;
}

export function PlaylistInput({ value, onChange }: PlaylistInputProps) {
  return (
    <div className="space-y-4">
      <UrlContentInput
        label="Playlist Link"
        value={value?.playlistUrl || ''}
        onChange={(playlistUrl) => onChange({ playlistUrl, title: value?.title || '' })}
        placeholder="Spotify or Apple Music playlist link..."
        required
        helperText="Paste a Spotify or Apple Music playlist link"
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Playlist Title (optional)
        </label>
        <input
          type="text"
          value={value?.title || ''}
          onChange={(e) => onChange({ playlistUrl: value?.playlistUrl || '', title: e.target.value })}
          placeholder="Our Love Playlist"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
        />
      </div>
    </div>
  );
}

// First Date
interface FirstDateInputProps {
  value?: SectionContentMap['first_date'];
  onChange: (value: SectionContentMap['first_date']) => void;
}

export function FirstDateInput({ value, onChange }: FirstDateInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={value?.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value, date: value?.date || '', location: value?.location || '', description: value?.description || '' })}
          placeholder="Our First Date"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={value?.date || ''}
            onChange={(e) => onChange({ ...value, title: value?.title || '', date: e.target.value, location: value?.location || '', description: value?.description || '' })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={value?.location || ''}
            onChange={(e) => onChange({ ...value, title: value?.title || '', date: value?.date || '', location: e.target.value, description: value?.description || '' })}
            placeholder="Where did you go?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          value={value?.description || ''}
          onChange={(e) => onChange({ ...value, title: value?.title || '', date: value?.date || '', location: value?.location || '', description: e.target.value })}
          placeholder="Tell the story of your first date..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all resize-none"
        />
      </div>
    </div>
  );
}

// Letter to Future
interface LetterToFutureInputProps {
  value?: SectionContentMap['letter_future'];
  onChange: (value: SectionContentMap['letter_future']) => void;
}

export function LetterToFutureInput({ value, onChange }: LetterToFutureInputProps) {
  return (
    <div className="space-y-4">
      <TextContentInput
        label="Letter to the Future"
        value={value?.letter || ''}
        onChange={(letter) => onChange({ letter, openDate: value?.openDate || '' })}
        placeholder="Write a heartfelt message to your future selves..."
        rows={6}
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          When should this letter be opened? (optional)
        </label>
        <input
          type="date"
          value={value?.openDate || ''}
          onChange={(e) => onChange({ letter: value?.letter || '', openDate: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
        />
      </div>
    </div>
  );
}

// Surprise Message
interface SurpriseMessageInputProps {
  value?: SectionContentMap['surprise_message'];
  onChange: (value: SectionContentMap['surprise_message']) => void;
}

export function SurpriseMessageInput({ value, onChange }: SurpriseMessageInputProps) {
  return (
    <div className="space-y-4">
      <TextContentInput
        label="Surprise Message"
        value={value?.message || ''}
        onChange={(message) => onChange({ message, hint: value?.hint || '' })}
        placeholder="Write a hidden surprise message for your partner..."
        rows={4}
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Hint (optional)
        </label>
        <input
          type="text"
          value={value?.hint || ''}
          onChange={(e) => onChange({ message: value?.message || '', hint: e.target.value })}
          placeholder="A clue to find the surprise..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
        />
      </div>
    </div>
  );
}

// Gift Section
interface GiftSectionInputProps {
  value?: SectionContentMap['gift_section'];
  onChange: (value: SectionContentMap['gift_section']) => void;
}

export function GiftSectionInput({ value, onChange }: GiftSectionInputProps) {
  const gifts = value?.gifts || [];

  return (
    <RepeaterInput
      label="Digital Gifts"
      items={gifts}
      onChange={(items) => onChange({ gifts: items as GiftItem[] })}
      required={false}
      addButtonText="Add Gift"
      emptyText="Add digital gifts for your partner"
      renderItem={(item, _, onUpdate) => (
        <div className="space-y-3 pr-6">
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Gift title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe this gift..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
          />
        </div>
      )}
    />
  );
}

// Love Quotes
interface QuotesInputProps {
  value?: SectionContentMap['quotes'];
  onChange: (value: SectionContentMap['quotes']) => void;
}

export function QuotesInput({ value, onChange }: QuotesInputProps) {
  const quotes = value?.quotes || [];

  return (
    <RepeaterInput
      label="Love Quotes"
      items={quotes}
      onChange={(items) => onChange({ quotes: items as LoveQuote[] })}
      required={false}
      addButtonText="Add Quote"
      emptyText="Add your favorite love quotes"
      renderItem={(item, _, onUpdate) => (
        <div className="space-y-3 pr-6">
          <textarea
            value={item.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Quote text..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
          />
          <input
            type="text"
            value={item.author || ''}
            onChange={(e) => onUpdate({ author: e.target.value })}
            placeholder="Author (optional)"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
        </div>
      )}
    />
  );
}

// Memory Map Location Input - Enhanced with search and manual modes
interface MemoryMapInputProps {
  value?: SectionContentMap['memory_map'];
  onChange: (value: SectionContentMap['memory_map']) => void;
}

interface MemoryMapLocationCardProps {
  item: MemoryMapLocation;
  onUpdate: (updates: Partial<MemoryMapLocation>) => void;
}

// Individual location card with search/manual toggle
function MemoryMapLocationCard({ item, onUpdate }: MemoryMapLocationCardProps) {
  const [inputMode, setInputMode] = useState<'search' | 'manual'>(
    // Default to search if no coordinates set yet, manual otherwise
    (item.lat && item.lng) ? 'manual' : 'search'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchPlaces(searchQuery);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (result: SearchResult) => {
    onUpdate({
      name: result.name,
      lat: result.lat,
      lng: result.lng,
      address: result.address,
    });
    setSearchQuery(result.name);
    setShowResults(false);
  };

  const hasValidCoords = isValidCoordinates(item.lat || 0, item.lng || 0);

  return (
    <div className="space-y-3">
      {/* Location Name */}
      <input
        type="text"
        value={item.name || ''}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="Location name (e.g., Paris, Eiffel Tower)"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
      />

      {/* Input Mode Toggle */}
      <div className="flex rounded-lg border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setInputMode('search')}
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            inputMode === 'search'
              ? 'bg-rose-500 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          🔍 Search Place
        </button>
        <button
          type="button"
          onClick={() => setInputMode('manual')}
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            inputMode === 'manual'
              ? 'bg-rose-500 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          📍 Enter Coordinates
        </button>
      </div>

      {/* Search Mode */}
      {inputMode === 'search' && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search for a city, landmark, or address..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          
          {/* Search Status */}
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.placeId}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 border-b border-slate-100 last:border-b-0 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-700">{result.name}</p>
                  <p className="text-xs text-slate-500 truncate">{result.displayName}</p>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3">
              <p className="text-sm text-slate-500">No places found. Try a different search.</p>
            </div>
          )}

          {/* Helper Text */}
          {hasValidCoords && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Location selected: {item.lat?.toFixed(4)}, {item.lng?.toFixed(4)}
            </p>
          )}
        </div>
      )}

      {/* Manual Mode */}
      {inputMode === 'manual' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={item.lat || ''}
                onChange={(e) => {
                  const lat = parseFloat(e.target.value);
                  onUpdate({ lat: isNaN(lat) ? 0 : lat });
                }}
                placeholder="e.g., 48.8566"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={item.lng || ''}
                onChange={(e) => {
                  const lng = parseFloat(e.target.value);
                  onUpdate({ lng: isNaN(lng) ? 0 : lng });
                }}
                placeholder="e.g., 2.3522"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400">
            💡 Tip: On Google Maps, right-click a location and copy the coordinates
          </p>
        </div>
      )}

      {/* Selected Address Display */}
      {item.address && (
        <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
          📍 {item.address}
        </p>
      )}

      {/* Description */}
      <textarea
        value={item.description || ''}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Memory at this place..."
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
      />

      {/* Date */}
      <input
        type="date"
        value={item.date || ''}
        onChange={(e) => onUpdate({ date: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
      />
    </div>
  );
}

// Memory Map Input - Main Component
export function MemoryMapInput({ value, onChange }: MemoryMapInputProps) {
  const locations = value?.locations || [];

  return (
    <RepeaterInput
      label="Memory Locations"
      items={locations}
      onChange={(items) => onChange({ locations: items as MemoryMapLocation[] })}
      required={false}
      addButtonText="Add Location"
      emptyText="Add places you've visited together with coordinates"
      renderItem={(item, _, onUpdate) => (
        <MemoryMapLocationCard 
          item={item as MemoryMapLocation} 
          onUpdate={onUpdate as (updates: Partial<MemoryMapLocation>) => void} 
        />
      )}
    />
  );
}

// Guest Messages (Config only - informational)
interface GuestMessagesInputProps {
  value?: SectionContentMap['guest_messages'];
  onChange?: (value: SectionContentMap['guest_messages']) => void;
}

export function GuestMessagesInput({ value, onChange }: GuestMessagesInputProps) {
  // This is informational only - no editing needed
  return (
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm text-blue-700 font-medium">Guest Messages</p>
          <p className="text-xs text-blue-600 mt-1">
            This feature allows friends and family to leave messages for you. 
            Messages will be collected and displayed on your website.
          </p>
        </div>
      </div>
    </div>
  );
}

