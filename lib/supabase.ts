// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// order type shared across client/server
export type Site = {
  id?: string;
  slug: string;
  website_name?: string;
  site_type?: string;
  status?: string;
  expires_at?: string | null;
  archived_at?: string | null;
  qr_code_url?: string;
  config?: any;
  theme?: string;
  sections?: string[];
  home_template?: string;
  gallery_template?: string;
  timeline_template?: string;
  timeline_events?: any[];
  created_at?: string;

  // Legacy fields (backwards compatibility)
  customer_name?: string;
  partner_name?: string;
  anniversary_date?: string;
  specialDate?: string;
  message?: string;
  tagline?: string;
  song_link?: string;
  photos?: string[];
};



export async function getSiteById(id: string) {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data || null;
}

