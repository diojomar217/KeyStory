import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { supabase } from '@/lib/supabase';
import supabaseAdmin from '@/lib/supabaseAdmin';

const client = supabaseAdmin ?? supabase;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
  console.warn('R2 environment variables are not fully configured. Uploads will fail until configured.');
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as unknown as File | null;
    const slug = (form.get('slug') as string) ?? '';
    const guestName = form.get('guestName')?.toString() ?? null;
    const caption = form.get('caption')?.toString() ?? null;

    if (!file) return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    if (!file.type || !file.type.startsWith('image/')) return new Response(JSON.stringify({ error: 'Invalid file type' }), { status: 400 });

    const maxSize = 5 * 1024 * 1024; // 5MB
    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > maxSize) return new Response(JSON.stringify({ error: 'File too large' }), { status: 400 });

    const buffer = Buffer.from(arrayBuffer);
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    const objectKey = `memories/${slug}/${Date.now()}-${randomUUID()}.${ext}`;

    await s3.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME!,
      Key: objectKey,
      Body: buffer,
      ContentType: file.type,
    }));

    const imageUrl = `${R2_PUBLIC_URL}/${objectKey}`;

    // try to resolve site_id from slug when possible
    let siteId: string | null = null;
    if (slug) {
      try {
        const { data: site } = await supabase.from('sites').select('id').eq('slug', slug).single();
        if (site && site.id) siteId = site.id;
      } catch (e) {
        // ignore lookup errors
      }
    }

    const { error } = await client.from('guest_photos').insert([{
      site_id: siteId,
      slug,
      image_url: imageUrl,
      key: objectKey,
      guest_name: guestName,
      caption,
      status: 'pending',
    }]);

    if (error) {
      console.error('Supabase insert error', error);
      return new Response(JSON.stringify({ error: 'DB insert failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, imageUrl }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
