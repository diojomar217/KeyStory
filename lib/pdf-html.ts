import { Site } from '@/lib/supabase';

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

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

function getSectionContent(site: Site) {
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

export function generatePdfHtml(site: Site, slug: string) {
  const siteType = (site.site_type as string) || (site.config?.occasion as string) || 'couple';
  const cfg = site.config || {};
  const customerName = cfg?.people?.primary || site.customer_name || cfg?.customer_name || '';
  const partnerName = cfg?.people?.secondary || site.partner_name || cfg?.partner_name || '';
  const specialDate = cfg?.dates?.special_date || site.specialDate || site.anniversary_date || '';
  const tagline = cfg?.tagline || site.tagline || '';
  const qrCodeUrl = site.qr_code_url || cfg?.qr_data_url || '';
  const sectionContent = getSectionContent(site);
  const timelineEvents = getTimelineEvents(site);
  const photos = getPhotos(site);

  const coverTitle = siteType === 'birthday'
    ? `${escapeHtml(customerName || 'Birthday Celebrant')}'s Birthday Memory Book`
    : `${escapeHtml(customerName || 'Couple')}${partnerName ? ` & ${escapeHtml(partnerName)}` : ''} Memory Book`;

  const secondarySubtitle = siteType === 'birthday'
    ? `Celebration date: ${escapeHtml(formatDate(specialDate))}`
    : `Anniversary date: ${escapeHtml(formatDate(specialDate))}`;

  const coverMessage = escapeHtml(tagline || (siteType === 'birthday'
    ? 'A special keepsake to celebrate a very happy birthday.'
    : 'A beautiful keepsake for your love story.'
  ));

  const items: string[] = [];
  const pushPage = (html: string) => items.push(`<div class="pdf-page">${html}</div>`);

  // Cover page
  pushPage(`
    <div class="cover" style="text-align:center; padding-top:60px;">
      <h1 style="font-size:32px; margin-bottom:16px;">${coverTitle}</h1>
      <p style="font-size:18px; margin-bottom:12px; color:#4b5563;">${secondarySubtitle}</p>
      <p style="font-size:20px; font-style:italic; color:#6b7280;">${coverMessage}</p>
      ${qrCodeUrl ? `<img src="${escapeHtml(qrCodeUrl)}" alt="QR code" width="140" height="140" style="margin-top:28px;border:1px solid #d1d5db;padding:4px;"/><p style="margin-top:10px; font-size:12px;color:#374151;font-weight:bold;">Scan to revisit this memory</p>` : ''}
    </div>
  `);

  if (sectionContent.loveLetter) {
    pushPage(`
      <h2>Message</h2>
      <p>${escapeHtml(sectionContent.loveLetter)}</p>
    `);
  }

  if (timelineEvents.length > 0) {
    pushPage(`
      <h2>Timeline</h2>
      <ol>
        ${timelineEvents.map((item) => `
          <li style="margin-bottom:12px;">
            <strong>${escapeHtml(formatDate(item.date))}</strong> - ${escapeHtml(item.title)}
            ${item.description ? `<p style="margin:4px 0 0;">${escapeHtml(item.description)}</p>` : ''}
          </li>`).join('')}
      </ol>
    `);
  }

  if (photos.length > 0) {
    const photosHtml = photos.map((p) => `<img src="${escapeHtml(p)}" style="width:48%;margin:1%;border-radius:8px;border:1px solid #e5e7eb;" loading="lazy" />`).join('');
    pushPage(`
      <h2>Gallery</h2>
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between;">${photosHtml}</div>
    `);
  }

  if (sectionContent.quotes || sectionContent.reasons || sectionContent.dreams || sectionContent.birthdayWishes) {
    let contentHtml = '';
    if (sectionContent.quotes) contentHtml += `<h3>Quotes</h3><p>${escapeHtml(sectionContent.quotes)}</p>`;
    if (siteType === 'birthday' && sectionContent.birthdayWishes) contentHtml += `<h3>Birthday Wishes</h3><p>${escapeHtml(sectionContent.birthdayWishes)}</p>`;
    if (siteType !== 'birthday' && sectionContent.reasons) contentHtml += `<h3>Reasons</h3><p>${escapeHtml(sectionContent.reasons)}</p>`;
    if (siteType !== 'birthday' && sectionContent.dreams) contentHtml += `<h3>Dreams</h3><p>${escapeHtml(sectionContent.dreams)}</p>`;

    pushPage(`<h2>Memories & Wishes</h2>${contentHtml}`);
  }

  pushPage(`
    <h2>Keepsake</h2>
    <p>${escapeHtml(sectionContent.finalMessage || 'Thank you for building your memory book. Scan the code below to revisit anytime.')}</p>
    ${qrCodeUrl ? `<div style="text-align:center;"><img src="${escapeHtml(qrCodeUrl)}" alt="QR code" width="140" height="140" style="border:1px solid #d1d5db;padding:4px;" /><p style="margin-top:10px;font-size:12px;color:#4b5563;font-weight:600;">Scan to revisit this memory</p></div>` : ''}
  `);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(slug || 'memory-book')}</title>
  <style>
    @page { size: A4; margin: 24mm; }
    body { margin: 0; padding: 0; background: #fff; color: #111; font-family: Helvetica, Arial, sans-serif; }
    .pdf-page { page-break-after: always; padding: 0 8px; }
    .pdf-page:last-child { page-break-after: auto; }
    h1 { font-size: 32px; margin-bottom: 14px; color: #1f2937; }
    h2 { font-size: 24px; margin: 18px 0 10px; color: #1f2937; }
    h3 { font-size: 18px; margin: 12px 0 8px; color: #334155; }
    p { font-size: 15px; margin: 8px 0; white-space: pre-wrap; }
    ol { padding-left: 18px; }
    li { margin-bottom: 10px; }
  </style>
</head>
<body>
  ${items.join('')}
</body>
</html>`;
}
