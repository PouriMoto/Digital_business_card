import React from 'react';

type IconProps = { className?: string; style?: React.CSSProperties };
const base = (path: React.ReactNode, viewBox = '0 0 24 24'): React.FC<IconProps> => (props) => (
  <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" className={props.className} style={props.style}>
    {path}
  </svg>
);

export const Icons: Record<string, React.FC<IconProps>> = {
  phone: base(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />),
  mobile: base(<><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>),
  email: base(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></>),
  website: base(<><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  instagram: base(<><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>),
  telegram: base(<><path d="m22 2-20 9 7 2 2 7z" /><path d="m22 2-11 11" /></>),
  whatsapp: base(<><path d="M21 11.5a8.5 8.5 0 0 1-11.9 7.8L3 21l1.7-6a8.5 8.5 0 1 1 16.3-3.5Z" /><path d="M8.5 9.5c0 3 3 6 6 6" /></>),
  linkedin: base(<><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /><path d="M10 9v12M10 13a4 4 0 0 1 8 0v8" /></>),
  twitter: base(<path d="M22 4s-.7 2-2 3c1.4 8-6.6 13.5-14 11 2.5.1 5-.7 6.7-2.3-2.5-.2-4.5-1.7-5.2-4 .8.15 1.6.1 2.3-.1-2.6-.5-4.4-2.8-4.4-5.3.7.4 1.5.6 2.3.6-2.4-1.6-3.1-4.7-1.6-7.2 2.7 3.3 6.7 5.3 11 5.5-.8-3.6 2.8-6.5 6-4.6.9 0 2.3-.9 2.9-1.6z" />),
  facebook: base(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />),
  youtube: base(<><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>),
  github: base(<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C7.5 2.8 6.4 3.1 6.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 5 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />),
  address: base(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>),
  upload: base(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5M12 3v12" /></>),
  qr: base(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" /></>),
  share: base(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 3.9M15.4 6.6 8.6 10.5" /></>),
  save: base(<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>),
  checkmark: base(<path d="M20 6 9 17l-5-5" />),
  close: base(<path d="M18 6 6 18M6 6l12 12" />),
  trash: base(<><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" /></>),
  telegramSend: base(<path d="m22 2-7 20-4-9-9-4Z" />),
};

export const SERVICE_ICON_KEYS = ['website', 'phone', 'email', 'checkmark', 'save', 'share', 'qr', 'address'];
