import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const data = search.get('data') || search.get('url');

  if (!data) {
    return new NextResponse('Missing query parameter: data', { status: 400 });
  }

  try {
    const pngBuffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 512,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      type: 'png',
    });

    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('QR generation failed:', error);
    return new NextResponse('Failed to generate QR', { status: 500 });
  }
}
