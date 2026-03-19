'use client';

interface WebsiteActionsProps {
  slug: string;
  id: string;
  onDelete: (id: string) => void;
  className?: string;
}

// Icons
const ViewIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const QRCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
);

const PrintIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const AnalyticsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h3v8H3v-8zm5-5h3v13H8V8zm5 3h3v10h-3V11zm5-4h3v14h-3V7z" />
  </svg>
);

const DeleteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function WebsiteActions({
  slug,
  id,
  onDelete,
  className = '',
}: WebsiteActionsProps) {
  return (
    <div className={`flex items-center justify-end gap-1 ${className}`}>
      {/* View QR Card Button */}
      <a
        href={`/admin/websites/${id}/qr-card`}
        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:scale-110"
        title="View QR Card"
      >
        <QRCardIcon className="w-4 h-4" />
      </a>

      {/* Print QR Card Button */}
      <a
        href={`/admin/websites/${id}/qr-card`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-110"
        title="Print QR Card"
      >
        <PrintIcon className="w-4 h-4" />
      </a>

      {/* View Website Button */}
      <a
        href={`/site/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
        title="View website"
      >
        <ViewIcon className="w-4 h-4" />
      </a>

      {/* Analytics Button */}
      <a
        href={`/admin/websites/${id}/analytics`}
        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200 hover:scale-110"
        title="View analytics"
      >
        <AnalyticsIcon className="w-4 h-4" />
      </a>

      {/* Edit Button */}
      <a
        href={`/admin/websites/${id}/edit`}
        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 hover:scale-110"
        title="Edit website"
      >
        <EditIcon className="w-4 h-4" />
      </a>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
        title="Delete website"
      >
        <DeleteIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

