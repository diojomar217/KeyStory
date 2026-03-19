import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });
    }

    const { data: site, error: fetchError } = await supabase.from('sites').select('*').eq('id', id).single();
    if (fetchError || !site) {
      return NextResponse.json({ success: false, message: 'Site not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('sites')
      .update({ status: 'archived', archived_at: now })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ success: false, message: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, archived_at: now });
  } catch (err) {
    console.error('Archive site error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
