'use client';
import React, { useRef } from 'react';
import { Icons } from '@/components/icons';
import { compressImage } from '@/lib/image-compress';
import themes from '@/config/themes.json';
import industries from '@/config/industries.json';
import limits from '@/config/limits.json';
import type { WizardState } from './types';

type StepProps = {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
};

export function StepAvatar({ state, update }: StepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const result = await compressImage(file, { maxDim: limits.AVATAR_MAX_DIM, maxBytes: limits.AVATAR_MAX_BYTES });
    update({ avatarLocal: result });
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <div
        onClick={() => inputRef.current?.click()}
        className="focus-ring"
        style={{ border: '2px dashed var(--line-strong)', borderRadius: 14, padding: 24, textAlign: 'center', cursor: 'pointer' }}
      >
        {state.avatarLocal ? (
          <>
            <img src={state.avatarLocal.dataUrl} alt="پیش‌نمایش" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', border: '2px solid var(--line)' }} />
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>برای تغییر کلیک کنید</div>
          </>
        ) : (
          <>
            <div style={{ color: 'var(--ink-faint)', marginBottom: 10 }}><Icons.upload style={{ width: 28, height: 28, margin: '0 auto' } as any} /></div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>برای انتخاب تصویر کلیک کنید</div>
            <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4 }}>حداکثر حجم نهایی ۲۰۰ کیلوبایت (فشرده‌سازی خودکار)</div>
          </>
        )}
      </div>
      {state.avatarLocal && (
        <button className="focus-ring" onClick={() => update({ avatarLocal: null })}
          style={{ marginTop: 10, background: 'none', border: '1.5px solid var(--line)', borderRadius: 10, padding: '8px 12px', fontSize: 13, color: 'var(--ink-soft)' }}>
          حذف تصویر
        </button>
      )}
    </div>
  );
}

export function StepTheme({ state, update }: StepProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      {(themes as any[]).map((theme) => (
        <div
          key={theme.id}
          onClick={() => update({ theme: theme.id })}
          className="focus-ring"
          style={{
            aspectRatio: '1', borderRadius: 14, cursor: 'pointer', background: theme.css,
            border: state.theme === theme.id ? '3px solid var(--ink)' : '3px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 900,
          }}
        >
          {state.theme === theme.id ? '✓' : ''}
        </div>
      ))}
    </div>
  );
}

export function StepBasicInfo({ state, update }: StepProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="نام یا نام شرکت">
        <input className="focus-ring" style={inputStyle} value={state.name}
          onChange={(e) => update({ name: e.target.value })} placeholder="مثلاً: سارا محمدی" />
      </Field>
      <Field label="سمت شغلی (اختیاری)">
        <input className="focus-ring" style={inputStyle} value={state.jobTitle}
          onChange={(e) => update({ jobTitle: e.target.value })} placeholder="مثلاً: طراح محصول" />
      </Field>
      <Field label="حوزه فعالیت">
        <select className="focus-ring" style={inputStyle} value={state.industry}
          onChange={(e) => update({ industry: e.target.value })}>
          <option value="">انتخاب کنید</option>
          {(industries as any[]).map((ind) => (
            <option key={ind.id} value={ind.id}>{ind.label_fa}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

export function StepDescription({ state, update }: StepProps) {
  const words = state.description.trim() ? state.description.trim().split(/\s+/).length : 0;
  return (
    <div>
      <textarea
        className="focus-ring"
        style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
        value={state.description}
        placeholder="چند جمله کوتاه بنویسید..."
        onChange={(e) => {
          const words2 = e.target.value.trim().split(/\s+/);
          const limited = words2.length > limits.DESCRIPTION_MAX_WORDS
            ? words2.slice(0, limits.DESCRIPTION_MAX_WORDS).join(' ')
            : e.target.value;
          update({ description: limited });
        }}
      />
      <div style={{ fontSize: 12, color: words >= limits.DESCRIPTION_MAX_WORDS ? 'var(--danger)' : 'var(--ink-faint)', textAlign: 'left', marginTop: 4 }}>
        {words} از {limits.DESCRIPTION_MAX_WORDS} کلمه
      </div>
    </div>
  );
}

export function StepAddress({ state, update }: StepProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="آدرس (اختیاری)">
        <textarea className="focus-ring" style={{ ...inputStyle, minHeight: 60 }} value={state.address.text}
          onChange={(e) => update({ address: { ...state.address, text: e.target.value } })} placeholder="مثلاً: تهران، خیابان ..." />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="عرض جغرافیایی (lat)">
          <input className="focus-ring" style={inputStyle} type="number" value={state.address.lat}
            onChange={(e) => update({ address: { ...state.address, lat: e.target.value } })} placeholder="35.6892" />
        </Field>
        <Field label="طول جغرافیایی (lng)">
          <input className="focus-ring" style={inputStyle} type="number" value={state.address.lng}
            onChange={(e) => update({ address: { ...state.address, lng: e.target.value } })} placeholder="51.3890" />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--ink)' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', border: '1.5px solid var(--line)', borderRadius: 'var(--radius-control)',
  fontSize: 14, background: 'var(--paper)',
};
