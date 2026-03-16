'use client';

import { KeychainSize, KEYCHAIN_SIZES } from './KeychainSizeConfig';

interface KeychainTypeSelectorProps {
  selectedSize: KeychainSize;
  onSizeChange: (size: KeychainSize) => void;
  customWidth: number;
  customHeight: number;
  onCustomWidthChange: (width: number) => void;
  onCustomHeightChange: (height: number) => void;
}

export default function KeychainTypeSelector({
  selectedSize,
  onSizeChange,
  customWidth,
  customHeight,
  onCustomWidthChange,
  onCustomHeightChange,
}: KeychainTypeSelectorProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;
    const size = KEYCHAIN_SIZES.find((s) => s.label === selectedLabel);
    if (size) {
      onSizeChange(size);
    }
  };

  const isCustomSize = selectedSize.label === 'Custom Size';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-rose-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        Keychain Type
      </h3>

      {/* Size Selector Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="keychain-size"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Select Size
        </label>
        <select
          id="keychain-size"
          value={selectedSize.label}
          onChange={handleSelectChange}
          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900 transition-colors"
        >
          {KEYCHAIN_SIZES.map((size) => (
            <option key={size.label} value={size.label}>
              {size.description || size.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Size Inputs */}
      {isCustomSize && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <label
              htmlFor="custom-width"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Width (mm)
            </label>
            <input
              type="number"
              id="custom-width"
              value={customWidth}
              onChange={(e) => onCustomWidthChange(Number(e.target.value))}
              min={10}
              max={150}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
              placeholder="e.g., 50"
            />
          </div>
          <div>
            <label
              htmlFor="custom-height"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Height (mm)
            </label>
            <input
              type="number"
              id="custom-height"
              value={customHeight}
              onChange={(e) => onCustomHeightChange(Number(e.target.value))}
              min={10}
              max={150}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
              placeholder="e.g., 35"
            />
          </div>
        </div>
      )}

      {/* Selected Size Info */}
      {!isCustomSize && (
        <div className="mt-4 p-4 bg-rose-50 rounded-lg border border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-rose-900">{selectedSize.label}</p>
              <p className="text-sm text-rose-700">
                {selectedSize.width_mm}mm × {selectedSize.height_mm}
              </p>
            </div>
            <div
              className="bg-white rounded border-2 border-rose-200"
              style={{
                width: `${selectedSize.width_mm * 2}px`,
                height: `${selectedSize.height_mm * 2}px`,
                minWidth: '40px',
                minHeight: '40px',
              }}
            />
          </div>
        </div>
      )}

      {/* Size Guide */}
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm font-semibold text-slate-800 mb-2">Keychain Insert Sizes (portrait by default)</p>
        <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
          <li>Small Portrait: 32mm × 46mm</li>
          <li>Medium Portrait: 35mm × 50mm (recommended for clear acrylic)</li>
          <li>Large Portrait: 40mm × 60mm</li>
          <li>Square: 32mm × 32mm</li>
        </ul>
      </div>

      {/* Print Info */}
      <p className="mt-4 text-xs text-slate-500">
        💡 Tip: These inserts are designed for double-sided clear acrylic
        keychains. Print and cut along the dotted lines.
      </p>
    </div>
  );
}

