import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

interface VerifyRequest {
  slug: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: VerifyRequest = await req.json();

    const { slug, password } = data;
    if (!slug || !password) {
      return NextResponse.json({ success: false, message: 'Missing slug or password' }, { status: 400 });
    }

    const { data: site, error } = await supabase
      .from('sites')
      .select('config')
      .eq('website_name', slug)
      .maybeSingle();

    if (error || !site) {
      return NextResponse.json({ success: false, message: 'Site not found' }, { status: 404 });
    }

    const passwordConfig = site.config?.password;
    if (!passwordConfig?.enabled || !passwordConfig?.hash) {
      return NextResponse.json({ success: false, message: 'Password protection not enabled' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, passwordConfig.hash);

    return NextResponse.json({ success: isMatch, message: isMatch ? 'Unlocked' : 'Invalid password' });
  } catch (err) {
    console.error('verify-password route error', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
