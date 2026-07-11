# v2card — فاز ۱ (بک‌اند + API)

## چیزی که تا الان ساخته شده

- `config/*.json` — تم‌ها، انواع تماس، صنایع، محدودیت‌ها (بدون نیاز به تغییر کد قابل ویرایش‌اند)
- `lib/card-schema.ts` — منبع واحد شکل داده‌ی کارت (Zod)، بعداً مستقیم به AI Agent فاز ۲ هم داده می‌شود
- `lib/apps-script-client.ts` — تنها نقطه‌ی ارتباط با Google Sheets/Drive
- `lib/vcard.ts` — تابع خالص ساخت vCard
- API Routes:
  - `POST /api/cards` — ساخت کارت
  - `GET/PATCH /api/cards/[id]` — خواندن/ویرایش کارت
  - `GET /api/cards/[id]/vcard` — فایل .vcf با هدر درست (مشکل تلگرام حل شد)
  - `POST /api/upload` — آپلود عکس به Drive
  - `POST /api/events` — ثبت رویداد آنالیتیکس
- `app/c/[id]/page.tsx` — صفحه‌ی عمومی کارت (فعلاً ساده، بدون طراحی نهایی)

## راه‌اندازی محلی

```bash
npm install
cp .env.local.example .env.local
# مقدار APPS_SCRIPT_KEY را با همان API_KEY که در Script Properties ساختی پر کن
npm run dev
```

## دیپلوی روی Vercel

1. این پوشه را در یک Git repository (GitHub) push کن.
2. در Vercel → New Project → همان ریپو را وصل کن.
3. در تنظیمات پروژه → Environment Variables، همان چهار مقدار `.env.local.example` را (با مقادیر واقعی) اضافه کن.
4. Deploy.

## تست سریع بعد از دیپلوی

```bash
curl -X POST https://YOUR_DOMAIN/api/cards \
  -H "Content-Type: application/json" \
  -d '{"ownerId":"test_owner","name":"سارا محمدی","jobTitle":"طراح محصول"}'
```
باید یک `cardId` برگردد. با آن `cardId`، صفحه‌ی `/c/CARD_ID` باید کارت را نشان دهد.

## قدم بعدی (پیام بعدی)

طراحی بصری کامل Wizard (فرم چندمرحله‌ای) + پیش‌نمایش زنده + QR + دکمه اشتراک‌گذاری تلگرام،
با هویت بصری اختصاصی (نه قالب پیش‌فرض) طبق `frontend-design` skill.
