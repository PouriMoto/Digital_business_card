// Data Flow: Server Component -> lib/apps-script-client (مستقیم) -> Sheets
import { notFound } from 'next/navigation';
import { getCard, logEvent } from '@/lib/apps-script-client';
import PublicCardClient from '@/components/PublicCardClient';

export default async function CardPage({ params }: { params: { id: string } }) {
  const result = await getCard(params.id);
  if (!result.ok) notFound();

  const card = result.card;

  // ثبت بازدید — بدون بلاک کردن رندر صفحه
  logEvent({ cardId: params.id, eventType: 'view' }).catch(() => {});

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  return (
    <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '32px 16px', background: 'var(--paper)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <PublicCardClient
          cardId={card.cardId}
          siteUrl={siteUrl}
          card={{
            name: card.name,
            jobTitle: card.jobTitle,
            theme: card.theme,
            avatarUrl: card.avatarUrl,
            description: card.description,
            contacts: card.contacts,
            services: card.services,
            gallery: card.gallery,
            addressText: card.addressText,
            addressLat: card.addressLat,
            addressLng: card.addressLng,
          }}
        />
      </div>
    </main>
  );
}
