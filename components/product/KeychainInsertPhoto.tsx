'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { getInsertDimensions, type KeychainShape, getHeartClipPath } from './KeychainSizeConfig';

interface KeychainInsertPhotoProps {
  widthMm: number;
  heightMm: number;
  shape?: KeychainShape;
  coverPhotoUrl?: string;
  coupleNames: string;
  scale?: number;
  printMode?: boolean;
  showGuides?: boolean;
}

export default function KeychainInsertPhoto({
  widthMm,
  heightMm,
  shape = 'rectangle',
  coverPhotoUrl,
  coupleNames,
  scale = 1,
  printMode = false,
  showGuides = true,
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

  const polaroidContainerStyle: CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: '#ffffff',
    border: showGuides && shape === 'heart' ? '2px dashed rgba(0,0,0,0.5)' : (showGuides ? '0.3mm dashed #444' : 'none'),
    boxShadow: 'none',
    borderRadius: shape === 'heart' ? '0' : '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '4px',
    paddingBottom: '10px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    // Apply heart clip-path for heart shape
    ...(shape === 'heart' ? {
      clipPath: getHeartClipPath(),
    } : {}),
  };

  const frameStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#fffefb',
    border: 'none',
    borderRadius: shape === 'heart' ? '0' : '0',
    padding: '3px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: shape === 'heart' ? 'column' : 'column',
    alignItems: 'center',
    justifyContent: shape === 'heart' ? 'center' : 'space-between',
  };

  return (
    <div style={polaroidContainerStyle}>
      <div style={frameStyle}>
        {shape === 'heart' ? (
          // Heart-shaped layout: couple names on top, photo centered within heart
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '6px 4px',
          }}>
            {/* Couple Names - positioned at top for heart shape */}
            {coupleNames && (
              <div
                style={{
                  width: shape === 'heart' ? '70%' : '85%',
                  textAlign: 'center' as const,
                  marginBottom: '4px',
                  padding: '2px 4px',
                  backgroundColor: 'transparent',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
              >
                <p
                  className="text-slate-900 font-semibold"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    letterSpacing: '0.04em',
                    fontSize: Math.max(7, Math.min(10, widthMm * 0.16)) + 'px',
                    lineHeight: 1.1,
                    maxWidth: '100%',
                    margin: 0,
                    textShadow: '0 1px 0 rgba(255,255,255,0.65)',
                  }}
                >
                  {coupleNames}
                </p>
              </div>
            )}
            
            {/* Photo area - centered within heart bounds */}
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{
                flex: 1,
                width: shape === 'heart' ? '70%' : '85%',
                backgroundColor: '#f3f2f0',
                borderRadius: '0',
                overflow: 'hidden',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                minHeight: 'auto',
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
          </div>
        ) : (
          // Rectangle/Square layout: photo above, couple names below
          <>
            {/* Polaroid photo area */}
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{
                width: '100%',
                height: '78%',
                backgroundColor: '#f3f2f0',
                borderRadius: '0',
                overflow: 'hidden',
                border: '1px solid #d8cfc3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
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
              <div
                style={{
                  width: '100%',
                  textAlign: 'center' as const,
                  marginTop: '6px',
                  padding: '8px 10px',
                  backgroundColor: '#fffefb',
                  borderBottomLeftRadius: '0.55rem',
                  borderBottomRightRadius: '0.55rem',
                  minHeight: '22%',
                  boxSizing: 'border-box',

                }}
              >
                <p
                  className="text-slate-900 font-semibold"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    letterSpacing: '0.04em',
                    fontSize: Math.max(7, Math.min(11, widthMm * 0.22)) + 'px',
                    lineHeight: 1.25,
                    maxWidth: '100%',
                    margin: 0,
                    textShadow: '0 1px 0 rgba(255,255,255,0.65)',
                  }}
                >
                  {coupleNames}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

