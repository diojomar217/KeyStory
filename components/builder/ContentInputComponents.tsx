"use client";

import { useState, useCallback, useEffect } from "react";
import {
  SectionContentMap,
  ReasonILoveYou,
  FutureDream,
  VideoMemory,
  SpecialMoment,
  Milestone,
  LoveQuote,
  GiftItem,
  SectionAsset,
  MemoryMapLocation,
} from "@/lib/types";
import {
  searchPlaces,
  SearchResult,
  isValidCoordinates,
  reverseGeocode,
} from "@/lib/geocoding";

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
  rows = 4,
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
  helperText,
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
      {helperText && (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      )}
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
  renderItem: (
    item: ListItem,
    index: number,
    onUpdate: (updates: Partial<ListItem>) => void,
  ) => React.ReactNode;
  addButtonText?: string;
  emptyText?: string;
}

export function RepeaterInput({
  label,
  items,
  onChange,
  required,
  renderItem,
  addButtonText = "Add Item",
  emptyText = "No items yet",
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
            <div
              key={item.id}
              className="relative bg-slate-50 rounded-xl p-4 border border-slate-200"
            >
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
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
  value?: SectionContentMap["reasons_love_you"];
  onChange: (value: SectionContentMap["reasons_love_you"]) => void;
}

export function ReasonsILoveYouInput({
  value,
  onChange,
}: ReasonsILoveYouInputProps) {
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
              value={item.text || ""}
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
  value?: SectionContentMap["future_dreams"];
  onChange: (value: SectionContentMap["future_dreams"]) => void;
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
            value={item.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Dream title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe this dream..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
          />
          <input
            type="text"
            value={item.targetYear || ""}
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
  value?: SectionContentMap["video_memories"];
  onChange: (value: SectionContentMap["video_memories"]) => void;
}

export function VideoMemoriesInput({
  value,
  onChange,
}: VideoMemoriesInputProps) {
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
            value={item.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Video title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <input
            type="url"
            value={item.url || ""}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="YouTube or Vimeo URL..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ""}
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
  value?: SectionContentMap["special_moments"];
  onChange: (value: SectionContentMap["special_moments"]) => void;
}

export function SpecialMomentsInput({
  value,
  onChange,
}: SpecialMomentsInputProps) {
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
            value={item.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Moment title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <input
            type="date"
            value={item.date || ""}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ""}
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
  value?: SectionContentMap["milestones"];
  onChange: (value: SectionContentMap["milestones"]) => void;
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
            value={item.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Milestone title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <input
            type="date"
            value={item.date || ""}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ""}
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
  value?: SectionContentMap["playlist"];
  onChange: (value: SectionContentMap["playlist"]) => void;
}

export function PlaylistInput({ value, onChange }: PlaylistInputProps) {
  return (
    <div className="space-y-4">
      <UrlContentInput
        label="Playlist Link"
        value={value?.playlistUrl || ""}
        onChange={(playlistUrl) =>
          onChange({ playlistUrl, title: value?.title || "" })
        }
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
          value={value?.title || ""}
          onChange={(e) =>
            onChange({
              playlistUrl: value?.playlistUrl || "",
              title: e.target.value,
            })
          }
          placeholder="Our Love Playlist"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
        />
      </div>
      <label className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-600">
          Auto-play music when site loads
        </span>
        <input
          type="checkbox"
          checked={Boolean((value as any)?.song_autoplay)}
          onChange={(e) =>
            onChange({
              playlistUrl: value?.playlistUrl || "",
              title: value?.title || "",
              song_autoplay: e.target.checked,
            })
          }
          className="h-4 w-4 text-rose-500 rounded"
        />
      </label>
    </div>
  );
}

// First Date
interface FirstDateInputProps {
  value?: SectionContentMap["first_date"];
  onChange: (value: SectionContentMap["first_date"]) => void;
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
          value={value?.title || ""}
          onChange={(e) =>
            onChange({
              ...value,
              title: e.target.value,
              date: value?.date || "",
              location: value?.location || "",
              description: value?.description || "",
            })
          }
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
            value={value?.date || ""}
            onChange={(e) =>
              onChange({
                ...value,
                title: value?.title || "",
                date: e.target.value,
                location: value?.location || "",
                description: value?.description || "",
              })
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={value?.location || ""}
            onChange={(e) =>
              onChange({
                ...value,
                title: value?.title || "",
                date: value?.date || "",
                location: e.target.value,
                description: value?.description || "",
              })
            }
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
          value={value?.description || ""}
          onChange={(e) =>
            onChange({
              ...value,
              title: value?.title || "",
              date: value?.date || "",
              location: value?.location || "",
              description: e.target.value,
            })
          }
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
  value?: SectionContentMap["letter_future"];
  onChange: (value: SectionContentMap["letter_future"]) => void;
}

export function LetterToFutureInput({
  value,
  onChange,
}: LetterToFutureInputProps) {
  return (
    <div className="space-y-4">
      <TextContentInput
        label="Letter to the Future"
        value={value?.letter || ""}
        onChange={(letter) =>
          onChange({ letter, openDate: value?.openDate || "" })
        }
        placeholder="Write a heartfelt message to your future selves..."
        rows={6}
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          When should this letter be opened? (optional)
        </label>
        <input
          type="date"
          value={value?.openDate || ""}
          onChange={(e) =>
            onChange({ letter: value?.letter || "", openDate: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
        />
      </div>
    </div>
  );
}

// Surprise Message
interface SurpriseMessageInputProps {
  value?: SectionContentMap["surprise_message"];
  onChange: (value: SectionContentMap["surprise_message"]) => void;
}

export function SurpriseMessageInput({
  value,
  onChange,
}: SurpriseMessageInputProps) {
  return (
    <div className="space-y-4">
      <TextContentInput
        label="Surprise Message"
        value={value?.message || ""}
        onChange={(message) => onChange({ message, hint: value?.hint || "" })}
        placeholder="Write a hidden surprise message for your partner..."
        rows={4}
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Hint (optional)
        </label>
        <input
          type="text"
          value={value?.hint || ""}
          onChange={(e) =>
            onChange({ message: value?.message || "", hint: e.target.value })
          }
          placeholder="A clue to find the surprise..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
        />
      </div>
    </div>
  );
}

// Gift Section
interface GiftSectionInputProps {
  value?: SectionContentMap["gift_section"];
  onChange: (value: SectionContentMap["gift_section"]) => void;
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
            value={item.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Gift title..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <textarea
            value={item.description || ""}
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
  value?: SectionContentMap["quotes"];
  onChange: (value: SectionContentMap["quotes"]) => void;
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
            value={item.text || ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Quote text..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
          />
          <input
            type="text"
            value={item.author || ""}
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
  value?: SectionContentMap["memory_map"];
  onChange: (value: SectionContentMap["memory_map"]) => void;
}

interface MemoryMapLocationCardProps {
  item: MemoryMapLocation;
  onUpdate: (updates: Partial<MemoryMapLocation>) => void;
}

// Individual location card with search/manual toggle
function MemoryMapLocationCard({ item, onUpdate }: MemoryMapLocationCardProps) {
  const [inputMode, setInputMode] = useState<"search" | "manual">(
    // Default to search if no coordinates set yet, manual otherwise
    item.lat && item.lng ? "manual" : "search",
  );
  const [searchQuery, setSearchQuery] = useState("");
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
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // When the user enters manual coordinates, attempt a reverse lookup
  useEffect(() => {
    if (inputMode !== "manual") return;
    const lat = item.lat || 0;
    const lng = item.lng || 0;
    if (!isValidCoordinates(lat, lng)) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await reverseGeocode(lat, lng);
        if (res) {
          onUpdate({
            address: res.address,
          });
        }
      } catch (err) {
        // ignore reverse errors
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inputMode, item.lat, item.lng]);

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

  const getDisplayLocationLabel = () => {
    const name = item.name?.trim();
    const addr = item.address?.trim();

    // Prefer POI-like names (church, parish, cathedral, chapel, basilica, shrine)
    const poiRe =
      /(church|parish|cathedral|chapel|basilica|shrine|mosque|temple|san |santo |sta |st\.|san\s)/i;
    if (name && poiRe.test(name)) return name;

    // If name exists and is meaningfully different from address, show name first
    if (name && addr && name.toLowerCase() !== addr.toLowerCase())
      return `${name}${addr ? ` • ${addr}` : ""}`;

    // Fallback to address or coordinates
    if (addr) return addr;
    if (hasValidCoords)
      return `${(item.lat || 0).toFixed(4)}, ${(item.lng || 0).toFixed(4)}`;
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Location Name */}
      <input
        type="text"
        value={item.name || ""}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="Location name (e.g., Paris, Eiffel Tower)"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
      />

      {/* Input Mode Toggle */}
      <div className="flex rounded-lg border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setInputMode("search")}
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            inputMode === "search"
              ? "bg-rose-500 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          🔍 Search Place
        </button>
        <button
          type="button"
          onClick={() => setInputMode("manual")}
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            inputMode === "manual"
              ? "bg-rose-500 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          📍 Enter Coordinates
        </button>
      </div>

      {/* Search Mode */}
      {inputMode === "search" && (
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
                  <p className="text-sm font-medium text-slate-700">
                    {result.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {result.displayName}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults &&
            searchQuery.length >= 2 &&
            !isSearching &&
            searchResults.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                <p className="text-sm text-slate-500">
                  No places found. Try a different search.
                </p>
              </div>
            )}

          {/* Helper Text */}
          {hasValidCoords && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Location selected: {item.lat?.toFixed(4)},{" "}
              {item.lng?.toFixed(4)}
            </p>
          )}
        </div>
      )}

      {/* Manual Mode */}
      {inputMode === "manual" && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={item.lat || ""}
                onChange={(e) => {
                  const lat = parseFloat(e.target.value);
                  onUpdate({ lat: isNaN(lat) ? 0 : lat });
                }}
                placeholder="e.g., 48.8566"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={item.lng || ""}
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
            💡 Tip: On Google Maps, right-click a location and copy the
            coordinates
          </p>
        </div>
      )}

      {/* Selected Address Display */}
      {(() => {
        const label = getDisplayLocationLabel();
        return label ? (
          <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            📍 {label}
          </p>
        ) : null;
      })()}

      {/* Description */}
      <textarea
        value={item.description || ""}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Memory at this place..."
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm resize-none"
      />

      {/* Google Maps Link (optional) */}
      <input
        type="url"
        value={(item as any).googleMapsUrl || ""}
        onChange={(e) => onUpdate({ googleMapsUrl: e.target.value })}
        placeholder="Paste Google Maps link (optional)"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
      />

      {/* Date */}
      <input
        type="date"
        value={item.date || ""}
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
      onChange={(items) =>
        onChange({ locations: items as MemoryMapLocation[] })
      }
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

// Image uploader for an event location (uploads to Cloudinary via server API)
function EventLocationImageUploader({
  item,
  onUpdate,
}: {
  item: MemoryMapLocation;
  onUpdate: (updates: Partial<MemoryMapLocation>) => void;
}) {
  const [preview, setPreview] = useState<string | null>(item.imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(item.imageUrl || null);
  }, [item.imageUrl]);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/uploads/cloudinary", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Upload failed");
      }

      onUpdate({ imageUrl: data.url });
      // keep preview pointing to uploaded URL
      setPreview(data.url);
    } catch (err: any) {
      console.error("Upload error", err);
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      // revoke local object URL after a short delay to avoid flicker
      setTimeout(() => {
        try {
          if (preview && preview.startsWith("blob:"))
            URL.revokeObjectURL(preview);
        } catch (e) {
          /* ignore */
        }
      }, 2000);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    handleFile(f);
  };

  const handleRemove = () => {
    onUpdate({ imageUrl: "" });
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={item.name || "preview"}
            className="w-full h-36 object-cover rounded-lg"
          />
          <div className="flex items-center gap-2 mt-2">
            <label className="inline-flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 cursor-pointer">
              Replace
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="sr-only"
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm"
            >
              Remove
            </button>
            {uploading && (
              <span className="text-xs text-slate-500">Uploading…</span>
            )}
          </div>
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
      ) : (
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            Upload Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full"
          />
          {uploading && <p className="text-xs text-slate-500">Uploading…</p>}
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
}

// Event Locations Input - for sections like baptism event_details
interface EventLocationsInputProps {
  value?: SectionContentMap["event_details"];
  onChange: (value: SectionContentMap["event_details"]) => void;
}

export function EventLocationsInput({
  value,
  onChange,
}: EventLocationsInputProps) {
  const locations = value?.locations || [];

  const update = (patch: Record<string, any>) => {
    onChange({ ...(value || {}), ...patch });
  };

  return (
    <div className="space-y-4">
      <RepeaterInput
        label="Event Locations"
        items={locations}
        onChange={(items) => update({ locations: items as MemoryMapLocation[] })}
        required={false}
        addButtonText="Add Location"
        emptyText="Add ceremony / reception locations"
        renderItem={(item, _, onUpdate) => (
          <div className="space-y-3 pr-6">
            <MemoryMapLocationCard
              item={item as MemoryMapLocation}
              onUpdate={onUpdate as (updates: Partial<MemoryMapLocation>) => void}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Time (optional)</label>
                <input
                  type="time"
                  value={item.time || ""}
                  onChange={(e) => onUpdate({ time: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
                />
              </div>
              <div>
                <EventLocationImageUploader
                  item={item as MemoryMapLocation}
                  onUpdate={
                    onUpdate as (updates: Partial<MemoryMapLocation>) => void
                  }
                />
              </div>
            </div>
          </div>
        )}
      />

      {/* Attire / Dress Code inputs - merge with existing event_details without overwriting locations */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Attire Guide / Dress Code</h4>
        <TextContentInput
          label="Dress Code / Attire"
          value={(value as any)?.dressCode || ""}
          onChange={(v) => update({ dressCode: v })}
          placeholder="e.g., Casual clothes in neutral or pastel colors"
        />

        <TextContentInput
          label="Godparent Attire (optional)"
          value={(value as any)?.godparentAttire || ""}
          onChange={(v) => update({ godparentAttire: v })}
          placeholder="e.g., Godparents are encouraged to wear white or cream"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Theme Colors (optional)</label>
          <input
            type="text"
            value={Array.isArray((value as any)?.themeColors) ? (value as any).themeColors.join(', ') : ((value as any)?.themeColors || '')}
            onChange={(e) => {
              const raw = e.target.value || '';
              const arr = raw.split(',').map(s => s.trim()).filter(Boolean);
              update({ themeColors: arr });
            }}
            placeholder="e.g., White, Cream, Blush Pink"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <p className="text-xs text-slate-400 mt-1">Optional comma-separated color names for suggestion chips on the site.</p>
        </div>
      </div>
    </div>
  );
}

// Invitation Input for Baptism
interface InvitationInputProps {
  value?: SectionContentMap["invitation"];
  onChange: (value: SectionContentMap["invitation"]) => void;
}

export function InvitationInput({ value, onChange }: InvitationInputProps) {
  const greeting = value?.greeting || "";
  const intro = value?.intro || "";
  const body = value?.body || value?.invitationMessage || "";
  const supportMessage = value?.supportMessage || "";
  const closingText = value?.closingText || "";
  const signoff = value?.signoff || "";
  const signedBy = value?.signedBy || "";
  const godparentMessage = value?.godparentMessage || "";

  const update = (patch: Record<string, any>) =>
    onChange({ ...(value || {}), ...patch });

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Greeting (optional)
          </label>
          <input
            type="text"
            value={greeting}
            onChange={(e) => update({ greeting: e.target.value })}
            placeholder="e.g., Dear family and friends"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Sign-off (optional)
          </label>
          <input
            type="text"
            value={signoff}
            onChange={(e) => update({ signoff: e.target.value })}
            placeholder="e.g., With love"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      <TextContentInput
        label="Intro (short)"
        value={intro}
        onChange={(v) => update({ intro: v })}
        rows={3}
      />

      <TextContentInput
        label="Main Invitation Text"
        value={body}
        onChange={(v) => update({ body: v, invitationMessage: v })}
        rows={6}
      />

      <TextContentInput
        label="Support Message / Godparent Note (optional)"
        value={supportMessage || godparentMessage}
        onChange={(v) => update({ supportMessage: v, godparentMessage: v })}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Closing Text (optional)
          </label>
          <input
            type="text"
            value={closingText}
            onChange={(e) => update({ closingText: e.target.value })}
            placeholder="e.g., Looking forward to celebrating together"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Signed By (optional)
          </label>
          <input
            type="text"
            value={signedBy}
            onChange={(e) => update({ signedBy: e.target.value })}
            placeholder="e.g., Parent names"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

// Schedule Input for Baptism
interface ScheduleInputProps {
  value?: SectionContentMap["schedule"];
  onChange: (value: SectionContentMap["schedule"]) => void;
}

export function ScheduleInput({ value, onChange }: ScheduleInputProps) {
  const items = value?.schedule || [];

  return (
    <RepeaterInput
      label="Event Schedule"
      items={items.map((it: any, idx: number) => ({
        id: it.id || `s-${idx}`,
        title: it.title || "",
        time: it.time || "",
      }))}
      onChange={(items) =>
        onChange({
          schedule: items.map((it: any) => ({
            title: it.title || "",
            time: it.time || "",
          })),
        })
      }
      addButtonText="Add schedule item"
      emptyText="Add schedule items (e.g., Ceremony, Reception)"
      renderItem={(item, _, onUpdate) => (
        <div className="space-y-2">
          <input
            type="text"
            value={item.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Title (e.g., Ceremony)"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
          <input
            type="time"
            value={item.time || ""}
            onChange={(e) => onUpdate({ time: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
          />
        </div>
      )}
    />
  );
}

// Dress Code Input for Baptism
interface DressCodeInputProps {
  value?: SectionContentMap["dress_code"];
  onChange: (value: SectionContentMap["dress_code"]) => void;
}

export function DressCodeInput({ value, onChange }: DressCodeInputProps) {
  const dressCode = value?.dressCode || "";
  const themeColor = value?.themeColor || "#ffffff";

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
      <TextContentInput
        label="Dress Code"
        value={dressCode}
        onChange={(v) => onChange({ ...(value || {}), dressCode: v })}
        placeholder="e.g., Smart casual, Pastel attire"
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Theme Accent Color
        </label>
        <input
          type="color"
          value={themeColor}
          onChange={(e) =>
            onChange({ ...(value || {}), themeColor: e.target.value })
          }
          className="w-16 h-10 p-0 border-0"
        />
        <p className="text-xs text-slate-400 mt-1">
          Optional color swatch to show alongside dress code.
        </p>
      </div>
    </div>
  );
}

// Map Input for Baptism
interface MapInputProps {
  value?: SectionContentMap["map_section"];
  onChange: (value: SectionContentMap["map_section"]) => void;
}

export function MapInput({ value, onChange }: MapInputProps) {
  const mapLink = value?.mapLink || "";

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
      <UrlContentInput
        label="Google Maps Link or Embed URL"
        value={mapLink}
        onChange={(v) => onChange({ ...(value || {}), mapLink: v })}
        placeholder="https://www.google.com/maps/place/..."
        helperText="If you paste an embed URL the map will be embedded on the page."
      />
    </div>
  );
}

// Safety Protocol Input
interface SafetyProtocolInputProps {
  value?: SectionContentMap["safety_protocol"];
  onChange: (value: SectionContentMap["safety_protocol"]) => void;
}

export function SafetyProtocolInput({
  value,
  onChange,
}: SafetyProtocolInputProps) {
  const content = value?.content || "";
  const contactName = value?.contactName || "";
  const contactPhone = value?.contactPhone || "";
  const pdfUrl = value?.pdfUrl || "";
  const items = (value as any)?.items || [];

  const update = (patch: Record<string, any>) => {
    onChange({ ...(value || {}), ...patch });
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
      <TextContentInput
        label="Safety Details"
        value={content}
        onChange={(v) => update({ content: v })}
        rows={5}
      />

      <UrlContentInput
        label="Safety PDF URL"
        value={pdfUrl}
        onChange={(v) => update({ pdfUrl: v })}
        placeholder="/safety.pdf"
      />

      <RepeaterInput
        label="Safety Items"
        items={items}
        onChange={(itemsArr) => update({ items: itemsArr })}
        addButtonText="Add Item"
        emptyText="Add safety items"
        renderItem={(item, _, onUpdate) => (
          <div className="space-y-3">
            <input
              type="text"
              value={item.title || ""}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Item title"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />

            <textarea
              value={item.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Description"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
        )}
      />
    </div>
  );
}

// Simple image uploader reused for safety items
function SafetyItemImageUploader({
  item,
  onUpdate,
}: {
  item: any;
  onUpdate: (updates: Partial<any>) => void;
}) {
  const [preview, setPreview] = useState<string | null>(item.imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(item.imageUrl || null);
  }, [item.imageUrl]);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/uploads/cloudinary", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Upload failed");
      }

      onUpdate({ imageUrl: data.url });
      setPreview(data.url);
    } catch (err: any) {
      console.error("Upload error", err);
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => {
        try {
          if (preview && preview.startsWith("blob:"))
            URL.revokeObjectURL(preview);
        } catch (e) {
          /* ignore */
        }
      }, 2000);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    handleFile(f);
  };

  const handleRemove = () => {
    onUpdate({ imageUrl: "" });
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={(item as any).title || "preview"}
            className="w-full h-36 object-cover rounded-lg"
          />
          <div className="flex items-center gap-2 mt-2">
            <label className="inline-flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 cursor-pointer">
              Replace
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="sr-only"
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm"
            >
              Remove
            </button>
            {uploading && (
              <span className="text-xs text-slate-500">Uploading…</span>
            )}
          </div>
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
      ) : (
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            Upload Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full"
          />
          {uploading && <p className="text-xs text-slate-500">Uploading…</p>}
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
}

// Section assets input - reusable per-section asset uploader
export function SectionAssetsInput({
  sectionKey,
  value,
  onChange,
}: {
  sectionKey: string;
  value?: SectionAsset;
  onChange: (assets: Partial<SectionAsset>) => void;
}) {
  const [preview, setPreview] = useState<Record<string, string | undefined>>((value as any) || {});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [enabled, setEnabled] = useState<boolean>(Boolean((value as any)?.enabled));

  useEffect(() => {
    setPreview((value as any) || {});
    setEnabled(Boolean((value as any)?.enabled));
  }, [value]);

  const uploadField = async (field: keyof SectionAsset, file?: File | null) => {
    if (!file) return;
    setErrors((p) => ({ ...p, [field]: undefined }));
    const objectUrl = URL.createObjectURL(file);
    setPreview((p) => ({ ...p, [field]: objectUrl }));
    setUploading((p) => ({ ...p, [field]: true }));
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/uploads/cloudinary', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Upload failed');

      setPreview((p) => ({ ...p, [field]: data.url }));
      onChange({ [field]: data.url } as Partial<SectionAsset>);
    } catch (err: any) {
      console.error('Upload error', err);
      setErrors((p) => ({ ...p, [field]: err?.message || 'Upload failed' }));
    } finally {
      setUploading((p) => ({ ...p, [field]: false }));
      setTimeout(() => {
        try {
          if (objectUrl && objectUrl.startsWith('blob:')) URL.revokeObjectURL(objectUrl);
        } catch (e) {
          /* ignore */
        }
      }, 2000);
    }
  };

  const onFileChange = (field: keyof SectionAsset, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    uploadField(field, f);
  };

  const handleRemove = (field: keyof SectionAsset) => {
    onChange({ [field]: '' } as Partial<SectionAsset>);
    setPreview((p) => ({ ...p, [field]: undefined }));
  };

  const fields: Array<keyof SectionAsset> = ['backgroundImage', 'leftImage', 'rightImage', 'topImage', 'bottomImage'];

  const labelFor = (f: keyof SectionAsset) => {
    switch (f) {
      case 'backgroundImage':
        return 'Background Image';
      case 'leftImage':
        return 'Left Image';
      case 'rightImage':
        return 'Right Image';
      case 'topImage':
        return 'Top Image';
      case 'bottomImage':
        return 'Bottom Image';
      default:
        return String(f);
    }
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700">Section Assets</h4>
        <label className="inline-flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setEnabled(val);
              onChange({ ...(value || {}), enabled: val } as Partial<SectionAsset>);
            }}
          />
          <span className="text-xs">Enable Section Decorations</span>
        </label>
      </div>

      {!enabled ? (
        <div className="mt-3 text-xs text-slate-500">Decorations are disabled. Existing images are preserved but hidden on the public site.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {fields.map((field) => (
            <div key={String(field)}>
              <label className="block text-xs text-slate-500 mb-1">{labelFor(field)}</label>
              {preview[field] ? (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview[field]} alt={String(field)} className="w-full h-28 object-cover rounded-lg" />
                  <div className="flex gap-2 mt-2">
                    <label className="inline-flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 cursor-pointer">
                      Replace
                      <input type="file" accept="image/*" onChange={(e) => onFileChange(field, e)} className="sr-only" />
                    </label>
                    <button type="button" onClick={() => handleRemove(field)} className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm">Remove</button>
                    {uploading[field] && <span className="text-xs text-slate-500">Uploading…</span>}
                  </div>
                  {errors[field] && <p className="text-xs text-rose-500 mt-1">{errors[field]}</p>}
                </div>
              ) : (
                <div>
                  <input type="file" accept="image/*" onChange={(e) => onFileChange(field, e)} className="w-full" />
                  {uploading[field] && <p className="text-xs text-slate-500">Uploading…</p>}
                  {errors[field] && <p className="text-xs text-rose-500 mt-1">{errors[field]}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Closing Input for Baptism
interface ClosingInputProps {
  value?: SectionContentMap["closing"];
  onChange: (value: SectionContentMap["closing"]) => void;
}

export function ClosingInput({ value, onChange }: ClosingInputProps) {
  const title = value?.title ?? "Thank You";
  const closingMessage = value?.closingMessage || "";
  const parentNames = value?.parentNames || "";
  const finalLine = value?.finalLine || "";

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange({ ...(value || {}), title: e.target.value })}
          placeholder="Thank You"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
        />
      </div>

      <TextContentInput
        label="Closing Message"
        value={closingMessage}
        onChange={(v) => onChange({ ...(value || {}), closingMessage: v })}
        rows={4}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Parent(s) Names</label>
        <input
          type="text"
          value={parentNames}
          onChange={(e) => onChange({ ...(value || {}), parentNames: e.target.value })}
          placeholder="Jen & Adrian"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Final Line (optional)</label>
        <input
          type="text"
          value={finalLine}
          onChange={(e) => onChange({ ...(value || {}), finalLine: e.target.value })}
          placeholder="See you on Anya’s special day ✨"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm"
        />
        <p className="mt-1 text-xs text-slate-400">Optional short closing line shown below the signature.</p>
      </div>
    </div>
  );
}

// RSVP Input (toggle)
interface RSVPInputProps {
  value?: SectionContentMap["rsvp"];
  onChange: (value: SectionContentMap["rsvp"]) => void;
}

export function RSVPInput({ value, onChange }: RSVPInputProps) {
  const enabled = value?.enabled ?? true;

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) =>
            onChange({ ...(value || {}), enabled: e.target.checked })
          }
        />
        <span className="text-sm">Enable RSVP form</span>
      </label>
    </div>
  );
}

// Guest Messages (Config only - informational)
interface GuestMessagesInputProps {
  value?: SectionContentMap["guest_messages"];
  onChange?: (value: SectionContentMap["guest_messages"]) => void;
}

export function GuestMessagesInput({
  value,
  onChange,
}: GuestMessagesInputProps) {
  // This is informational only - no editing needed
  return (
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-blue-500 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
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
