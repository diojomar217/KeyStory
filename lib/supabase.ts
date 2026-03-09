// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// order type shared across client/server
export type Order = {
  id?: string;
  slug: string;
  website_name?: string; // human-readable identifier used in URL
  customer_name: string;
  partner_name: string;
  anniversary_date: string;
  message: string;
  photos: string[];
  song_link?: string;
  qr_code_url?: string;

  // individual config columns (optional)
  theme?: string;
  sections?: string[];
  home_template?: string;
  gallery_template?: string;
  timeline_template?: string;
  timeline_events?: any;

  config?: any;
  status?: string;
  created_at?: string;
};

export async function insertOrder(order: Order) {
  const { data, error } = await supabase.from('orders').insert(order).select().single();
  if (error) throw error;
  return data;
}
