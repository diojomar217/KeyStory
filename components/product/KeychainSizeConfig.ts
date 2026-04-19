// Keychain Size Configuration
// All sizes in millimeters (mm)

export type KeychainShape = 'rectangle' | 'square' | 'heart';

export interface KeychainSize {
  label: string;
  width_mm: number;
  height_mm: number;
  shape: KeychainShape;
  description?: string;
  safeAreaScale?: number;
}

// Predefined keychain sizes
export const KEYCHAIN_SIZES: KeychainSize[] = [
  {
    label: 'Keychain - SM',
    width_mm: 31,
    height_mm: 48,
    shape: 'rectangle',
    description: 'QR keychain size - 31mm × 48mm',
  },
  {
    label: 'Custom Size',
    width_mm: 0,
    height_mm: 0,
    shape: 'rectangle',
    description: 'Enter custom dimensions',
  },
];

const MM_TO_PX = 3.7795;
const MM_TO_INCH = 0.0393701;

export function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX);
}

export function mmToInch(mm: number): number {
  return mm * MM_TO_INCH;
}

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

  const columns = Math.max(1, Math.floor((usableWidth + gapMm) / (insertWidthMm + gapMm)));
  const rows = Math.max(1, Math.floor((usableHeight + gapMm) / (insertHeightMm + gapMm)));

  return {
    columns,
    rows,
    total: columns * rows,
  };
}

export function getInsertDimensions(
  widthMm: number,
  heightMm: number,
  scale: number = 1
): { width: string; height: string } {
  const widthPx = mmToPx(widthMm) * scale;
  const heightPx = mmToPx(heightMm) * scale;

  return {
    width: `${widthPx}px`,
    height: `${heightPx}px`,
  };
}

export function getPrintDimensions(
  widthMm: number,
  heightMm: number
): { width: string; height: string } {
  return {
    width: `${widthMm}mm`,
    height: `${heightMm}mm`,
  };
}

export function findKeychainSize(label: string): KeychainSize | undefined {
  return KEYCHAIN_SIZES.find((size) => size.label === label);
}

export function getSafeAreaScale(shape: KeychainShape, customScale?: number): number {
  if (customScale !== undefined) return customScale;

  switch (shape) {
    case 'heart':
      return 0.82;
    default:
      return 1;
  }
}

export function getSafeContentDimensions(
  widthMm: number,
  heightMm: number,
  shape: KeychainShape,
  safeAreaScale?: number
): { width: number; height: number; offsetX: number; offsetY: number } {
  const scale = getSafeAreaScale(shape, safeAreaScale);

  if (shape === 'heart') {
    const scaledWidth = widthMm * scale;
    const scaledHeight = heightMm * scale;
    const offsetX = (widthMm - scaledWidth) / 2;
    const offsetY = (heightMm - scaledHeight) / 2;
    return { width: scaledWidth, height: scaledHeight, offsetX, offsetY };
  }

  return {
    width: widthMm,
    height: heightMm,
    offsetX: 0,
    offsetY: 0,
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