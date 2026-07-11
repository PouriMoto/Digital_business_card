'use client';
import React from 'react';
import contactTypes from '@/config/contact-types.json';
import limits from '@/config/limits.json';
import type { WizardState } from './types';

const CONTACT_TYPES = contactTypes as Record<string, { label_fa: string; placeholder: string; kind: string }>;

export function StepContacts({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  function addContact() {
    if (state.contacts.length >= limits.MAX_CONTACTS) return;
    update({ contacts: [...state.contacts, { type: 'mobile', value: '' }] });
  }
  function updateContact(i: number, patch: Partial<{ type: string; value: string }>) {
    const next = state.contacts.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    update({ contacts: next });
  }
  function removeContact(i: number) {
    update({ contacts: state.contacts.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      {state.contacts.map((c, i) => (
        <div key={i} style={{ border: '1.5px solid var(--line)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <select className="focus-ring" value={c.type} onChange={(e) => updateContact(i, { type: e.target.value, value: '' })} style={selectStyle}>
              {Object.keys(CONTACT_TYPES).map((key) => (
                <option key={key} value={key}>{CONTACT_TYPES[key].label_fa}</option>
              ))}
            </select>
            <button className="focus-ring" onClick={() => removeContact(i)} style={removeBtnStyle}>حذف</button>
          </div>
          <input
            className="focus-ring"
            style={inputStyle}
            value={c.value}
            placeholder={CONTACT_TYPES[c.type]?.placeholder}
            onChange={(e) => updateContact(i, { value: e.target.value })}
          />
        </div>
      ))}
      <button className="focus-ring" onClick={addContact} style={addBtnStyle}>+ افزودن راه ارتباطی</button>
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1.5px solid var(--line)', borderRadius: 10, fontSize: 14, background: 'var(--paper)' };
const selectStyle: React.CSSProperties = { ...inputStyle, width: 'auto', flex: 1 };
const removeBtnStyle: React.CSSProperties = { marginInlineStart: 'auto', background: 'none', border: 'none', color: 'var(--danger)', fontSize: 13, padding: '4px 8px' };
const addBtnStyle: React.CSSProperties = { width: '100%', padding: 10, border: '1.5px dashed var(--line-strong)', borderRadius: 10, background: 'transparent', color: 'var(--ink)', fontWeight: 600, fontSize: 13 };
