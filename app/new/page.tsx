'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CardView from '@/components/CardView';
import { StepAvatar, StepTheme, StepBasicInfo, StepDescription, StepAddress } from '@/components/wizard/StepsSimple';
import { StepContacts } from '@/components/wizard/StepContacts';
import { StepServices } from '@/components/wizard/StepServices';
import { StepGallery } from '@/components/wizard/StepGallery';
import { emptyWizardState, WizardState } from '@/components/wizard/types';
import { getOrCreateOwnerId } from '@/lib/local-owner';
import { uploadCompressedImage } from '@/lib/image-compress';

const STEPS = [
  { key: 'avatar', title: 'یک تصویر انتخاب کنید', hint: 'لوگو یا عکس پروفایل — اختیاری', Comp: StepAvatar, validate: () => true },
  { key: 'theme', title: 'رنگ کارت را انتخاب کنید', hint: 'یکی از تم‌های آماده را برگزینید', Comp: StepTheme, validate: () => true },
  { key: 'basic', title: 'اطلاعات پایه', hint: 'نام، سمت شغلی و حوزه فعالیت', Comp: StepBasicInfo, validate: (s: WizardState) => s.name.trim().length > 0 },
  { key: 'description', title: 'کمی درباره خودتان بنویسید', hint: 'حداکثر ۱۲۰ کلمه', Comp: StepDescription, validate: () => true },
  { key: 'contacts', title: 'راه‌های ارتباطی', hint: 'تلفن، ایمیل، شبکه‌های اجتماعی و...', Comp: StepContacts, validate: () => true },
  { key: 'services', title: 'خدمات شما', hint: 'کارهایی که ارائه می‌دهید', Comp: StepServices, validate: () => true },
  { key: 'gallery', title: 'نمونه‌کارها', hint: 'چند تصویر از نمونه‌کارهایتان اضافه کنید', Comp: StepGallery, validate: () => true },
  { key: 'address', title: 'آدرس', hint: 'آدرس متنی و مختصات جغرافیایی', Comp: StepAddress, validate: () => true },
] as const;

export default function NewCardWizard() {
  const router = useRouter();
  const [state, setState] = useState<WizardState>(emptyWizardState());
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const meta = STEPS[step];
  const update = (patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch }));

  function next() {
    if (!meta.validate(state)) { setError('این بخش را کامل کنید'); return; }
    setError('');
    if (step === STEPS.length - 1) { void finish(); return; }
    setStep((s) => s + 1);
  }
  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function finish() {
    setSubmitting(true);
    setError('');
    try {
      const ownerId = getOrCreateOwnerId();
      const createRes = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId,
          name: state.name,
          jobTitle: state.jobTitle,
          industry: state.industry,
          theme: state.theme,
          description: state.description,
          contacts: state.contacts,
          services: state.services,
          address: state.address,
        }),
      });
      const createJson = await createRes.json();
      if (!createJson.ok) throw new Error(createJson.error || 'ساخت کارت ناموفق بود');
      const { cardId, driveFolderId } = createJson;

      const patch: Record<string, unknown> = {};

      if (state.avatarLocal) {
        const { fileId, url } = await uploadCompressedImage(state.avatarLocal.dataUrl, state.avatarLocal.mimeType, driveFolderId, 'avatar.jpg');
        patch.avatarFileId = fileId;
        patch.avatarUrl = url;
      }

      if (state.galleryLocal.length > 0) {
        const uploaded = await Promise.all(
          state.galleryLocal.map((g, i) => uploadCompressedImage(g.dataUrl, g.mimeType, driveFolderId, `gallery-${i}.jpg`)),
        );
        patch.gallery = uploaded.map((u) => ({ fileId: u.fileId, url: u.url }));
      }

      if (Object.keys(patch).length > 0) {
        await fetch(`/api/cards/${cardId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
      }

      router.push(`/c/${cardId}`);
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد');
      setSubmitting(false);
    }
  }

  const previewCard = {
    name: state.name,
    jobTitle: state.jobTitle,
    theme: state.theme,
    avatarUrl: state.avatarLocal?.dataUrl || '',
    description: state.description,
    contacts: state.contacts,
    services: state.services,
    gallery: state.galleryLocal.map((g) => ({ fileId: '', url: g.dataUrl })),
    addressText: state.address.text,
    addressLat: state.address.lat,
    addressLng: state.address.lng,
  };

  return (
    <div className="wizard-shell">
      {/* ستون فرم */}
      <section style={{ background: '#fff', padding: '28px 22px 40px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>🪪 v2card</div>
          <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>مرحله {toFa(step + 1)} از {toFa(STEPS.length)}</span>
        </div>

        {/* نوار پیشرفت به شکل مهرهای تایید */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={s.key} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= step ? 'var(--ink)' : 'var(--line)',
            }} />
          ))}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px' }}>{meta.title}</h2>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '0 0 20px' }}>{meta.hint}</p>

        <div style={{ flex: 1 }}>
          <meta.Comp state={state} update={update} />
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
          <button className="focus-ring" onClick={prev} disabled={step === 0}
            style={{ background: 'var(--paper)', color: 'var(--ink)', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, opacity: step === 0 ? 0.5 : 1 }}>
            قبلی
          </button>
          <button className="focus-ring" onClick={next} disabled={submitting}
            style={{ flex: 1, background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'در حال ساخت...' : step === STEPS.length - 1 ? 'پایان و ساخت کارت' : 'بعدی'}
          </button>
        </div>
      </section>

      {/* خط پرفراژ */}
      <div className="perforation perforation-col" />

      {/* ستون پیش‌نمایش */}
      <section style={{ background: 'var(--paper)', padding: '28px 16px 60px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <CardView card={previewCard} />
        </div>
      </section>
    </div>
  );
}

function toFa(n: number) {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (d) => map[+d]);
}
