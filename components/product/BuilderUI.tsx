'use client';

import React from 'react';

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function SectionCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function SegmentedButton({
  active,
  label,
  sublabel,
  onClick,
}: {
  active: boolean;
  label: string;
  sublabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'rounded-xl border px-4 py-3 text-left transition-all duration-200',
        active
          ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-100'
          : 'border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50/40'
      )}
    >
      <div className="text-sm font-bold">{label}</div>
      {sublabel ? <div className="mt-1 text-xs text-slate-500">{sublabel}</div> : null}
    </button>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
        {children}
      </label>
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </div>
  );
}

export function PhotoTransformControls({
  zoom,
  offsetX,
  offsetY,
  onZoomChange,
  onOffsetXChange,
  onOffsetYChange,
  onReset,
}: {
  zoom: number;
  offsetX: number;
  offsetY: number;
  onZoomChange: (value: number) => void;
  onOffsetXChange: (value: number) => void;
  onOffsetYChange: (value: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">Photo Position</h4>
        <button
          type="button"
          className="text-xs text-slate-500 hover:text-slate-700 underline"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        <label className="flex flex-col text-sm font-semibold text-slate-800">
          Zoom
          <input
            type="range"
            min="1"
            max="2.2"
            step="0.01"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="mt-2"
          />
          <span className="mt-1 text-xs font-normal text-slate-500">{zoom.toFixed(2)}x</span>
        </label>

        <label className="flex flex-col text-sm font-semibold text-slate-800">
          Move Left / Right
          <input
            type="range"
            min="-40"
            max="40"
            step="1"
            value={offsetX}
            onChange={(e) => onOffsetXChange(Number(e.target.value))}
            className="mt-2"
          />
          <span className="mt-1 text-xs font-normal text-slate-500">
            {offsetX > 0 ? '+' : ''}
            {offsetX}
          </span>
        </label>

        <label className="flex flex-col text-sm font-semibold text-slate-800">
          Move Up / Down
          <input
            type="range"
            min="-40"
            max="40"
            step="1"
            value={offsetY}
            onChange={(e) => onOffsetYChange(Number(e.target.value))}
            className="mt-2"
          />
          <span className="mt-1 text-xs font-normal text-slate-500">
            {offsetY > 0 ? '+' : ''}
            {offsetY}
          </span>
        </label>
      </div>
    </div>
  );
}