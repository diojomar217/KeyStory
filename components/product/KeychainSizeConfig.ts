// Keychain Size Configuration
// All sizes in millimeters (mm)

export type KeychainShape = 'rectangle' | 'square' | 'heart';

export interface KeychainSize {
  label: string;
  width_mm: number;
  height_mm: number;
  shape: KeychainShape;
  description?: string;
  safeAreaScale?: number; // For shapes with unsafe edge areas (e.g., 0.85 = 85% usable)
}

// Predefined keychain sizes
export const KEYCHAIN_SIZES: KeychainSize[] = [
  {
    label: 'Small Portrait',
    width_mm: 32,
    height_mm: 46,
    shape: 'rectangle',
    description: 'Compact portrait - 32mm × 46mm',
  },
  {
    label: 'Medium Portrait',
    width_mm: 35,
    height_mm: 50,
    shape: 'rectangle',
    description: 'Standard portrait - 35mm × 50mm (recommended for clear acrylic)',
  },
  {
    label: 'Square',
    width_mm: 32,
    height_mm: 32,
    shape: 'square',
    description: 'Square shape - 32mm × 32mm',
  },
  {
    label: 'Large Portrait',
    width_mm: 40,
    height_mm: 60,
    shape: 'rectangle',
    description: 'Large portrait - 40mm × 60mm',
  },
  {
    label: 'Heart',
    width_mm: 50,
    height_mm: 50,
    shape: 'heart',
    description: 'Heart shape - 50mm × 50mm (clear acrylic)',
    safeAreaScale: 0.82, // 82% of total area is safe for content
  },
  {
    label: 'Custom Size',
    width_mm: 0,
    height_mm: 0,
    shape: 'rectangle',
    description: 'Enter custom dimensions (for unique layouts)',
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

/**
 * Get safe area dimensions for content based on shape
 * Returns the usable area scale (0-1) where content should be placed
 */
export function getSafeAreaScale(shape: KeychainShape, customScale?: number): number {
  if (customScale !== undefined) return customScale;
  
  switch (shape) {
    case 'heart':
      return 0.82; // 82% of area is safe for heart shape (avoids edges and tip)
    default:
      return 1; // rectangle and square use full area
  }
}

/**
 * Calculate safe content dimensions for a given shape
 */
export function getSafeContentDimensions(
  widthMm: number,
  heightMm: number,
  shape: KeychainShape,
  safeAreaScale?: number
): { width: number; height: number; offsetX: number; offsetY: number } {
  const scale = getSafeAreaScale(shape, safeAreaScale);
  
  if (shape === 'heart') {
    // For heart shape, content is centered and scaled
    const scaledWidth = widthMm * scale;
    const scaledHeight = heightMm * scale;
    const offsetX = (widthMm - scaledWidth) / 2;
    const offsetY = (heightMm - scaledHeight) / 2;
    return { width: scaledWidth, height: scaledHeight, offsetX, offsetY };
  }
  
  // For rectangle/square, use full dimensions
  return { 
    width: widthMm, 
    height: heightMm, 
    offsetX: 0, 
    offsetY: 0 
  };
}

export function getHeartClipPath(): string {
  return `polygon(
    50% 92%,
    44% 86%,
    36% 78%,
    26% 68%,
    16% 56%,
    10% 44%,
    8% 32%,
    10% 20%,
    18% 10%,
    30% 8%,
    40% 12%,
    50% 22%,
    60% 12%,
    70% 8%,
    82% 10%,
    90% 20%,
    92% 32%,
    90% 44%,
    84% 56%,
    74% 68%,
    64% 78%,
    56% 86%
  )`;
}


/**
 * Get CSS clip-path for heart outline (for guides in preview)
 */
export function getHeartOutlinePath(): string {
  // Slightly larger heart outline for guides
  return getHeartClipPath(); // Same shape, just used for outline reference
}


