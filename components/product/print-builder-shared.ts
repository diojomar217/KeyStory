export type PhotoTransform = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

export type QrPreset = 'classic' | 'modern' | 'minimal' | 'elegant' | 'bold';

export type SharedQrDesign = {
  dotsColor: string;
  backgroundColor: string;
  cornersColor: string;
  dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  cornersType: 'square' | 'dot' | 'extra-rounded';
  cornersDotType: 'dot' | 'square';
  logoUrl?: string;
};

export const QR_LOGO_OPTIONS = [
  { label: 'None', value: undefined },
  { label: 'Heart', value: '/heart-icon.svg' },
  { label: 'File', value: '/file.svg' },
  { label: 'Globe', value: '/globe.svg' },
  { label: 'Window', value: '/window.svg' },
  { label: 'Vercel', value: '/vercel.svg' },
] as const;

export const QR_PRESETS: Record<QrPreset, SharedQrDesign> = {
  classic: {
    dotsColor: '#000000',
    backgroundColor: '#ffffff',
    cornersColor: '#000000',
    dotsType: 'square',
    cornersType: 'square',
    cornersDotType: 'square',
    logoUrl: '/heart-icon.svg',
  },
  modern: {
    dotsColor: '#6366f1',
    backgroundColor: '#ffffff',
    cornersColor: '#6366f1',
    dotsType: 'rounded',
    cornersType: 'extra-rounded',
    cornersDotType: 'dot',
    logoUrl: '/heart-icon.svg',
  },
  minimal: {
    dotsColor: '#374151',
    backgroundColor: '#f9fafb',
    cornersColor: '#374151',
    dotsType: 'dots',
    cornersType: 'dot',
    cornersDotType: 'dot',
    logoUrl: '/heart-icon.svg',
  },
  elegant: {
    dotsColor: '#7c3aed',
    backgroundColor: '#ffffff',
    cornersColor: '#7c3aed',
    dotsType: 'classy',
    cornersType: 'extra-rounded',
    cornersDotType: 'dot',
    logoUrl: '/heart-icon.svg',
  },
  bold: {
    dotsColor: '#dc2626',
    backgroundColor: '#ffffff',
    cornersColor: '#dc2626',
    dotsType: 'extra-rounded',
    cornersType: 'extra-rounded',
    cornersDotType: 'square',
    logoUrl: '/heart-icon.svg',
  },
};

export function createDefaultPhotoTransform(): PhotoTransform {
  return {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  };
}

export function validateScanability(dotsColor: string, bgColor: string): string | null {
  const getLuminance = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lumDots = getLuminance(dotsColor);
  const lumBg = getLuminance(bgColor);
  const ratio = lumBg > lumDots ? lumBg / lumDots : lumDots / lumBg;

  if (ratio < 3) return '⚠️ Low contrast - QR may not scan reliably';
  if (ratio < 4.5) return '⚠️ Poor contrast - test scanning before printing';
  return null;
}

export function duplicateConfig<T extends { photoTransform?: PhotoTransform; qrDesign?: SharedQrDesign }>(
  config: T
): T {
  return {
    ...config,
    photoTransform: config.photoTransform ? { ...config.photoTransform } : undefined,
    qrDesign: config.qrDesign ? { ...config.qrDesign } : undefined,
  };
}