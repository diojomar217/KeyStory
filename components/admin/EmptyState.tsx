'use client';

import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        {icon || (
          <svg
            className="w-10 h-10 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">
        {title}
      </h3>
      
      {description && (
        <p className="text-slate-500 text-center max-w-md mb-6">
          {description}
        </p>
      )}
      
      <div className="flex items-center gap-3">
        {actionLabel && (
          <Link
            href={actionHref || '#'}
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-xl hover:from-rose-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all"
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
            {actionLabel}
          </Link>
        )}
        
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="inline-flex items-center px-5 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}

// Specialized empty states
export function NoWebsitesState() {
  return (
    <EmptyState
      title="No websites yet"
      description="Create your first couple website to get started. It's quick and easy!"
      actionLabel="Create Website"
      actionHref="/admin/websites/create"
    />
  );
}

export function NoSearchResultsState({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      title="No results found"
      description={`We couldn't find any websites matching "${searchQuery}". Try a different search term.`}
      actionLabel="Clear Search"
    />
  );
}

