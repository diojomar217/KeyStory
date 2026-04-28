import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function GET(_req: NextRequest) {
  try {
    const image = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg,#fff7fb,#fffaf0)',
            fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            color: '#6a2f39',
            padding: 48,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 96, height: 96, borderRadius: 18, background: '#F472B6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 36, fontWeight: 800 }}>
              KS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>KeyStory</div>
              <div style={{ marginTop: 8, fontSize: 22, color: '#7d5c64' }}>Capture your memories beautifully</div>
            </div>
          </div>
        </div>
      ),
      size,
    );

    image.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return image;
  } catch (e) {
    try {
      const fallback = new ImageResponse(
        (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#fff7fb,#fffaf0)' }}>
            <div style={{ textAlign: 'center', fontFamily: 'Inter, system-ui, -apple-system' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#6a2f39' }}>KeyStory</div>
            </div>
          </div>
        ),
        size,
      );

      fallback.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      return fallback;
    } catch (inner) {
      return new Response('Failed to generate image', { status: 500 });
    }
  }
}
