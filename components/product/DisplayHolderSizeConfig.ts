// Display Holder Size Configuration
// Re-uses the same shape/type as Keychain sizes for compatibility.

import { KeychainSize } from './KeychainSizeConfig';

export const DISPLAY_HOLDER_SIZES: KeychainSize[] = [
  {
    label: 'Display Stand (Small)',
    width_mm: 105,
    height_mm: 148,
    shape: 'rectangle',
    description: 'Small display holder - 105mm × 148mm',
  },
  {
    label: 'Display Stand (Large)',
    width_mm: 80,
    height_mm: 120,
    shape: 'rectangle',
    description: 'Large table display holder - 80mm × 120mm',
  },
  {
    label: 'Custom Size',
    width_mm: 0,
    height_mm: 0,
    shape: 'rectangle',
    description: 'Enter custom dimensions',
  },
];

export function findDisplayHolderSize(label: string): KeychainSize | undefined {
  return DISPLAY_HOLDER_SIZES.find((s) => s.label === label);
}

export default DISPLAY_HOLDER_SIZES;
