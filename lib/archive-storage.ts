import fs from 'fs';
import path from 'path';

export type ArchiveUploadResult = {
  provider: 'local' | 's3' | 'drive';
  archivePath: string;
};

export async function uploadArchivePackage(buffer: Buffer, filename: string): Promise<ArchiveUploadResult> {
  const provider = (process.env.ARCHIVE_PROVIDER || 'local').toLowerCase();

  if (provider === 's3') {
    // TODO: add AWS S3 implementation (future), fallback to local for now
    console.warn('ARCHIVE_PROVIDER=s3 not implemented; using local fallback');
  }

  if (provider === 'drive') {
    // TODO: Google Drive implementation (future), fallback to local for now
    console.warn('ARCHIVE_PROVIDER=drive not implemented; using local fallback');
  }

  const archiveRoot = path.join(process.cwd(), 'archives');
  if (!fs.existsSync(archiveRoot)) fs.mkdirSync(archiveRoot, { recursive: true });

  const archivePath = path.join(archiveRoot, filename);
  fs.writeFileSync(archivePath, buffer);

  return {
    provider: 'local',
    archivePath,
  };
}

export async function downloadArchivePackage(archivePath: string): Promise<Buffer> {
  if (!fs.existsSync(archivePath)) {
    throw new Error(`Archive not found at ${archivePath}`);
  }

  return fs.readFileSync(archivePath);
}
