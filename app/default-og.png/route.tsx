import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function DefaultOg() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: 'linear-gradient(135deg,#fff7fb,#fffaf0)',
          fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 96, height: 96, borderRadius: 18, background: '#F472B6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 40, fontWeight: 700 }}>
            KS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div style={{ fontSize: 56, fontWeight: 800, color: '#6a2f39', lineHeight: 1 }}>
              KeyStory
            </div>
            <div style={{ marginTop: 8, fontSize: 24, color: '#7d5c64' }}>Capture your memories beautifully</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
