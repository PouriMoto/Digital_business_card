import type { Address, Contact, Service } from '@/lib/card-schema';

export type LocalImage = { dataUrl: string; mimeType: string; sizeBytes: number };

export interface WizardState {
  name: string;
  jobTitle: string;
  industry: string;
  theme: string;
  description: string;
  contacts: Contact[];
  services: Service[];
  address: Address;
  avatarLocal: LocalImage | null;
  galleryLocal: LocalImage[];
}

export function emptyWizardState(): WizardState {
  return {
    name: '',
    jobTitle: '',
    industry: '',
    theme: 'solid-indigo',
    description: '',
    contacts: [],
    services: [],
    address: { text: '', lat: '', lng: '' },
    avatarLocal: null,
    galleryLocal: [],
  };
}
