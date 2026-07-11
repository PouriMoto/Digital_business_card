import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logEvent } from '@/lib/apps-script-client';

const EventSchema = z.object({
  cardId: z.string().min(1),
  eventType: z.enum(['view', 'link_clicked', 'qr_generated', 'share', 'vcard_download']),
  meta: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = EventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'داده‌ی نامعتبر' }, { status: 400 });
  }

  const result = await logEvent({
    ...parsed.data,
    userAgent: req.headers.get('user-agent') || '',
    referrer: req.headers.get('referer') || '',
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json(result, { status: 201 });
}
