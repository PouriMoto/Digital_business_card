import { NextRequest, NextResponse } from 'next/server';
import { CardUpdateSchema } from '@/lib/card-schema';
import { getCard, updateCard } from '@/lib/apps-script-client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await getCard(params.id);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = CardUpdateSchema.safeParse({ ...body, cardId: params.id });

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'داده‌ی نامعتبر', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await updateCard(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json(result);
}
