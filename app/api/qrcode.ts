// app/api/qrcode.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateQRCode } from '@/lib/qrcode';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  const qrCodeUrl = await generateQRCode(url);
  return NextResponse.json({ qrCodeUrl });
}
