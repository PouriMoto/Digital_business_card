'use client';
// Data Source: LocalStorage
// TODO_REMOVE_BEFORE_TELEGRAM_AUTH — این یک شناسه‌ی موقت سمت مرورگر است تا
// «سازنده‌ی کارت» بتواند بعداً کارت‌های خودش را ببیند، پیش از اینکه Auth
// واقعی با تلگرام (فاز ۲) جایگزین آن شود. هیچ داده‌ی حساسی اینجا نیست.

const KEY = 'v2card_owner_id_temp';

export function getOrCreateOwnerId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = 'owner_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
