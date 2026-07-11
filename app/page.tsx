import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>🪪 v2card</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 12px', maxWidth: 420 }}>کارت ویزیت دیجیتال خودت رو در چند دقیقه بساز</h1>
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: 360, marginBottom: 28 }}>
        بدون نیاز به چاپ، با QR قابل اسکن، قابل اشتراک‌گذاری در تلگرام.
      </p>
      <Link href="/new" style={{ background: 'var(--ink)', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15 }}>
        ساخت کارت جدید
      </Link>
    </main>
  );
}
