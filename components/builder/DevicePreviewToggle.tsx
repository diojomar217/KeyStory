'use client';

import { PreviewDevice } from '@/lib/types';

interface DevicePreviewToggleProps {
  device: PreviewDevice;
  onChange: (device: PreviewDevice) => void;
}

export default function DevicePreviewToggle({ device, onChange }: DevicePreviewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
      <button
        type="button"
        onClick={() => onChange('desktop')}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
          ${device === 'desktop' 
            ? 'bg-white text-slate-800 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
          }
        `}
        title="Desktop Preview"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline">Desktop</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('mobile')}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
          ${device === 'mobile' 
            ? 'bg-white text-slate-800 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
          }
        `}
        title="Mobile Preview"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline">Mobile</span>
      </button>
    </div>
  );
}

