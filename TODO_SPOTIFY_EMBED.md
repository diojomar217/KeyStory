# Spotify Embed Fix TODO

## Task
Fix the Spotify embed issue in Next.js App Router + TypeScript + Tailwind project.

## Steps

- [x] 1. Create helper function `lib/musicEmbed.ts` with `getMusicEmbedInfo()` function
- [x] 2. Update `components/SongSection.tsx` to use helper and handle Spotify
- [x] 3. Update `components/MusicPlayer.tsx` to use helper and handle Spotify

## Details

### lib/musicEmbed.ts
- Detect provider: 'youtube' | 'spotify' | null
- For Spotify, support: track, album, playlist
- Convert Spotify URLs to embed format:
  - https://open.spotify.com/track/ID -> https://open.spotify.com/embed/track/ID
  - https://open.spotify.com/album/ID -> https://open.spotify.com/embed/album/ID
  - https://open.spotify.com/playlist/ID -> https://open.spotify.com/embed/playlist/ID
- Return typed response with provider and embedUrl

### SongSection.tsx
- Use helper function to get provider and embed URL
- Render YouTube iframe for youtube provider
- Render Spotify iframe for spotify provider
- Use proper iframe attributes: allow, loading, referrerPolicy
- Make Spotify iframe responsive and styled

### MusicPlayer.tsx
- Similar updates as SongSection.tsx

## COMPLETED ✓
All steps completed. Spotify links will now render correctly as embedded Spotify players.

