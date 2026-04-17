type RsvpNotify = {
  site_id?: string;
  slug?: string;
  name: string;
  attendance: string;
  companions?: number;
  godparent_confirmation?: string;
  message?: string;
};

function escapeHtml(str: string | undefined) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendRsvpNotification(payload: RsvpNotify) {
  // Controlled by env var SEND_RSVP_EMAILS=true
  if (process.env.SEND_RSVP_EMAILS !== 'true') {
    console.info('[email disabled] RSVP notification skipped', payload);
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || `no-reply@${process.env.NEXT_PUBLIC_VERCEL_URL || 'keystory.app'}`;
  const toListRaw = process.env.RSVP_NOTIFICATION_TO || process.env.ADMIN_EMAIL || process.env.EMAIL_TO;

  if (!toListRaw) {
    console.warn('[email] SEND_RSVP_EMAILS enabled but RSVP_NOTIFICATION_TO not set; skipping send');
    return;
  }

  const toList = toListRaw.split(',').map((s) => s.trim()).filter(Boolean);

  const subject = `New RSVP: ${payload.name} — ${payload.attendance}`;
  const html = `
    <h2>New RSVP submitted</h2>
    <ul>
      <li><strong>Site:</strong> ${escapeHtml(payload.slug) || escapeHtml(payload.site_id) || 'unknown'}</li>
      <li><strong>Name:</strong> ${escapeHtml(payload.name)}</li>
      <li><strong>Attendance:</strong> ${escapeHtml(payload.attendance)}</li>
      <li><strong>Companions:</strong> ${escapeHtml(String(payload.companions ?? 0))}</li>
      <li><strong>Godparent Confirmation:</strong> ${escapeHtml(payload.godparent_confirmation) || '—'}</li>
      <li><strong>Message:</strong> ${escapeHtml(payload.message) || '—'}</li>
    </ul>
  `;

  // If RESEND_API_KEY is present, use Resend API (no extra dependency)
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from,
          to: toList,
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.warn('[email] Resend API returned non-OK:', res.status, txt);
      } else {
        console.info('[email] Resend sent RSVP notification');
      }
    } catch (err) {
      console.warn('sendRsvpNotification (Resend) failed', err);
    }

    return;
  }

  // No provider configured; log as fallback
  console.info('[email stub] RSVP notification (no provider configured)', { from, toList, subject, html });
}
