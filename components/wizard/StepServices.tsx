'use client';
import React from 'react';
import { Icons, SERVICE_ICON_KEYS } from '@/components/icons';
import limits from '@/config/limits.json';
import type { WizardState } from './types';

export function StepServices({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  function addService() {
    if (state.services.length >= limits.MAX_SERVICES) return;
    update({ services: [...state.services, { icon: SERVICE_ICON_KEYS[0], title: '', desc: '' }] });
  }
  function updateService(i: number, patch: Partial<{ icon: string; title: string; desc: string }>) {
    update({ services: state.services.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  }
  function removeService(i: number) {
    update({ services: state.services.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      {state.services.map((s, i) => (
        <div key={i} style={{ border: '1.5px solid var(--line)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="focus-ring" onClick={() => removeService(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 13 }}>حذف</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 10 }}>
            {SERVICE_ICON_KEYS.map((key) => {
              const Icon = Icons[key];
              const selected = s.icon === key;
              return (
                <div
                  key={key}
                  onClick={() => updateService(i, { icon: key })}
                  className="focus-ring"
                  style={{
                    aspectRatio: '1', border: selected ? '1.5px solid var(--ink)' : '1.5px solid var(--line)',
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', background: selected ? '#EFEFEC' : 'var(--paper)',
                  }}
                >
                  <Icon style={{ width: 18, height: 18 } as any} />
                </div>
              );
            })}
          </div>
          <input className="focus-ring" style={{ ...inputStyle, marginBottom: 8 }} placeholder="عنوان خدمت" value={s.title}
            onChange={(e) => updateService(i, { title: e.target.value })} />
          <input className="focus-ring" style={inputStyle} placeholder="توضیح کوتاه" value={s.desc}
            onChange={(e) => updateService(i, { desc: e.target.value })} />
        </div>
      ))}
      <button className="focus-ring" onClick={addService} style={addBtnStyle}>+ افزودن خدمت</button>
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1.5px solid var(--line)', borderRadius: 10, fontSize: 14, background: 'var(--paper)' };
const addBtnStyle: React.CSSProperties = { width: '100%', padding: 10, border: '1.5px dashed var(--line-strong)', borderRadius: 10, background: 'transparent', color: 'var(--ink)', fontWeight: 600, fontSize: 13 };
