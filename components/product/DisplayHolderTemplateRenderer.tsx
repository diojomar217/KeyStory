'use client';

import React from 'react';
import type { OccasionType } from '@/lib/occasion-registry';

export type SiteData = {
  occasionType: OccasionType | string;
  customerName: string;
  partnerName?: string;
  eventName?: string;
  celebrantName?: string;
  date?: string;
  time?: string;
  location?: string;
  message?: string;
  tagline?: string;
  media?: { photos?: string[] };
  participants?: Array<{ id?: string; name?: string; role?: string }>;
  qrCodeUrl?: string;
  selectedPhotoUrl?: string;
  showPhotoOnPanel?: boolean;
};

interface Props {
  site: SiteData;
  templateStyle?: 'minimal' | 'floral' | 'classic' | 'premium' | 'modern';
  showCutlines?: boolean;
  qrCaption?: string;
  widthMm?: number;
  heightMm?: number;
}

function mm(value?: number, fallback?: number) {
  return `${value ?? fallback ?? 0}mm`;
}

function PanelShell({
  children,
  widthMm,
  heightMm,
  background,
}: {
  children: React.ReactNode;
  widthMm?: number;
  heightMm?: number;
  background?: string;
}) {
  return (
    <div
      style={{
        width: mm(widthMm, 105),
        height: mm(heightMm, 148),
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        background:
          background ||
          'linear-gradient(180deg, #fdf1f2 0%, #fbe7e8 32%, #fff6f4 68%, #fdebed 100%)',
      }}
    >
      {/* soft watercolor overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top left, rgba(255,184,197,0.28), transparent 28%), radial-gradient(circle at top right, rgba(255,205,214,0.22), transparent 24%), radial-gradient(circle at bottom left, rgba(255,192,203,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(255,214,220,0.18), transparent 24%)',
          pointerEvents: 'none',
        }}
      />

      {/* paper feel */}
      <div
        style={{
          position: 'absolute',
          inset: '4mm',
          background: 'rgba(255,255,255,0.22)',
          borderRadius: '2mm',
          boxShadow: 'inset 0 0 0 0.2mm rgba(255,255,255,0.35)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          padding: '8mm 7mm 7mm',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ScriptText({
  children,
  size = 24,
  align = 'left',
  color = '#7b2e35',
  marginBottom = '0',
}: {
  children: React.ReactNode;
  size?: number;
  align?: 'left' | 'center' | 'right';
  color?: string;
  marginBottom?: string;
}) {
  return (
    <div
      style={{
        fontFamily: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive',
        fontSize: `${size}px`,
        lineHeight: 1.05,
        color,
        textAlign: align,
        marginBottom,
      }}
    >
      {children}
    </div>
  );
}

function BodyText({
  children,
  size = 11,
  align = 'center',
  color = '#6c3a3d',
}: {
  children?: React.ReactNode;
  size?: number;
  align?: 'left' | 'center' | 'right';
  color?: string;
}) {
  if (!children) return null;

  return (
    <div
      style={{
        fontSize: `${size}px`,
        lineHeight: 1.58,
        color,
        textAlign: align,
        whiteSpace: 'pre-line',
      }}
    >
      {children}
    </div>
  );
}

function SmallDetail({
  children,
}: {
  children?: React.ReactNode;
}) {
  if (!children) return null;

  return (
    <div
      style={{
        fontSize: '9px',
        lineHeight: 1.35,
        color: '#9a6a6f',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

function FloralPhotoFrame({
  src,
  widthMm = 42,
  heightMm = 42,
}: {
  src?: string;
  widthMm?: number;
  heightMm?: number;
}) {
  if (!src) return null;

  return (
    <div
      style={{
        position: 'relative',
        width: mm(widthMm),
        height: mm(heightMm),
        margin: '0 auto',
      }}
    >
      {/* outer decorative lines */}
      <div
        style={{
          position: 'absolute',
          inset: '-2mm',
          border: '0.5mm solid rgba(210, 138, 193, 0.55)',
          transform: 'rotate(8deg)',
          borderRadius: '10mm',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '-1mm',
          border: '0.5mm solid rgba(227, 163, 103, 0.55)',
          transform: 'rotate(-8deg)',
          borderRadius: '10mm',
        }}
      />

      {/* photo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: '50%',
          border: '1.2mm solid rgba(255,255,255,0.95)',
          boxShadow: '0 1mm 3mm rgba(137, 88, 92, 0.12)',
          background: '#f7efef',
        }}
      >
        <img
          src={src}
          alt="Photo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* tiny floral accents */}
      <div
        style={{
          position: 'absolute',
          left: '-6mm',
          bottom: '2mm',
          fontSize: '14px',
          color: '#be7ad4',
          opacity: 0.85,
        }}
      >
        ✿
      </div>
      <div
        style={{
          position: 'absolute',
          right: '-5mm',
          bottom: '-1mm',
          fontSize: '13px',
          color: '#c88bcf',
          opacity: 0.85,
        }}
      >
        ✿
      </div>
    </div>
  );
}

function MiniQR({
  url,
  caption,
  sizeMm = 18,
}: {
  url?: string;
  caption?: string;
  sizeMm?: number;
}) {
  if (!url) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '3mm',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '1.2mm',
          borderRadius: '2mm',
          boxShadow: '0 0 0 0.3mm rgba(214, 188, 190, 0.65)',
        }}
      >
        <img
          src={url}
          alt="QR code"
          style={{
            width: mm(sizeMm),
            height: mm(sizeMm),
            display: 'block',
          }}
        />
      </div>

      <div
        style={{
          marginTop: '1.2mm',
          fontSize: '8px',
          color: '#9a6a6f',
          textAlign: 'center',
        }}
      >
        {caption}
      </div>
    </div>
  );
}

function BaptismLetterTemplate({
  site,
  caption,
  widthMm,
  heightMm,
}: {
  site: SiteData;
  caption?: string;
  widthMm?: number;
  heightMm?: number;
}) {
  const photo = site.selectedPhotoUrl || site.media?.photos?.[0];
  const small = (widthMm ?? 105) <= 80;

  const greetingName = site.customerName || 'Our Dear Guest';
  const celebrant = site.celebrantName || site.eventName || 'Our Little One';

  // participant lookup: prefer normalized participants array when present
  const participants = site.participants || [];
  const childName = participants.find((p) => p.id === 'child' || p.role === 'celebrant')?.name || celebrant || site.customerName;
  const parent1 =
    participants.find((p) => p.id === 'parent_1')?.name || participants.find((p) => p.role === 'parent')?.name || '';
  const parent2 = participants.find((p) => p.id === 'parent_2')?.name || participants.filter((p) => p.role === 'parent')[1]?.name || '';

  const fallbackMessage = `As we prepare for ${celebrant}'s baptism and birthday, we've been thinking about the people we trust and look up to.

Those who can help guide and support her as she grows.

With that, we would be honored to have you as one of her godparents.

Your presence in our lives means a lot to us, and we would truly appreciate your guidance and love in the years to come.

We hope you can be part of this special milestone.`;

  return (
    <PanelShell
      widthMm={widthMm}
      heightMm={heightMm}
      background="linear-gradient(180deg, #fdf0f2 0%, #fbe8ea 38%, #fff4f2 68%, #fdecef 100%)"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <ScriptText
          size={small ? 19 : 24}
          align="left"
          marginBottom={small ? '3mm' : '4mm'}
        >
          {`Hi ${greetingName},`}
        </ScriptText>

        <div style={{ padding: small ? '0 1mm' : '0 2mm' }}>
          <BodyText size={small ? 9.2 : 11}>
            {site.message || fallbackMessage}
          </BodyText>
        </div>

        {(site.date || site.time || site.location) ? (
          <div style={{ marginTop: small ? '3mm' : '4mm' }}>
            <SmallDetail>
              {[site.date, site.time, site.location].filter(Boolean).join(' • ')}
            </SmallDetail>
          </div>
        ) : null}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: photo ? '1fr 1fr' : '1fr',
            gap: small ? '3mm' : '4mm',
            alignItems: 'end',
            marginTop: 'auto',
            paddingTop: '4mm',
          }}
        >
          {photo ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
              }}
            >
              <FloralPhotoFrame
                src={photo}
                widthMm={small ? 28 : 38}
                heightMm={small ? 28 : 38}
              />
            </div>
          ) : (
            <div />
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: photo ? 'flex-end' : 'center',
              justifyContent: 'flex-end',
            }}
          >
            <ScriptText
              size={small ? 18 : 24}
              align={photo ? 'right' : 'center'}
              marginBottom="1mm"
            >
              With love,
            </ScriptText>

            <div
              style={{
                fontSize: `${small ? 10 : 12}px`,
                color: '#7b2e35',
                textAlign: photo ? 'right' : 'center',
                lineHeight: 1.35,
                fontWeight: 500,
              }}
            >
              {(() => {
                const signature = parent1 ? (parent2 ? `${parent1} & ${parent2}` : parent1) : (site.tagline || site.partnerName || 'Adrian & Jenica');
                return signature;
              })()}
            </div>

            <MiniQR
              url={site.qrCodeUrl}
              caption={caption}
              sizeMm={small ? 14 : 18}
            />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

