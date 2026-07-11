'use client';
import React, { useState } from 'react';
import CardView, { CardData } from '@/components/CardView';
import QrShareModal from '@/components/QrShareModal';

export default function PublicCardClient({ card, cardId, siteUrl }: { card: CardData; cardId: string; siteUrl: string }) {
  const [qrOpen, setQrOpen] = useState(false);

  function handleAction(action: 'save-vcard' | 'share' | 'show-qr') {
    if (action === 'save-vcard') {
      window.location.href = `/api/cards/${cardId}/vcard`;
      return;
    }
    if (action === 'share' || action === 'show-qr') {
      setQrOpen(true);
    }
  }

  return (
    <>
      <CardView card={card} onAction={handleAction} />
      <QrShareModal open={qrOpen} onClose={() => setQrOpen(false)} cardId={cardId} siteUrl={siteUrl} />
    </>
  );
}
