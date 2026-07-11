// این Route دقیقاً همان مشکلی را حل می‌کند که در نسخه‌ی قبلی (Blob دانلود) در تلگرام کار نمی‌کرد.
// چون این یک URL واقعی با Content-Type: text/vcard است، تلگرام/مرورگر خودش پیشنهاد
// "افزودن مخاطب" را نشان می‌دهد، نه دانلود بلاک‌شده.
import { NextRequest, NextResponse } from 'next/server';
import { getCard, logEvent } from '@/lib/apps-script-client';
import { buildVcardText } from '@/lib/vcard';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await getCard(params.id);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 404 });
  }

  const vcard = buildVcardText(result.card);

  // ثبت رویداد بدون بلاک‌کردن پاسخ کاربر
  logEvent({
    cardId: params.id,
    eventType: 'vcard_download',
    userAgent: req.headers.get('user-agent') || '',
    referrer: req.headers.get('referer') || '',
  }).catch(() => {});

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `inline; filename="${(result.card.name || 'card').trim()}.vcf"`,
    },
  });
}
