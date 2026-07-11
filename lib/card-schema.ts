/**
 * Data Source: N/A (این فایل فقط تعریف Schema است، نه داده)
 * منبع واحد شکل داده‌ی "کارت" — هم API Route ها از این استفاده می‌کنند،
 * هم در فاز ۲ همین Schema به AI Agent داده می‌شود تا خروجی مکالمه را
 * به همین فرمت دقیق برگرداند (بدون بازتعریف دوباره‌ی فیلدها جای دیگر).
 */
import { z } from 'zod';

export const ContactSchema = z.object({
  id: z.string().optional(),
  type: z.string(), // یکی از کلیدهای config/contact-types.json
  value: z.string(),
});

export const ServiceSchema = z.object({
  id: z.string().optional(),
  icon: z.string(),
  title: z.string(),
  desc: z.string().optional().default(''),
});

export const GalleryItemSchema = z.object({
  id: z.string().optional(),
  fileId: z.string(),
  url: z.string(),
});

export const AddressSchema = z.object({
  text: z.string().optional().default(''),
  lat: z.string().optional().default(''),
  lng: z.string().optional().default(''),
});

export const CardCreateSchema = z.object({
  ownerId: z.string().min(1, 'ownerId الزامی است'),
  name: z.string().min(1, 'نام الزامی است'),
  jobTitle: z.string().optional().default(''),
  industry: z.string().optional().default(''), // یکی از config/industries.json
  theme: z.string().optional().default('solid-indigo'),
  description: z.string().max(1500).optional().default(''),
  contacts: z.array(ContactSchema).max(12).optional().default([]),
  services: z.array(ServiceSchema).max(8).optional().default([]),
  gallery: z.array(GalleryItemSchema).max(9).optional().default([]),
  address: AddressSchema.optional().default({ text: '', lat: '', lng: '' }),
});

export const CardUpdateSchema = CardCreateSchema.partial().extend({
  cardId: z.string().min(1),
  status: z.enum(['active', 'archived']).optional(),
  avatarFileId: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type CardCreateInput = z.infer<typeof CardCreateSchema>;
export type CardUpdateInput = z.infer<typeof CardUpdateSchema>;

// شکل کامل کارت همان‌طور که از Apps Script برمی‌گردد
export interface Card {
  cardId: string;
  ownerId: string;
  status: string;
  name: string;
  jobTitle: string;
  industry: string;
  theme: string;
  avatarFileId: string;
  avatarUrl: string;
  description: string;
  contacts: Contact[];
  services: Service[];
  gallery: GalleryItem[];
  addressText: string;
  addressLat: string;
  addressLng: string;
  driveFolderId: string;
  createdAt: string;
  updatedAt: string;
}
