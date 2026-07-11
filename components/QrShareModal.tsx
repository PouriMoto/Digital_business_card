'use client';
import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Icons } from './icons';

function logEvent(cardId: string, eventType: string, meta?: Record<string, unknown>) {
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, eventType, meta }),
  }).catch(() => {});
}

export default function QrShareModal({
  open,
  onClose,
  cardId,
  siteUrl,
}: {
  open: boolean;
  onClose: () => void;
  cardId: string;
  siteUrl: string;
}) {
  const [tab, setTab] = useState<'offline' | 'online'>('offline');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const vcardUrl = `${siteUrl}/api/cards/${cardId}/vcard`;
  const cardUrl = `${siteUrl}/c/${cardId}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(cardUrl)}&text=${encodeURIComponent('کارت ویزیت دیجیتال من')}`;

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const text = tab === 'offline' ? vcardUrl : cardUrl;
    QRCode.toCanvas(canvasRef.current, text, { width: 220, margin: 1 }, () => {});
    logEvent(cardId, 'qr_generated', { tab });
  }, [open, tab, cardId, vcardUrl, cardUrl]);

  if (!open) return null;

  function downloadQr() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'qr-code.png';
    a.click();
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(21,23,28,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 1000 }}
    >
      <div style={{ background: '#fff', borderRadius: 18, padding: 22, width: '100%', maxWidth: 380 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>اشتراک‌گذاری کارت</h3>
          <button className="focus-ring" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <Icons.close style={{ width: 18, height: 18 } as any} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, background: 'var(--paper)', borderRadius: 10, padding: 4, marginBottom: 16 }}>
          <TabBtn active={tab === 'offline'} onClick={() => setTab('offline')}>آفلاین (vCard)</TabBtn>
          <TabBtn active={tab === 'online'} onClick={() => setTab('online')}>آنلاین (لینک)</TabBtn>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220, background: 'var(--paper)', borderRadius: 12, marginBottom: 14 }}>
          <canvas ref={canvasRef} />
        </div>

        <p style={{ fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center', marginBottom: 14, lineHeight: 1.7 }}>
          {tab === 'offline'
            ? 'با اسکن، گوشی مستقیم پیشنهاد افزودن مخاطب می‌دهد — بدون نیاز به دانلود فایل جدا.'
            : 'با اسکن، صفحه‌ی زنده‌ی کارت باز می‌شود — همیشه آخرین نسخه.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="focus-ring" onClick={downloadQr} style={btnSecondary}>دانلود تصویر QR</button>
          <a
            href={telegramShareUrl}
            target="_blank"
            rel="noopener"
            onClick={() => logEvent(cardId, 'share', { via: 'telegram' })}
            style={{ ...btnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Icons.telegramSend style={{ width: 16, height: 16 } as any} /> اشتراک‌گذاری در تلگرام
          </a>
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className="focus-ring"
      onClick={onClick}
      style={{
        flex: 1, border: 'none', padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600,
        background: active ? '#fff' : 'transparent', color: active ? 'var(--ink)' : 'var(--ink-soft)',
        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {children}
    </button>
  );
}

const btnPrimary: React.CSSProperties = { background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600 };
const btnSecondary: React.CSSProperties = { background: 'var(--paper)', color: 'var(--ink)', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600 };
