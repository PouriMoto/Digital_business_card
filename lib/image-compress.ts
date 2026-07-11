'use client';
/**
 * Data Source: N/A — این فایل فقط تصویر ورودی کاربر را در مرورگر فشرده می‌کند.
 * خروجی base64 سپس به /api/upload فرستاده می‌شود.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('خواندن فایل ناموفق بود'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('بارگذاری تصویر ناموفق بود'));
    img.src = dataUrl;
  });
}

export async function compressImage(
  file: File,
  { maxDim, maxBytes }: { maxDim: number; maxBytes: number },
): Promise<{ dataUrl: string; mimeType: string; sizeBytes: number }> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.85;
  let outputUrl = canvas.toDataURL('image/jpeg', quality);
  while (outputUrl.length * 0.75 > maxBytes && quality > 0.25) {
    quality -= 0.1;
    outputUrl = canvas.toDataURL('image/jpeg', quality);
  }

  return { dataUrl: outputUrl, mimeType: 'image/jpeg', sizeBytes: Math.round(outputUrl.length * 0.75) };
}

export async function uploadCompressedImage(
  dataUrl: string,
  mimeType: string,
  driveFolderId: string,
  fileName: string,
): Promise<{ fileId: string; url: string }> {
  const base64Data = dataUrl.split(',')[1];
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driveFolderId, base64Data, mimeType, fileName }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'آپلود ناموفق بود');
  return { fileId: json.fileId, url: json.url };
}
