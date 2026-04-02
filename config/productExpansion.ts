export type ProductPrintMode = 'front-back-pair' | 'qr-only';
export type ProductBackSideVariant = 'photo' | 'engraved';

export type ProductExpansionPreset = {
  id: 'nfc_keychain' | 'metal_engraved' | 'wallet_insert' | 'sticker_pack' | 'table_stand' | 'wedding_suite';
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
};

export const PRODUCT_EXPANSION_PRESETS: ProductExpansionPreset[] = [
  {
    id: 'nfc_keychain',
    label: 'NFC Tap + QR Keychain',
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
  },
  {
    id: 'metal_engraved',
    label: 'Premium Metal Engraved Series',
    shortLabel: 'Metal Engraved',
    description: 'Luxury brushed-metal concept with engraved back-side guidance for names or vows.',
    sizeLabel: 'Metal Engraved Tag',
    defaultCaption: 'Scan the keepsake',
    defaultSubtitle: 'Laser engraving guide for names, date, or short message',
    defaultCopies: 6,
    sheetMode: 'front-back-pair',
    backSideVariant: 'engraved',
    priceFrom: 499,
    badge: 'Premium',
  },
  {
    id: 'wallet_insert',
    label: 'Mini Cards & Wallet Inserts',
    shortLabel: 'Wallet Insert',
    description: 'Slim card-sized QR keepsake that fits wallets, invitation envelopes, and thank-you packs.',
    sizeLabel: 'Wallet Insert',
    defaultCaption: 'Scan our keepsake',
    defaultSubtitle: 'Slim format for wallets and envelope drops',
    defaultCopies: 12,
    sheetMode: 'front-back-pair',
    backSideVariant: 'photo',
    priceFrom: 129,
    badge: 'Compact',
  },
  {
    id: 'sticker_pack',
    label: 'Matching Sticker QR Pack',
    shortLabel: 'Sticker Pack',
    description: 'Small repeated QR stickers for packaging, freebies, sealing tags, and event giveaways.',
    sizeLabel: 'Sticker Tile',
    defaultCaption: 'Scan me',
    defaultSubtitle: 'Sticker pack sheet',
    defaultCopies: 24,
    sheetMode: 'qr-only',
    backSideVariant: 'photo',
    priceFrom: 89,
    badge: 'Add-on',
  },
  {
    id: 'table_stand',
    label: 'Event Table QR Stands',
    shortLabel: 'QR Stand',
    description: 'Reception-ready QR stand cards for guestbooks, galleries, menus, or memory walls.',
    sizeLabel: 'Table QR Stand',
    defaultCaption: 'Scan to view the event page',
    defaultSubtitle: 'Fold or mount on acrylic stand hardware',
    defaultCopies: 10,
    sheetMode: 'qr-only',
    backSideVariant: 'photo',
    priceFrom: 159,
    badge: 'Events',
  },
  {
    id: 'wedding_suite',
    label: 'Wedding Invitation QR Suite',
    shortLabel: 'Wedding Suite',
    description: 'Invitation companion cards for save-the-date, RSVP, registry, or full wedding microsite access.',
    sizeLabel: 'Wedding Invite Panel',
    defaultCaption: 'Scan for RSVP, details, and registry',
    defaultSubtitle: 'Invitation suite insert with elegant text back',
    defaultCopies: 20,
    sheetMode: 'front-back-pair',
    backSideVariant: 'engraved',
    priceFrom: 249,
    badge: 'Wedding',
  },
];

export const getProductExpansionPreset = (id: ProductExpansionPreset['id']) =>
  PRODUCT_EXPANSION_PRESETS.find((preset) => preset.id === id);
