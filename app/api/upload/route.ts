// Data Flow: Browser (بعد از فشرده‌سازی با Canvas) -> این Route -> Apps Script -> Drive
// نکته: فشرده‌سازی تصویر (resize + کیفیت) همچنان سمت مرورگر انجام می‌شود (مثل نسخه‌ی
// قبلی)، این Route فقط نتیجه‌ی نهایی base64 را می‌گیرد و امن به Drive منتقل می‌کند.
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadImage } from '@/lib/apps-script-client';

const UploadSchema = z.object({
  driveFolderId: z.string().min(1),
  base64Data: z.string().min(1),
  mimeType: z.string().min(1),
  fileName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = UploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'داده‌ی نامعتبر' }, { status: 400 });
  }

  const result = await uploadImage(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json(result, { status: 201 });
}
