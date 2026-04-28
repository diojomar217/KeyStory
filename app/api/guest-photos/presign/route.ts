import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

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
    const filename = (body.filename as string) || 'photo.jpg';
    const contentType = (body.contentType as string) || 'image/jpeg';

    const ext = contentType === 'image/png' ? 'png' : 'jpg';
    const objectKey = `memories/${slug}/${Date.now()}-${randomUUID()}.${ext}`;

    const putCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME!,
      Key: objectKey,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3, putCommand, { expiresIn: 60 * 60 });

    const imageUrl = `${R2_PUBLIC_URL}/${objectKey}`;

    return new Response(JSON.stringify({ url, key: objectKey, imageUrl }), { status: 200 });
  } catch (err) {
    console.error('Presign error', err);
    return new Response(JSON.stringify({ error: 'Presign failed' }), { status: 500 });
  }
}
