// lib/qrcode.ts
import QRCode from 'qrcode';

export async function generateQRCode(text: string): Promise<string> {
  return await QRCode.toDataURL(text);
}
