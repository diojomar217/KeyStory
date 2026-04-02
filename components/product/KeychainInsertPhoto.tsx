'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  getInsertDimensions,
  type KeychainShape,
  getHeartClipPath,
} from './KeychainSizeConfig';

interface KeychainInsertPhotoProps {
  widthMm: number;
  heightMm: number;
  shape?: KeychainShape;
  coverPhotoUrl?: string;
  coupleNames: string;
  scale?: number;
  printMode?: boolean;
  showGuides?: boolean;
  photoTransform?: {
    zoom: number;
    offsetX: number;
    offsetY: number;
  };
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
  photoTransform,
}: KeychainInsertPhotoProps) {
  const dimensions = getInsertDimensions(widthMm, heightMm, scale);

  const zoom = Math.max(1, Math.min(2.2, photoTransform?.zoom ?? 1));
  const offsetX = Math.max(-40, Math.min(40, photoTransform?.offsetX ?? 0));
  const offsetY = Math.max(-40, Math.min(40, photoTransform?.offsetY ?? 0));

  const objectPosX = 50 + offsetX;
  const objectPosY = 50 + offsetY;

  const imageStyle: CSSProperties = {
    objectFit: 'cover',
    objectPosition: `${objectPosX}% ${objectPosY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: 'center center',
  };

  const nameFontSize =
    shape === 'heart'
      ? Math.max(7, Math.min(10, widthMm * 0.16))
      : Math.max(7, Math.min(10.5, widthMm * 0.19));

  if (shape === 'heart') {
    const heartContainerStyle: CSSProperties = {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#ffffff',
      border: showGuides && !printMode ? '2px dashed rgba(0,0,0,0.5)' : 'none',
      boxShadow: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'visible',
      clipPath: getHeartClipPath(),
    };

    const heartInnerStyle: CSSProperties = {
      width: '100%',
      height: '100%',
      backgroundColor: '#fffefb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '6px 4px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    };

    return (
      <div style={heartContainerStyle}>
        <div style={heartInnerStyle}>
          {coupleNames && (
            <div
              style={{
                width: '70%',
                textAlign: 'center',
                marginBottom: '4px',
                padding: '2px 4px',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              <p
                className="text-slate-900 font-semibold"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  letterSpacing: '0.04em',
                  fontSize: `${nameFontSize}px`,
                  lineHeight: 1.1,
                  margin: 0,
                  textShadow: printMode ? 'none' : '0 1px 0 rgba(255,255,255,0.65)',
                  wordBreak: 'break-word',
                }}
              >
                {coupleNames}
              </p>
            </div>
          )}

          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              flex: 1,
              width: '70%',
              backgroundColor: '#f3f2f0',
              overflow: 'hidden',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            {coverPhotoUrl ? (
              <Image
                src={coverPhotoUrl}
                alt="Couple Cover Photo"
                fill
                className="object-cover"
                style={imageStyle}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-slate-400 text-xs">No Photo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const containerStyle: CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: '#ffffff',
    border: showGuides && !printMode ? '0.3mm dashed #444' : 'none',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'visible',
    padding: 0,
    boxShadow: 'none',
  };

  const polaroidStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#fffefb',
    border: printMode ? 'none' : '1px solid #e7ddd2',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    overflow: 'hidden',
    paddingTop: printMode ? '1mm' : '4%',
    paddingLeft: printMode ? '1mm' : '4%',
    paddingRight: printMode ? '1mm' : '4%',
    paddingBottom: printMode ? '1.4mm' : '6%',
    rowGap: printMode ? '0.8mm' : 0,
  };

  const photoFrameStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: 0,
    backgroundColor: '#f3f2f0',
    border: '1px solid #ddd2c6',
    overflow: 'hidden',
  };

  const nameWrapStyle: CSSProperties = {
    width: '100%',
    textAlign: 'center',
    paddingTop: printMode ? '0.2mm' : '6%',
    paddingLeft: printMode ? '0.6mm' : '4%',
    paddingRight: printMode ? '0.6mm' : '4%',
    paddingBottom: 0,
    backgroundColor: '#fffefb',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <div style={polaroidStyle}>
        <div style={photoFrameStyle}>
          {coverPhotoUrl ? (
            <Image
              src={coverPhotoUrl}
              alt="Couple Cover Photo"
              fill
              className="object-cover"
              style={imageStyle}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-400 text-xs">No Photo</span>
            </div>
          )}
        </div>

        {coupleNames && (
          <div style={nameWrapStyle}>
            <p
              className="text-slate-900 font-semibold"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                letterSpacing: '0.03em',
                fontSize: `${nameFontSize}px`,
                lineHeight: 1.12,
                margin: 0,
                textShadow: printMode ? 'none' : '0 1px 0 rgba(255,255,255,0.65)',
                wordBreak: 'break-word',
              }}
            >
              {coupleNames}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}