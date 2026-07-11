'use client';
import React from 'react';
import { Icons } from './icons';
import { resolveTheme } from '@/lib/theme-engine';
import { contactHref, buildMapLink } from '@/lib/contact-links';
import contactTypes from '@/config/contact-types.json';
import type { Card } from '@/lib/card-schema';

type ContactTypeMeta = { label_fa: string; placeholder: string; kind: string };
const CONTACT_TYPES = contactTypes as Record<string, ContactTypeMeta>;

export type CardData = Pick<
  Card,
  'name' | 'jobTitle' | 'theme' | 'avatarUrl' | 'description' | 'contacts' | 'services' | 'gallery' | 'addressText' | 'addressLat' | 'addressLng'
>;

export default function CardView({
  card,
  onAction,
}: {
  card: CardData;
  onAction?: (action: 'save-vcard' | 'share' | 'show-qr', payload?: { type?: string }) => void;
}) {
  const theme = resolveTheme(card.theme);
  const name = card.name || 'نام شما';
  const contacts = (card.contacts || []).filter((c) => c.value?.trim());
  const services = (card.services || []).filter((s) => s.title?.trim());
  const gallery = card.gallery || [];
  const mapLink = buildMapLink({ text: card.addressText, lat: card.addressLat, lng: card.addressLng });
  const isEmpty = !card.description && !contacts.length && !services.length && !gallery.length && !card.addressText;

  return (
    <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: '#fff', boxShadow: '0 24px 60px rgba(21,23,28,0.16)' }}>
      {/* Hero */}
      <div style={{ background: theme.background, color: theme.textColor, padding: '38px 20px 26px', textAlign: 'center' }}>
        {card.avatarUrl ? (
          <img
            src={card.avatarUrl}
            alt={name}
            style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', border: '3px solid rgba(255,255,255,0.7)' }}
          />
        ) : (
          <div style={{
            width: 88, height: 88, borderRadius: '50%', margin: '0 auto 14px',
            background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 800,
          }}>
            {name.charAt(0)}
          </div>
        )}
        <h1 style={{ fontSize: 21, fontWeight: 800, margin: '0 0 2px' }}>{name}</h1>
        {card.jobTitle && <p style={{ fontSize: 13.5, opacity: 0.85, margin: 0 }}>{card.jobTitle}</p>}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18 }}>
          <button
            className="focus-ring"
            onClick={() => onAction?.('save-vcard')}
            style={{ padding: '9px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, background: 'rgba(255,255,255,0.22)', color: theme.textColor, border: 'none' }}
          >
            ذخیره مخاطب
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        {card.description && (
          <Section title="درباره">
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-soft)', margin: 0 }}>{card.description}</p>
          </Section>
        )}

        {contacts.length > 0 && (
          <Section title="راه‌های ارتباطی">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {contacts.map((c, i) => {
                const Icon = Icons[c.type] || Icons.website;
                return (
                  <a
                    key={i}
                    href={contactHref(c.type, c.value)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 4px', borderRadius: 12, background: 'var(--paper)', fontSize: 10.5, color: 'var(--ink)' }}
                  >
                    <Icon className="focus-ring" />
                    <span>{CONTACT_TYPES[c.type]?.label_fa || c.type}</span>
                  </a>
                );
              })}
            </div>
          </Section>
        )}

        {services.length > 0 && (
          <Section title="خدمات">
            {services.map((s, i) => {
              const Icon = Icons[s.icon] || Icons.checkmark;
              return (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 12, background: 'var(--paper)', marginBottom: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EFEFEC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon className="focus-ring" style={{ width: 19, height: 19, color: 'var(--ink)' } as any} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 2px' }}>{s.title}</p>
                    {s.desc && <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>}
                  </div>
                </div>
              );
            })}
          </Section>
        )}

        {gallery.length > 0 && (
          <Section title="نمونه‌کارها">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {gallery.map((g, i) => (
                <img key={i} src={g.url} alt="نمونه کار" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </div>
          </Section>
        )}

        {(card.addressText || mapLink) && (
          <Section title="آدرس">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: 'var(--paper)', borderRadius: 12, fontSize: 13 }}>
              <Icons.address style={{ width: 18, height: 18, flexShrink: 0 } as any} />
              <span>{card.addressText || 'مشاهده روی نقشه'}</span>
            </div>
            {mapLink && (
              <a href={mapLink} target="_blank" rel="noopener" style={{ marginTop: 8, display: 'inline-block', fontSize: 12.5, color: 'var(--ink)', fontWeight: 600, textDecoration: 'underline' }}>
                باز کردن در نقشه ←
              </a>
            )}
          </Section>
        )}

        {isEmpty && <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: 12.5, padding: 10 }}>با تکمیل فرم، کارت شما اینجا کامل می‌شود</p>}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px 22px', display: 'flex', gap: 10, borderTop: '1px solid var(--line)' }}>
        <button className="focus-ring" onClick={() => onAction?.('share')} style={footerBtnStyle}>
          <Icons.share style={{ width: 16, height: 16 } as any} /> اشتراک‌گذاری
        </button>
        <button className="focus-ring" onClick={() => onAction?.('show-qr')} style={footerBtnStyle}>
          <Icons.qr style={{ width: 16, height: 16 } as any} /> QR کد
        </button>
      </div>
    </div>
  );
}

const footerBtnStyle: React.CSSProperties = {
  flex: 1, fontSize: 13, padding: 10, borderRadius: 10, border: 'none',
  background: 'var(--paper)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 10px' }}>{title}</p>
      {children}
    </div>
  );
}
