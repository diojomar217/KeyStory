import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import cloudinary, { uploadToCloudinary } from '@/lib/cloudinary';
import { supabase, Site } from '@/lib/supabase'; // No change needed, not direct site CRUD
import { downloadArchivePackage, uploadArchivePackage } from '@/lib/archive-storage';

function sanitizeFileName(url: string): string {
  const p = new URL(url);
  const fileName = path.basename(p.pathname);
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getCloudinaryPublicId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    // remove version segment like v123456
    const idx = parts.findIndex((part) => /^v\d+$/.test(part));
    const idParts = idx >= 0 ? parts.slice(idx + 1) : parts;
    const publicId = idParts.join('/').replace(/\.[^.]+$/, '');
    return publicId;
  } catch {
    return null;
  }
}

function extractMediaUrls(config: any): string[] {
  const results: string[] = [];

  function recurse(obj: any) {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach(recurse);
      return;
    }

    Object.values(obj).forEach((value) => {
      if (typeof value === 'string' && value.includes('cloudinary.com')) {
        results.push(value);
      } else if (typeof value === 'object') {
        recurse(value);
      }
    });
  }

  recurse(config);
  return Array.from(new Set(results));
}

export async function createArchiveForSite(site: Site): Promise<{ archivePath: string; provider: string }> {
  if (!site.id) throw new Error('Site id is required to archive');

  const siteConfig = site.config || {};
  const mediaUrls = extractMediaUrls(siteConfig);

  // Use /tmp for writable storage on Vercel (serverless environment)
  const archiveFolder = path.join('/tmp', 'keystory-site-archives', site.id);
  fs.mkdirSync(archiveFolder, { recursive: true });

  // Save metadata and config
  fs.writeFileSync(path.join(archiveFolder, 'metadata.json'), JSON.stringify({ siteId: site.id, website_name: site.website_name, archivedAt: new Date().toISOString(), mediaCount: mediaUrls.length }, null, 2));
  fs.writeFileSync(path.join(archiveFolder, 'config.json'), JSON.stringify(siteConfig, null, 2));

  // Download media and write in folder
  for (const mediaUrl of mediaUrls) {
    try {
      const resp = await fetch(mediaUrl);
      if (!resp.ok) {
        console.warn('Failed downloading media', mediaUrl, resp.status);
        continue;
      }
      const buffer = Buffer.from(await resp.arrayBuffer());
      const filename = sanitizeFileName(mediaUrl);
      fs.writeFileSync(path.join(archiveFolder, filename), buffer);
    } catch (err) {
      console.error('Error downloading media', mediaUrl, err);
    }
  }

  // Create package
  const ts = Date.now();
  const packageName = `site-${site.id}-${ts}.zip`;
  const zipPath = path.join('/tmp', 'keystory-site-archives', packageName);

  // minimal zip via compression (no dependency)
  const archiver = await import('archiver');
  const output = fs.createWriteStream(zipPath);
  const archiveStream = archiver.default('zip', { zlib: { level: 9 } });

  await new Promise<void>((resolve, reject) => {
    output.on('close', resolve);
    archiveStream.on('error', reject);
    archiveStream.pipe(output);
    archiveStream.directory(archiveFolder, false);
    archiveStream.finalize();
  });

  const buffer = fs.readFileSync(zipPath);
  const uploadResult = await uploadArchivePackage(buffer, packageName);

  // Delete cloudinary media after successful archive
  for (const mediaUrl of mediaUrls) {
    const publicId = getCloudinaryPublicId(mediaUrl);
    if (!publicId) continue;
    try {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
    } catch (err) {
      console.warn('Failed to remove Cloudinary media', publicId, err);
    }
  }

  // Update DB site record
  const archiveInfo = {
    archived: true,
    provider: uploadResult.provider,
    archivePath: uploadResult.archivePath,
    mediaRemoved: true,
    archivedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('sites')
    .update({
      status: 'archived',
      archived_at: new Date().toISOString(),
      config: {
        ...siteConfig,
        archive: archiveInfo,
      },
    })
    .eq('id', site.id);

  if (error) throw error;

  return uploadResult;
}

export async function restoreSiteFromArchive(site: Site): Promise<Site> {
  if (!site.id) throw new Error('Site id is required to restore');
  if (!site.config?.archive?.archivePath) throw new Error('Missing archive path');

  const archivePath = site.config.archive.archivePath;
  const buffer = await downloadArchivePackage(archivePath);
  if (!buffer) throw new Error('Archive file not found');

  // unzip
  const unzipper = (await import('unzipper')) as any;
  const content = await unzipper.Open.buffer(buffer);

  const archiveConfigEntry = content.files.find((f: any) => f.path === 'config.json');
  if (!archiveConfigEntry) throw new Error('config.json not found in archive');

  const archiveConfigBuffer = await archiveConfigEntry.buffer();
  const archivedConfig = JSON.parse(archiveConfigBuffer.toString('utf-8'));

  const mediaFiles = content.files.filter((f: any) => f.path !== 'metadata.json' && f.path !== 'config.json');
  const restoredUrls: string[] = [];

  for (const fileEntry of mediaFiles) {
    try {
      const fileBuffer = await fileEntry.buffer();
      const ext = path.extname(fileEntry.path).toLowerCase().replace('.', '') || 'jpg';
      const fileDataUri = `data:image/${ext};base64,${fileBuffer.toString('base64')}`;
      const uploadRes = await cloudinary.uploader.upload(fileDataUri, {
        folder: 'loveqr-archive-restored',
      });
      restoredUrls.push(uploadRes.secure_url);
    } catch (err) {
      console.warn('Failed to restore media file', fileEntry.path, err);
    }
  }

  // Rebuild config media references
  const newConfig = {
    ...archivedConfig,
    media: {
      ...archivedConfig.media,
      photos: restoredUrls,
    },
    archive: {
      ...site.config.archive,
      archived: false,
      restoredAt: new Date().toISOString(),
    },
  };

  const newExpiresAt = new Date();
  newExpiresAt.setMonth(newExpiresAt.getMonth() + 6);

  const { data: updatedSite, error } = await supabase
    .from('sites')
    .update({
      status: 'active',
      expires_at: newExpiresAt.toISOString(),
      archived_at: null,
      config: newConfig,
    })
    .eq('id', site.id)
    .select()
    .single();

  if (error) throw error;

  return updatedSite;
}
