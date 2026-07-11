import type { Address, Contact } from './card-schema';

export function buildMapLink(address?: Address): string {
  if (address?.lat && address?.lng) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address.lat)},${encodeURIComponent(address.lng)}`;
  }
  if (address?.text) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.text)}`;
  }
  return '';
}

export function contactHref(type: string, value: string): string {
  const safe = (value || '').trim();
  if (!safe) return '#';
  switch (type) {
    case 'phone':
    case 'mobile':
      return 'tel:' + safe.replace(/[^\d+]/g, '');
    case 'email':
      return 'mailto:' + safe;
    case 'whatsapp':
      return 'https://wa.me/' + safe.replace(/[^\d]/g, '');
    case 'website':
    case 'linkedin':
    case 'facebook':
    case 'youtube':
      return /^https?:\/\//i.test(safe) ? safe : 'https://' + safe;
    case 'instagram':
      return safe.startsWith('http') ? safe : 'https://instagram.com/' + safe.replace('@', '');
    case 'telegram':
      return safe.startsWith('http') ? safe : 'https://t.me/' + safe.replace('@', '');
    case 'twitter':
      return safe.startsWith('http') ? safe : 'https://x.com/' + safe.replace('@', '');
    case 'github':
      return safe.startsWith('http') ? safe : 'https://github.com/' + safe.replace('@', '');
    default:
      return safe;
  }
}

export function primaryContact(contacts: Contact[] = []) {
  return contacts.find((c) => c.type === 'mobile' || c.type === 'phone');
}
