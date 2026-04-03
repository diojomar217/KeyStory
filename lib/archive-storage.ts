import fs from 'fs';
import path from 'path';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export type ArchiveUploadResult = {
  provider: 'local' | 's3' | 'drive';
  archivePath: string;
};

type S3Config = {
  bucket: string;
  keyPrefix: string;
  client: S3Client;
};

const streamToBuffer = async (stream: any): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const getS3Config = (): S3Config => {
  const bucket = process.env.AWS_S3_ARCHIVE_BUCKET?.trim() || '';
  const region = process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || '';
  const keyPrefix = (process.env.AWS_S3_ARCHIVE_PREFIX || 'keystory-archives').trim().replace(/^\/+|\/+$/g, '');
  const endpoint = process.env.AWS_S3_ENDPOINT?.trim() || undefined;
  const forcePathStyle = (process.env.AWS_S3_FORCE_PATH_STYLE || '').trim().toLowerCase() === 'true';

  if (!bucket) {
    throw new Error('Missing AWS_S3_ARCHIVE_BUCKET for S3 archive provider');
  }
  if (!region) {
    throw new Error('Missing AWS_REGION (or AWS_DEFAULT_REGION) for S3 archive provider');
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials:
      accessKeyId && secretAccessKey
        ? {
            accessKeyId,
            secretAccessKey,
          }
        : undefined,
  });

  return {
    bucket,
    keyPrefix,
    client,
  };
};

const buildS3Path = (bucket: string, key: string): string => `s3://${bucket}/${key}`;

const parseS3Path = (archivePath: string): { bucket: string; key: string } | null => {
  if (!archivePath.startsWith('s3://')) return null;
  const withoutScheme = archivePath.slice('s3://'.length);
  const firstSlash = withoutScheme.indexOf('/');
  if (firstSlash <= 0) return null;
  const bucket = withoutScheme.slice(0, firstSlash);
  const key = withoutScheme.slice(firstSlash + 1);
  if (!bucket || !key) return null;
  return { bucket, key };
};

export async function uploadArchivePackage(buffer: Buffer, filename: string): Promise<ArchiveUploadResult> {
  const provider = (process.env.ARCHIVE_PROVIDER || 'local').toLowerCase();
  const isVercel = process.env.VERCEL === '1';
  const isProduction = process.env.NODE_ENV === 'production';

  if (provider === 's3') {
    const { bucket, keyPrefix, client } = getS3Config();
    const key = `${keyPrefix}/${filename}`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: 'application/zip',
      }),
    );

    return {
      provider: 's3',
      archivePath: buildS3Path(bucket, key),
    };
  }

  if (provider === 'drive') {
    throw new Error('ARCHIVE_PROVIDER=drive is configured but Drive upload is not implemented yet. Implement Drive provider before using this setting.');
  }

  if (provider === 'local' && isVercel && isProduction) {
    throw new Error(
      'ARCHIVE_PROVIDER=local is not supported on Vercel production because filesystem storage is ephemeral. Configure ARCHIVE_PROVIDER=s3 (or drive) for durable archives.',
    );
  }

  // Use /tmp for writable storage on Vercel (serverless environment)
  const archiveRoot = path.join('/tmp', 'keystory-archives');
  if (!fs.existsSync(archiveRoot)) fs.mkdirSync(archiveRoot, { recursive: true });

  const archivePath = path.join(archiveRoot, filename);
  fs.writeFileSync(archivePath, buffer);

  return {
    provider: 'local',
    archivePath,
  };
}

export async function downloadArchivePackage(archivePath: string): Promise<Buffer> {
  const s3Path = parseS3Path(archivePath);
  if (s3Path) {
    const { client } = getS3Config();
    const output = await client.send(
      new GetObjectCommand({
        Bucket: s3Path.bucket,
        Key: s3Path.key,
      }),
    );

    if (!output.Body) {
      throw new Error(`Archive not found at ${archivePath}`);
    }

    return streamToBuffer(output.Body);
  }

  if (!fs.existsSync(archivePath)) {
    throw new Error(`Archive not found at ${archivePath}`);
  }

  return fs.readFileSync(archivePath);
}
