// Data Flow: Browser -> این Route -> lib/apps-script-client -> Apps Script -> Sheets/Drive
import { NextRequest, NextResponse } from 'next/server';
import { CardCreateSchema } from '@/lib/card-schema';
import { createCard } from '@/lib/apps-script-client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CardCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'داده‌ی نامعتبر', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await createCard(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json(result, { status: 201 });
}