function BirthdayTemplate({
  site,
  caption,
  widthMm,
  heightMm,
}: {
  site: SiteData;
  caption?: string;
  widthMm?: number;
  heightMm?: number;
}) {
  const photo = site.selectedPhotoUrl || site.media?.photos?.[0];
  const small = (widthMm ?? 105) <= 80;

  return (
    <PanelShell
      widthMm={widthMm}
      heightMm={heightMm}
      background="linear-gradient(180deg, #fff6f7 0%, #fff1f1 45%, #fff9f7 100%)"
    >
      {photo ? (
        <div style={{ marginBottom: '4mm' }}>
          <FloralPhotoFrame
            src={photo}
            widthMm={small ? 28 : 36}
            heightMm={small ? 28 : 36}
          />
        </div>
      ) : null}

      <div style={{ marginTop: photo ? '0' : '6mm' }}>
        <ScriptText size={small ? 18 : 22} align="center" marginBottom="2mm">
          You're Invited
        </ScriptText>

        <div
          style={{
            textAlign: 'center',
            fontFamily: 'serif',
            fontSize: `${small ? 15 : 18}px`,
            color: '#6b3038',
            fontWeight: 600,
          }}
        >
          {site.eventName || site.customerName || 'Birthday Celebration'}
        </div>

        <div style={{ marginTop: '4mm' }}>
          <BodyText size={small ? 9 : 10.5} align="center">
            {site.message ||
              'Join us for a joyful celebration filled with love, laughter, and beautiful memories.'}
          </BodyText>
        </div>
      </div>

      <div style={{ marginTop: '4mm' }}>
        <SmallDetail>
          {[site.date, site.time, site.location].filter(Boolean).join(' • ')}
        </SmallDetail>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <MiniQR url={site.qrCodeUrl} caption={caption} sizeMm={small ? 14 : 18} />
      </div>
    </PanelShell>
  );
}

