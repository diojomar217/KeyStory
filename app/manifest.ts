import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KeyStory',
    short_name: 'KeyStory',
    description: 'Create personalized memory websites connected to QR keychains.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff7fb',
    theme_color: '#ec4899',
    icons: [
      {
        src: '/heart-icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/heart-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
