'use client';

import { SiteConfig, CreateOrderPayload } from '@/lib/types';
import { THEME_PRESETS, LAYOUT_PRESETS, SECTION_TOGGLES } from '@/lib/builder-constants';
import { SECTION_REGISTRY, getSectionMetadata } from '@/lib/section-registry';

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
      badgeText: 'Completed',
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
  if (form.photos.length > 0 && config.cover_photo_index === undefined) {
    warnings.push('No cover photo selected - first photo will be used');
  }

  const coupleDetailsComplete =
    !!form.website_name && !!form.customer_name && !!form.partner_name && !!form.anniversary_date;
  const coupleDetailsStatus: 'completed' | 'missing' = coupleDetailsComplete ? 'completed' : 'missing';

  const heroContentComplete = !!form.message;
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

  const memoriesComplete = form.photos.length > 0;
  const memoriesStatus: 'completed' | 'attention' = memoriesComplete ? 'completed' : 'attention';

  const memoriesWarnings: string[] = [];
  if (form.photos.length === 0) {
    memoriesWarnings.push('No photos uploaded yet');
  }
  if (config.sections?.includes('timeline') && (!config.timeline_events || config.timeline_events.length === 0)) {
    memoriesWarnings.push('Timeline enabled but no events added');
  }

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
        title="Couple Details"
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
              yoursite.com/love/{form.website_name || '...'}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Anniversary</p>
            <p className="font-medium text-slate-800">{form.anniversary_date || 'Not set'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Your Name</p>
            <p className="font-medium text-slate-800">{form.customer_name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Partner&apos;s Name</p>
            <p className="font-medium text-slate-800">{form.partner_name || 'Not set'}</p>
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
            <p className="text-slate-500 text-xs">Love Message</p>
            <p className="font-medium text-slate-800 line-clamp-2">
              {form.message || 'No message added'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-slate-500 text-xs">Tagline</p>
              <p className="font-medium text-slate-800">
                {form.tagline || 'Default tagline'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Song</p>
              <p className="font-medium text-slate-800">
                {form.song_link ? 'Added' : 'Not added'}
              </p>
            </div>
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
        <div className="grid grid-cols-2 gap-2 text-sm">
          {config.sections?.includes('home') && (
            <div className="flex justify-between">
              <span className="text-slate-500">Home</span>
              <span className="font-medium text-slate-800">
                {config.home_template || 'Not selected'}
              </span>
            </div>
          )}

          {config.sections?.includes('gallery') && (
            <div className="flex justify-between">
              <span className="text-slate-500">Gallery</span>
              <span className="font-medium text-slate-800">
                {config.gallery_template || 'Not selected'}
              </span>
            </div>
          )}

          {config.sections?.includes('timeline') && (
            <div className="flex justify-between">
              <span className="text-slate-500">Timeline</span>
              <span className="font-medium text-slate-800">
                {config.timeline_template || 'Not selected'}
              </span>
            </div>
          )}

          {config.sections?.includes('song') && (
            <div className="flex justify-between">
              <span className="text-slate-500">Song</span>
              <span className="font-medium text-slate-800">
                {config.song_template || 'Not selected'}
              </span>
            </div>
          )}

          {(!config.sections || config.sections.length === 0) && (
            <p className="text-slate-500">No sections requiring templates</p>
          )}
        </div>
      </ReviewBlock>

      {/* F. Memories */}
      <ReviewBlock
        title="Memories"
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
        status={memoriesStatus}
        onEdit={() => onEditSection?.(6)}
        warnings={memoriesWarnings}
      >
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-slate-500 text-xs">Photos</p>
            <p className="font-medium text-slate-800">{form.photos.length} uploaded</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Cover Photo</p>
            <p className="font-medium text-slate-800">
              {config.cover_photo_index !== undefined
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