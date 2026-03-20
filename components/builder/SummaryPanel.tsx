'use client';

import { SiteConfig, CreateOrderPayload, OccasionType } from '@/lib/types';
import { getOccasionMetadata } from '@/lib/occasion-registry';
import { THEME_PRESETS, LAYOUT_PRESETS, SECTION_TOGGLES } from '@/lib/builder-constants';

type LocalForm = Omit<CreateOrderPayload, 'config' | 'photos'> & { photos: File[] };

interface SummaryPanelProps {
  config: SiteConfig;
  form: LocalForm;
  onEditSection?: (step: number) => void;
}

// ============================================
// REVIEW BLOCK COMPONENT
// ============================================

interface ReviewBlockProps {
  title: string;
  icon: React.ReactNode;
  status: 'completed' | 'missing' | 'attention';
  onEdit?: () => void;
  children: React.ReactNode;
  warnings?: string[];
}

function ReviewBlock({ title, icon, status, onEdit, children, warnings }: ReviewBlockProps) {
  const statusStyles = {
    completed: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: 'text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700',
      badgeText: ' Completed',
    },
    missing: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      badge: 'bg-red-100 text-red-700',
      badgeText: 'Missing',
    },
    attention: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-700',
      badgeText: 'Needs Attention',
    },
  };

  const style = statusStyles[status];

  return (
    <div className={`rounded-xl border-2 ${style.bg} ${style.border} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/5">
        <div className="flex items-center gap-2">
          <span className={style.icon}>{icon}</span>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${style.badge}`}>
            {style.badgeText}
          </span>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="px-4 pb-3">
          <div className="space-y-1">
            {warnings.map((warning, i) => (
              <p key={i} className="text-xs text-amber-600 flex items-start gap-1">
                <span>⚠️</span>
                <span>{warning}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SECTION CONTENT SUMMARY HELPERS
// ============================================

interface SectionContentSummary {
  label: string;
  icon: string;
  status: 'completed' | 'missing' | 'attention';
  content: string;
}

// Truncate text to a specified length
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Get section content summary for each enabled section
function getSectionContentSummary(
  sectionId: string,
  sectionContent: Record<string, unknown> | undefined,
  form: LocalForm
): SectionContentSummary | null {
  const sectionInfo = SECTION_TOGGLES.find((t) => t.id === sectionId);
  const content = sectionContent?.[sectionId as keyof Record<string, unknown>] as Record<string, unknown> | undefined;
  
  // Sections handled elsewhere (photos, timeline events)
  if (sectionId === 'gallery' || sectionId === 'timeline') {
    return null;
  }

  switch (sectionId) {
    // Text content sections
    case 'love_letter': {
      const text = (form.message?.trim() || (content?.content as string) || '').trim();
      return {
        label: sectionInfo?.label || 'Love Letter',
        icon: '💌',
        status: text.length > 0 ? 'completed' : 'missing',
        content: text.length > 0 ? truncateText(text, 100) : 'No letter added',
      };
    }

    case 'song': {
      const hasSong = !!form.song_link?.trim();
      return {
        label: sectionInfo?.label || 'Song',
        icon: '🎵',
        status: hasSong ? 'completed' : 'missing',
        content: hasSong ? 'Song link added' : 'No song link',
      };
    }

    case 'our_story': {
      const text = (content?.content as string) || '';
      return {
        label: sectionInfo?.label || 'Our Story',
        icon: '📖',
        status: text.length > 0 ? 'completed' : 'missing',
        content: text.length > 0 ? truncateText(text, 100) : 'No story added',
      };
    }

    case 'first_date': {
      const hasContent = !!(content?.title || content?.date || content?.location || content?.description);
      return {
        label: sectionInfo?.label || 'First Date',
        icon: '💕',
        status: hasContent ? 'completed' : 'missing',
        content: hasContent 
          ? `${content?.title || 'First Date'}${content?.date ? ` • ${content.date}` : ''}`
          : 'Not configured',
      };
    }

    // List content sections
    case 'special_moments': {
      const items = (content?.moments as unknown[]) || [];
      return {
        label: sectionInfo?.label || 'Special Moments',
        icon: '⭐',
        status: items.length > 0 ? 'completed' : 'missing',
        content: items.length > 0 ? `${items.length} moment${items.length !== 1 ? 's' : ''} added` : 'No moments added',
      };
    }

    case 'milestones': {
      const items = (content?.milestones as unknown[]) || [];
      return {
        label: sectionInfo?.label || 'Milestones',
        icon: '🏆',
        status: items.length > 0 ? 'completed' : 'missing',
        content: items.length > 0 ? `${items.length} milestone${items.length !== 1 ? 's' : ''} added` : 'No milestones added',
      };
    }

    // Media sections
    case 'playlist': {
      const hasContent = !!content?.playlistUrl;
      return {
        label: sectionInfo?.label || 'Playlist',
        icon: '🎶',
        status: hasContent ? 'completed' : 'missing',
        content: hasContent ? 'Playlist link added' : 'No playlist link',
      };
    }

    case 'video_memories': {
      const items = (content?.videos as unknown[]) || [];
      return {
        label: sectionInfo?.label || 'Video Memories',
        icon: '🎬',
        status: items.length > 0 ? 'completed' : 'missing',
        content: items.length > 0 ? `${items.length} video${items.length !== 1 ? 's' : ''} added` : 'No videos added',
      };
    }

    // Stats & counters (auto-generated, no content needed)
    case 'relationship_stats':
    case 'anniversary_countdown': {
      return {
        label: sectionInfo?.label || sectionId,
        icon: sectionId === 'relationship_stats' ? '📊' : '⏰',
        status: 'completed',
        content: 'Auto-generated',
      };
    }

    case 'birthday_countdown': {
      return {
        label: sectionInfo?.label || 'Birthday Countdown',
        icon: '⏳',
        status: 'completed',
        content: 'Auto-generated',
      };
    }

    case 'birthday_wishes': {
      const wishes = (content?.quotes as unknown[] | undefined) || [];
      const wishesCount = Array.isArray(wishes) ? wishes.length : 0;
      return {
        label: sectionInfo?.label || 'Birthday Wishes',
        icon: '🎈',
        status: wishesCount > 0 ? 'completed' : 'attention',
        content: wishesCount > 0 ? `${wishesCount} wishes` : 'No wishes added',
      };
    }

    case 'birthday_message': {
      const messageText = (content?.content as string) || '';
      return {
        label: sectionInfo?.label || 'Birthday Message',
        icon: '🎂',
        status: messageText.trim().length > 0 ? 'completed' : 'missing',
        content: messageText.trim().length > 0 ? 'Message provided' : 'No message',
      };
    }

    case 'party_details': {
      const hasContent = !!(
        content?.location ||
        content?.date ||
        content?.time ||
        content?.dressCode
      );
      return {
        label: sectionInfo?.label || 'Party Details',
        icon: '📍',
        status: hasContent ? 'completed' : 'missing',
        content: hasContent ? 'Party details set' : 'No party details',
      };
    }

    case 'gift_wishlist': {
      const items = (content?.items as unknown[]) || [];
      const count = Array.isArray(items) ? items.length : 0;
      return {
        label: sectionInfo?.label || 'Gift Wishlist',
        icon: '🎁',
        status: count > 0 ? 'completed' : 'missing',
        content: count > 0 ? `${count} item${count !== 1 ? 's' : ''}` : 'No wishlist items',
      };
    }

    // Interactive sections
    case 'future_dreams': {
      const items = (content?.dreams as unknown[]) || [];
      return {
        label: sectionInfo?.label || 'Future Dreams',
        icon: '💭',
        status: items.length > 0 ? 'completed' : 'missing',
        content: items.length > 0 ? `${items.length} dream${items.length !== 1 ? 's' : ''} added` : 'No dreams added',
      };
    }

    case 'quotes': {
      const items = (content?.quotes as unknown[]) || [];
      return {
        label: sectionInfo?.label || 'Love Quotes',
        icon: '💕',
        status: items.length > 0 ? 'completed' : 'missing',
        content: items.length > 0 ? `${items.length} quote${items.length !== 1 ? 's' : ''} added` : 'No quotes added',
      };
    }

    case 'reasons_love_you': {
      const items = (content?.reasons as unknown[]) || [];
      return {
        label: sectionInfo?.label || 'Reasons I Love You',
        icon: '💖',
        status: items.length > 0 ? 'completed' : 'missing',
        content: items.length > 0 ? `${items.length} reason${items.length !== 1 ? 's' : ''} added` : 'No reasons added',
      };
    }

    case 'memory_map': {
      const items = (content?.locations as unknown[]) || [];
      return {
        label: sectionInfo?.label || 'Memory Map',
        icon: '🗺️',
        status: items.length > 0 ? 'completed' : 'missing',
        content: items.length > 0 ? `${items.length} location${items.length !== 1 ? 's' : ''} added` : 'No locations added',
      };
    }

    case 'guest_messages': {
      return {
        label: sectionInfo?.label || 'Guest Messages',
        icon: '💬',
        status: 'completed',
        content: 'Enabled',
      };
    }

    case 'letter_future': {
      const text = (content?.letter as string) || '';
      return {
        label: sectionInfo?.label || 'Letter to the Future',
        icon: '📮',
        status: text.length > 0 ? 'completed' : 'missing',
        content: text.length > 0 
          ? truncateText(text, 80) 
          : 'No letter written',
      };
    }

    case 'gift_section': {
      const items = (content?.gifts as unknown[]) || [];
      return {
        label: sectionInfo?.label || 'Gift Section',
        icon: '🎁',
        status: items.length > 0 ? 'completed' : 'missing',
        content: items.length > 0 ? `${items.length} gift${items.length !== 1 ? 's' : ''} added` : 'No gifts added',
      };
    }

    case 'surprise_message': {
      const hasContent = !!content?.message;
      return {
        label: sectionInfo?.label || 'Surprise Message',
        icon: '🎉',
        status: hasContent ? 'completed' : 'missing',
        content: hasContent ? 'Configured' : 'Not configured',
      };
    }

    case 'qr_keepsake': {
      return {
        label: sectionInfo?.label || 'QR Keepsake',
        icon: '🎴',
        status: 'completed',
        content: 'QR code enabled',
      };
    }

    // Home section - no additional content to review
    case 'home':
      return null;

    default:
      return {
        label: sectionInfo?.label || sectionId,
        icon: sectionInfo?.icon || '📄',
        status: 'attention',
        content: 'Unknown section type',
      };
  }
}

// ============================================
// SUMMARY PANEL COMPONENT
// ============================================

export default function SummaryPanel({ config, form, onEditSection }: SummaryPanelProps) {
  const themePreset = THEME_PRESETS[config.theme] || THEME_PRESETS.romantic_classic;
  const layoutPreset = LAYOUT_PRESETS.find((p) => p.key === config.layout_preset);

  const warnings: string[] = [];

  if (config.sections?.includes('gallery') && form.photos.length === 0) {
    warnings.push('Gallery section enabled but no photos uploaded');
  }
  if (config.sections?.includes('gallery') && form.photos.length > 0 && form.photos.length < 3) {
    warnings.push('Consider adding more photos for a better gallery');
  }
  if (config.sections?.includes('timeline') && (!config.timeline_events || config.timeline_events.length < 2)) {
    warnings.push('Timeline section needs at least 2 events');
  }
  if (config.sections?.includes('song') && !form.song_link) {
    warnings.push('Song section enabled but no song link added');
  }
  if (form.photos.length > 0 && config.cover_photo_index === undefined && !config.hero?.coverPhotoUrl && config.hero?.coverPhotoIndex === undefined) {
    warnings.push('No cover photo selected - first photo will be used');
  }

  const occasionMeta = getOccasionMetadata(form.occasion || 'couple');
  const coupleDetailsComplete =
    !!form.website_name && 
    form.participants?.some(p => !!p.name) && 
    !!form.specialDate;
  const coupleDetailsStatus: 'completed' | 'missing' = coupleDetailsComplete ? 'completed' : 'missing';

  const heroMessageRequired = config.sections?.includes('love_letter');
  const heroContentComplete = !heroMessageRequired || !!form.message;
  const heroContentStatus: 'completed' | 'missing' = heroContentComplete ? 'completed' : 'missing';

  const styleComplete = !!config.theme;
  const styleStatus: 'completed' | 'missing' = styleComplete ? 'completed' : 'missing';

  const layoutComplete = !!config.sections && config.sections.length > 0;
  const layoutStatus: 'completed' | 'missing' = layoutComplete ? 'completed' : 'missing';

  const templatesComplete =
    !config.sections?.length ||
    ((!config.sections.includes('home') || !!config.home_template) &&
      (!config.sections.includes('gallery') || !!config.gallery_template) &&
      (!config.sections.includes('timeline') || !!config.timeline_template) &&
      (!config.sections.includes('song') || !!config.song_template));

  const templatesStatus: 'completed' | 'attention' = templatesComplete ? 'completed' : 'attention';

  // ============================================
  // ENHANCED CONTENT CHECK - Check dynamic section content
  // ============================================
  
  // Check if any content sections are enabled
  const hasContentSections = config.sections?.some(section => 
    ['love_letter', 'our_story', 'first_date', 'special_moments', 'milestones', 
     'playlist', 'video_memories', 'future_dreams', 'quotes', 'reasons_love_you',
     'memory_map', 'letter_future', 'gift_section', 'surprise_message'].includes(section)
  );

  // Check if gallery section is enabled
  const hasGallerySection = config.sections?.includes('gallery');
  const hasTimelineSection = config.sections?.includes('timeline');
  
  // Check photos (only required if gallery is enabled)
  const photosComplete = !hasGallerySection || form.photos.length > 0;
  
  // Check timeline events (only required if timeline is enabled)
  const timelineComplete = !hasTimelineSection || (config.timeline_events && config.timeline_events.length > 0);
  
  // Check dynamic section content
  const sectionContent = config.section_content;
  
  const checkSectionContentComplete = (sectionId: string, form: LocalForm): boolean => {
    const content = sectionContent?.[sectionId as keyof typeof sectionContent];

    if (sectionId === 'love_letter') {
      return !!form.message?.trim() || !!(content as { content?: string })?.content;
    }

    if (sectionId === 'song') {
      return !!form.song_link?.trim();
    }

    if (!content) return false;
    
    switch (sectionId) {
      case 'our_story':
        return !!(content as { content: string }).content;
      case 'first_date':
        return !!(content as { title?: string }).title;
      case 'special_moments':
        return ((content as { moments?: unknown[] })?.moments?.length ?? 0) > 0;
      case 'milestones':
        return ((content as { milestones?: unknown[] })?.milestones?.length ?? 0) > 0;
      case 'playlist':
        return !!(content as { playlistUrl?: string }).playlistUrl;
      case 'video_memories':
        return ((content as { videos?: unknown[] })?.videos?.length ?? 0) > 0;
      case 'future_dreams':
        return ((content as { dreams?: unknown[] })?.dreams?.length ?? 0) > 0;
      case 'quotes':
        return ((content as { quotes?: unknown[] })?.quotes?.length ?? 0) > 0;
      case 'reasons_love_you':
        return ((content as { reasons?: unknown[] })?.reasons?.length ?? 0) > 0;
      case 'memory_map':
        return ((content as { locations?: unknown[] })?.locations?.length ?? 0) > 0;
      case 'letter_future':
        return !!(content as { letter?: string }).letter;
      case 'gift_section':
        return ((content as { gifts?: unknown[] })?.gifts?.length ?? 0) > 0;
      case 'surprise_message':
        return !!(content as { message?: string }).message;
      case 'guest_messages':
        return true; // Guest messages is informational only
      default:
        return true;
    }
  };
  
  // Check each enabled content section
  const contentSectionsToCheck = config.sections?.filter(section =>
    ['love_letter', 'song', 'our_story', 'first_date', 'special_moments', 'milestones', 
     'playlist', 'video_memories', 'future_dreams', 'quotes', 'reasons_love_you',
     'memory_map', 'letter_future', 'gift_section', 'surprise_message'].includes(section)
  ) || [];
  
  const allContentSectionsComplete = contentSectionsToCheck.length === 0 || 
    contentSectionsToCheck.every(section => checkSectionContentComplete(section, form));
  
  // Overall content status
  const contentComplete = photosComplete && timelineComplete && allContentSectionsComplete;
  const contentStatus: 'completed' | 'attention' = contentComplete ? 'completed' : 'attention';

  // Content warnings
  const contentWarnings: string[] = [];
  
  if (!photosComplete) {
    contentWarnings.push('No photos uploaded yet');
  }
  if (!timelineComplete) {
    contentWarnings.push('Timeline enabled but no events added');
  }
  
  // Check each dynamic section for missing content
  contentSectionsToCheck.forEach(section => {
    const isComplete = checkSectionContentComplete(section, form);
    if (!isComplete) {
      const sectionInfo = SECTION_TOGGLES.find(t => t.id === section);
      const sectionName = sectionInfo?.label || section;
      
      switch (section) {
        case 'love_letter':
          contentWarnings.push(`${sectionName} section selected but no letter written`);
          break;
        case 'our_story':
          contentWarnings.push(`${sectionName} section selected but no story added`);
          break;
        case 'first_date':
          contentWarnings.push(`${sectionName} section selected but not configured`);
          break;
        case 'special_moments':
          contentWarnings.push(`${sectionName} section selected but no moments added`);
          break;
        case 'milestones':
          contentWarnings.push(`${sectionName} section selected but no milestones added`);
          break;
        case 'playlist':
          contentWarnings.push(`${sectionName} section selected but no playlist link added`);
          break;
        case 'video_memories':
          contentWarnings.push(`${sectionName} section selected but no videos added`);
          break;
        case 'future_dreams':
          contentWarnings.push(`${sectionName} section selected but no dreams added`);
          break;
        case 'quotes':
          contentWarnings.push(`${sectionName} section selected but no quotes added`);
          break;
        case 'reasons_love_you':
          contentWarnings.push(`${sectionName} section selected but no reasons added`);
          break;
        case 'memory_map':
          contentWarnings.push(`${sectionName} section selected but no locations added`);
          break;
        case 'letter_future':
          contentWarnings.push(`${sectionName} section selected but no letter written`);
          break;
        case 'gift_section':
          contentWarnings.push(`${sectionName} section selected but no gifts added`);
          break;
        case 'surprise_message':
          contentWarnings.push(`${sectionName} section selected but no message written`);
          break;
        default:
          contentWarnings.push(`${sectionName} section selected but not configured`);
      }
    }
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Review Your Love Website</h2>
        <p className="text-sm text-slate-500">
          Make sure everything looks perfect before creating
        </p>
      </div>

      {/* A. Couple Details */}
      <ReviewBlock
        title="Website Details"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        }
        status={coupleDetailsStatus}
        onEdit={() => onEditSection?.(1)}
      >
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500 text-xs">Website</p>
            <p className="font-medium text-slate-800">
              yoursite.com/site/{form.website_name || '...'}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">{occasionMeta.specialDateLabel}</p>
            <p className="font-medium text-slate-800">{form.specialDate || 'Not set'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">{occasionMeta.participantsLabel}</p>
            <p className="font-medium text-slate-800">{form.participants?.map(p => p.name).filter(Boolean).join(' & ') || 'Not set'}</p>
          </div>
        </div>
      </ReviewBlock>

      {/* B. Hero Content */}
      <ReviewBlock
        title="Hero Content"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        }
        status={heroContentStatus}
        onEdit={() => onEditSection?.(2)}
      >
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-slate-500 text-xs">Tagline</p>
            <p className="font-medium text-slate-800">
              {form.tagline || 'Default tagline'}
            </p>
          </div>
        </div>
      </ReviewBlock>

      {/* C. Style */}
      <ReviewBlock
        title="Style"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        }
        status={styleStatus}
        onEdit={() => onEditSection?.(3)}
      >
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {themePreset.preview?.map((color: string, i: number) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div>
            <p className="font-medium text-slate-800">{themePreset.label}</p>
            <p className="text-xs text-slate-500">{layoutPreset?.label || 'Default layout'}</p>
          </div>
        </div>
      </ReviewBlock>

      {/* D. Page Layout */}
      <ReviewBlock
        title="Page Layout"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        }
        status={layoutStatus}
        onEdit={() => onEditSection?.(4)}
      >
        <div className="flex flex-wrap gap-2">
          {config.sections?.length > 0 ? (
            config.sections.map((section) => {
              const sectionInfo = SECTION_TOGGLES.find((t) => t.id === section);
              return (
                <span
                  key={section}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700"
                >
                  <span>{sectionInfo?.icon}</span>
                  <span>{sectionInfo?.label}</span>
                </span>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">No sections selected</p>
          )}
        </div>
      </ReviewBlock>

      {/* E. Templates */}
      <ReviewBlock
        title="Templates"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        }
        status={templatesStatus}
        onEdit={() => onEditSection?.(5)}
      >
        <div className="space-y-3 text-sm">
          {config.sections?.includes('home') && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-700">Home</span>
              <span className="font-medium text-slate-800">{config.home_template || 'Not selected'}</span>
            </div>
          )}

          {config.sections?.includes('gallery') && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-700">Gallery</span>
              <span className="font-medium text-slate-800">{config.gallery_template || 'Not selected'}</span>
            </div>
          )}

          {config.sections?.includes('timeline') && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-700">Timeline</span>
              <span className="font-medium text-slate-800">{config.timeline_template || 'Not selected'}</span>
            </div>
          )}

          {config.sections?.includes('song') && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-700">Song</span>
              <span className="font-medium text-slate-800">{config.song_template || 'Not selected'}</span>
            </div>
          )}

          {(!config.sections || config.sections.length === 0) && (
            <p className="text-slate-500">No sections requiring templates</p>
          )}
        </div>
      </ReviewBlock>

      {/* F. Content - Enhanced with Dynamic Section Content */}
      <ReviewBlock
        title="Content"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
        status={contentStatus}
        onEdit={() => onEditSection?.(6)}
        warnings={contentWarnings}
      >
        {/* Legacy content - Photos, Cover, Timeline Events */}
        <div className="grid grid-cols-3 gap-3 text-sm mb-4">
          <div>
            <p className="text-slate-500 text-xs">Photos</p>
            <p className="font-medium text-slate-800">{form.photos.length} uploaded</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Cover Photo</p>
            <p className="font-medium text-slate-800">
              {config.hero?.coverPhotoUrl
                ? 'Dedicated Hero Photo'
                : config.hero?.coverPhotoIndex !== undefined
                  ? `Photo ${config.hero.coverPhotoIndex + 1}`
                  : config.cover_photo_index !== undefined
                    ? `Photo ${config.cover_photo_index + 1}`
                    : 'Default'}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Timeline Events</p>
            <p className="font-medium text-slate-800">
              {config.timeline_events?.length || 0} events
            </p>
          </div>
        </div>

        {/* Main Content Summary (Love Message + Song) */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
            Content Details
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-base">💌</span>
                <span className="font-medium text-slate-700">Love Message</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${form.message?.trim() ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                {form.message?.trim() ? 'Added' : 'No message added'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-base">🎵</span>
                <span className="font-medium text-slate-700">Song</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${form.song_link?.trim() ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                {form.song_link?.trim() ? 'Added' : 'No song link'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Section Content Summaries */}
        {config.sections && config.sections.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Section Content
            </p>
            <div className="space-y-2">
              {config.sections.map((sectionId) => {
                const summary = getSectionContentSummary(sectionId, config.section_content as Record<string, unknown> | undefined, form);
                if (!summary) return null;
                
                const statusColors = {
                  completed: 'text-emerald-600 bg-emerald-50',
                  missing: 'text-red-600 bg-red-50',
                  attention: 'text-amber-600 bg-amber-50',
                };
                
                return (
                  <div 
                    key={sectionId}
                    className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{summary.icon}</span>
                      <span className="font-medium text-slate-700">{summary.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[summary.status]}`}>
                        {summary.content}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ReviewBlock>

      {/* Overall Warnings */}
      {warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-amber-800 mb-2">Recommendations</h4>
          <ul className="space-y-1">
            {warnings.map((warning, i) => (
              <li key={i} className="text-xs text-amber-700">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
