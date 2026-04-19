export type ProductPrintMode = 'front-back-pair' | 'qr-only';
export type ProductBackSideVariant = 'photo' | 'engraved';

export type TemplateId = 'classic' | 'premium' | 'floral' | 'minimal' | 'modern';

export type ProductExpansionPreset = {
  id: 'qr_keychain' | 'display_holder';
  label: string;
  shortLabel: string;
  description: string;
  sizeLabel: string;
  defaultCaption: string;
  defaultSubtitle: string;
  defaultCopies: number;
  sheetMode: ProductPrintMode;
  backSideVariant: ProductBackSideVariant;
  priceFrom: number;
  badge: string;
  defaultTemplate?: TemplateId;
  availableTemplates?: TemplateId[];
};

export const PRODUCT_EXPANSION_PRESETS: ProductExpansionPreset[] = [
  {
    id: 'qr_keychain',
    label: 'QR Keychain',
    shortLabel: 'NFC Keychain',
    description: 'Dual-access keepsake with an NFC tap experience plus printed QR backup.',
    sizeLabel: 'NFC Tap Keychain',
    defaultCaption: 'Tap or scan to open our story',
    defaultSubtitle: 'NFC chip placement guide on hardware layer',
    defaultCopies: 8,
    sheetMode: 'front-back-pair',
    backSideVariant: 'photo',
    priceFrom: 349,
    badge: 'Dual Access',
    defaultTemplate: 'classic',
    availableTemplates: ['classic'],
  },
  {
    id: 'display_holder',
    label: 'Display Holder',
    shortLabel: 'Metal Engraved',
    description: 'Luxury brushed-metal concept with engraved back-side guidance for names or vows.',
    sizeLabel: 'Metal Engraved Tag',
    defaultCaption: 'Scan the keepsake',
    defaultSubtitle: 'Laser engraving guide for names, date, or short message',
    defaultCopies: 6,
    // Display holders are single-sided (engraved front). Use qr-only sheet mode.
    sheetMode: 'qr-only',
    backSideVariant: 'engraved',
    priceFrom: 499,
    badge: 'Premium',
    defaultTemplate: 'premium',
    availableTemplates: ['premium', 'floral', 'minimal', 'modern'],
  },
];

export const getProductExpansionPreset = (id: ProductExpansionPreset['id']) =>
  PRODUCT_EXPANSION_PRESETS.find((preset) => preset.id === id);