function CoupleTemplate({
  site,
  caption,
  widthMm,
  heightMm,
}: {
  site: SiteData;
  caption?: string;
  widthMm?: number;
  heightMm?: number;
}) {
  const photo = site.selectedPhotoUrl || site.media?.photos?.[0];
  const small = (widthMm ?? 105) <= 80;

  return (
    <PanelShell
      widthMm={widthMm}
      heightMm={heightMm}
      background="linear-gradient(180deg, #fff8f8 0%, #fff1f2 42%, #fffaf8 100%)"
    >
      {photo ? (
        <div style={{ marginBottom: '4mm' }}>
          <FloralPhotoFrame
            src={photo}
            widthMm={small ? 28 : 36}
            heightMm={small ? 28 : 36}
          />
        </div>
      ) : null}

      <ScriptText size={small ? 18 : 22} align="center" marginBottom="2mm">
        Our Keepsake
      </ScriptText>

      <div
        style={{
          textAlign: 'center',
          fontFamily: 'serif',
          fontSize: `${small ? 16 : 20}px`,
          color: '#6b3038',
          lineHeight: 1.15,
          fontWeight: 600,
        }}
      >
        {site.customerName}
        {site.partnerName ? ` & ${site.partnerName}` : ''}
      </div>

      <div style={{ marginTop: '4mm' }}>
        <BodyText size={small ? 9 : 10.5} align="center">
          {site.message || site.tagline || 'A little story you can always keep close.'}
        </BodyText>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <MiniQR url={site.qrCodeUrl} caption={caption} sizeMm={small ? 14 : 18} />
      </div>
    </PanelShell>
  );
}

function DefaultTemplate({
  site,
  caption,
  widthMm,
  heightMm,
}: {
  site: SiteData;
  caption?: string;
  widthMm?: number;
  heightMm?: number;
}) {
  return (
    <PanelShell widthMm={widthMm} heightMm={heightMm}>
      <ScriptText size={22} align="center" marginBottom="3mm">
        Special Event
      </ScriptText>

      <BodyText align="center">
        {site.message || site.eventName || 'A beautiful keepsake made for a meaningful moment.'}
      </BodyText>

      <div style={{ marginTop: '4mm' }}>
        <SmallDetail>
          {[site.date, site.time, site.location].filter(Boolean).join(' • ')}
        </SmallDetail>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <MiniQR url={site.qrCodeUrl} caption={caption} />
      </div>
    </PanelShell>
  );
}

export default function DisplayHolderTemplateRenderer({
  site,
  templateStyle = 'premium',
  showCutlines = false,
  qrCaption,
  widthMm,
  heightMm,
}: Props) {
  const caption =
    qrCaption ||
    (site.occasionType === 'couple'
      ? 'Scan to see the story'
      : 'Scan the keepsake');

  const occasion = (site.occasionType || 'default') as OccasionType;

  const content =
    occasion === 'baptism' ? (
      <BaptismLetterTemplate
        site={site}
        caption={caption}
        widthMm={widthMm}
        heightMm={heightMm}
      />
    ) : occasion === 'birthday' ? (
      <BirthdayTemplate
        site={site}
        caption={caption}
        widthMm={widthMm}
        heightMm={heightMm}
      />
    ) : occasion === 'couple' ? (
      <CoupleTemplate
        site={site}
        caption={caption}
        widthMm={widthMm}
        heightMm={heightMm}
      />
    ) : (
      <DefaultTemplate
        site={site}
        caption={caption}
        widthMm={widthMm}
        heightMm={heightMm}
      />
    );

  if (!showCutlines) return content;

  return (
    <div
      style={{
        position: 'relative',
        width: mm(widthMm, 105),
        height: mm(heightMm, 148),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px dashed #d9c7cb',
          pointerEvents: 'none',
        }}
      />
      {content}
    </div>
  );
}