import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { supabase } from '@/lib/supabase';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { action } = await req.json();
    const { id } = await context.params;
    if (!action || !['approve', 'reject'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    const { error } = await supabase.from('guest_photos').update({ status }).eq('id', id);
    if (error) {
      console.error('Supabase update error', error);
      return new Response(JSON.stringify({ error: 'DB update failed' }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    // find the record to get the object key
    const { data: record, error: fetchErr } = await supabase.from('guest_photos').select('key').eq('id', id).single();
    if (fetchErr) {
      console.error('Supabase fetch error', fetchErr);
      return new Response(JSON.stringify({ error: 'DB fetch failed' }), { status: 500 });
    }

    if (record && (record as any).key) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: (record as any).key }));
      } catch (e) {
        console.warn('Failed to delete object from R2', e);
      }
    }

    const { error } = await supabase.from('guest_photos').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error', error);
      return new Response(JSON.stringify({ error: 'DB delete failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
