import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _admin: SupabaseClient | null = null;

if (supabaseUrl && serviceRoleKey) {
  _admin = createClient(supabaseUrl, serviceRoleKey);
}

export const supabaseAdmin = _admin;

export default supabaseAdmin;
