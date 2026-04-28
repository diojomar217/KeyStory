// client-side IndexedDB helper for storing pending guest photo uploads
type OfflinePhoto = {
  id?: number;
  blob: Blob;
  slug: string;
  guestName?: string | null;
  caption?: string | null;
  createdAt: number;
};

const DB_NAME = 'guest-photos-db';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

function isBrowser() {
  return typeof window !== 'undefined' && !!(window as any).indexedDB;
}

function openDB(): Promise<IDBDatabase> {
  if (!isBrowser()) return Promise.reject(new Error('IndexedDB not available'));
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function promisifyRequest<T>(req: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export async function saveOfflinePhoto(photo: {
  blob: Blob;
  slug: string;
  guestName?: string | null;
  caption?: string | null;
}) {
  const db = await openDB();
  return new Promise<number>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const data: OfflinePhoto = { ...photo, createdAt: Date.now() };
    const req = store.add(data as any);
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

export async function getOfflinePhotos(): Promise<OfflinePhoto[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const req = store.getAll();
  return promisifyRequest<OfflinePhoto[]>(req);
}

export async function removeOfflinePhoto(id: number) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function uploadPendingPhotos() {
  if (!isBrowser()) return;
  if (!navigator.onLine) return;

  const items = await getOfflinePhotos();
  for (const item of items) {
    try {
      const usePresign = typeof process !== 'undefined' && (((process.env as any).NEXT_PUBLIC_USE_PRESIGNED_UPLOAD === 'true') || ((process.env as any).NEXT_PUBLIC_USE_PRESIGNED_UPLOAD === '1'));

      if (usePresign) {
        try {
          const presignRes = await fetch('/api/guest-photos/presign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: item.slug, filename: 'photo.jpg', contentType: item.blob.type || 'image/jpeg' }),
          });
          if (!presignRes.ok) {
            console.warn('Presign failed for pending photo', await presignRes.text());
            continue;
          }
          const presignData = await presignRes.json();
          const putRes = await fetch(presignData.url, { method: 'PUT', body: item.blob, headers: { 'content-type': item.blob.type || 'image/jpeg' } });
          if (!putRes.ok) {
            console.warn('PUT to presigned URL failed', putRes.statusText);
            continue;
          }

          // commit metadata
          const commitRes = await fetch('/api/guest-photos/commit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: item.slug, key: presignData.key, guestName: item.guestName, caption: item.caption }),
          });
          if (commitRes.ok) {
            if (item.id) await removeOfflinePhoto(item.id);
          } else {
            console.warn('Commit failed for pending photo', await commitRes.text());
          }
        } catch (e) {
          console.warn('Presign upload failed, will retry later', e);
        }
      } else {
        const form = new FormData();
        form.append('file', item.blob, 'photo.jpg');
        form.append('slug', item.slug);
        if (item.guestName) form.append('guestName', item.guestName);
        if (item.caption) form.append('caption', item.caption);

        const res = await fetch('/api/guest-photos/upload', { method: 'POST', body: form });
        if (res.ok) {
          // remove from queue
          if (item.id) await removeOfflinePhoto(item.id);
        } else {
          console.warn('Failed to upload pending photo', await res.text());
        }
      }
    } catch (e) {
      console.warn('Upload failed, will retry later', e);
    }
  }
}
