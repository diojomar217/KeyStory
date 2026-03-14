'use client';

import { SiteConfig, Theme, OccasionType } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

// ============================================
// THEME STYLES - Theme-specific styling
// ============================================

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  border: string;
  muted: string;
};

const getThemeColors = (theme: Theme): ThemeColors => {
  const preset = THEME_PRESETS[theme] || THEME_PRESETS.romantic_classic;
  return {
    primary: preset.colors.primary,
    secondary: preset.colors.secondary,
    accent: preset.colors.accent,
    background: preset.colors.background,
    text: preset.colors.text,
    card: preset.colors.card,
    border: preset.colors.border,
    muted: preset.colors.text + '99',
  };
};

// ============================================
// HOME SECTION PREVIEW
// ============================================

interface HomeSectionPreviewProps {
  theme: Theme;
  siteType?: OccasionType;
  customerName: string;
  partnerName: string;
  tagline?: string;
  message?: string;
  specialDate?: string;
  anniversary_date?: string;
  hasCoverPhoto: boolean;
}

export function HomeSectionPreview({
  theme,
  siteType = 'couple',
  customerName,
  partnerName,
  tagline,
  message,
  specialDate,
  anniversary_date,
  hasCoverPhoto,
}: HomeSectionPreviewProps) {
  const colors = getThemeColors(theme);

  // Proper empty state helpers matching BuilderPreview
  const nameData = customerName?.trim() && partnerName?.trim() 
    ? { hasContent: true, primary: `${customerName} & ${partnerName}` }
    : { hasContent: false, primary: 'Add your names' };

  const taglineData = tagline?.trim() 
    ? { hasContent: true, text: tagline } 
    : { hasContent: false, text: 'Your tagline will appear here' };

  const isBirthday = siteType === 'birthday';

  const dateString = specialDate || anniversary_date;
  const anniversaryData = dateString
    ? { hasContent: true, text: new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
    : { hasContent: false, text: isBirthday ? 'Add your birthday date' : 'Add your special date' };

  const messageData = message?.trim() 
    ? { hasContent: true, text: message }
    : { hasContent: false, text: isBirthday ? 'Your birthday message will appear here' : 'Your love message will appear here' };

  const heroTitle = isBirthday && customerName?.trim()
    ? `${customerName}'s Birthday`
    : isBirthday
      ? 'Birthday Celebration'
      : nameData.primary;

  const heroTagline = taglineData.hasContent ? taglineData.text : '';
  const dateLabel = isBirthday ? '🎂 Birthday' : '💍 Since';

  return (
    <div 
      className="relative rounded-xl overflow-hidden border border-dashed"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.muted.replace('99', '50'),
        opacity: nameData.hasContent || taglineData.hasContent ? 1 : 0.7
      }}
    >
      {/* Hero Area */}
      <div 
        className="h-24 flex flex-col items-center justify-center text-center px-4 py-2"
        style={{ 
          background: hasCoverPhoto 
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('/placeholder-cover.jpg')`
            : `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`
        }}
      >
        <div className="flex gap-2 mb-2 opacity-80">
          <span style={{ color: colors.primary, opacity: 0.8 }}>💕</span>
        </div>
        
        <h2 
          className={`text-sm font-bold leading-tight line-clamp-1 mb-1 transition-opacity ${(nameData.hasContent || isBirthday) ? '' : 'italic'}`}
          style={{ 
            color: colors.text,
            opacity: (nameData.hasContent || isBirthday) ? 1 : 0.5
          }}
        >
          {heroTitle}
        </h2>
        
        <p 
          className={`text-xs leading-tight line-clamp-1 px-1 transition-all ${heroTagline ? 'font-normal' : 'italic'}`}
          style={{ 
            color: colors.muted,
            opacity: heroTagline ? 1 : 0.6,
            fontStyle: heroTagline ? 'normal' : 'italic'
          }}
        >
          "{heroTagline}"
        </p>
      </div>

      {/* Message Card */}
      {messageData.hasContent && (
        <div 
          className="mx-3 -mt-6 p-3 rounded-xl shadow-sm border"
          style={{ 
            backgroundColor: colors.card, 
            borderColor: colors.border,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <p 
            className="text-xs leading-relaxed line-clamp-3"
            style={{ 
              color: colors.text,
              opacity: 1,
              fontStyle: 'normal'
            }}
          >
            {messageData.text}
          </p>
        </div>
      )}

      {/* Anniversary Badge */}
      {anniversaryData.hasContent && (
        <div className="flex justify-center py-2 px-4">
          <span 
            className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
            style={{ 
              backgroundColor: colors.secondary,
              color: colors.primary,
              borderWidth: 0,
              borderStyle: 'solid',
            }}
          >
            {dateLabel} {anniversaryData.text}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// GALLERY SECTION PREVIEW
// ============================================

interface GallerySectionPreviewProps {
  theme: Theme;
  photoCount: number;
}

export function GallerySectionPreview({
  theme,
  photoCount,
}: GallerySectionPreviewProps) {
  const colors = getThemeColors(theme);

  if (photoCount === 0) {
    return (
      <div 
        className="rounded-xl p-4 text-center border-2 border-dashed"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <div className="text-2xl mb-2">📸</div>
        <p className="text-xs" style={{ color: colors.muted }}>
          Your gallery photos will appear here
        </p>
        <p className="text-[10px] mt-1" style={{ color: colors.muted }}>
          Add photos in the Content step
        </p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>📸</span> Our Gallery
      </h3>
      
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: Math.min(photoCount, 6) }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md overflow-hidden"
            style={{ backgroundColor: colors.secondary }}
          >
            <div className="w-full h-full flex items-center justify-center text-lg opacity-50">
              💕
            </div>
          </div>
        ))}
        {photoCount > 6 && (
          <div 
            className="aspect-square rounded-md flex items-center justify-center text-xs font-medium"
            style={{ backgroundColor: colors.secondary, color: colors.primary }}
          >
            +{photoCount - 6}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// TIMELINE SECTION PREVIEW
// ============================================

interface TimelineSectionPreviewProps {
  theme: Theme;
  eventCount: number;
}

export function TimelineSectionPreview({
  theme,
  eventCount,
}: TimelineSectionPreviewProps) {
  const colors = getThemeColors(theme);

  if (eventCount === 0) {
    return (
      <div 
        className="rounded-xl p-4 text-center border-2 border-dashed"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <div className="text-2xl mb-2">📅</div>
        <p className="text-xs" style={{ color: colors.muted }}>
          Your love story timeline will appear here
        </p>
        <p className="text-[10px] mt-1" style={{ color: colors.muted }}>
          Add events in the Content step
        </p>
      </div>
    );
  }

  const sampleEvents = [
    { date: 'First Met', title: 'Our story began' },
    { date: 'First Date', title: 'Magical moment' },
    { date: 'Together', title: 'Started our journey' },
  ];

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-3 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>📅</span> Our Timeline
      </h3>
      
      <div className="space-y-2">
        {sampleEvents.slice(0, Math.min(eventCount, 3)).map((event, i) => (
          <div key={i} className="flex gap-2">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div 
                className="w-2 h-2 rounded-full mt-1.5"
                style={{ backgroundColor: colors.primary }}
              />
              {i < Math.min(eventCount, 3) - 1 && (
                <div 
                  className="w-0.5 flex-1 my-0.5"
                  style={{ backgroundColor: colors.border }}
                />
              )}
            </div>
            
            {/* Event content */}
            <div 
              className="flex-1 p-2 rounded-md"
              style={{ backgroundColor: colors.secondary + '50' }}
            >
              <span 
                className="text-[10px] font-medium"
                style={{ color: colors.primary }}
              >
                {event.date}
              </span>
              <p 
                className="text-[10px] mt-0.5 truncate"
                style={{ color: colors.text }}
              >
                {event.title}
              </p>
            </div>
          </div>
        ))}
        
        {eventCount > 3 && (
          <p className="text-[10px] text-center pt-1" style={{ color: colors.muted }}>
            +{eventCount - 3} more events
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// SONG SECTION PREVIEW
// ============================================

interface SongSectionPreviewProps {
  theme: Theme;
  hasSong: boolean;
}

export function SongSectionPreview({
  theme,
  hasSong,
}: SongSectionPreviewProps) {
  const colors = getThemeColors(theme);

  if (!hasSong) {
    return (
      <div 
        className="rounded-xl p-4 text-center border-2 border-dashed"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <div className="text-2xl mb-2">🎵</div>
        <p className="text-xs" style={{ color: colors.muted }}>
          Your special song will be embedded here
        </p>
        <p className="text-[10px] mt-1" style={{ color: colors.muted }}>
          Add a Spotify or YouTube link in the Hero step
        </p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>🎵</span> Our Song
      </h3>
      
      <div 
        className="flex items-center gap-3 p-2 rounded-lg"
        style={{ backgroundColor: colors.secondary }}
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="text-white text-sm">▶</span>
        </div>
        <div className="flex-1 min-w-0">
          <p 
            className="text-xs font-medium truncate"
            style={{ color: colors.text }}
          >
            Your Special Song
          </p>
          <p 
            className="text-[10px] truncate"
            style={{ color: colors.muted }}
          >
            Artist Name
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LOVE LETTER SECTION PREVIEW
// ============================================

interface LoveLetterSectionPreviewProps {
  theme: Theme;
  hasMessage: boolean;
}

export function LoveLetterSectionPreview({
  theme,
  hasMessage,
}: LoveLetterSectionPreviewProps) {
  const colors = getThemeColors(theme);

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>💌</span> Love Letter
      </h3>
      
      <div 
        className="p-2 rounded-lg"
        style={{ backgroundColor: colors.secondary + '50' }}
      >
        <p 
          className="text-[10px] leading-relaxed line-clamp-4"
          style={{ color: colors.text }}
        >
          {hasMessage 
            ? 'Your heartfelt love message will be displayed here in a beautiful letter format...'
            : 'Your love letter will appear here...'
          }
        </p>
      </div>
    </div>
  );
}

// ============================================
// QUOTES SECTION PREVIEW
// ============================================

interface QuotesSectionPreviewProps {
  theme: Theme;
}

export function QuotesSectionPreview({ theme }: { theme: Theme }) {
  const colors = getThemeColors(theme);
  const quotes = [
    'Love is not about how many days we have been together...',
    'You are my today and all of my tomorrows.',
    'In all the world, there is no heart for me like yours.',
  ];

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>💕</span> Love Quotes
      </h3>
      
      <div className="space-y-2">
        {quotes.slice(0, 2).map((quote, i) => (
          <div 
            key={i}
            className="p-2 rounded-lg text-center"
            style={{ backgroundColor: colors.secondary + '30' }}
          >
            <p 
              className="text-[10px] italic"
              style={{ color: colors.text }}
            >
              "{quote.substring(0, 50)}..."
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// RELATIONSHIP STATS SECTION PREVIEW
// ============================================

interface StatsSectionPreviewProps {
  theme: Theme;
}

export function StatsSectionPreview({ theme }: { theme: Theme }) {
  const colors = getThemeColors(theme);

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>📊</span> Our Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Days', value: '365' },
          { label: 'Months', value: '12' },
          { label: 'Years', value: '1' },
          { label: 'Love', value: '❤️' },
        ].map((stat, i) => (
          <div 
            key={i}
            className="p-2 rounded-lg text-center"
            style={{ backgroundColor: colors.secondary }}
          >
            <p 
              className="text-sm font-bold"
              style={{ color: colors.primary }}
            >
              {stat.value}
            </p>
            <p 
              className="text-[10px]"
              style={{ color: colors.muted }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MILESTONES SECTION PREVIEW
// ============================================

interface MilestonesSectionPreviewProps {
  theme: Theme;
}

export function MilestonesSectionPreview({ theme }: { theme: Theme }) {
  const colors = getThemeColors(theme);

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>🏆</span> Milestones
      </h3>
      
      <div className="space-y-2">
        {[
          { icon: '💍', title: 'Engaged' },
          { icon: '🏠', title: 'First Home' },
          { icon: '🌍', title: 'First Trip' },
        ].map((milestone, i) => (
          <div 
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{ backgroundColor: colors.secondary + '50' }}
          >
            <span className="text-lg">{milestone.icon}</span>
            <span 
              className="text-xs font-medium"
              style={{ color: colors.text }}
            >
              {milestone.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// FUTURE DREAMS SECTION PREVIEW
// ============================================

interface FutureDreamsSectionPreviewProps {
  theme: Theme;
}

export function FutureDreamsSectionPreview({ theme }: { theme: Theme }) {
  const colors = getThemeColors(theme);

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>💭</span> Future Dreams
      </h3>
      
      <div className="space-y-2">
        {[
          'Dream vacation together',
          'Building our forever home',
          'Adopting a pet',
        ].map((dream, i) => (
          <div 
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{ backgroundColor: colors.secondary + '30' }}
          >
            <span 
              className="text-xs"
              style={{ color: colors.primary }}
            >
              ✨
            </span>
            <span 
              className="text-[10px]"
              style={{ color: colors.text }}
            >
              {dream}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// POLAROID GALLERY SECTION PREVIEW
// ============================================

interface PolaroidGalleryPreviewProps {
  theme: Theme;
  photoCount: number;
}

export function PolaroidGalleryPreview({
  theme,
  photoCount,
}: PolaroidGalleryPreviewProps) {
  const colors = getThemeColors(theme);

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>🖼️</span> Polaroid Memories
      </h3>
      
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: Math.max(photoCount, 3) }).map((_, i) => (
          <div 
            key={i}
            className="flex-shrink-0 w-16 p-1 bg-white rounded rotate-1 shadow-sm"
            style={{ transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)` }}
          >
            <div 
              className="aspect-square rounded-sm flex items-center justify-center text-2xl"
              style={{ backgroundColor: colors.secondary }}
            >
              💕
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ANNIVERSARY COUNTDOWN PREVIEW
// ============================================

interface AnniversaryCountdownPreviewProps {
  theme: Theme;
}

export function AnniversaryCountdownPreview({ theme }: { theme: Theme }) {
  const colors = getThemeColors(theme);

  return (
    <div 
      className="rounded-xl p-3 text-center"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center justify-center gap-1"
        style={{ color: colors.text }}
      >
        <span>⏰</span> Next Anniversary
      </h3>
      
      <div 
        className="inline-flex gap-2 p-3 rounded-lg"
        style={{ backgroundColor: colors.secondary }}
      >
        {[
          { value: '30', label: 'Days' },
          { value: '12', label: 'Hours' },
          { value: '45', label: 'Mins' },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <p 
              className="text-lg font-bold"
              style={{ color: colors.primary }}
            >
              {item.value}
            </p>
            <p 
              className="text-[8px]"
              style={{ color: colors.muted }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// QR KEEPSAKE SECTION PREVIEW
// ============================================

interface QRKeepsakePreviewProps {
  theme: Theme;
}

export function QRKeepsakePreview({ theme }: { theme: Theme }) {
  const colors = getThemeColors(theme);

  return (
    <div 
      className="rounded-xl p-3 text-center"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold mb-2 flex items-center justify-center gap-1"
        style={{ color: colors.text }}
      >
        <span>🎴</span> QR Keepsake
      </h3>
      
      <div className="inline-block p-2 rounded-lg bg-white shadow-sm">
        <div className="w-16 h-16 bg-slate-800 rounded flex items-center justify-center">
          <div className="w-10 h-10 bg-white grid grid-cols-5 gap-0.5 p-1">
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={i} 
                className={`${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[10px] mt-2" style={{ color: colors.muted }}>
        Scan to view your love website
      </p>
    </div>
  );
}

// ============================================
// DEFAULT SECTION PREVIEW (For unknown sections)
// ============================================

interface DefaultSectionPreviewProps {
  sectionId: string;
  theme: Theme;
}

export function DefaultSectionPreview({
  sectionId,
  theme,
}: DefaultSectionPreviewProps) {
  const colors = getThemeColors(theme);
  const sectionEmoji: Record<string, string> = {
    love_letter: '💌',
    our_story: '📖',
    first_date: '🌹',
    special_moments: '⭐',
    playlist: '🎶',
    video_memories: '🎬',
    memory_map: '🗺️',
    guest_messages: '💬',
    letter_future: '📮',
    gift_section: '🎁',
    surprise_message: '🎉',
    reasons_love_you: '💖',
  };

  const emoji = sectionEmoji[sectionId] || '📄';
  const label = sectionId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div 
      className="rounded-xl p-3"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xs font-semibold flex items-center gap-1"
        style={{ color: colors.text }}
      >
        <span>{emoji}</span> {label}
      </h3>
      <p className="text-[10px] mt-1" style={{ color: colors.muted }}>
        Configure this section in the Content step
      </p>
    </div>
  );
}

// ============================================
// SECTION RENDERER - Main component to render any section
// ============================================

interface SectionRendererProps {
  sectionId: string;
  config: SiteConfig;
  occasion?: OccasionType;
  coupleNames?: {
    customer_name: string;
    partner_name: string;
  };
  tagline?: string;
  message?: string;
  specialDate?: string;
}

export function SectionRenderer({ sectionId, config, occasion, coupleNames, tagline, message, specialDate }: SectionRendererProps) {
  const theme = config.theme || 'romantic_classic';
  const siteType = occasion || config.occasion || 'couple';
  const hasCoverPhoto = config.cover_photo_index !== undefined;
  const photoCount = config.cover_photo_index !== undefined ? 5 : 0;
  const eventCount = config.timeline_events?.length || 0;
  const hasSong = !!config.sections?.includes('song');

  switch (sectionId) {
    case 'home':
      return (
        <HomeSectionPreview
          theme={theme}
          siteType={siteType}
          customerName={coupleNames?.customer_name || 'Your Name'}
          partnerName={coupleNames?.partner_name || 'Partner Name'}
          tagline={tagline || config.tagline || ''}
          message={message || config.message || ''}
          specialDate={specialDate || config.specialDate || ''}
          hasCoverPhoto={hasCoverPhoto}
        />
      );
    
    case 'gallery':
      return <GallerySectionPreview theme={theme} photoCount={photoCount} />;
    
    case 'timeline':
      return <TimelineSectionPreview theme={theme} eventCount={eventCount} />;
    
    case 'song':
      return <SongSectionPreview theme={theme} hasSong={hasSong} />;
    
    case 'love_letter':
      return <LoveLetterSectionPreview theme={theme} hasMessage={true} />;
    
    case 'quotes':
      return <QuotesSectionPreview theme={theme} />;
    
    case 'relationship_stats':
      return <StatsSectionPreview theme={theme} />;
    
    case 'milestones':
      return <MilestonesSectionPreview theme={theme} />;
    
    case 'future_dreams':
      return <FutureDreamsSectionPreview theme={theme} />;
    
    case 'polaroid_gallery':
      return <PolaroidGalleryPreview theme={theme} photoCount={photoCount} />;
    
    case 'anniversary_countdown':
      return <AnniversaryCountdownPreview theme={theme} />;
    
    case 'qr_keepsake':
      return <QRKeepsakePreview theme={theme} />;
    
    default:
      return <DefaultSectionPreview sectionId={sectionId} theme={theme} />;
  }
}

