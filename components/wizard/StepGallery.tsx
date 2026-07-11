'use client';
import React, { useRef } from 'react';
import { Icons } from '@/components/icons';
import { compressImage } from '@/lib/image-compress';
import limits from '@/config/limits.json';
import type { WizardState } from './types';

export function StepGallery({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    const remaining = limits.GALLERY_MAX_ITEMS - state.galleryLocal.length;
    if (remaining <= 0) return;
    const toProcess = Array.from(files).slice(0, remaining);
    const results = await Promise.all(
      toProcess.map((f) => compressImage(f, { maxDim: limits.GALLERY_MAX_DIM, maxBytes: limits.GALLERY_MAX_BYTES })),
    );
    update({ galleryLocal: [...state.galleryLocal, ...results] });
  }

  function removeAt(i: number) {
    update({ galleryLocal: state.galleryLocal.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }} />
      <div
        onClick={() => inputRef.current?.click()}
        className="focus-ring"
        style={{ border: '2px dashed var(--line-strong)', borderRadius: 14, padding: 24, textAlign: 'center', cursor: 'pointer' }}
      >
        <div style={{ color: 'var(--ink-faint)', marginBottom: 10 }}><Icons.upload style={{ width: 28, height: 28, margin: '0 auto' } as any} /></div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>افزودن تصویر به گالری</div>
        <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4 }}>حداکثر {limits.GALLERY_MAX_ITEMS} تصویر</div>
      </div>

      {state.galleryLocal.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
          {state.galleryLocal.map((g, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden' }}>
              <img src={g.dataUrl} alt="نمونه کار" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                className="focus-ring"
                onClick={() => removeAt(i)}
                style={{ position: 'absolute', top: 4, left: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(21,23,28,0.6)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icons.close style={{ width: 12, height: 12 } as any} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
