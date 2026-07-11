import './globals.css';

export const metadata = {
  title: 'v2card',
  description: 'سازنده کارت ویزیت دیجیتال',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
