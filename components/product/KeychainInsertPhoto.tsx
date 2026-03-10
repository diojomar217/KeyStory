'use client';

import Image from 'next/image';
import { getInsertDimensions } from './KeychainSizeConfig';

interface KeychainInsertPhotoProps {
  widthMm: number;
  heightMm: number;
  coverPhotoUrl?: string;
  coupleNames: string;
  scale?: number;
}

export default function KeychainInsertPhoto({
  widthMm,
  heightMm,
  coverPhotoUrl,
  coupleNames,
  scale = 1,
}: KeychainInsertPhotoProps) {
  // Calculate dimensions
  const dimensions = getInsertDimensions(widthMm, heightMm, scale);

  // Photo container size - takes up most of the space
  const photoSize = Math.min(
    Number(dimensions.width.replace('px', '')) * 0.85,
    Number(dimensions.height.replace('px', '')) * 0.65
  );

  // Font size based on width
  const fontSize = Math.max(6, Math.min(12, widthMm * 0.22));

  return (
    <div
      className="flex flex-col items-center justify-center bg-white rounded-lg border-2 border-dashed border-slate-300"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        padding: '4px',
      }}
    >
      {/* Cover Photo */}
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-md bg-slate-100"
        style={{
          width: photoSize,
          height: photoSize,
        }}
      >
        {coverPhotoUrl ? (
          <Image
            src={coverPhotoUrl}
            alt="Couple Cover Photo"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-400 text-xs">No Photo</span>
          </div>
        )}
      </div>

      {/* Couple Names */}
      {coupleNames && (
        <p
          className="text-slate-700 text-center font-semibold mt-1"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1.2,
            maxWidth: '100%',
          }}
        >
          {coupleNames}
        </p>
      )}
    </div>
  );
}

