// lib/qrcode.ts
import QRCode from 'qrcode';

/**
 * Generate a reliable base QR code for storage in database.
 * This creates a simple, high-contrast QR code optimized for scanning reliability.
 * The romantic styling is applied client-side in QRSection.tsx using qr-code-styling.
 */
export async function generateQRCode(text: string): Promise<string> {
  // Generate a reliable QR code with high error correction level
  // to ensure scanning works even with the styled overlay
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H', // High error correction - 30% recovery
    margin: 1,
    width: 400,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}
