/**
 * Data Source: Google Sheets + Drive (از طریق Apps Script Web App)
 * Repository: این فایل تنها نقطه‌ای است که با Apps Script صحبت می‌کند.
 * هیچ API Route دیگری نباید مستقیم fetch به APPS_SCRIPT_URL بزند —
 * همه از توابع همین فایل عبور می‌کنند (قانون ۲ Constitution: یک منبع داده).
 *
 * این فایل فقط سمت سرور اجرا می‌شود (API Routes / Server Components).
 * APPS_SCRIPT_KEY هرگز نباید به کد کلاینت/مرورگر برسد (قانون ۵ Constitution).
 */
import 'server-only';
import type { Card } from './card-schema';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!;
const APPS_SCRIPT_KEY = process.env.APPS_SCRIPT_KEY!;

type ApiResult<T> = { ok: true } & T | { ok: false; error: string };

async function callGet<T>(action: string, params: Record<string, string>): Promise<ApiResult<T>> {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return { ok: false, error: `Apps Script GET failed: ${res.status}` };
  return res.json();
}

async function callPost<T>(action: string, payload: Record<string, unknown>): Promise<ApiResult<T>> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // از Preflight CORS جلوگیری می‌کند
    body: JSON.stringify({ action, apiKey: APPS_SCRIPT_KEY, payload }),
    cache: 'no-store',
  });
  if (!res.ok) return { ok: false, error: `Apps Script POST failed: ${res.status}` };
  return res.json();
}

// ---------------- Cards ----------------

export async function getCard(cardId: string) {
  return callGet<{ card: Card }>('getCard', { cardId });
}

export async function createCard(payload: Record<string, unknown>) {
  return callPost<{ cardId: string; driveFolderId: string }>('createCard', payload);
}

export async function updateCard(payload: Record<string, unknown>) {
  return callPost<{ cardId: string }>('updateCard', payload);
}

export async function listCardsByOwner(ownerId: string) {
  return callPost<{ cards: Card[] }>('listCardsByOwner', { ownerId });
}

// ---------------- Events ----------------

export type EventType = 'view' | 'link_clicked' | 'qr_generated' | 'share' | 'vcard_download';

export async function logEvent(payload: {
  cardId: string;
  eventType: EventType;
  meta?: Record<string, unknown>;
  userAgent?: string;
  referrer?: string;
}) {
  return callPost<{ eventId: string }>('logEvent', payload);
}

export async function getCardEvents(cardId: string) {
  return callPost<{ events: any[] }>('getCardEvents', { cardId });
}

export async function getAllEvents() {
  return callPost<{ events: any[] }>('getAllEvents', {});
}

// ---------------- Drive (تصاویر) ----------------

export async function uploadImage(payload: {
  driveFolderId: string;
  base64Data: string;
  mimeType: string;
  fileName?: string;
}) {
  return callPost<{ fileId: string; url: string }>('uploadImage', payload);
}

export async function deleteImage(fileId: string) {
  return callPost<{}>('deleteImage', { fileId });
}
