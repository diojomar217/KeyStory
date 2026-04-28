// Client-side image resizing and compression utility
export async function resizeAndCompress(file: File, maxWidth = 1080, quality = 0.7): Promise<Blob> {
  if (typeof window === 'undefined') throw new Error('resizeAndCompress must be run in the browser');

  const img = await loadImage(file);
  const { width, height } = img;
  let targetWidth = width;
  let targetHeight = height;
  if (width > maxWidth) {
    targetWidth = maxWidth;
    targetHeight = Math.round((maxWidth / width) * height);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob from canvas'));
    }, 'image/jpeg', quality);
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}
