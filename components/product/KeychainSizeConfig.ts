// Keychain Size Configuration
// All sizes in millimeters (mm)

export type KeychainShape = 'rectangle' | 'square';

export interface KeychainSize {
  label: string;
  width_mm: number;
  height_mm: number;
  shape: KeychainShape;
  description?: string;
}

// Predefined keychain sizes
export const KEYCHAIN_SIZES: KeychainSize[] = [
  {
    label: 'Small Rectangle',
    width_mm: 46,
    height_mm: 32,
    shape: 'rectangle',
    description: 'Compact size - 46mm × 32mm',
  },
  {
    label: 'Medium Rectangle',
    width_mm: 50,
    height_mm: 35,
    shape: 'rectangle',
    description: 'Standard size - 50mm × 35mm',
  },
  {
    label: 'Square',
    width_mm: 32,
    height_mm: 32,
    shape: 'square',
    description: 'Square shape - 32mm × 32mm',
  },
  {
    label: 'Large Rectangle',
    width_mm: 60,
    height_mm: 40,
    shape: 'rectangle',
    description: 'Large size - 60mm × 40mm',
  },
  {
    label: 'Custom Size',
    width_mm: 0,
    height_mm: 0,
    shape: 'rectangle',
    description: 'Enter custom dimensions',
  },
];

// Conversion constants
const MM_TO_PX = 3.7795; // 1mm = 3.7795px at 96 DPI
const MM_TO_INCH = 0.0393701; // 1mm = 0.0393701 inches

/**
 * Convert millimeters to pixels (at 96 DPI for screen display)
 */
export function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX);
}

/**
 * Convert millimeters to inches (for print)
 */
export function mmToInch(mm: number): number {
  return mm * MM_TO_INCH;
}

/**
 * Calculate the number of inserts that fit on a sheet
 * A4 paper: 210mm × 297mm
 * Letter paper: 8.5in × 11in = 215.9mm × 279.4mm
 */
export function calculateInsertsPerSheet(
  insertWidthMm: number,
  insertHeightMm: number,
  paperWidthMm: number = 210,
  paperHeightMm: number = 297,
  marginMm: number = 5,
  gapMm: number = 3
): { columns: number; rows: number; total: number } {
  const usableWidth = paperWidthMm - 2 * marginMm;
  const usableHeight = paperHeightMm - 2 * marginMm;

  const columns = Math.max(1, Math.floor(usableWidth / (insertWidthMm + gapMm)));
  const rows = Math.max(1, Math.floor(usableHeight / (insertHeightMm + gapMm)));

  return {
    columns,
    rows,
    total: columns * rows,
  };
}

/**
 * Get CSS size string for rendering
 */
export function getInsertDimensions(
  widthMm: number,
  heightMm: number,
  scale: number = 1
): { width: string; height: string } {
  // For screen display, convert to pixels with scale
  const widthPx = mmToPx(widthMm) * scale;
  const heightPx = mmToPx(heightMm) * scale;
  
  return {
    width: `${widthPx}px`,
    height: `${heightPx}px`,
  };
}

/**
 * Get print dimensions in mm for CSS
 */
export function getPrintDimensions(
  widthMm: number,
  heightMm: number
): { width: string; height: string } {
  return {
    width: `${widthMm}mm`,
    height: `${heightMm}mm`,
  };
}

/**
 * Find a keychain size by label
 */
export function findKeychainSize(label: string): KeychainSize | undefined {
  return KEYCHAIN_SIZES.find(size => size.label === label);
}

