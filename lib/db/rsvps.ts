import { supabase } from '@/lib/supabase';
import supabaseAdmin from '@/lib/supabaseAdmin';

export type RsvpRecord = {
  id: string;
  site_id: string;
  name: string;
  contact_number?: string;
  attendance: string;
  godparent_confirmation?: string;
  companions?: number;
  message?: string;
  created_at?: string;
};

export type InsertRsvpInput = {
  site_id?: string;
  slug?: string;
  name: string;
  contact_number?: string;
  attendance: string;
  godparent_confirmation?: string;
  companions?: number;
  message?: string;
};

export async function insertRsvp(input: InsertRsvpInput) {
  const siteId = (input.site_id || '').trim();
  const slug = (input.slug || '').trim();
  const name = (input.name || '').trim();
  const attendance = (input.attendance || '').trim();

  if (!name || !attendance) {
    throw new Error('name and attendance are required');
  }

  let resolvedSiteId = siteId;

  if (!resolvedSiteId && slug) {
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('website_name', slug)
      .maybeSingle();
    if (siteError) throw siteError;
    if (!site) throw new Error('Site not found');
    resolvedSiteId = site.id;
  }

  if (!resolvedSiteId) {
    throw new Error('site_id or slug must be provided');
  }

  // Simple duplicate prevention (same name + attendance within 30 seconds)
  const dedupeSince = new Date(Date.now() - 30 * 1000).toISOString();
  const { data: recent, error: recentError } = await supabase
    .from('rsvps')
    .select('id')
    .eq('site_id', resolvedSiteId)
    .eq('name', name)
    .eq('attendance', attendance)
    .gte('created_at', dedupeSince)
    .limit(1);

  if (recentError) {
    console.warn('RSVP dedupe lookup failed', recentError);
  }

  if (recent && recent.length > 0) {
    return { duplicate: true };
  }

  const client = supabaseAdmin ?? supabase;

  try {
    const { error } = await client.from('rsvps').insert({
      site_id: resolvedSiteId,
      name,
      contact_number: input.contact_number || null,
      attendance,
      godparent_confirmation: input.godparent_confirmation || null,
      companions: input.companions || 0,
      message: input.message || null,
    });

    if (error) throw error;
  } catch (err: any) {
    // Row-level security or permission errors are common when using anon key
    // in a DB with RLS. Surface a clearer message for devs.
    if (err && (err.code === '42501' || /row-level security/i.test(err.message || ''))) {
      const msg = 'Database rejected RSVP insert due to row-level security. Ensure SUPABASE_SERVICE_ROLE_KEY is set or add an insert policy for the `rsvps` table.';
      const e = new Error(msg);
      // Attach original error details for debugging
      (e as any).original = err;
      throw e;
    }
    throw err;
  }
  return { success: true };
}

export async function getRsvpsBySiteId(siteId: string) {
  const client = supabaseAdmin ?? supabase;
  const { data, error } = await client
    .from('rsvps')
    .select('id, site_id, name, contact_number, attendance, godparent_confirmation, companions, message, created_at')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as RsvpRecord[]) || [];
}

export async function deleteRsvp(id: string) {
  const { error } = await supabase.from('rsvps').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function getRsvpSummary(siteId: string) {
  const rsvps = await getRsvpsBySiteId(siteId);
  const total = rsvps.length;
  const yes = rsvps.filter((r) => r.attendance === 'yes').length;
  const no = rsvps.filter((r) => r.attendance === 'no').length;
  const maybe = rsvps.filter((r) => r.attendance === 'maybe').length;
  const totalCompanions = rsvps.reduce((acc, r) => acc + (r.companions || 0), 0);
  return { total, yes, no, maybe, totalCompanions };
}
