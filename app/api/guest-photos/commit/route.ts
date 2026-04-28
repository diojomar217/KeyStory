import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { supabase } from '@/lib/supabase';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

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
    const body = await req.json();
    const slug = (body.slug as string) || '';
    const key = (body.key as string) || '';
    const guestName = body.guestName ?? null;
    const caption = body.caption ?? null;

    if (!key || !key.startsWith(`memories/${slug}/`)) {
      return new Response(JSON.stringify({ error: 'Invalid key' }), { status: 400 });
    }

    // Optionally verify object exists in R2
    try {
      await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: key }));
    } catch (e) {
      console.warn('HeadObject failed; object may not exist yet', e);
      return new Response(JSON.stringify({ error: 'Object not found in storage' }), { status: 400 });
    }

    const imageUrl = `${R2_PUBLIC_URL}/${key}`;

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

    const { error } = await supabase.from('guest_photos').insert([{
      site_id: siteId,
      slug,
      image_url: imageUrl,
      key,
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
    console.error('Commit error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
