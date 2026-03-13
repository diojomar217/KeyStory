// components/PhotoGallery.tsx
import Image from 'next/image';

type Props = {
  photos: string[];
};

export default function PhotoGallery({ photos }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 animate-fade-in">
      {photos.map((url, i) => (
        <div key={i} className="rounded overflow-hidden">
          <Image src={url} alt={`Photo ${i + 1}`} width={300} height={300} className="object-cover w-full h-40" />
        </div>
      ))}
    </div>
  );
}
