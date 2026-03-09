// components/MusicPlayer.tsx

type Props = {
  songLink?: string;
};

export default function MusicPlayer({ songLink }: Props) {
  if (!songLink) return null;
  return (
    <div className="my-4 animate-fade-in">
      <iframe
        src={songLink}
        width="100%"
        height="80"
        allow="autoplay"
        className="rounded shadow"
        title="Love Song"
      />
    </div>
  );
}
