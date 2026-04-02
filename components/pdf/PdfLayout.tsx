import { Site } from '@/lib/supabase';

interface PdfLayoutProps {
  site: Site;
}

const formatDate = (value?: string) => {
  if (!value || value.trim() === '') return 'Unknown date';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

function normalizeSectionContent(site: Site) {
  const cfg = site.config || {};
  const sectionContent = (cfg.section_content as Record<string, any>) || {};

  return {
    loveLetter: cfg.message || site.message || sectionContent.love_letter || sectionContent.loveLetter || '',
    story: sectionContent.our_story || sectionContent.ourStory || '',
    reasons: sectionContent.reasons_love_you || sectionContent.reasons || '',
    dreams: sectionContent.future_dreams || sectionContent.futureDreams || '',
    quotes: sectionContent.quotes || '',
    birthdayWishes: sectionContent.birthday_wishes || sectionContent.birthdayWishes || '',
    finalMessage: sectionContent.surprise_message || sectionContent.final_message || '',
  };
}

function getTimelineEvents(site: Site) {
  const cfg = site.config || {};
  const events = Array.isArray(cfg.timeline_events)
    ? cfg.timeline_events
    : Array.isArray(cfg.timeline)
      ? cfg.timeline
      : [];

  if (!Array.isArray(events)) return [];

  return events
    .map((event: any) => ({
      title: event.title || event.name || '',
      date: event.date || event.when || '',
      description: event.description || event.details || '',
    }))
    .filter((e: any) => e.title || e.date || e.description);
}

function getPhotos(site: Site) {
  const cfg = site.config || {};
  const photos = Array.isArray(cfg?.media?.photos)
    ? cfg.media.photos
    : Array.isArray(site.photos)
      ? site.photos
      : Array.isArray(cfg.photos)
        ? cfg.photos
        : [];

  if (!Array.isArray(photos)) return [];
  return photos.filter((p) => typeof p === 'string' && p).slice(0, 12);
}

export default function PdfLayout({ site }: PdfLayoutProps) {
  const siteType = (site.site_type as string) || (site.config?.occasion as string) || 'couple';
  const config = site.config || {};

  const customerName = config?.people?.primary || site.customer_name || config?.customer_name || '';
  const partnerName = config?.people?.secondary || site.partner_name || config?.partner_name || '';
  const specialDate = config?.dates?.special_date || site.specialDate || '';
  const tagline = config?.tagline || site.tagline || '';
  const qrCodeUrl = site.qr_code_url || config?.qr_data_url || '';
  const { loveLetter, story, reasons, dreams, quotes, birthdayWishes, finalMessage } = normalizeSectionContent(site);
  const timelineEvents = getTimelineEvents(site);
  const photos = getPhotos(site);

  const coverTitle = siteType === 'birthday'
    ? `${customerName || 'Birthday Celebrant'}'s Birthday Memory Book`
    : `${customerName || 'Couple'} ${partnerName ? `& ${partnerName}` : ''} Memory Book`;

  const secondarySubtitle = siteType === 'birthday'
    ? `Celebration date: ${formatDate(specialDate)}`
    : `Anniversary date: ${formatDate(specialDate)}`;

  const coverMessage = tagline || (siteType === 'birthday'
    ? 'A special keepsake to celebrate a very happy birthday.'
    : 'A beautiful keepsake for your love story.'
  );

  return (
    <div className="pdf-root" style={{ width: '100%', color: '#111', fontFamily: 'Helvetica, Arial, sans-serif', lineHeight: 1.5 }}>
      {/* Cover Page */}
      <section className="pdf-page" style={{ padding: '28px', pageBreakAfter: 'always' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '18px', color: '#1f2937' }}>{coverTitle}</h1>
        <p style={{ fontSize: '18px', marginBottom: '10px', color: '#4b5563' }}>{secondarySubtitle}</p>
        <p style={{ fontSize: '20px', fontStyle: 'italic', color: '#6b7280' }}>{coverMessage}</p>
        {qrCodeUrl && (
          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <img src={qrCodeUrl} alt="QR code" width="140" height="140" style={{ border: '1px solid #d1d5db', padding: '4px' }} />
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#374151' }}><strong>Scan to revisit this memory</strong></p>
          </div>
        )}
      </section>

      {/* Love Letter / Message */}
      {loveLetter && (
        <section className="pdf-page" style={{ padding: '28px', pageBreakAfter: 'always' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#1f2937' }}>Message</h2>
          <p style={{ fontSize: '16px', whiteSpace: 'pre-wrap', color: '#374151' }}>{loveLetter}</p>
        </section>
      )}

      {/* Timeline */}
      {timelineEvents.length > 0 && (
        <section className="pdf-page" style={{ padding: '28px', pageBreakAfter: 'always' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#1f2937' }}>Timeline</h2>
          <ol style={{ paddingLeft: '18px', color: '#374151' }}>
            {timelineEvents.map((item, index) => (
              <li key={`timeline-${index}`} style={{ marginBottom: '12px' }}>
                <strong>{formatDate(item.date)}</strong> - <span>{item.title}</span>
                {item.description && <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{item.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Gallery */}
      {photos.length > 0 && (
        <section className="pdf-page" style={{ padding: '28px', pageBreakAfter: 'always' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#1f2937' }}>Gallery</h2>
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {photos.map((photo, index) => (
              <img
                key={`photo-${index}`}
                src={photo}
                alt={`Photo ${index + 1}`}
                style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quotes / Reasons / Dreams */}
      {(quotes || reasons || dreams || birthdayWishes) && (
        <section className="pdf-page" style={{ padding: '28px', pageBreakAfter: 'always' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#1f2937' }}>Memories & Wishes</h2>

          {quotes && (
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '6px', color: '#334155' }}>Quotes</h3>
              <p style={{ fontSize: '15px', whiteSpace: 'pre-wrap', color: '#475569' }}>{quotes}</p>
            </div>
          )}

          {siteType === 'birthday' ? (
            birthdayWishes && (
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '6px', color: '#334155' }}>Birthday Wishes</h3>
                <p style={{ fontSize: '15px', whiteSpace: 'pre-wrap', color: '#475569' }}>{birthdayWishes}</p>
              </div>
            )
          ) : (
            <>
              {reasons && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '6px', color: '#334155' }}>Reasons We Love Each Other</h3>
                  <p style={{ fontSize: '15px', whiteSpace: 'pre-wrap', color: '#475569' }}>{reasons}</p>
                </div>
              )}

              {dreams && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '6px', color: '#334155' }}>Future Dreams</h3>
                  <p style={{ fontSize: '15px', whiteSpace: 'pre-wrap', color: '#475569' }}>{dreams}</p>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* End Page (QR + Final Message) */}
      <section className="pdf-page" style={{ padding: '28px', pageBreakAfter: 'auto' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#1f2937' }}>Keepsake</h2>
        {finalMessage ? (
          <p style={{ fontSize: '16px', marginBottom: '14px', whiteSpace: 'pre-wrap', color: '#374151' }}>{finalMessage}</p>
        ) : (
          <p style={{ fontSize: '16px', marginBottom: '14px', color: '#374151' }}>
            Thank you for building your memory book. Scan the code below to revisit anytime.
          </p>
        )}

        {qrCodeUrl && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <img src={qrCodeUrl} alt="QR code" width="140" height="140" style={{ border: '1px solid #d1d5db', padding: '4px' }} />
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#4b5563' }}><strong>Scan to revisit this memory</strong></p>
          </div>
        )}
      </section>
    </div>
  );
}
