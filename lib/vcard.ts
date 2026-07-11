/**
 * تابع خالص: ورودی Card -> خروجی متن vCard 3.0
 * وابسته به DOM/Math.random/Date.now نیست — طبق قانون ۷ Constitution قابل تست است.
 */
import type { Card } from './card-schema';

export function buildVcardText(card: Pick<Card, 'name' | 'jobTitle' | 'contacts' | 'addressText'>): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  const name = card.name || '';
  lines.push(`FN:${escapeVcard(name)}`);
  lines.push(`N:${escapeVcard(name)};;;;`);
  if (card.jobTitle) lines.push(`TITLE:${escapeVcard(card.jobTitle)}`);

  const mobile = card.contacts?.find((c) => c.type === 'mobile');
  const phone = card.contacts?.find((c) => c.type === 'phone');
  const email = card.contacts?.find((c) => c.type === 'email');
  const website = card.contacts?.find((c) => c.type === 'website');

  if (mobile?.value) lines.push(`TEL;TYPE=CELL:${escapeVcard(mobile.value)}`);
  if (phone?.value) lines.push(`TEL;TYPE=WORK:${escapeVcard(phone.value)}`);
  if (email?.value) lines.push(`EMAIL:${escapeVcard(email.value)}`);
  if (website?.value) lines.push(`URL:${escapeVcard(website.value)}`);
  if (card.addressText) lines.push(`ADR;TYPE=WORK:;;${escapeVcard(card.addressText)};;;;`);

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

function escapeVcard(value: string): string {
  return String(value).replace(/([,;])/g, '\\$1');
}
