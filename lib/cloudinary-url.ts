type CloudinaryCrop = 'limit' | 'fill' | 'scale' | 'fit';

type OptimizeCloudinaryUrlOptions = {
  quality?: 'auto:eco' | 'auto:good' | 'auto:best';
  width?: number;
  height?: number;
  crop?: CloudinaryCrop;
  progressive?: boolean;
  dprAuto?: boolean;
};

const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';

const isCloudinaryUrl = (url: string) =>
  typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes(CLOUDINARY_UPLOAD_SEGMENT);

const hasOptimizationSegment = (url: string) => {
  const uploadIndex = url.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
  if (uploadIndex < 0) return false;

  const remainder = url.slice(uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length);
  const firstSegment = remainder.split('/')[0] || '';
  return (
    firstSegment.includes('f_auto') ||
    firstSegment.includes('q_auto') ||
    firstSegment.includes('w_') ||
    firstSegment.includes('h_') ||
    firstSegment.includes('c_')
  );
};

export function optimizeCloudinaryDeliveryUrl(
  url: string,
  options: OptimizeCloudinaryUrlOptions = {},
): string {
  if (!isCloudinaryUrl(url)) return url;
  if (hasOptimizationSegment(url)) return url;

  const {
    quality = 'auto:eco',
    width,
    height,
    crop = 'limit',
    progressive = true,
    dprAuto = true,
  } = options;

  const transforms: string[] = ['f_auto', `q_${quality}`];

  if (dprAuto) transforms.push('dpr_auto');
  if (progressive) transforms.push('fl_progressive');
  if (typeof width === 'number' && Number.isFinite(width) && width > 0) transforms.push(`w_${Math.round(width)}`);
  if (typeof height === 'number' && Number.isFinite(height) && height > 0) transforms.push(`h_${Math.round(height)}`);
  if ((width || height) && crop) transforms.push(`c_${crop}`);

  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transforms.join(',')}/`);
}
